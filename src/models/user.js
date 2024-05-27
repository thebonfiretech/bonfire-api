import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
	name: String,
	school: String,
	id: {
	  type: String,
	  unique: true
	},
	password: String,
	role: {
	  default: "normal",
	  type: String
	},
	status:{
		default: "never-logged-in",
		type: String
	},
	contact: String,
	descripton: String,
	loginDay: Date,
	date:{
	  type: Date,
	  default: Date.now()
	}
});

export default mongoose.model('user', UserSchema);
