import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { fetchUser } from '@/lib/actions';

import { PostThread } from '@/components/forms';

export default async function Page() {
	const currUser = await currentUser();
	if (!currUser) return null;

	const userInfo = await fetchUser(currUser.id);
	if (!userInfo || !userInfo.onboarded) redirect('/onboarding');

	return (
		<>
			<h1 className='head-text'>Create Thread</h1>

			<PostThread userId={userInfo._id} />
		</>
	);
}
