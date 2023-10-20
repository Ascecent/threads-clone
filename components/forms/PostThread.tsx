'use client';

import { usePathname, useRouter } from 'next/navigation';

import { useOrganization } from '@clerk/nextjs';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import * as z from 'zod';

import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
	Textarea,
} from '@/components/ui';

import { ThreadValidation } from '@/lib/validations';
import { createThread } from '@/lib/actions';

export const PostThread = ({ userId }: { userId: string }) => {
	const router = useRouter();
	const pathname = usePathname();
	const { organization } = useOrganization();

	const form = useForm({
		resolver: zodResolver(ThreadValidation),
		defaultValues: {
			thread: '',
			accountId: userId,
		},
	});

	const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
		await createThread({
			text: values.thread,
			author: values.accountId,
			communityId: organization?.id ?? null,
			path: pathname,
		});

		router.push('/');
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex flex-col justify-start gap-6 mt-5'
			>
				<FormField
					control={form.control}
					name='thread'
					render={({ field }) => (
						<FormItem className='flex flex-col w-full'>
							<FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
								<Textarea
									rows={5}
									placeholder='What are you thinking?'
									{...field}
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type='submit' className='w-full bg-primary-500'>
					Post Thread
				</Button>
			</form>
		</Form>
	);
};
