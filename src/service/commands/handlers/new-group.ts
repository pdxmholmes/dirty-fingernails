import * as moment from 'moment';

import { Bot, IBotRequest, Utils, log } from '../../core';
import { Group, IGroup, IGroupModel } from '../../models';
import { Games } from '../../games';
import { ICommand } from '../command';

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
      log.warn(`Unknown game type: ${type}`);
      return;
    }

    try {
      const args = rawArgs as INewGroupArguments;
      const fromNow = Utils.friendlyDuration(args.timeUntilStart);

      const group: IGroup = {
        groupId: Utils.newId(),
        name: args.description,
        organizer: request.requestor.name,
        organizerId: request.requestor.id,
        startTime: moment().add(args.timeUntilStart).toDate(),
        gameId: game.id,
        numberOfPlayers: args.numberOfPlayers,
        attributes: [
          { name: 'campaign', value: args.campaign }
        ]
      };

      const g = await Group.create(group);
      log.info({
        requestor: request.requestor,
        type
      }, `Group created`);
      request.replyDirect(`Created ${type} ${g.fullId()}. It will start in ${fromNow}.`);
    }
    catch (err) {
      log.error(err);
      request.replyDirect(`An error ocurred creating your ${type}. Please contact an admin.`);
    }
  }
};

export = newGroup;
