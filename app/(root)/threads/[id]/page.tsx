import { redirect } from 'next/navigation';

import { currentUser } from '@clerk/nextjs';

import { ThreadCard } from '@/components/cards';
import { PostReply } from '@/components/forms';

import { IThread, IUser } from '@/lib/models';

import { fetchThreadById, fetchUser } from '@/lib/actions';

export default async function Page({ params }: { params: { id: string } }) {
	if (!params.id) return null;

	const currUser = await currentUser();
	if (!currUser) return null;

	const user = await fetchUser(currUser.id);
	if (!user?.onboarded) {
		redirect('/onboarding');
	}

	const thread = await fetchThreadById(params.id);

	return (
		<section className='relative '>
			<ThreadCard
				key={thread._id}
				thread={thread}
				currentUserId={currUser.id}
			/>

			<div className='mt-7'>
				<PostReply
					threadId={JSON.stringify(thread._id)}
					currentUser={{
						id: JSON.stringify(user._id),
						avatar: user.avatar,
					}}
				/>
			</div>

			<div className='mt-10'>
				<h2 className='text-2xl font-bold text-light-2 mb-10'>
					Replies
				</h2>

				<div className='flex flex-col gap-5'>
					{thread.replies.length === 0 ? (
						<p className='text-light-2'>
							No replies yet. Be the first to reply!
						</p>
					) : (
						thread.replies.map((reply: IThread) => (
							<ThreadCard
								key={reply._id}
								thread={reply}
								currentUserId={currUser.id}
								isReply
							/>
						))
					)}
				</div>
			</div>
		</section>
	);
}
