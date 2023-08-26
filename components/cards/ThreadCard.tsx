import { IThread } from '@/lib/models';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
	thread: IThread;
	isReply?: boolean;
	currentUserId: string;
}

export const ThreadCard = ({ thread, isReply, currentUserId }: Props) => {
	const { author, replies, id, text } = thread;

	return (
		<article
			className={`flex w-full flex-col rounded-xl ${
				isReply ? 'px-0 xs:px-7' : 'bg-dark-2 p-7'
			}`}
		>
			<div className='flex items-start justify-between'>
				<div className='flex w-full flex-1 gap-4'>
					<div className='flex flex-col items-center'>
						<Link
							href={`/users/${author.id}`}
							className='relative h-11 w-11'
						>
							<Image
								src={author.avatar}
								alt='Profile image'
								className='cursor-pointer rounded-full'
								width={44}
								height={44}
							/>
						</Link>

						<div className='thread-card_bar' />
					</div>

					<div className='flex flex-col w-full'>
						<Link href={`/users/${author.id}`} className='w-fit'>
							<h4 className='cursor-pointer text-base-semibold text-light-1'>
								{author.name}
							</h4>
						</Link>

						<p className='mt-2 text-small-regular text-light-2'>
							{text}
						</p>

						<div className='mt-5 flex flex-col gap-3'>
							<div className='flex gap-3.5'>
								<Image
									src='/assets/heart-gray.svg'
									alt='heard'
									width={24}
									height={24}
									title='Like'
									className='cursor-pointer object-contain'
								/>

								<Link href={`/threads/${id}`}>
									<Image
										src='/assets/reply.svg'
										alt='reply'
										width={24}
										height={24}
										title='Reply'
										className='cursor-pointer object-contain'
									/>
								</Link>

								<Image
									src='/assets/repost.svg'
									alt='repost'
									width={24}
									height={24}
									title='Repost'
									className='cursor-pointer object-contain'
								/>

								<Image
									src='/assets/share.svg'
									alt='share'
									width={24}
									height={24}
									title='Share'
									className='cursor-pointer object-contain'
								/>
							</div>

							{isReply && replies && replies.length > 0 && (
								<Link href={`/threads/${id}`}>
									<p className='mt-1 text-subtle-medium text-gray-1'>
										{replies.length} replies
									</p>
								</Link>
							)}
						</div>
					</div>
				</div>
			</div>
		</article>
	);
};
