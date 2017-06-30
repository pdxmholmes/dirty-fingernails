import { Flight } from './models';

export class BotContext {
    private _flights: Flight[];

    constructor() {
        this._flights = [];
    }

    get flights(): Flight[] {
        return this._flights;
    }

    newFlight(name: string, startTime: Date, campaign?: string) {
        this._flights.push(new Flight(name, startTime, campaign || 'KTO'));
    }
};
