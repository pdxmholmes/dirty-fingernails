import * as Discord from 'discord.js';
import * as timestring from 'timestring';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as humanizeDuration from 'humanize-duration';

import { log } from '../../log';
import { Bot } from '../../bot';
import { Group, IGroup } from '../../models';
import { Games } from '../../games';
import { ICommand } from '../command';
import { IBotRequest } from '../../request';

const listGroup: ICommand = {
  match: /list-(.*)/i,
  arguments: [
    {
      name: 'detailed',
      type: 'flag',
      optional: true
    }
  ],
  handler: async (request: IBotRequest, params: string[], rawArgs: any) => {
  }
};

export = listGroup;
