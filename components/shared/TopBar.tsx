import Image from 'next/image';
import Link from 'next/link';

import { OrganizationSwitcher, SignOutButton, SignedIn } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export const TopBar = () => {
	return (
		<nav className='topbar border-solid border-b border-gray-800'>
			<Link href='/' className='flex items-center gap-4'>
				<Image
					src='/assets/logo.svg'
					width={32}
					height={32}
					alt='threads'
				/>

				<p className='text-heading3-bold text-light-1 max-sx:hidden'>
					Threads
				</p>
			</Link>

			<div className='flex items-center gap-1'>
				<div className='block md:hidden '>
					<SignedIn>
						<SignOutButton>
							<Image
								src='/assets/logout.svg'
								width={24}
								height={24}
								alt='logout'
							/>
						</SignOutButton>
					</SignedIn>
				</div>

				<OrganizationSwitcher
					appearance={{
						baseTheme: dark,
						elements: {
							organizationSwitcherTrigger: 'py-2 px-4',
						},
					}}
				/>
			</div>
		</nav>
	);
};
