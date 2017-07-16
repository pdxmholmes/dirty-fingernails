import { Schema, Document, Model, model } from 'mongoose';

export interface IGroupAttribute {
	name: string;
	value: string;
}

export interface IGroup {
	groupId: string;
	name: string;
	startTime: Date;
  organizer: string;
  organizerId: string;
  gameId: string;
  numberOfPlayers: number;
	attributes?: IGroupAttribute[];
}

export const GroupSchema = new Schema({
	groupId: String,
	name: String,
	startTime: Date,
  organizer: String,
  organizerId: String,
  gameId: String,
  numberOfPlayers: Number,
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
