import mongoose from 'mongoose';

const InvestmentsSchema = new mongoose.Schema({
	name: String,
	description: String,
	type: String,
	author: String,
	date:{
		type: Date,
		default: Date.now()
	},
	config: {
		typeOfRescue: {
			type: Number,
			default: 0
		},
		minimumInvestment: {
			type: Number,
			default: 0
		},
		performance: {
			type: Number,
			default: 0
		},
		advanceRedemption: {
			type: Number,
			default: 0
		}
	}
});

export default mongoose.model('investments', InvestmentsSchema);
