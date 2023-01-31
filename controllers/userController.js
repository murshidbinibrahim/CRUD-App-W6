const User = require("../models/userModel");
const bcrypt = require("bcrypt");


const securePassword = async(password) =>{
    try {

        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
        
    } catch (error) {

        console.log(error.message);

    }
}

const loadRegister = async(req, res) => {
    try {

        res.render('registration');
        
    } catch (error) {

        console.log(error.message);
        
    }
}

const insertUser = async(req , res) => {
    try {

        const spassword = await securePassword(req.body.pwd);

        const user = new User({

            name : req.body.name,
            email : req.body.email,
            mobile : req.body.mno,
            password : spassword,
            is_admin : 0

        });

        const userData = await user.save();

        if(userData){
            res.render('registration',{message : "Registation Success"})
        }
        else{
            res.render('registration',{message : "Registration Failed"})
        }
        
    } catch (error) {

        console.log(error.message);

    }
}

//login method for users

const loginLoad = async(req, res) => {
    try {

        res.render('login')
        
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async(req,res) => {

    try {
        
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email:email});

        if (userData) {

            const passwordMatch = await bcrypt.compare(password, userData.password);

            if(passwordMatch){

                req.session.user_id = userData._id;

                res.redirect('/home')

            }
            else{

                res.render('login', {message : "Email and password is incorrect"});
            }
            
        } else {

            res.render('login', {message : "Please provide your Email and password is incorrect"});

        }

    } catch (error) {
        console.log(error.message);
    }
}

const loadHome = async (req,res)=> {

        try {
            
            const userData = await User.findById({_id : req.session.user_id});
            res.render('home',{user : userData});

        } catch (error) {

            console.log(error.message);
            
        }
}

const userLogout = async(req,res) =>{
    try {

        req.session.destroy();
        res.redirect('/');
        
    } catch (error) {

        console.log(error.message);
    }
}

module.exports = {

    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout

}