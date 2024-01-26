const express = require('express');

const bookingController = require('../controller/bookingController')

const router = express.Router();

router.post('/get-book',bookingController.getBookedTicket)



router.post('/webservices',bookingController.getWebServices);
router.post('/days',bookingController.getDays)
router.post('/time',bookingController.getTime)
router.post('/reserve',bookingController.reserveTicket)

module.exports = router;