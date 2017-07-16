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

interface ListGroupArgs {
  detailed?: boolean;
}

interface CancelGroupArgs {
  id: string;
}

const cancelGroup: ICommand = {
  match: /cancel-(.*)/i,
  arguments: [
    {
      name: 'id',
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

    const args = rawArgs as CancelGroupArgs;
    try {
      const group = await Group.findOneAndRemove({
        gameId: game.id,
        id: { $regex: new RegExp(`^${args.id}`, 'i') },
        organizerId: request.requestorId
      });

      if (group) {
        request.replyDirect(`${type} ${game.id.toUpperCase()}-${group.id} has been canceled.`);
      }
    }
    catch (err) {
      log.error(err);
      request.replyDirect('There was an error. Please contact an admiin.');
    }
  }
};

export = cancelGroup;
