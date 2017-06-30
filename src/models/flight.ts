export class Flight {
    constructor(name: string, startTime: Date, campaign: string) {
        this._name = name;
        this._startTime = startTime;
        this._campaign = campaign;
    }

    get name() {
        return this._name;
    }

    get startTime() {
        return this._startTime;
    }

    get campaign() {
        return this._campaign;
    }

    private _name: string;
    private _startTime: Date;
    private _campaign: string;
}
