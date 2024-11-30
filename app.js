const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const encrypt = require('mongoose-encryption');

var app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/secrets');
const trySchema = new mongoose.Schema({
    email: String,
    password :String

})
const secret = "thisislittlesecret.";
trySchema.plugin(encrypt,{secret:secret, encryptedFields:["password"]});
const item = mongoose.model("second", trySchema);

app.get("/", function(req, res){
    res.render("home");
});
app.post("/register", function(req, res){
    const newUser = new item({
        email:req.body.username,
        password:req.body.password
    });
    newUser.save()
    .then(()=>{
        res.render("secrets");
    })
    .catch((err)=>{
        console.log(err);
    })
});
app.get("/login",function(req,res){
    res.render("login");
});
app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    item.findOne({email:username})
    .then((existingUser)=>{
        if(existingUser){
            if(existingUser.password===password){
                res.render("secrets");
            }
        }
    })
    .catch((err)=>{
        console.log(err);
    })
});
app.get("/register",function(req,res){
    res.render("register");
});
app.get("/logout", function(req, res) {
    res.redirect("/"); // Redirects to the home page
});
app.get("/submit", function(req, res) {
    res.redirect("/"); // Redirects to the home page
});
app.listen(5000,function(){
    console.log("Server started");
});
