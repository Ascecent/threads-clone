'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { currentUser, SignedIn, SignOutButton, useAuth } from '@clerk/nextjs';

import { sidebarLinks } from '@/constants';

export const LeftSideBar = () => {
	const { userId } = useAuth();

	const pathname = usePathname();
	const router = useRouter();

	return (
		<section className='custom-scrollbar leftsidebar'>
			<div className='flex flex-col gap-6 px-6 w-full'>
				{sidebarLinks.map(({ route, label, imgURL }) => {
					const isActive =
						(pathname.includes(route) && route !== '/') ||
						(route === '/' && pathname === route);

					if (route === '/users') {
						route = `/users/${userId}`;
					}

					return (
						<Link
							href={route}
							key={label}
							className={`leftsidebar_link ${
								isActive ? 'bg-primary-500' : 'hover-effect'
							}`}
						>
							<Image
								width={24}
								height={24}
								src={imgURL}
								alt={label}
							/>

							<p className='text-light-1 max-lg:hidden'>
								{label}
							</p>
						</Link>
					);
				})}
			</div>

			<div className='mt-10 px-6'>
				<SignedIn>
					<SignOutButton
						signOutCallback={() => router.push('/sign-in')}
					>
						<div className='flex cursor-pointer gap-4 p-4 hover-effect rounded-lg'>
							<Image
								src='/assets/logout.svg'
								width={24}
								height={24}
								alt='logout'
							/>

							<p className='text-light-1 max-lg:hidden'>Logout</p>
						</div>
					</SignOutButton>
				</SignedIn>
			</div>
		</section>
	);
};
