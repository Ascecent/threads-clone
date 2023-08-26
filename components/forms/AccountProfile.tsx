'use client';

import { ChangeEvent, use, useState } from 'react';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Button,
	Textarea,
	Avatar,
	AvatarImage,
	AvatarFallback,
} from '@/components/ui';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import * as z from 'zod';

import { useUploadThing } from '@/lib/uploadthing';
import { UserValidation } from '@/lib/validations';
import { isBase64Image } from '@/lib/utils';
import { updateUser } from '@/lib/actions/user.actions';

interface Props {
	user: {
		id: string;
		username: string;
		name: string;
		bio: string;
		avatar: string;
	};
}

export const AccountProfile = ({ user }: Props) => {
	const [files, setFiles] = useState<File[]>([]);

	const { startUpload } = useUploadThing('imageUploader');

	const router = useRouter();
	const pathname = usePathname();

	const form = useForm({
		resolver: zodResolver(UserValidation),
		defaultValues: {
			name: user.name,
			username: user.username,
			bio: user.bio,
			avatar: user.avatar,
		},
	});

	const handleImage = (
		e: ChangeEvent<HTMLInputElement>,
		fieldChange: (value: string) => void,
	) => {
		e.preventDefault();

		const fileReader = new FileReader();

		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];

			setFiles(Array.from(e.target.files));

			if (!file.type.includes('image')) return;

			fileReader.onload = async event => {
				const imageDataUrl = event.target?.result?.toString() || '';

				fieldChange(imageDataUrl);
			};

			fileReader.readAsDataURL(file);
		}
	};

	const onSubmit = async (values: z.infer<typeof UserValidation>) => {
		const blob = values.avatar;

		const hasImageChanged = isBase64Image(blob);

		if (hasImageChanged) {
			const imgRes = await startUpload(files);

			if (imgRes && imgRes[0].fileUrl) {
				values.avatar = imgRes[0].fileUrl;
			}
		}

		await updateUser({ userId: user.id, ...values, path: pathname });

		if (pathname === '/profile/edit') {
			router.back();
		} else {
			router.push('/');
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex flex-col justify-start gap-6'
			>
				<FormField
					control={form.control}
					name='avatar'
					render={({ field }) => (
						<FormItem className='flex items-center gap-4'>
							<FormLabel className='account-form_image-label'>
								<Avatar>
									<AvatarImage
										src={field.value}
										width={96}
										height={96}
									/>

									<AvatarFallback>
										<Image
											src='/assets/profile.svg'
											alt='profile'
											width={25}
											height={25}
										/>
									</AvatarFallback>
								</Avatar>
							</FormLabel>

							<FormControl className='flex-1 text-base-semibold text-gray-200'>
								<Input
									type='file'
									accept='image/*'
									placeholder='Upload a photo'
									className='account-form_image-input'
									onChange={e =>
										handleImage(e, field.onChange)
									}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<div className='flex gap-5'>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem className='flex flex-col w-full'>
								<FormLabel className='text-base-semibold text-light-2'>
									Name
								</FormLabel>

								<FormControl className='flex-1 text-base-semibold text-gray-200'>
									<Input
										type='text'
										className='account-form_input no-focus'
										placeholder='Elon Musk'
										{...field}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='username'
						render={({ field }) => (
							<FormItem className='flex flex-col w-full'>
								<FormLabel className='text-base-semibold text-light-2'>
									Username
								</FormLabel>

								<FormControl className='flex-1 text-base-semibold text-gray-200'>
									<Input
										type='text'
										className='account-form_input no-focus'
										placeholder='elonmusk'
										{...field}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name='bio'
					render={({ field }) => (
						<FormItem className='flex flex-col w-full'>
							<FormLabel className='text-base-semibold text-light-2'>
								Bio
							</FormLabel>

							<FormControl className='flex-1 text-base-semibold text-gray-200'>
								<Textarea
									cols={10}
									rows={10}
									className='account-form_input no-focus'
									placeholder='elonmusk'
									{...field}
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type='submit'>Submit</Button>
			</form>
		</Form>
	);
};
