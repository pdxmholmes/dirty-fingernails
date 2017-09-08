import { Schema, Document, Model, model } from 'mongoose';

export interface IGroupAttribute {
	name: string;
	value: string;
}

export interface IGroupReservation {
  player: string;
  playerId: string;
  reservedAt: Date;
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
  reservations?: IGroupReservation[];
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
  }],
  reservations: [{
    player: String,
    playerId: String,
    reservedAt: Date
  }]
}, {
		timestamps: true
  });

GroupSchema.methods.fullId = function(): string {
  return `${this.gameId.toUpperCase()}-${this.groupId.toUpperCase()}`;
};

GroupSchema.methods.reservationCount = function(): number {
  return this.reservations ? this.reservations.length : 0;
};

export interface IGroupModel extends IGroup, Document {
  fullId(): string;
  reservationCount(): number;
}

export const Group = model<IGroupModel>('Group', GroupSchema);
