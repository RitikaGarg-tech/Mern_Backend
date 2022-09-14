const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const _userSchema = new Schema({
    email: {
        type: String,
        required:true,
        unique:true
    },
    password: {
        type: String,
        required: true
    }
})

// static signup method

_userSchema.statics.signup = async function(email,password) {
    const exists = await this.findOne({ email })

    // validation
    if(!email || !password){
        throw Error('All fields must be filled')
    }
    if(!validator.isEmail(email)){
        throw Error('Email is not valid')
    }
    if(!validator.isStrongPassword(password)){
        throw Error('Password not strong enough')
    }
    if(exists) {
        throw Error('Email already in use')
    }

    const salt = await bcrypt.genSalt(10)

    const hash = await bcrypt.hash(password, salt)

    const _user = await this.create({ email, password: hash })

    return _user
}

// static login method
_userSchema.statics.login = async function(email,password){
    if(!email || !password){
        throw Error('All fields must be filled')
    }

    const _user = await this.findOne({ email })

    if(!_user) {
        throw Error('Incorrect email')
    }
    const match = await bcrypt.compare(password, _user.password)

    if(!match){
        throw Error('Incorrect password')
    }
    return _user
}

module.exports = mongoose.model('_User', _userSchema)