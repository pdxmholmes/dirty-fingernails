import { Flight } from './models';

export class BotContext {
    constructor() {
        this.flights = [];
    }

    newFlight(name: string, startTime: Date, campaign?: string) {
        this.flights.push(new Flight(name, startTime, campaign || 'KTO'));
    }

    readonly flights: Flight[];
}
