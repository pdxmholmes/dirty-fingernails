import { Bms } from './bms';
import { IGame } from './game';
import { Utils } from '../core';

export * from './game';

export const Games = {
  Bms,

  fromGroupTitle: (title: string): IGame => {
    if (!title) {
      return null;
    }

    const key = Object.keys(Games)
      .find(k => Games[k] &&
        Games[k].groupTitle &&
        Utils.iequals(Games[k].groupTitle, title));

    if (!key) {
      return null;
    }

    return Games[key];
  }
};
