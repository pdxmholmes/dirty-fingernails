import * as moment from 'moment';

import { log } from '../core';
import {
  Group,
  IGroup,
  Notification,
  INotification
} from '../core/models';

export class Notifier {
  readonly tickRate = 60 * 1000;

  start() {
    setTimeout(this.onTick.bind(this), this.tickRate);
  }

  private async onTick() {
    setTimeout(this.onTick.bind(this), this.tickRate);
  }

  private async upcomingGroups(gameId?: string): Promise<IGroup[]> {
    let opts = {
      startTime: { $lt: moment().add(30, 'minutes').toDate() }
    };
    if (gameId) {
      opts = Object.assign({}, opts, { gameId });
    }

    return await Group.find(opts).sort('startTime').limit(3);
  }
}
