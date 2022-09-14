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



//GET all events
//router.get('/', getEvents)

//GET a single event
//router.get('/:id',getEvent)

//POST a new workout
//router.post('/',createEvent)

//router.delete('/:id', deleteEvent)

//router.patch('/:id', updateEvent)

router.post("/", addEvents)

module.exports=router

