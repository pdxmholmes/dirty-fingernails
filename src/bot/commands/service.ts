import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

import {
  IBotRequest,
  Utils,
  log
} from '../../core';
import { ICommand } from './command';
import { ArgumentValidator } from './validation';

const handlers = fs
  .readdirSync(path.join(__dirname, 'handlers'))
  .filter(h => Utils.iequals(path.extname(h), '.js'))
  .map(h => path.parse(h).name);

const commands: ICommand[] = [];
handlers.forEach(h => {
  const handler = require(`./handlers/${h}`) as ICommand;
  commands.push(handler);
});

export interface ICommandService {
  invoke(request: IBotRequest): Promise<boolean>;
}

export interface PermissionSet {
  [key: string]: string[];
}

let serviceInstance: ICommandService = null;
export function commandService(permissions: PermissionSet): ICommandService {
  if (!serviceInstance) {
    serviceInstance = new CommandService(permissions);
  }

  return serviceInstance;
}

class CommandService implements ICommandService {
  private readonly permissions: PermissionSet;
  private readonly validator: ArgumentValidator = new ArgumentValidator();

  constructor(permissions: PermissionSet) {
    this.permissions = permissions;
  }

  async invoke(request: IBotRequest): Promise<boolean> {
    let params: string[] = [];
    const command = commands.find(c => {
      if (_.isString(c.match)) {
        return Utils.iequals(c.match, request.command);
      }
      else if (_.isRegExp(c.match)) {
        const results = c.match.exec(request.command);
        if (!results) {
          return false;
        }

        params = results.slice(1);
        return true;
      }
      else {
        return false;
      }
    });

    if (!command) {
      return false;
    }

    // Validate arguments
    const result = this.validator.validate(command.arguments, request.arguments);
    if (!result.valid) {
      result.errors.forEach(e => {
        request.replyDirect(`${request.command}: ${e.error}`);
      });

      return false;
    }

    // Early check for roles. If a command has no canExecute override,
    // we can early out here if roles are not met
    const roles = this.permissions[command.id];
    const hasRole = !roles ||
      roles.some(role => role === '*') ||
      roles.some(role => request.requestor.hasRole(role));

    if (!command.canExecute && !hasRole) {
      log.info({
        invoker: request.requestor,
        command: request.command,
        params,
        arguments: request.arguments
      }, `Command invocation rejected for ${request.command}`);
      return false;
    }

    // Execute any command traits defined
    const traits = command.traits || [];
    try {
      for (const trait of traits) {
        await trait(request, params, result.values);
      }
    }
    catch (error) {
      log.error({
        error
      }, `Error invoking trait: ${error.message}`);

      return false;
    }

    try {
      const hasOverride = !command.canExecute ||
        await command.canExecute(request, params, result.values);
      if (!hasOverride) {
        log.info({
          invoker: request.requestor,
          command: request.command,
          params,
          arguments: request.arguments
        }, `Command invocation rejected for ${request.command}`);
        return false;
      }
    }
    catch (error) {
      log.error({
        error
      }, `Error checking override: ${error.message}`);

      return false;
    }

    log.info({
      invoker: request.requestor,
      command: request.command,
      params,
      arguments: request.arguments
    }, `Invoking ${request.command}`);

    return command.handler(request, params, result.values)
      .then(() => true);
  }
}
