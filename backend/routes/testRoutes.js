const express = require('express');
const router = express.Router();
const { testHandler } = require('../controllers/testController');

router.get('/', testHandler);

module.exports = router;
