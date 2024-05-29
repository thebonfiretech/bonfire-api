import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema({
	id: String,
	name: String,
	author: String,
	date:{
		type: Date,
		default: Date.now()
	}
});

export default mongoose.model('favorite', FavoriteSchema);
