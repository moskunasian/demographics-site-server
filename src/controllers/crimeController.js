/**
    @module Crime
    @exports Crime
    @file Crime controller code
        Uses CrimeModel
*/
const express = require('express');

const router = express.Router();
const crimeModel = require('../models/crimeModel');


/**
    Get crime data for given area
    @returns {object} @see {@link CrimeModel}
*/
router.get('/', async (req, res) => {
    try {
        res.json({ response: await crimeModel.get(req.query.startDate, req.query.endDate, req.query.border) });
    } catch (err) {
        console.log(`Oops! ${err.message}`);
        res.json({ error: err.message });
    }
});


module.exports = router;
