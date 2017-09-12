const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
	fname: { type: String, required: true },
	lname: { type: String, required: true },
	password: { type: String, required: true },
	email: { type: String, required: true }
});

UserSchema.pre('save', async function(next) {
	const user = this;
	const hash = await bcrypt.hashSync(user.password, 12);

	user.password = hash;
	next();
});

module.exports = mongoose.model('User', UserSchema);
