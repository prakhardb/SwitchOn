const mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");
//Define a schema
const Schema = mongoose.Schema;
const UserSchema = new Schema({
 username: {
  type: String,
  unique: true,
  trim: true,  
  required: true,
 },
 password: {
  type: String,
  trim: true,
  required: true
 }
});
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);