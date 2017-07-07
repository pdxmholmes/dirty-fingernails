import * as _ from 'lodash';

export interface IStringUtils {
    expandCamelCase(str: string): string;
    iequals(str1: string, str2: string): boolean;
}

export interface IUtils {
    string: IStringUtils;
}

class Utilities implements IUtils {
    string: IStringUtils = {
        expandCamelCase: (str: string): string => {
            return str.replace(/([a-z])([A-Z])/g, '$1 $2')
                // space before last upper in a sequence followed by lower
                .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
                // uppercase the first character
                .replace(/^./, function(s){ return s.toUpperCase(); });
        },
        iequals: (str1: string, str2: string): boolean => {
            if (!_.isString(str1) || !_.isString(str2)) {
                return false;
            }

            return str1.toLowerCase() === str2.toLowerCase();
        }
    };
}

export const Utils: IUtils = new Utilities();
