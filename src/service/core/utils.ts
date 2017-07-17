import * as _ from 'lodash';

export interface IUtils {
  newId(): string;
  expandCamelCase(str: string): string;
  iequals(str1: string, str2: string): boolean;
}

const ID_LENGTH = 4;

class Utilities implements IUtils {
  newId(): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const id = Array(ID_LENGTH);
    for (let i = 0; i < ID_LENGTH; i++) {
      id[i] = possible.charAt(Math.floor(Math.random() * possible.length));
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
}

export const Utils: IUtils = new Utilities();
