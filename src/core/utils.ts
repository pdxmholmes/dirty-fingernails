import * as _ from 'lodash';
import * as moment from 'moment';
import * as humanizeDuration from 'humanize-duration';

export interface IUtils {
  newId(): string;
  expandCamelCase(str: string): string;
  iequals(str1: string, str2: string): boolean;
  friendlyDuration(duration: moment.Duration): string;
}

export const ID_LENGTH = 4;
export const POSSIBLE_ID_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

class Utilities implements IUtils {
  newId(): string {
    const id = Array(ID_LENGTH);
    for (let i = 0; i < ID_LENGTH; i++) {
      id[i] = POSSIBLE_ID_CHARACTERS.charAt(Math.floor(Math.random()
        * POSSIBLE_ID_CHARACTERS.length));
    }

    return id.join('');
  }

  expandCamelCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1 $2')
      // space before last upper in a sequence followed by lower
      .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
      // uppercase the first character
      .replace(/^./, function(s) { return s.toUpperCase(); });
  }

  iequals(str1: string, str2: string): boolean {
    if (!_.isString(str1) || !_.isString(str2)) {
      return false;
    }

    return str1.toLowerCase() === str2.toLowerCase();
  }

  friendlyDuration(duration: moment.Duration): string {
    let largest = 2;
    if (duration.asHours() < 1) {
      largest = 1;
    }

    return humanizeDuration(duration, { largest });
  }
}

export const Utils: IUtils = new Utilities();
