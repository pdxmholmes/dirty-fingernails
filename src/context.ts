import { IFlight } from './models';

export class BotContext {
	constructor() {
		this.flights = [];
	}

	readonly flights: IFlight[];
}
