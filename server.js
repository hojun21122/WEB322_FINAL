const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const mealPackage = require("./models/mealPackage");
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
const app = express();
const multer = require("multer");
const dataServiceAuth = require("./data-service-auth.js");
const clientSessions = require("client-sessions");


var viewData = {
    fakedb: [],
    getfakedb(){
        return this.fakedb;
    }
};
var detailData = {
    fakedb: [],
    getfakedb(){
        return this.fakedb;
    }
};
var shoppingcart={
    db: [],
    getfakedb(){
        return this.db;
    }
}
const storage = multer.diskStorage({
    destination: "./public/images/",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

const upload = multer({ storage: storage });
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




var transporter = nodemailer.createTransport({
    service: 'smtp.gmail',
    secure: false,
    port: 465,
    auth: {
            user: 'hhwang21122@gmail.com',
            pass:"ghwns211"
    }
  });

  function ensureLogin(req, res, next) {
    if (!req.session.user) {
      res.redirect("/login");
    } else {
      next();
    }
  }
  function ensuredataClerk(req, res, next) {
    if (!req.session.user.dataClerk) {
      res.redirect("/");
    } else {
      next();
    }
  }
  app.use(clientSessions({
    cookieName: "session",
    secret: "web322_Assignment", 
    duration: 99999 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
  }));

  app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});
