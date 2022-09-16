const Event = require("../models/eventsModel");
const Registration = require("../models/registrationModel");
const User = require("../models/userModel");
//const generateToken = require("../utils/generateToken")
//const mongoose = require('mongoose')

const addRegistration = async(req,res)=> {
    try{
        const user = req.user;
        const {eventId}= req.params;
        const event = await Event.findById(eventId);

        if(!event){
            return res.status(404).send({
                success:false,
                error:"No such event found",

            });
        }
        const preRegistration = await Registration.findOne({
user:user._id,
event:eventId,
        });
        if(preRegistration) {
			return res.status(400).send({
				success: false,
				error: "Already registered for this event",
			});
		} 
        const registration = new Registration({
			user: user._id,
			event: eventId,
        }); 
        const savedRegistration = await registration.save();  
        const allRegistrations = event.registrations; 
        event.registrations = [...allRegistrations, savedRegistration._id];
		await event.save();
        const allRegisteredIn = user.registeredIn;
		user.registeredIn = [...allRegisteredIn, event._id];
		await user.save();

		res.status(200).send({
			success: true,
			data: savedRegistration,
		});
	} catch (e) {
		console.log(e);
		return res.status(500).send({
			success: false,
			error: `Server error ${e}`,
		});
	}
};

const deleteRegistration = async (req, res) => {
	try {
		const user = req.user;
		const { eventId, registrationId } = req.params;
		if (!(eventId && registrationId)) {
			return res.status(400).send({
				success: false,
				error: "Select event and registration",
			});
		}
		const event = await Event.findById(eventId);
		if (!event) {
			return res.status(404).send({
				success: false,
				error: "No such event found",
			});
		}
		
		const registration = await Registration.findOne({
			_id: registrationId,
			event: eventId,
		});
		if (!registration) {
			return res.status(404).send({
				success: false,
				error: "No such registration found",
			});
		}
		if (String(req.user._id) !== String(registration.user)) {
			return res.status(401).send({
				success: false,
				error: "Not authorized",
			});
		}

		const allRegisteredIn = user.registeredIn;
		user.registeredIn = allRegisteredIn.filter(
			(events) => String(events._id) !== String(event._id)
		);
		await user.save();

		const allRegistrations = event.registrations;
		event.registrations = allRegistrations.filter(
			(registrations) =>
				String(registrations._id) !== String(registration._id)
		);
		await event.save();

		await registration.remove();

		res.status(200).send({
			success: true,
			message: "Registration deleted",
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
	addRegistration,
	deleteRegistration
}
