import { currentUser } from '@clerk/nextjs';

import { fetchThreads } from '@/lib/actions';
import { ThreadCard } from '@/components/cards';

export default async function Page() {
	const { threads, isNext } = await fetchThreads(1, 30);

	const user = await currentUser();

	return (
		<>
			<h1 className='head-text text-left'>Home</h1>

			<section className='mt-9 flex flex-col gap-10'>
				{threads.length === 0 ? (
					<div className='flex flex-col items-center justify-center'>
						<p className='text-2xl'>No threads found.</p>
						<p className='text-xl'>Be the first to create one!</p>
					</div>
				) : (
					<>
						{threads.map(thread => (
							<ThreadCard
								key={thread._id}
								thread={thread}
								currentUserId={user?.id || ''}
							/>
						))}
					</>
				)}
			</section>
		</>
	);
}
