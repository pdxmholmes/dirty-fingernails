import { log } from './log';

export class Notifier {
  readonly tickRate = 15 * 1000;

  start() {
    setTimeout(this.onTick.bind(this), this.tickRate);
  }

  private onTick() {
    log.info('Notifier tick');
    setTimeout(this.onTick.bind(this), this.tickRate);
  }
}
