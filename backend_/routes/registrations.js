const {
    addRegistration
    //deleteRegistration,
} = require("../controllers/registrationController");

const router = require("express").Router();

router.post("/:eventId",addRegistration);
//router.delete("/:eventId/:registerationId",deleteRegistration);

module.exports = router;