var express = require('express');
var router = express.Router();
var config = require('../config');
var controllerEngine = require('../cruiser_lib/engines/controllerEngine');

/* GET home page. */
router.get('/', function (req, res, next) {
    controllerEngine.execute('/$authController$onAuth', [res, config.authorizationPath]);
    //controllerEngine.execute('/login$loginController$onLogin', ['quito', 'password']);

    /*    if(authorization.onAuth(res,exports.authorizationPath)) {
     res.render('index', {title: 'Express'});
     }*/
});

module.exports = router;
