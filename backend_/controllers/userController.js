const User = require("../models/userModel");
const mongoose = require('mongoose');
const Event =require("../models/eventsModel")
const router = require("../routes/user");
const generateToken = require("../utils/generateToken");


const register = async(req,res) => {

    
    try{
       
        

         const{
            name,
            collegeId,
            password,
            year,
            email,
            phone,
            image,
            gender,
            section,
            branch,
         } = req.body;
         if(!name) {
           return res.status(400).send({
               success: false,
               error: "Please enter your name",
           });
         }
         if(!collegeId) {
            return res.status(400).send({
                success: false,
                error: "Please enter your college Id",
            });
         }
        if(!password){
            return res.status(400).send({
                success: false,
                error: "Please enter your email",
            });
        }
        if(!email) {
            return res.status(400).send({
                success: false,
                error: "Please enter your phone number",
            });
        }
        const preUser = await User.findOne({ collegeId: collegeId});
        if(preUser){
            return res.status(400).send({
                success: false,
                error: "User with same college id already exist",
            });
        }
        const user = new User({
            name,
            collegeId,
            password,
            year,
            image,
            gender,
            section,
            email,
            phone,
            branch,
        });
      
      
    const savedUser = await user.save();
    res.status(200).send({
        success: true,
        data: {
            _id :savedUser._id,
            name:savedUser.name,
            collegeId: savedUser.collegeId,
            year:savedUser.year,
            image:savedUser.image,
            gender:savedUser.gender,
            section: savedUser.section,
            branch: savedUser.branch,
            email: savedUser.email,
            phone: savedUser.phone,
        },
    }); 
}  catch (e) {
     console.log(e);
     return res.status(500).send({
        success: false,
        error:'Server error ${e}',
     });
}

};

const login = async (req,res)=>{
    try{
        const { collegeId, password} = req.body;
        if(!collegeId){
            return res.status(400).send({
                success: false,
                error:"Please enter your college Id",
            });
        }
        if(!password){
            return res.status(400).send({
                success: false,
                error: "Please enter your password",
            });
        }
        const user = await User.findOne({ collegeId: collegeId});
        if(user && (await user.matchPassword(password))) {
            const currentToken =generateToken(user._id);
            const updatedTokens = [...user.tokens, currentToken];
            user.tokens = updatedTokens;
             await user.save();
             res.status(200).json({
                 success: true,
                 data: {
                       _id: user._id,
                       name: user.name,
                       collegeId: user.collegeId,
                       year: user.year,
                       image: user.image,
                       gender: user.gender,
                       phone: user.phone,
                       email: user.email,
                       registeredIn: user.registeredIn,
                       token: currentToken,
                       section: user.section,
                       branch: user.branch,
                       
                 },
             });
        } else {
            return res.status(401).json({
                success: false,
                error: "Wrong email or password",
            });
        }
    
} catch(e){
    console.log(e);
    return res.status(500).send({
        success: false,
        error: 'Server error ${e}',
    });
}

};

const logout = async (req, res) => {
	try {
		const user = req.user;
		if (!user) {
			return res.status(401).send({
				success: false,
				error: "Not Authenticated",
			});
		}
		const currentToken = req.token;
		const tokens = user.tokens;
		const newTokens = tokens.filter((token) => {
			return token !== currentToken;
		});
		user.tokens = newTokens;
		await user.save();
		return res.status(200).send({
			success: true,
			message: "Successfully logged out",
		});
	} catch (e) {
		console.log(e);
		return res.status(500).send({
			success: false,
			error: `Server error${e}`,
		});
	}
};

   const logoutAll = async (req, res) => {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).send({
                    success: false,
                    error: "Not Authenticated",
                });
            }
            user.tokens=[];
            await user.save();
            return res.status(200).send({
                success: true,
                message: "Successfully logged out from all devices",
            });
        } catch (e) {
            console.log(e);
            return res.status(500).send({
                success: false,
                error: `Server error${e}`,
            });
        }
    };

    const find = async (req, res) => {
        try {
            const user = req.user;
            return res.status(200).send({
                success: true,
                data: user,
            });
        } catch (e) {
            console.log(e);
            return res.status(500).send({
                success: false,
                error: `Server error${e}`,
            });
        }
    };

    const update = async (req, res) => {
        try {
            const {
                name,
                collegeId,
                password,
                year,
                image,
                email,
                phone,
                gender,
                section,
                branch,
            } = req.body;
    
            const preUser = await User.findOne({ collegeId: collegeId });
            if (preUser && String(preUser._id) !== String(req.user._id)) {
                return res.status(400).send({
                    success: false,
                    error: "User with same college id already exist",
                });
            }
    
            const user = req.user;
            user.name = name || user.name;
            user.collegeId = collegeId || user.collegeId;
            user.year = year || user.year;
            user.image = image || user.image;
            user.gender = gender || user.gender;
            user.branch = branch || user.branch;
            user.section = section || user.section;
            user.phone = phone || user.phone;
            user.email = email || user.email;
    
            if (password) {
                user.password = password;
            }
            const savedUser = await user.save();
            res.status(200).send({
                success: true,
                data: {
                    _id: savedUser._id,
                    name: savedUser.name,
                    collegeId: savedUser.collegeId,
                    year: savedUser.year,
                    image: savedUser.image,
                    gender: savedUser.gender,
                    section: savedUser.section,
                    branch: savedUser.branch,
                    email: savedUser.email,
                    phone: savedUser.phone,
                },
            });
        } catch (e) {
            console.log(e);
            return res.status(500).send({
                success: false,
                error: `Server error ${e}`,
            });
        }
    };
    
    const remove = async (req, res) => {
        try {
            const user = req.user;
            const savedUser = user;
            await user.remove();
            res.status(200).send({
                success: true,
                data: {
                    _id: savedUser._id,
                    name: savedUser.name,
                    collegeId: savedUser.collegeId,
                    year: savedUser.year,
                    image: savedUser.image,
                    gender: savedUser.gender,
                    section: savedUser.section,
                    branch: savedUser.branch,
                },
            });
        } catch (e) {
            console.log(e);
            return res.status(500).send({
                success: false,
                error: `Server error ${e}`,
            });
        }
    };
    /*const remove = async(req,res)=>{
        const {id} =req.params
    
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({error: 'No such user'})
        }
    
        const user = await User.findOneAndDelete({_id: id})
    
        if(!user) {
            return res.status(400).json({error:'No such user'})
        }
    
        res.status(200).json(user)
    }*/

    const getAllEvents = async (req, res) => {
        try {
            const QRY = req.query;
            const data = await Event.find(QRY)
                .select(["-__v", "-registrations"])
            if (!data) {
                return res.status(400).send({
                    success: false,
                    error: `Unable to fetch events`,
                });
            }
            return res.status(200).send({
                success: true,
                data: data,
            });
        } catch (e) {
            console.log(e);
            return res.status(500).send({
                success: false,
                error: `Server error ${e}`,
            });
        }
    };
    


module.exports={
    register,
    login,
    logout,
	logoutAll,
	find,
	update,
	remove,
	getAllEvents,
}
