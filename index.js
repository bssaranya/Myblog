const express = require('express');
const router = require('express').Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//const cors = require('cors');
const auth = require('./src/middleware/Auth')
const ArticleInfo = require('./src/model/BlogDB');
const SignupInfo = require('./src/model/Signup');
const IndividualarticleInfo = require('./src/model/article');
const { response } = require('express');
require("dotenv").config()

//Object Intialization
const app = express();
// app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json())


const path = require('path');
app.use(express.static('./build/'));






const PORT = process.env.PORT || 5000
mongoose.connect('mongodb+srv://saranya:saranya@cluster0.j1jik.mongodb.net/BlogApp?retryWrites=true&w=majority')

//Display Article
app.get('/api/article/:name', (req, res) => {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
    try {
        const articleName = req.params.name;
        ArticleInfo.findOne({ name: articleName })
            .then(function (article) {
                res.status(200).json(article);
            })
    }

    catch (error) {
        res.status(500).json({ message: 'Error', eroor });
    }
});



// upvotes routing
app.post('/api/article/:name/upvotes', (req, res) => {
    const articleName = req.params.name;
    const filter = { name: articleName };
    const update = { $inc: { upvotes: 1 } };
    ArticleInfo.findOneAndUpdate(filter, update, { new: true })
        .then(function (article) {
            res.json(article);
        })
})

// Comments Routing
app.post('/api/article/:name/comments', (req, res) => {
    const articleName = req.params.name;
    const { username, text } = req.body;
    const filter = { name: articleName };
    const update = { $push: { comments: { username, text } } };
    ArticleInfo.findOneAndUpdate(filter, update, { new: true })
        .then(function (article) {
            res.json(article);
        })
})


// Add article
app.post('/api/add',(req,res) =>{
    ArticleInfo.create(req.body).then((article) =>{
        res.status(200).send(article);
    }).catch((err)=>{
        res.status(400).send(err)
    })

})



// Signup
app.post('/api/signup', async (req, res) => {
    try {
        const { username, email, password, repeatpassword } = req.body;

        if (!username || !email || !password || !repeatpassword)
            return res.status(400).json({ msg: "Not all fields have been entered." });
        if (password.length < 5)
            return res.status(400).json({ msg: "The password needs to be at least 5 characters long." });
        if (password !== repeatpassword)
            return res.status(400).json({ msg: "Enter the same password twice for verification." });
        const existingEmail = await SignupInfo.findOne({ email: email });
        if (existingEmail)
            return res.status(400).json({ msg: "An account with this email already exists." });
        const existingUser = await SignupInfo.findOne({ username: username });
        if (existingUser)
            return res.status(400).json({ msg: "An account with this username already exists." });
        // const salt = await bcrypt.genSalt();
        // const passwordHash = await bcrypt.hash(password, salt);
        const passwordHash = bcrypt.hashSync(password,10)
        const newUser = new SignupInfo({
            email: email,
            password: passwordHash,
            repeatpassword: passwordHash,
            username: username,
        });
        const savedUser = await newUser.save();
        // res.json(savedUser);
        res.json({msg:"Sucessfully Saved"})

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password)
            return res.status(400).json({ msg: "Not all fields have been entered." });
        const user = await SignupInfo.findOne({ username: username });
        if (!user)
            return res.status(400).json({ msg: "No account with this username has been registered." });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });
        // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        const token = jwt.sign({id:user._id},'myjwtkey',{expiresIn:'4000d'})
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
            },
        });
    }
    catch (err) {
        res.status(500).json({ error: `error in login ${err.message}` });
    }
})

// Check if token is valid
app.post("/tokenIsValid", async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) return res.json(false);
        const user = await SignupInfo.findById(verified.id);
        if (!user) return res.json(false);
        return res.json(true);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/", auth, async (req, res) => {
    const user = await SignupInfo.findById(req.user);
    res.json({
        username: user.username,
        id: user._id,
    });
});
module.exports = router;

// Article List

app.post('/api/article', (req, res) => {
    // jwt.verify(req.headers.token,'myjwtkey',(err,decoded)=>{
    //     if(decoded){
            ArticleInfo.find({},function(err,users){
                if(err){
                    res.send('something went really wrong!!')
                }
                console.log(users)
                res.json(users)
            })
        // }
        // else{
        //     res.send('UnAuthorized User')
        // }
    // })
});

// Updates

app.post('/api/article/:name/update',(req,res)=>{
    const articleName = req.params.name;
    const { username, description } = req.body;
    console.log(req.body)
    const filter = { name: articleName };
    const update = { username: username,description:description } ;
    ArticleInfo.findOneAndUpdate(filter, update, { new: true })
        .then(function (article) {
            res.json(article);
        })
})

// Delete

app.post('/api/article/:name/delete',(req,res)=>{
    const articleName = req.params.name;
    const filter = { name: articleName };
    ArticleInfo.findOneAndDelete(filter,(err)=>{
        if(err){
            console.log(err)
        }
        console.log("One data deleted")
    })
   
})



app.get('/*',(req,res)=>{
    res.sendFile(path.join(__dirname+'/build/index.html'));
})

// Port number
app.listen(PORT, () => {
    console.log(`Listening to the port ${PORT}`);
})

