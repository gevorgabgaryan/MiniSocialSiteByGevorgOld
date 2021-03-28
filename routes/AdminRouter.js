var express = require('express');
const { admin } = require('../controllers/AdminController');

var router = express.Router();

/* GET home page. */
router.get('/',admin );

module.exports = router;

