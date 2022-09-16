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

//GET a single event
router.get('/:id',adminprotect,getEvent)

//POST a new workout
//router.post('/',createEvent)

//router.delete('/:id', deleteEvent)

//router.patch('/:id', updateEvent)

router.post('/', adminprotect,addEvents)

module.exports=router

