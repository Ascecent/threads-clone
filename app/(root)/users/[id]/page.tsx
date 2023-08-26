import { redirect } from 'next/navigation';

import { currentUser } from '@clerk/nextjs';

import { ProfileHeader, ThreadsTab } from '@/components/shared';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';

import { fetchUser } from '@/lib/actions';

import { profileTabs } from '@/constants';

export default async function Page({ params }: { params: { id: string } }) {
	const currUser = await currentUser();
	if (!currUser) return null;

	const user = await fetchUser(params.id);
	if (!user || !user.onboarded) redirect('/onboarding');

	return (
		<section>
			<ProfileHeader user={user} authUserId={currUser.id} />

			<div className='mt-9'>
				<Tabs defaultValue='threads' className='w-full'>
					<TabsList className='w-full bg-transparent p-0 overflow-hidden h-auto'>
						{profileTabs.map(({ value, label, id, Icon }) => (
							<TabsTrigger value={value} key={id} className='tab'>
								<Icon size={20} />

								<p className='max-sm:hidden'>{label}</p>

								{value === 'threads' && (
									<span className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
										{user.threads.length}
									</span>
								)}
							</TabsTrigger>
						))}
					</TabsList>

					{profileTabs.map(tab => (
						<TabsContent
							value={tab.value}
							key={tab.id}
							className='w-full text-light-1'
						>
							<ThreadsTab
								currentUserId={currUser.id}
								accountId={user.id}
								accountType='user'
							/>
						</TabsContent>
					))}
				</Tabs>
			</div>
		</section>
	);
}
