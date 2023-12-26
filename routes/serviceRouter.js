const serviceController = require('../controller/serviceController');

const express = require('express');
const router = express.Router();


router.post('/', serviceController.getServices);
router.post('/event-now',serviceController.sendEventNow);
router.post('/print',serviceController.print_tick);

module.exports = router;