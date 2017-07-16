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

interface INewGroupArguments {
  timeUntilStart: moment.Duration;
  numberOfPlayers: number;
  campaign: string;
  description: string;
}

const newGroup: ICommand = {
  match: /new-(.+)/i,
  arguments: [
    {
      name: 'timeUntilStart',
      type: 'duration',
      options: {
        min: 15,
        max: 60 * 24
      }
    },
    {
      name: 'numberOfPlayers',
      type: 'number',
      options: {
        min: 2,
        max: 16
      }
    },
    {
      name: 'campaign',
      type: 'string'
    },
    {
      name: 'description',
      type: 'string'
    }
  ],
  handler: async (request: IBotRequest, params: string[], rawArgs: any) => {
    const type = params[0].toLowerCase();
    const game = Games.fromGroupTitle(type);
    if (!game) {
      log.warn(`Uknown game type: ${type}`);
      return;
    }

    const args = rawArgs as INewGroupArguments;
    const fromNow = humanizeDuration(args.timeUntilStart.asMilliseconds());

    const group: IGroup = {

    };

    request.replyDirect(`Received your flight request for ${fromNow}`);
  }
};

export = newGroup;
