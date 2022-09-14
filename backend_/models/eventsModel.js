const mongoose = require("mongoose");

const EventSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please enter name of event"],
			trim: true,
		},
		description: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			
		},
		location: {
			type: String,
			required: true,
		},
		
		speakers: [
			{
				type: Object,
			},
		],
		contactDetails: {
			type: Object,
			required: true,
		},
		dateAndTime: {
			type: Date,
			default: Date.now(),
			required: true,
		},
		cta: {
			type: String,
		},
		registrations: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Registeration",
			},
		],
		
	},
	{
		timestamps: true,
	}
);

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;

