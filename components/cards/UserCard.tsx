'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui';

import { IUser } from '@/lib/models';

interface Props {
	user: IUser;
	userType: string;
}

export const UserCard = ({ user, userType = 'user' }: Props) => {
	const { id, avatar, name, username } = user;

	const router = useRouter();

	return (
		<article className='user-card'>
			<div className='user-card_avatar'>
				<Image
					src={avatar}
					alt='User Avatar'
					width={48}
					height={48}
					className='rounded-full'
				/>

				<div className='flex-1 text-ellipsis'>
					<h4 className='text-base-semibold text-light-1'>{name}</h4>
					<p className='text-small-medium text-gray-1'>@{username}</p>
				</div>
			</div>

			<Button
				className='user-card_btn'
				onClick={() => router.push(`/users/${id}`)}
			>
				View
			</Button>
		</article>
	);
};
