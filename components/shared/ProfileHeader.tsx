import { IUser } from '@/lib/models';
import Image from 'next/image';

interface Props {
	user: IUser;
	authUserId: string;
}

export const ProfileHeader = ({ user, authUserId }: Props) => {
	return (
		<div className='flex flex-col justify-start w-full'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					<Image
						src={user.avatar}
						alt={user.username}
						width={50}
						height={50}
						className='rounded-full object-cover shadow-xl'
					/>

					<div className='flex-1'>
						<h2 className='text-left text-heading3-bold text-light-1'>
							{user.name}
						</h2>
						<p className='text-base-medium text-gray-1'>
							@{user.username}
						</p>
					</div>
				</div>
				{/* TODO: Community */}
			</div>

			<p className='mt-6 max-w-lg text-base-regular text-light-2'>
				{user.bio}
			</p>

			<div className='mt-12 h-0.5 w-full bg-dark-3' />
		</div>
	);
};
