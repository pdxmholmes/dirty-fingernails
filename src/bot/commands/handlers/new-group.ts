import * as moment from 'moment';

import {
  IBotRequest,
  Utils,
  log
} from '../../../core';
import {
  Group,
  IGroup,
  IGroupModel
} from '../../../core/models';
import { IGame } from '../../../core/games';
import { ICommand } from '../command';
import { needsGame } from '../traits';

interface INewGroupArguments {
  timeUntilStart: moment.Duration;
  numberOfPlayers: number;
  campaign: string;
  description: string;
}

const newGroup: ICommand = {
  id: 'new-group',
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
  traits: [
    needsGame
  ],
  handler: async (request: IBotRequest, params: string[], rawArgs: any) => {
    const type = request.data.gameType as string;
    const game = request.data.game as IGame;

    try {
      const args = rawArgs as INewGroupArguments;
      const fromNow = Utils.friendlyDuration(args.timeUntilStart);

      const groupDef: IGroup = {
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

      const group = await Group.create(groupDef);
      log.info({
        requestor: request.requestor,
        type
      }, `Group created`);
      request.replyDirect(`Created ${type} ${group.fullId()}. It will start in ${fromNow}.`);
    }
    catch (err) {
      log.error(err);
      request.replyDirect(`An error ocurred creating your ${type}. Please contact an admin.`);
    }
  }
};

export = newGroup;
