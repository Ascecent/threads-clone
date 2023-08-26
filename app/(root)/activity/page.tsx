import { redirect } from 'next/navigation';

import { currentUser } from '@clerk/nextjs';

import { fetchActivity, fetchUser } from '@/lib/actions';
import Link from 'next/link';
import Image from 'next/image';
import { IThread } from '@/lib/models';

export default async function Page() {
	const currUser = await currentUser();
	if (!currUser) return null;

	const user = await fetchUser(currUser.id);
	if (!user || !user.onboarded) redirect('/onboarding');

	const activity = await fetchActivity(user._id);

	return (
		<section>
			<h1 className='head-text mb-10'>Activity</h1>

			<section className='mt-10 flex flex-col gap-5'>
				{activity.length === 0 ? (
					<p className='text-center text-gray-500'>
						No activity found
					</p>
				) : (
					activity.map(activity => (
						<Link
							key={activity._id}
							href={`/threads/${activity.parentId}`}
						>
							<article className='activity-card'>
								<Image
									src={activity.author.avatar}
									alt='Profile picture'
									width={20}
									height={20}
									className='rounded-full object-cover'
								/>

								<p className='!text-small-regular text-light-1'>
									<span className='mr-1 text-primary-500'>
										{activity.author.name}
									</span>{' '}
									replied to your thread
								</p>
							</article>
						</Link>
					))
				)}
			</section>
		</section>
	);
}
