import { redirect } from 'next/navigation';

import { currentUser } from '@clerk/nextjs';

import { fetchUser, fetchUsers } from '@/lib/actions';
import { UserCard } from '@/components/cards';

export default async function Page() {
	const currUser = await currentUser();
	if (!currUser) return null;

	const user = await fetchUser(currUser.id);
	if (!user || !user.onboarded) redirect('/onboarding');

	// Fetch users
	const result = await fetchUsers({ userId: currUser.id });

	return (
		<section>
			<h1 className='head-text mb-10'>Search</h1>

			{/* Search Bar */}
			<div className='mt-1 flex flex-col gap-9'>
				{result.users.length === 0 ? (
					<p className='text-center text-gray-500'>No users found</p>
				) : (
					result.users.map(user => (
						<div key={user.id} className='flex flex-col gap-2'>
							<UserCard user={user} userType='user' />
						</div>
					))
				)}
			</div>
		</section>
	);
}
