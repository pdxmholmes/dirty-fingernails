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

const listGroup: ICommand = {
  match: /list-(.*)s/i,
  arguments: [
    {
      name: 'detailed',
      type: 'flag',
      optional: true
    }
  ],
  handler: async (request: IBotRequest, params: string[], rawArgs: any) => {
    const type = params[0].toLowerCase();
    const game = Games.fromGroupTitle(type);
    if (!game) {
      log.warn(`Uknown game type: ${type}`);
      return;
    }

    const args = rawArgs as ListGroupArgs;
    try {
      const groups = await Group
        .find({ gameId: game.id, startTime: { $gt: Date.now() } })
        .sort('startTime').limit(10);

      const count = groups ? groups.length : 0;
      request.reply(`There are ${count === 0 ? 'no' : count} ${type}s starting soon.`);
      if (count === 0) {
        return;
      }

      groups.forEach(g => {
        const fromNow = moment.duration(moment().diff(g.startTime));
        request.reply(`**[${g.gameId.toUpperCase()}-${g.groupId}]** ${g.numberOfPlayers} player ${type} `
          + `starting in ${humanizeDuration(fromNow, { largest: 2 })} organized by **${g.organizer}**.`);
      });
    }
    catch (err) {
      log.error(err);
      request.replyDirect('There was an error getting the list of groups. Please contact an admin.');
    }
  }
};

export = listGroup;
