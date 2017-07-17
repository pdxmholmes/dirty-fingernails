import * as Discord from 'discord.js';

import { Bot, IBotRequest, log } from '../../core';
import { Group, IGroup } from '../../models';
import { Games } from '../../games';
import { ICommand } from '../command';

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
      log.warn(`Unknown game type: ${type}`);
      return;
    }

    const args = rawArgs as CancelGroupArgs;
    try {
      const group = await Group.findOneAndRemove({
        gameId: game.id,
        groupId: { $regex: new RegExp(`^${args.id}`, 'i') },
        organizerId: request.requestor.id
      });

      if (group) {
        request.replyDirect(`${type} ${group.fullId()} has been canceled.`);
      }
    }
    catch (err) {
      log.error(err);
      request.replyDirect('There was an error. Please contact an admin.');
    }
  }
};

export = cancelGroup;
