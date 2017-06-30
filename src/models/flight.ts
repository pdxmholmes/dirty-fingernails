export class Flight {
    constructor(name: string, startTime: Date, campaign: string) {
        this.name = name;
        this.startTime = startTime;
        this.campaign = campaign;
    }

    readonly name: string;
    readonly startTime: Date;
    readonly campaign: string;
}
