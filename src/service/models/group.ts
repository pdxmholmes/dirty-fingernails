import { Schema, Document, Model, model } from 'mongoose';

export interface IGroupAttribute {
	name: string;
	value: string;
}

export interface IGroup {
	id?: string;
	name?: string;
	startTime?: Date;
	organizer?: string;
	gameId?: string;
	attributes?: IGroupAttribute[];
}

export const GroupSchema = new Schema({
	id: String,
	name: String,
	startTime: Date,
	organizer: String,
	gameId: String,
	attributes: [{
		name: String,
		value: String
	}]
}, {
		timestamps: true
	});

export interface IGroupModel extends IGroup, Document {
}

export const Group = model<IGroupModel>('Group', GroupSchema);
