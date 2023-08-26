import { currentUser } from '@clerk/nextjs';

import { AccountProfile } from '@/components/forms';

import { Separator } from '@/components/ui';

export default async function Page() {
	const user = await currentUser();

	const userData = {
		id: user?.id || '',
		username: user?.username || '',
		name: user?.firstName || '',
		bio: '',
		avatar: user?.imageUrl || '',
	};

	return (
		<main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-20'>
			<section className='mt-9 p-10 bg-dark-2 rounded-lg'>
				<h1 className='head-text'>Onboarding</h1>

				<p className='mt-3 text-base-regular text-light-2'>
					Complete your profile to get started. You can always edit
					your profile later.
				</p>

				<Separator className='my-7' />

				<AccountProfile user={userData} />
			</section>
		</main>
	);
}
