const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const md5 = require('md5');
// models
const UserModel = require('../model/user');

function validEmail(e) {
    var filter = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
    return String(e).search (filter) != -1;
}



router.post('/signup', async (req, res) => {
    try {
        let name = req.body.name;
        let email = req.body.email;
        let password = req.body.password;
        let proceed = true;
        // @validation part
        // => validation 1 : required are not empty
        if(name.length === 0 || email.length === 0 || password.length === 0){
            proceed = false;
            res.send({
                type: 'error',
                msg:  'Required Fields Should Not Be Empty'
            })
        }
        // => validation 2 : name has no numeric and special chars
        if(/^[A-Za-z\s]*$/.test(name) === false) {
            proceed = false;
            res.send({
                type: 'error',
                msg: 'Name Should Have Characters From English Alphabet'
            })
        }
        // => validation 3 : email should be validated
        if(!validEmail(email)){
            proceed = false;
            res.send({
                type: 'error',
                msg: 'Email Address Is Not Valid'
            })
        }
        // => validation 4 : password length should be more than 8 and less than 16
        if(password.length < 8 || password.length > 16){
            proceed = false;
            res.send({
                type: 'error',
                msg: 'Password Should Have 8 to 16 Characters'
            })
        }
        
        // => validation - check email exists or not
        let users = await UserModel.find({
            email : email
        });

        if(users.length !== 0){
            proceed = false;
            res.send({
                type: 'error',
                msg: 'User Already Exists'
            })
        }


        // @business logic
        if(proceed === true){
            let newUser = new UserModel({
                name : name,
                email : email,
                password : md5(password)
            })
            await newUser.save();

            res.send({
                type: 'success',
                msg: 'A New User Has Been Registered'
            })
        }
    }
    catch(error) {
        console.log(error);
    }
})

router.post('/login', async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;
        let proceed = true;
        // @validation part
        // => validation - check email exists or not
        let users = await UserModel.find({
            email : email
        });

        if(users.length !== 1){
            proceed = false;
            res.send({
                type: 'error',
                msg: 'This Email Does Not Exist'
            })
        }


        // @business logic
        if(proceed === true){
            if(users[0].password === md5(password)){
                res.send({
                    type: 'success',
                    msg: 'Your Login Information Is Validated'
                })
                // @todo - session assignment
            }
            else {
                res.send({
                    type: 'error',
                    msg: 'Email Matched but Password Did Not Match'
                })
            }

            
        }
    }
    catch(error) {
        console.log(error);
    }
})




module.exports = router;