const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const config = require('../config/config');

const securePassword = async(password)=>{
    try {

        const passwordMatch = await bcrypt.hash(password, 10);
        return passwordMatch;
        
    } catch (error) {
        console.log(error.message);
    }
}

const loadLogin = async (req,res) =>{
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async (req,res) =>{
    try {

        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email : email});

        if (userData) {

            const passwordMatch = await bcrypt.compare(password , userData.password)

            if(passwordMatch){
                if(userData.is_admin === 0){
                    res.render('login',{message : "Email and password is incorrect, not an admin"});
                }
                else{
                    req.session.user_id = userData._id;
                    res.redirect("/admin/home");
                }
            }
            else{
                res.render('login',{message : "Email or password is incorrect"});
            }
            
        } else {
            res.render('login', {message : "Please provide your Email and password"});
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

const loadDashboard = async (req,res) =>{
    try {

        const userData = await User.findById({_id : req.session.user_id});
        res.render('home', {admin : userData});
        
    } catch (error) {
        console.log(error.message);
    }
}

const logout = async (req,res) =>{
    try {

        req.session.destroy();
        res.redirect('/admin');
        
    } catch (error) {
        console.log(error.message);
    }
}

const adminDashboard = async (req,res) => {

    try {
        const userData = await User.find({is_admin:0});
        res.render('dashboard',{users : userData});
        
    } catch (error) {

        console.log(error.message);
    }
}

// Add new user (Admin)

const newUserLoad = async (req,res) =>{
    try {

        res.render('new-user');
        
    } catch (error) {
        console.log(error.message);
    }
}

const addUser = async(req,res) =>{
    try {

        const name = req.body.name;
        const email =  req.body.email;
        const mno = req.body.mno;
        const password = randomstring.generate(8);

        const spassword = await securePassword(password);

        const user = new User({
            name : name,
            email : email,
            mobile : mno,
            password : spassword,
            is_admin : 0
        });

        const userData = await user.save();

        if (userData) {

            res.redirect('/admin/dashboard');
            
        } else {

            res.render('new-user',{message : "Something wrong"});
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    adminDashboard,
    newUserLoad,
    addUser
}