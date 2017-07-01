import { Schema, Document, Model, model } from 'mongoose';

export interface IFlight {
	name?: string;
	startTime?: Date;
	organizer?: string;
	campaign?: string;
}

export const FlightSchema = new Schema({
	name: String,
	startTime: Date,
	organizer: String,
	campaign: String
}, {
		timestamps: true
	});

export interface IFlightModel extends IFlight, Document {
}

export const Flight = model<IFlightModel>('Flight', FlightSchema);
