import { IBotRequest, log } from '../../../core';
import { Group, IGroupModel } from '../../../core/models';
import { ICommand } from '../command';
import { needsGame, needsGroup } from '../traits';

interface CancelGroupArgs {
  id: string;
}

const cancelGroup: ICommand = {
  id: 'cancel-group',
  match: /cancel-(.*)/i,
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
  canExecute: (request: IBotRequest, params: string[], rawArgs: any) => {
    const group = request.data.group as IGroupModel;
    return group && group.organizerId === request.requestor.id;
  },
  handler: async (request: IBotRequest, params: string[], rawArgs: any) => {
    // const game = request.data.game as IGame;
    const type = request.data.gameType as string;
    const group = request.data.group as IGroupModel;
    const args = rawArgs as CancelGroupArgs;

    if (!group) {
      request.replyDirect(`${type} ${args.id} could not be found.`);
      return;
    }

    try {
      await Group.remove(group).exec();
      request.replyDirect(`${type} ${group.fullId()} has been canceled.`);
    }
    catch (err) {
      log.error(err);
      request.replyDirect('There was an error. Please contact an admin.');
    }
  }
};

export = cancelGroup;