app.get("/", (req, res) =>{
    res.render("home", {
        title: "Home Page",
         data:   mealPackage.getTopdb()
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
app.get("/dataentry", ensureLogin,ensuredataClerk,(req, res) =>{
    res.render("dataentry", {
        title: "dataentry"
    })
})
app.get("/dataclerkdashboard", ensureLogin,ensuredataClerk,(req, res) =>{
    res.render("dataclerkdashboard", {
        title: "dataclerkdashboard"
    })
})
app.get("/editdata", ensureLogin,ensuredataClerk,(req, res) =>{
    res.render("editdata", {
        title: "Edit Data",
        data: mealPackage.getAllmeals()
    })
})
app.get("/editdata/:str", ensureLogin,ensuredataClerk,(req, res) =>{
    if(viewData.fakedb.length >0){
        viewData = {
            fakedb: [],
            getfakedb(){
                return this.fakedb;
            }
        };
    }
    for(i=0;i < mealPackage.fakedb.length;i++){
        if(mealPackage.fakedb[i].title.toLowerCase() == req.params.str.toLowerCase()){
            viewData.fakedb.push(mealPackage.fakedb[i]);
        }
    }
    res.render("edit", {
        title: "Edit Data",
        data: viewData.getfakedb()
    })
})

app.get("/detail/:str", ensureLogin,(req, res) =>{
    if(detailData.fakedb.length >0){
        detailData = {
            fakedb: [],
            getfakedb(){
                return this.fakedb;
            }
        };
    }
    for(i=0;i < mealPackage.fakedb.length;i++){
        if(mealPackage.fakedb[i].title.toLowerCase() == req.params.str.toLowerCase()){
            detailData.fakedb.push(mealPackage.fakedb[i]);
        }
    }
    res.render("detail", {
        title: "Edit Data",
        data: detailData.getfakedb()
    })
})

app.get("/shoppingcart", ensureLogin,(req, res) =>{
    res.render("shoppingcart", {
        title: "shopping cart",
        data: shoppingcart.getfakedb()
    })
})
app.post("/shoppingcart", ensureLogin,(req, res) =>{
        var sstring = "";
        var total = 0;
        if(shoppingcart.db.length < 0){
            res.render("shoppingcart", {
                title: "shopping cart",
                data: shoppingcart.getfakedb(),
                message33: "No Items are in Shopping cart"
            })
        }
        else{
            for(i = 0; i < shoppingcart.db.length; i++){
                sstring += "Name: " + shoppingcart.db[i].title +  "   qty: "+ shoppingcart.db[i].num +  "  price: "+shoppingcart.db[i].total+ "\n";
                total += shoppingcart.db[i].total;
            }
            
        for(i=0;i < mealPackage.fakedb.length;i++){
            for(j=0;j < shoppingcart.db.length;j++)
            if(mealPackage.fakedb[i].title.toLowerCase() == shoppingcart.db[j].title.toLowerCase()){
                mealPackage.fakedb[i].num -= shoppingcart.db[j].num;
            }
        }
        var mailOptions = {
            from: "hhwang21122@gmail.com",
            to: req.session.user.email,
            subject: 'Order Confirmation',
            text: "Thank you for your order! Here is your Order Confirmation \n"+
            "Address: " + req.body.apartment + req.body.street + ", " + req.body.city +"\n" +
            "Customer Name: " + req.session.user.firstName +  " " +req.session.user.lastName  + "\n"+
            "Phone Number: " + req.body.phone + "\n" +
            "Order Detail: " + "\n"+ "********************************************\n" + sstring + "\n" +
            "Final Total: " + total
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
          shoppingcart={
            db: [],
            getfakedb(){
                return this.db;
            }
        }
            res.render("dashboard", {
                title: "Success",
                message: "Your Order is successfully placed"
            })
        }
        
})
app.post("/detail", ensureLogin,(req, res) =>{
    var index = 0;
        for(i=0;i < mealPackage.fakedb.length;i++){
            if(mealPackage.fakedb[i].title.toLowerCase() == req.body.title.toLowerCase()){
                index = i;
            }
        }
        shoppingcart.db.push({
            title: mealPackage.fakedb[index].title,
            foodcategory: mealPackage.fakedb[index].foodcategory,
            synopsis: mealPackage.fakedb[index].synopsis,
            price: mealPackage.fakedb[index].price,
            toppackge: mealPackage.fakedb[index].toppackge,
            imagePath: mealPackage.fakedb[index].imagePath,
            num: req.body.quantity,
            total: parseFloat(req.body.quantity) * parseFloat(mealPackage.fakedb[index].price.slice(1))
            
        });
        res.render("mealPackageListing", {
            title: "Meal Listing Page",
            data: mealPackage.getAllmeals()
        })
})

app.post("/edit", ensureLogin,ensuredataClerk,upload.single("img"),(req, res) =>{
        var index = 0;
        for(i=0;i < mealPackage.fakedb.length;i++){
            if(mealPackage.fakedb[i].title.toLowerCase() == viewData.fakedb[0].title.toLowerCase()){
                index = i;
            }
        }
        if(req.body.ftitle){   
            viewData.fakedb[0].title= req.body.ftitle;
            viewData.fakedb[0].foodcategory= req.body.foodcategory;
            viewData.fakedb[0].synopsis= req.body.synopsis;
            viewData.fakedb[0].price= "$" +req.body.price;
            viewData.fakedb[0].toppackge= req.body.topMeal;
            viewData.fakedb[0].num= req.body.num;
            if(req.file){
                viewData.fakedb[0].imagePath= req.file.filename;
            }
            else{
                viewData.fakedb[0].imagePath = mealPackage.fakedb[index].imagePath;
            }

            mealPackage.fakedb[index] = viewData.fakedb[0];
            viewData = {
                fakedb: [],
                getfakedb(){
                    return this.fakedb;
                }
            };
            res.render("editdata", {
                title: "Edit Data",
                data: mealPackage.getAllmeals()
            })
        }
        else{
            res.render("edit", {
                title: "Edit Data",
                data: viewData.getfakedb(),
                message1: "You must enter the food title"
            })
        }
        
        
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
            text: 'You are successfully registered! \n It is from web assignment made by hojun!'
        };
        dataServiceAuth.registerUser(req.body).then(()=>{
            res.render("dashboard", {title: "Welcome!"});
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            
        }).catch((err)=>{
            res.render("registration", {
                title: "Registration",
                first: req.body.first,
                last: req.body.last,
                email: req.body.email,
                password: "",
                message1: error[0],
                message2: error[1],
                message3: "Your email is already Taken",
                message4: error[3]
            })
            
        });
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
    req.body.userAgent = req.get('User-Agent');
  
    dataServiceAuth.checkUser(req.body).then((user) => {
        req.session.user = {
            
            dataClerk: user.dataClerk,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }
    
        res.render('dashboard',  {message: "Welcome " + user.firstName +" "+ user.lastName});
    }).catch((err) => {
      res.render("login", {message1: err});
    });
})

app.post("/dataentry", ensureLogin,ensuredataClerk,upload.single("img") ,(req, res) =>{
    mealPackage.fakedb.push({
        title: req.body.mpName,
        foodcategory: req.body.category,
        synopsis: req.body.desc,
        price: "$" +req.body.price,
        toppackge: req.body.topMeal,
        imagePath: req.file.filename,
        num: req.body.num
    });
    if(req.body.topMeal){
        mealPackage.topdb.push({
            title: req.body.mpName,
            foodcategory: req.body.category,
            synopsis: req.body.desc,
            price: "$" +req.body.price,
            toppackge: req.body.topMeal,
            imagePath: req.file.filename,
            num: req.body.num
        });
    }
    res.redirect("/dataentry");
})

app.get("/logout", (req,res)=>{
    viewData = {
        fakedb: [],
        getfakedb(){
            return this.fakedb;
        }
    };
    detailData = {
        fakedb: [],
        getfakedb(){
            return this.fakedb;
        }
    };
    shoppingcart={
        db: [],
        getfakedb(){
            return this.db;
        }
    }
    req.session.reset();
    res.redirect('/');
  })
const PORT = process.env.PORT || 3000;
dataServiceAuth.initialize().then(()=>{app.listen(PORT, ()=>{
    console.log("Server is running " + PORT);
})}).catch((err)=>{ console.log("unable to start server: " + err);});
