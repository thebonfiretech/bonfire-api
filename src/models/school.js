import mongoose from 'mongoose';

const SchoolSchema = new mongoose.Schema({
	name: String,
	descripton: String,
	date:{
	  type: Date,
	  default: Date.now()
	},
	coins:{
	  type: Number,
	  default: 25000
	},
	modules: {
		type: Array,
		default: ["base", "admin"]
	}
});

export default mongoose.model('school', SchoolSchema);
