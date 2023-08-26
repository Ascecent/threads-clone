import mongoose, { mongo } from 'mongoose';

let isConnected = false;

export const connectToDatabase = async () => {
	if (process.env.MONGODB_URI === undefined)
		throw new Error('MONGODB_URI is undefined');

	if (isConnected) return;

	mongoose.set('strictQuery', true);

	try {
		await mongoose.connect(process.env.MONGODB_URI);

		isConnected = true;
	} catch (error) {
		console.log('Error connecting to database');
		console.error(error);
	}
};
