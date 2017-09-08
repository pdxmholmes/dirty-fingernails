import { Schema, Document, Model, model } from 'mongoose';
import { IGroup } from './group';

export enum NotificationType {
  Update = 0,
  AboutToStart = 1
}

export interface INotification {
  group: IGroup;
  type: NotificationType;
}

export const NotificationSchema = new Schema({
  group: { type: Schema.Types.ObjectId, ref: 'Group' },
  type: Number
}, {
		timestamps: true
	});

export interface INotificationModel extends INotification, Document {
}

export const Notification = model<INotificationModel>('Notification', NotificationSchema);
