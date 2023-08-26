'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { useAuth } from '@clerk/nextjs';

import { sidebarLinks } from '@/constants';

export const BottomBar = () => {
	const { userId } = useAuth();

	const pathname = usePathname();
	const router = useRouter();

	return (
		<section className='bottombar'>
			<div className='bottombar_container'>
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
							className={`${
								isActive && 'bg-primary-500'
							} bottombar_link`}
						>
							<Image
								width={24}
								height={24}
								src={imgURL}
								alt={label}
							/>

							<p className='text-light-1 text-subtle-medium max-sm:hidden'>
								{label.split(' ')[0]}
							</p>
						</Link>
					);
				})}
			</div>
		</section>
	);
};
