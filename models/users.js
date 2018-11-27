const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  lineId: String,
  name: String,
  university: String,
  graduation_date: String,
  email: String,
  phone: String,
  attend_date: [String],
  confirmed: { type: Boolean, default: false },
  hidden: { type: Boolean, default: false }
});


module.exports = mongoose.model('User', UserSchema);