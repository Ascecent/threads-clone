import '../globals.css';

import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';

export const metadata = {
	title: 'Threads',
	description: 'A Next.js 13 Meta Threads Application',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider>
			<html lang='en'>
				<body
					className={`${inter.className} bg-dark-1 w-screen min-h-screen flex items-center justify-center`}
				>
					{children}
				</body>
			</html>
		</ClerkProvider>
	);
}
