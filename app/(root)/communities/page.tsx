import { redirect } from 'next/navigation';

import { currentUser } from '@clerk/nextjs';

import { fetchUser } from '@/lib/actions';

export default async function Page() {
	const currUser = await currentUser();
	if (!currUser) return null;

	const user = await fetchUser(currUser.id);
	if (!user || !user.onboarded) redirect('/onboarding');

	return (
		<section>
			<h1 className='head-text mb-10'>Communities</h1>
		</section>
	);
}
