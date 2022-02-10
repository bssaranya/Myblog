const mongoose = require('mongoose');

// Connect with backend and server
// mongoose.connect('mongodb://localhost:27017/blogapp');
const Schema = mongoose.Schema;


// Structure of mongo fieldname,type
var individualarticleSchema = new Schema({
    name: String,
    title:String,
    description: String
});

// Assign to collection
var IndividualarticleInfo = mongoose.model('individualarticle', individualarticleSchema);

module.exports = IndividualarticleInfo;