const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const AdminSchema = mongoose.Schema(
    {
        username: {
             type:String,
             required: true,
             unique: true,
        },
        password: {
            type: String,
            required:true,
        },
        tokens: [{type:String}],
        events: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Event",
                required: true,
            },
        ],
    },
    {
        timestamps:true,
    }  
);

AdminSchema.methods.matchPassword = async function (enteredPassword) {
    console.log(enteredPassword);
    return await bcrypt.compare(enteredPassword, this.password);
};

AdminSchema.pre("save",async function (next){
    try{
        const user = this;
        if(user.isModified("password")){
            user.password = await bcrypt.hash(user.password, 10);
        }
        next();
    }
    catch(e){
        console.log(`Error occured while hashing password ${e}`);
    }
});

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;