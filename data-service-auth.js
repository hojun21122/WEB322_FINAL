const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


let Schema = mongoose.Schema;

let userSchema = new Schema({
  email:  {
    type: String,
    unique: true
  },
  password: String,
  firstName: String,
  lastName: String,
  dataClerk: Boolean,
});

let User;

module.exports.initialize = function () {

    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb+srv://dbuser:ghwns211@assignment3.q4oyr.mongodb.net/web?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});
        db.on('error', (err)=>{
            reject(err);
        });
        db.once('open', ()=>{
           User = db.model("users", userSchema);
           resolve();
        });
    });
};

module.exports.registerUser = function (userData) {
    return new Promise(function (resolve, reject) {
            bcrypt.genSalt(10, function (err, salt) {
                if (err) {
                        reject("There was an error encrypting the password");
                }else{
                    bcrypt.hash(userData.password, salt, function (err, hash) { 
                        if (err) {
                            reject("There was an error encrypting the password");
                        } else {
                            User.find({email: userData.email}).exec()
                            .then((users) =>{
                                if(users.length == 0){
                                    userData.password = hash;
                                    let newUser = new User(userData);
                                    newUser.firstName = userData.first;
                                    newUser.lastName = userData.last;
                                    newUser.dataClerk = false;
                                    newUser.save((err) => {
                                        if (err) {
                                                reject("There was an error creating the user: " + err);
                                        } else {
                                            resolve();
                                        }
                                    });
                                }
                                else{
                                    reject("There was an error creating the user: " + err);
                                }
                            })
                            .catch((err)=>{
                                reject("Unable to find user: " + userData.userName);
                            });
                            
                        }
                    });
                }
            });
        }
    );
};

module.exports.checkUser = function(userData){
    return new Promise(function (resolve, reject) {

        User.find({ email: userData.email})
            .exec()
            .then((users) => {
                if(users.length == 0){
                    reject("Unable to find user with given email ");
                }else{
                    bcrypt.compare(userData.password, users[0].password).then((res) => {
                        if(res === true){
                            User.update({ userName: users[0].userName })
                            .exec()
                            .then(() => { 
                                resolve(users[0]);
                            })
                            .catch((err) => { 
                                reject("There was an error verifying the user: " + err);
                            });
                        }else{
                            reject("Incorrect Password for user");
                        }
                    });
                }
            }).catch((err) => {
                reject("Unable to find user with given email" );
            });

     });
};