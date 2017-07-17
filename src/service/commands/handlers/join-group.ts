import * as Discord from 'discord.js';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as humanizeDuration from 'humanize-duration';

import { Bot, IBotRequest, log } from '../../core';
import { Group, IGroup } from '../../models';
import { Games } from '../../games';
import { ICommand } from '../command';

interface JoinGroupArgs {
  groupId: string;
}

const joinGroup: ICommand = {
  match: /join-(.*)/i,
  arguments: [
    {
      name: 'groupId',
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

    const args = rawArgs as JoinGroupArgs;
    const idMatch = new RegExp(`^${game.id}-(.*)`, 'i');
    const match = idMatch.exec(args.groupId);
    let groupId = args.groupId;
    if (match) {
      groupId = match[1];
    }

    const group = await Group.findOne({
      gameId: game.id,
      groupId: { $regex: new RegExp(`^${groupId}`, 'i') }
    });

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
