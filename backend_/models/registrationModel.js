const mongoose = require("mongoose");

const RegistrationSchema = mongoose.Schema(
    {
        user: {
            type:mongoose.Schema.Types.ObjectId,
            required: true,
            ref:"User",
        },
        event: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Event",
        },
        
    },
    {
        timestamps: true,
    }
);
const Registration = mongoose.model("Registeration", RegistrationSchema);

module.exports = Registration;