import mongoose from 'mongoose';

const KeySchema = new mongoose.Schema({
	id: String,
	author: String,
	date:{
		type: Date,
		default: Date.now()
	}
});

export default mongoose.model('key', KeySchema);
