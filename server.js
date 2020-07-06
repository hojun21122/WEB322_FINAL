const express = require("express");
const exphbs = require("express-handlebars");
const mealPackage = require("./models/mealPackage");
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer');
const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'hhwang21122@gmail.com',
      pass: 'ghwns211'
    }
  });
  
 
  

app.get("/", (req, res) =>{
    res.render("home", {
        title: "Home Page",
        data: mealPackage.getTopPackage()
    })
})

app.get("/mealPackageListing", (req, res) =>{
    res.render("mealPackageListing", {
        title: "Meal Listing Page",
        data: mealPackage.getAllmeals()
    })
})

app.get("/login", (req, res) =>{
    res.render("login", {
        title: "Log in"
    })
})

app.get("/registration", (req, res) =>{
    res.render("registration", {
        title: "Registration"
    })
})
app.post("/registration", (req, res) =>{
    const error = [];

    if(req.body.first==""){
        error.push("You must enter a First Name");
    }else{
        error.push("");
    }
    if(req.body.last==""){
        error.push("You must enter a Last Name");
    }else{
        error.push("");
    }
    if(req.body.email==""){
        error.push("You must enter a email");
    }else{
        var valid = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if(req.body.email.match(valid)){
            error.push("");
        }
        else{
            error.push("Your email has invalid email form make sure to use @ and domain");

        }
        
    }
    if(req.body.password==""){
        error.push("You must enter a password");
    }else {
        var lower = /[a-z]/;
        var upper = /[A-Z]/;
        var num = /[0-9]/;
        var spec = /[!@#$%^&*()~]/;
        var len = /^.{6,12}$/;
        if(req.body.password.match(len)){
            if(null == req.body.password.match(/[^\w\.\-]/)){
                if(req.body.password.match(lower) || req.body.password.match(upper) || req.body.password.match(num)){
                    error.push("")
                }else{
                    error.push("password cannot contain special characters")
                }
            }
            else{
                 error.push("No special Characters allowed");
            }
        }
        else{
            error.push("Password must be between 6 and 12 characters");   
        }
    }
    if(error[0] != "" || error[1] != ""|| error[2] != "" || error[3] != ""){
        
        res.render("registration", {
            title: "Registration",
            first: req.body.first,
            last: req.body.last,
            email: req.body.email,
            password: req.body.password,
            message1: error[0],
            message2: error[1],
            message3: error[2],
            message4: error[3]
        })
    }
    else{
        var mailOptions = {
            from: "hhwang21122@gmail.com",
            to: req.body.email,
            subject: 'You are successfully registered!',
            text: 'You are successfully registered! \n It is from assignment 2 made by hojun!'
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        res.render("dashboard",{
            title: "Welcome!",
        })
    }
})
app.post("/login", (req, res) =>{
    const error = [];

    if(req.body.email==""){
        error.push("You must enter a email");
    }else{
        var valid = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if(req.body.email.match(valid)){
            error.push("");
        }
        else{
            error.push("Your email has invalid email form make sure to use @ and domain");

        }
        
    }
    if(req.body.password==""){
        error.push("You must enter a password");
    }else{
        error.push("");
    }
    res.render("login", {
        title: "login",
        email: req.body.email,
        password: req.body.password,
        message1: error[0],
        message2: error[1]
    })
})
const PORT = 3000;

app.listen(PORT, ()=>{
    console.log("Server is running");
})