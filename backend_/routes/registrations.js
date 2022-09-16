const Express = require('express');
const {
    addRegistration,
    deleteRegistration,
} = require("../controllers/registrationController");
const protect = require("../middleware/auth")
const router = Express.Router();

router.post('/:eventId',protect,addRegistration);
router.delete('/:eventId/:registrationId',protect,deleteRegistration);

module.exports = router;