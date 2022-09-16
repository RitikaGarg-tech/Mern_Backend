const express = require('express')

const{
    addEvents,
	updateEvents,
	deleteEvents,
	getEvents,
	getEvent,
	createExelOfRegistrations,
    
}=require("../controllers/eventsController")

const router =express.Router()
const adminprotect=require('../middleware/adminauth.js');



//GET all events
router.get('/', adminprotect,getEvents)

router.get('/:id',adminprotect,getEvent)

router.post('/', adminprotect,addEvents)

module.exports=router

