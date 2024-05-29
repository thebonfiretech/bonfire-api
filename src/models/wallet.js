import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema({
	id: String,
	author: String,
	coins: {
		type: Number,
		default: 0
	},
	transactions: [
		{
			coins: {
				type: Number,
				default: 0
			},
			date:{
				type: Date,
				default: Date.now()
			}
		}
	],
	date:{
		type: Date,
		default: Date.now()
	}
});

export default mongoose.model('wallet', WalletSchema);
