const express = require('express')

const{
    register,
    login,
	logout,
	logoutAll,
	find,
	update,
	remove,
	getAllEvents,
}=require("../controllers/userController")

const protect = require("../middleware/auth");
const router = express.Router()

router.post("/",register);
router.post("/login",login);
router.post("/logout",protect,logout);
router.post("/logout/all",protect,logoutAll);
router.get("/find",protect,find);
router.get("/events",getAllEvents);
router.put("/update",protect,update);
router.delete("/:id",protect,remove);



module.exports=router;