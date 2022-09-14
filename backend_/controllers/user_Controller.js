const _User = require('../models/user_Model')
const jwt = require('jsonwebtoken')
 const generateToken = require('../utils/generateToken');

// login user
const loginUser = async (req,res) => {
    const {email, password} = req.body

    try{
        const user = await _User.login(email, password) 

        // create a token
        const token = generateToken(user._id)
        
        res.status(200).json({email, token})
   
   
       }catch(error) {
           res.status(400).json({error: error.message})
   
       }

    res.json({mssg: 'login user'})
}




//signup user
const signupUser = async (req,res)=>{

    const {email,password}=req.body

    try{
     const _user = await _User.signup(email, password) 

     // create a token
     const token = generateToken(_user._id)
     
     res.status(200).json({email, token})


    }catch(error) {
        res.status(400).json({error: error.message})

    }

    res.json({mssg: 'login user'})
}

module.exports = {
    signupUser, loginUser
}