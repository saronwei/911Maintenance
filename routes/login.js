/**
 * Created by Saron on 2015/9/29.
 */

var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    console.log('this is login page');
});

module.exports = router;