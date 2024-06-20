import mongoose from 'mongoose';

const ExtractSchema = new mongoose.Schema({
	value: Number,
	description: String,
	type: String,
	author: String,
	date:{
		type: Date,
		default: Date.now()
	}
});

export default mongoose.model('extract', ExtractSchema);
