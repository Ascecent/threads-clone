import mongoose, { Schema, Document } from 'mongoose';

import { IThread, IUser } from '@/lib/models';

export interface ICommunity extends Document {
	id: string;
	name: string;
	username: string;
	avatar: string;
	bio: string;
	createdBy: IUser['_id'] | IUser;
	threads: IThread['_id'][] | IThread[];
	members: IUser['_id'][] | IUser[];
}

const CommunitySchema: Schema = new Schema({
	id: { type: String, required: true },
	name: { type: String, required: true },
	username: { type: String, required: true, unique: true },
	avatar: String,
	bio: String,
	createdBy: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	threads: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Thread',
		},
	],
	members: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Community',
		},
	],
});

export const Community =
	mongoose.models.Community ||
	mongoose.model<ICommunity>('Community', CommunitySchema);
