const mongoose = require('mongoose');

// // Connect with backend and server
// mongoose.connect('mongodb://localhost:27017/blogapp');
const Schema = mongoose.Schema;


// Structure of mongo fieldname,type
var signupSchema = new Schema({
    username: String,
    email:String,
    password: String,
    repeatpassword: String,
});

// Assign to collection
var SignupInfo = mongoose.model('user', signupSchema);

module.exports = SignupInfo;