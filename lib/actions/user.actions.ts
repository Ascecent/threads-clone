'use server';

import { revalidatePath } from 'next/cache';

import { IThread, IUser, Thread, User } from '@/lib/models';

import { connectToDatabase } from '../mongoose';
import { FilterQuery, SortOrder } from 'mongoose';

interface UpdateUserParams {
	userId: string;
	name: string;
	username: string;
	avatar: string;
	bio: string;
	path: string;
}

export async function updateUser({
	userId,
	name,
	username,
	avatar,
	bio,
	path,
}: UpdateUserParams) {
	connectToDatabase();

	try {
		await User.findOneAndUpdate(
			{
				id: userId,
			},
			{
				username: username.toLowerCase(),
				name,
				bio,
				avatar,
				onboarded: true,
			},
			{ upsert: true },
		);

		if (path === '/profile/edit') {
			revalidatePath(path);
		}
	} catch (error: any) {
		throw new Error(`Failed to create/update user: ${error.message}`);
	}
}

export async function fetchUser(userId: string): Promise<IUser | null> {
	try {
		connectToDatabase();

		return await User.findOne({ id: userId });
	} catch (error: any) {
		throw new Error(`Failed to get user: ${error.message}`);
	}
}

export async function fetchUserThreads(userId: string) {
	connectToDatabase();

	try {
		// Find all threads where the user is the author

		// TODO: Populate community
		const threads = await User.findOne({ id: userId }).populate({
			path: 'threads',
			model: Thread,
			populate: [
				{
					path: 'replies',
					model: Thread,
					populate: {
						path: 'author',
						model: User,
						select: 'name avatar id',
					},
				},
				{
					path: 'author',
					model: User,
				},
			],
		});

		return threads;
	} catch (error: any) {
		throw new Error(`Failed to get user threads: ${error.message}`);
	}
}

export async function fetchUsers({
	userId,
	searchTerm = '',
	pageNumber = 1,
	pageSize = 20,
	sortOrder = 'desc',
}: {
	userId: string;
	searchTerm?: string;
	pageNumber?: number;
	pageSize?: number;
	sortOrder?: SortOrder;
}) {
	connectToDatabase();

	try {
		const skips = (pageNumber - 1) * pageSize;

		const regex = new RegExp(searchTerm, 'i');

		const query: FilterQuery<IUser> = {
			id: { $ne: userId },
		};

		if (searchTerm.trim() !== '') {
			query.$or = [
				{ username: { $regex: regex } },
				{ name: { $regex: regex } },
			];
		}

		const sortOptions = { createdAt: sortOrder };

		const users = await User.find(query)
			.sort(sortOptions)
			.skip(skips)
			.limit(pageSize)
			.exec();

		const usersCount = await User.countDocuments(query);

		const isNext = usersCount > skips + users.length;

		return { users, isNext };
	} catch (error: any) {
		throw new Error(`Failed to fetch users: ${error.message}`);
	}
}

export async function fetchActivity(userId: string) {
	connectToDatabase();

	try {
		const userThreads = await Thread.find({ author: userId });

		const replyThreadsIds = userThreads.reduce((acc, thread) => {
			return acc.concat(thread.replies);
		}, []);

		const replies = await Thread.find({
			_id: { $in: replyThreadsIds },
			author: { $ne: userId },
		}).populate({
			path: 'author',
			model: User,
			select: 'name avatar _id',
		});

		return replies;
	} catch (error: any) {
		throw new Error(`Failed to fetch activity: ${error.message}`);
	}
}
