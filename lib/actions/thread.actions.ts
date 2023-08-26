'use server';

import { revalidatePath } from 'next/cache';

import { connectToDatabase } from '../mongoose';

import { IThread, Thread, User } from '@/lib/models';

interface Params {
	text: string;
	author: string;
	communityId: string | null;
	path: string;
}

export async function fetchThreads(
	pageNumber = 1,
	pageSize = 20,
): Promise<{ threads: IThread[]; isNext: boolean }> {
	connectToDatabase();

	try {
		const skips = pageSize * (pageNumber - 1);

		const threads = await Thread.find({
			parentId: { $in: [null, undefined] },
		})
			.sort({ createdAt: 'desc' })
			.skip(skips)
			.limit(pageSize)
			.populate({ path: 'author', model: User })
			.populate({
				path: 'replies',
				populate: {
					path: 'author',
					model: User,
					select: '_id name parentId avatar',
				},
			})
			.exec();

		const totalThreads = await Thread.countDocuments({
			parentId: { $in: [null, undefined] },
		});

		const isNext = totalThreads > skips + threads.length;

		return { threads, isNext };
	} catch (error: any) {
		throw new Error(`Failed to fetch threads: ${error.message}`);
	}
}

export async function fetchThreadById(id: string): Promise<IThread> {
	connectToDatabase();

	try {
		// TODO: Populate community
		const thread = await Thread.findById(id)
			.populate({
				path: 'author',
				model: User,
				select: '_id id name avatar',
			})
			.populate({
				path: 'replies',
				populate: [
					{
						path: 'author',
						model: User,
						select: '_id name parentId avatar',
					},
					{
						path: 'replies',
						model: Thread,
						populate: {
							path: 'author',
							model: User,
							select: '_id name parentId avatar',
						},
					},
				],
			})
			.exec();

		return thread;
	} catch (error: any) {
		throw new Error(`Failed to fetch thread: ${error.message}`);
	}
}

export async function createThread({
	text,
	author,
	communityId,
	path,
}: Params) {
	connectToDatabase();

	try {
		const createdThread = await Thread.create({
			text,
			author,
			community: null,
		});

		await User.findByIdAndUpdate(author, {
			$push: { threads: createdThread._id },
		});

		revalidatePath(path);
	} catch (error: any) {
		throw new Error(`Failed to create thread: ${error.message}`);
	}
}

export async function addReplyToThread(
	threadId: string,
	commentText: string,
	userId: string,
	path: string,
) {
	connectToDatabase();

	try {
		const originalThread = await Thread.findById(threadId);

		if (!originalThread) {
			throw new Error('Thread not found');
		}

		const replyThread = new Thread({
			text: commentText,
			author: userId,
			parentId: threadId,
		});

		const savedReplyThread = await replyThread.save();

		originalThread.replies.push(savedReplyThread._id);
		await originalThread.save();

		revalidatePath(path);
	} catch (error: any) {
		throw new Error(`Failed to add reply to thread: ${error.message}`);
	}
}
