var express = require('express');
var app=express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var passport =require("passport");
var localStrategy = require("passport-local");
var User = require("./models/user");
var flash = require("connect-flash");
var passportLocalMongoose = require("passport-local-mongoose"); 
mongoose.connect("mongodb://localhost/auth_demo",{useNewUrlParser: true,useUnifiedTopology:true}, () => { console.log("we are connected")}).catch(err => console.log(err));
app.use(require("express-session")({
    secret:"Cr7 is the best footballer in the world",
    resave:false,
    saveUninitialized:false
}));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",(req,res)=>{
    res.render("home");
})
app.get("/register",(req,res)=>{
    res.render("register");
});
app.get("/secret",isLoggedIn,(req,res)=>{
    res.render("secret");
})
app.post("/register",(req,res)=>{
    req.body.username;
    req.body.password;
    User.register(new User({username:req.body.username}),req.body.password,(err,user)=>{
        if(err){
            console.log(err);
            res.redirect("/register");
        }
        passport.authenticate("local")(req,res,()=>{
            res.redirect("/secret");
        })
    })
})
app.get("/login",(req,res)=>{
    res.render("login"); //flash message need to be added
})
app.post("/login",passport.authenticate("local",{
    successRedirect:"/secret",
    failureRedirect:"/login"
}),(req,res)=>{
});
app.get("/logout",(req,res)=>{
    req.logOut();
    res.redirect("/");
})
function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
        return next();
    else{
        req.flash("error", "Please Login first!");
        res.render("login");
    }
}
app.listen(3000,()=>{
    console.log("Server started");
});