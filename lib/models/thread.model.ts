import mongoose, { Schema, Document } from 'mongoose';

import { ICommunity, IUser } from '@/lib/models';

export interface IThread extends Document {
	text: string;
	author: IUser['_id'] | IUser;
	community: ICommunity['_id'] | ICommunity | null;
	createdAt: Date;
	parentId: IThread['_id'] | IThread | null;
	replies: IThread['_id'][] | IThread[];
}

const ThreadSchema: Schema = new Schema({
	text: { type: String, required: true },
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	community: {
		type: Schema.Types.ObjectId,
		ref: 'Community',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	parentId: {
		type: Schema.Types.ObjectId,
		ref: 'Thread',
	},
	replies: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Thread',
		},
	],
});

export const Thread =
	mongoose.models.Thread || mongoose.model<IThread>('Thread', ThreadSchema);
