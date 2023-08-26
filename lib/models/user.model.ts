import mongoose, { Schema, Document } from 'mongoose';

import { IThread } from './thread.model';

export interface IUser extends Document {
	id: string;
	name: string;
	username: string;
	avatar: string;
	bio: string;
	threads: IThread['_id'][] | IThread[];
	onboarded: boolean;
	communities: string[];
}

const UserSchema: Schema = new Schema({
	id: { type: String, required: true },
	name: { type: String, required: true },
	username: { type: String, required: true, unique: true },
	avatar: String,
	bio: String,
	threads: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Thread',
		},
	],
	onboarded: {
		type: Boolean,
		default: false,
	},
	communities: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Community',
		},
	],
});

export const User =
	mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
