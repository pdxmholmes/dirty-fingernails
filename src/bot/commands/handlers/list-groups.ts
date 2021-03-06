import * as Discord from 'discord.js';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as humanizeDuration from 'humanize-duration';

import { IBotRequest, log } from '../../../core';
import { Group } from '../../../core/models';
import { IGame } from '../../../core/games';
import { ICommand } from '../command';
import { needsGame } from '../traits';

interface ListGroupArgs {
  detailed?: boolean;
}

const listGroup: ICommand = {
  id: 'list-groups',
  match: /list-(.*)s/i,
  arguments: [
    {
      name: 'detailed',
      type: 'flag',
      optional: true
    }
  ],
  traits: [
    needsGame
  ],
  handler: async (request: IBotRequest, params: string[], rawArgs: any) => {
    const type = request.data.gameType as string;
    const game = request.data.game as IGame;
    const args = rawArgs as ListGroupArgs;
    try {
      const groups = await Group
        .find({ gameId: game.id, startTime: { $gt: Date.now() } })
        .sort('startTime').limit(10);

      const count = groups ? groups.length : 0;
      if (!args.detailed) {
        request.reply(`There are ${count === 0 ? 'no' : count} ${type}s starting soon.`);
        if (count === 0) {
          return;
        }

        groups.forEach(g => {
          const fromNow = moment.duration(moment().diff(g.startTime));
          request.reply([
            `**[${g.fullId()}]**  ${g.reservationCount()} / ${g.numberOfPlayers} ${game.playerPlural}`,
            `${g.organizer}`,
            `**${humanizeDuration(fromNow, { largest: 2 })}**`
          ].join('  |  '));
        });
      }
      else {
        request.replyDirect(`There are ${count === 0 ? 'no' : count} ${type}s starting soon.`);
        if (count === 0) {
          return;
        }

        groups.forEach(g => {
          const fromNow = moment.duration(moment().diff(g.startTime));
          const embed = new Discord.RichEmbed();
          embed
            .setTitle(`${g.fullId()} - ${humanizeDuration(fromNow, { largest: 2 })}`)
            .setDescription(g.name)
            .setAuthor(g.organizer)
            .addField(_.capitalize(game.playerPlural),
            g.reservations.map(r => r.player).join('\n'));

          request.replyDirect({ embed });
        });
      }
    }
    catch (err) {
      log.error(err);
      request.replyDirect('There was an error getting the list of groups. Please contact an admin.');
    }
  }
};

export = listGroup;
