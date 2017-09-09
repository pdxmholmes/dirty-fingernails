import { IBotRequest } from '../../core';
import { Games, IGame } from '../../core/games';
import { Group } from '../../core/models';

export type NextTrait = (success?: boolean) => void;
export type CommandTrait = (request: IBotRequest, params: string[],
  args: any) => Promise<void>;

export function needsGame(request: IBotRequest, params: string[],
  args: any): Promise<void> {
  const type = params[0].toLowerCase();
  const game = Games.fromGroupTitle(type);
  if (!game) {
    return Promise.reject(`Unknown game type: ${type}`);
  }

  request.data.gameType = type;
  request.data.game = game;
  return Promise.resolve();
}

export function needsGroup(request: IBotRequest, params: string[],
  args: any): Promise<void> {
  const game = request.data.game as IGame;

  const idMatch = new RegExp(`^${game.id}-(.*)`, 'i');
  const match = idMatch.exec(args.id);
  let groupId = args.id;
  if (match) {
    groupId = match[1];
  }

  return Group.findOne({
    gameId: game.id,
    groupId: { $regex: new RegExp(`^${groupId}`, 'i') }
  })
    .exec()
    .then(group => {
      request.data.groupId = groupId;
      request.data.group = group;
    });
}
