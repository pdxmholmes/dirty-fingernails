import * as moment from 'moment';
import * as timestring from 'timestring';
import * as _ from 'lodash';

import { ICommandArgument } from './command';
import { Utils } from '../core';

const validators = {
  duration: (name: string, title: string, arg: string, options?: any): [IValidationError, any] => {
    const fromNow = timestring(arg);
    if (fromNow === 0) {
      return [{
        argument: name,
        error: `The value for ${name} is not valid. Example time: 1h 30m.`
      }, null];
    }

    const duration = moment.duration(fromNow, 'seconds');
    if (options) {
      if (_.isNumber(options.min) && duration.asMinutes() < options.min) {
        const min = moment.duration(options.min, 'minutes').humanize();
        return [{
          argument: name,
          error: `${name} must be at least ${min} in the future`
        }, null];
      }
      if (_.isNumber(options.max) && duration.asMinutes() > options.max) {
        const max = moment.duration(options.max, 'minutes').humanize();
        return [{
          argument: name,
          error: `${name} cannot be more than ${max} in the futiure`
        }, null];
      }
    }

    return [null, duration];
  },

  number: (name: string, title: string, arg: string, options?: any): [IValidationError, any] => {
    const val = parseFloat(arg);
    if (isNaN(val)) {
      return [{
        argument: name,
        error: `${title} must be a number.`
      }, null];
    }

    if (options) {
      if (_.isNumber(options.min) && val < options.min) {
        return [{
          argument: name,
          error: `${title} must be at least ${options.min}`
        }, null];
      }
      if (_.isNumber(options.max) && val > options.max) {
        return [{
          argument: name,
          error: `${title} cannot be more than ${options.max}`
        }, null];
      }
    }

    return [null, val];
  },

  string: (name: string, title: string, arg: string, string, options?: any): [IValidationError, any] => {
    if (!arg) {
      return [{
        argument: name,
        error: `${title} is required.`
      }, null];
    }

    return [null, arg];
  },

  flag: (name: string, title: string, arg: string, options?: any): [IValidationError, any] => {
    return [null, Utils.iequals(name, arg)];
  }
};

export interface IValidationError {
  argument: string;
  error: string;
}

export class ValidationResult {
  readonly valid: boolean;
  readonly values: any;
  readonly errors: IValidationError[];

  constructor(valid: boolean, values: any, errors?: IValidationError[]) {
    this.valid = valid;
    this.values = values;
    this.errors = errors || [];
  }
}

export class ArgumentValidator {
  validate(defs: ICommandArgument[], args: string[]): ValidationResult {
    if (!defs || defs.length < 1) {
      return new ValidationResult(true, {}, []);
    }

    const requiredDefs = defs.filter(d => !d.optional);
    if (!args || args.length < requiredDefs.length) {
      return new ValidationResult(false, {}, [
        {
          argument: 'usage',
          error: this.getCommandUsage(defs)
        }
      ]);
    }

    const values = {};
    const errors: IValidationError[] = [];
    defs.forEach((def, idx) => {
      const validator = validators[def.type];
      const arg = args.length > idx ? args[idx] : '';

      if (!validator) {
        values[def.name] = arg;
        return;
      }

      const title = Utils.expandCamelCase(def.name);
      const [err, val] = validator(def.name, title, arg, def.options);
      if (err) {
        errors.push(err);
        return;
      }

      values[def.name] = val;
    });

    return new ValidationResult(errors.length === 0, values, errors);
  }

  private getCommandUsage(defs: ICommandArgument[]): string {
    return defs
      .map(d => `<${Utils.expandCamelCase(d.name).toLowerCase()}>`)
      .join(', ');
  }
}
