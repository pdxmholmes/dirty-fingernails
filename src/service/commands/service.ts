import * as fs from 'fs';
import * as path from 'path';
import * as Discord from 'discord.js';
import * as bunyan from 'bunyan';
import * as _ from 'lodash';

import { Bot, IBotRequest, Utils, log } from '../core';
import { Group, IGroup } from '../models';
import { Games } from '../games';
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

export class CommandService {
	private readonly validator: ArgumentValidator = new ArgumentValidator();

	invoke(bot: Bot, request: IBotRequest): boolean {
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

		const result = this.validator.validate(command.arguments, request.arguments);
		if (!result.valid) {
			result.errors.forEach(e => {
				request.replyDirect(`${request.command}: ${e.error}`);
			});

			return false;
		}

		log.info({
			invoker: request.requestor,
			command: request.command,
			params,
			arguments: request.arguments
		}, `Invoking ${request.command}`);

		command.handler(request, params, result.values);
		return true;
	}
}
