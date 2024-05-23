import mongoose from 'mongoose';

const SchoolSchema = new mongoose.Schema({
	name: String,
	descripton: String,
	date:{
	  type: Date,
	  default: Date.now()
	},
	modules: {
		type: Array,
		default: ["base"]
	}
});

export default mongoose.model('school', SchoolSchema);
