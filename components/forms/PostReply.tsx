'use client';

import { usePathname } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import * as z from 'zod';

import { CommentValidation } from '@/lib/validations';

import {
	Form,
	FormItem,
	FormControl,
	Button,
	FormField,
	Input,
	FormLabel,
} from '@/components/ui';
import Image from 'next/image';
import { addReplyToThread } from '@/lib/actions';

interface Props {
	threadId: string;
	currentUser: {
		id: string;
		avatar: string;
	};
}

export const PostReply = ({ threadId, currentUser }: Props) => {
	const pathname = usePathname();

	const form = useForm({
		resolver: zodResolver(CommentValidation),
		defaultValues: {
			thread: '',
		},
	});

	const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
		await addReplyToThread(
			JSON.parse(threadId),
			values.thread,
			JSON.parse(currentUser.id),
			pathname,
		);

		form.reset();
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='comment-form'
			>
				<FormField
					control={form.control}
					name='thread'
					render={({ field }) => (
						<FormItem className='flex items-center w-full'>
							<FormLabel>
								<Image
									src={currentUser.avatar}
									alt='Profile image'
									width={40}
									height={40}
									className='rounded-full object-contain'
								/>
							</FormLabel>

							<FormControl className='no-focus border-none bg-transparent text-light-1'>
								<Input
									type='text'
									placeholder='Comment...'
									className='no-focus text-light-1 outline-none'
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<Button type='submit' className='comment-form_btn'>
					Reply
				</Button>
			</form>
		</Form>
	);
};
