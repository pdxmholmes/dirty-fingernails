import * as moment from 'moment';
import * as humanizeDuration from 'humanize-duration';

import { IBotRequest } from '../../../core';
import { Group, IGroupModel } from '../../../core/models';
import { IGame } from '../../../core/games';
import { ICommand } from '../command';
import { needsGame, needsGroup } from '../traits';

const joinGroup: ICommand = {
  id: 'join-group',
  match: /join-(.*)/i,
  arguments: [
    {
      name: 'id',
      type: 'string'
    }
  ],
  traits: [
    needsGame,
    needsGroup
  ],
  handler: async (request: IBotRequest, params: string[], rawArgs: any) => {
    const game = request.data.game as IGame;
    const groupId = request.data.groupId as string;
    const group = request.data.group as IGroupModel;

    if (!group) {
      return request.replyDirect(
        `Could not find ${game.groupTitle} ${game.id.toUpperCase()}-${groupId.toUpperCase()} to join.`);
    }

    if (!group.reservations) {
      group.reservations = [];
    }

    const fromNow = moment.duration(moment().diff(group.startTime));
    if (group.reservations.some(r => r.playerId === request.requestor.id)) {
      return request.replyDirect([
        `You've already reserved a slot in ${group.fullId()}.`,
        `The ${game.groupTitle} starts in ${humanizeDuration(fromNow, { largest: 2})}.`
      ].join(' '));
    }

    const isReserve = group.reservations.length >= group.numberOfPlayers;
    group.reservations.push({
      player: request.requestor.name,
      playerId: request.requestor.id,
      reservedAt: moment().toDate()
    });

    await Group.update({
      gameId: game.id,
      groupId: { $regex: new RegExp(`^${groupId}`, 'i') }
    }, group);

    if (isReserve) {
      return request.replyDirect([
        `Unfortunately the ${game.groupTitle} ${group.fullId()} is full.`,
        `You've been added as a reserve ${game.playerTitle}.`
      ].join(' '));
    }

    request.replyDirect([
      `You've reserved a slot in the ${game.groupTitle} ${group.fullId()}.`,
      `This ${game.groupTitle} starts in ${humanizeDuration(fromNow, { largest: 2 })}.`
    ].join(' '));
  }
};

export = joinGroup;
