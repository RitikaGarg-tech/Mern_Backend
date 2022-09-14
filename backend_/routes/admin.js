const express = require('express')
const router = express.Router();
const adminprotect = require('../middleware/adminauth')

const {
    register,
    login,
    logout
} = require("../controllers/adminController")

router.post('/',register);
router.post('/login',login);
router.post('/logout',adminprotect,logout);

module.exports = router