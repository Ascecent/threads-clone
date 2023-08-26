import { fetchUserThreads } from '@/lib/actions';
import { redirect } from 'next/navigation';
import { ThreadCard } from '../cards';
import { IThread } from '@/lib/models';

interface Props {
	currentUserId: string;
	accountId: string;
	accountType: string;
}

export const ThreadsTab = async ({
	currentUserId,
	accountId,
	accountType,
}: Props) => {
	const result = await fetchUserThreads(accountId);
	if (!result) redirect('/');

	return (
		<section className='mt-9 flex flex-col gap-10'>
			{result.threads.map((thread: IThread) => (
				<ThreadCard
					key={thread.id}
					thread={thread}
					currentUserId={currentUserId}
				/>
			))}
		</section>
	);
};
