const mongoose = require('mongoose');

// Connect with backend and server
// mongoose.connect('mongodb://localhost:27017/blogapp');
const Schema = mongoose.Schema;


// Structure of mongo fieldname,type
var articleSchema = new Schema({
    name: String,
    title: String,
    username: String,
    upvotes: Number,
    description: String,
    comments: Array
});

// Assign to collection
var ArticleInfo = mongoose.model('articles', articleSchema);

module.exports = ArticleInfo;