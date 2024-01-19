const express = require('express');
const ratingController = require("../controller/ratingController")

const router = express.Router();

router.post("/",ratingController.rate);

router.post('/check',ratingController.check);

module.exports = router;

