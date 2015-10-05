var express = require('express');
var router = express.Router();
var authorization = require('../controllers/authController');
var controllerEngine = require('../cruiser_lib/engines/controllerEngine');

/* GET home page. */
router.get('/', function(req, res, next) {
    var path = __dirname + '/authorization.io';
    controllerEngine.execute('/','auth','onAuth',[res,path]);

    //if(authorization.onAuth(res,exports.authorizationPath)) {
    //    res.render('index', {title: 'Express'});
    //}
});

module.exports = router;
