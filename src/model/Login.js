const mongoose = require('mongoose');

// Connect with backend and server
// mongoose.connect('mongodb://localhost:27017/blogapp');
const Schema = mongoose.Schema;


// Structure of mongo fieldname,type
var signinSchema = new Schema({
    username: String,
    password: String,
});

// Assign to collection
var SigninInfo = mongoose.model('user', signinSchema);

module.exports = SigninInfo;