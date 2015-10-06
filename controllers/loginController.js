/**
 * Created by Saron on 2015/10/1.
 * Handle the necessary logic after the user has login success,
 */

var file = require('./fileController');
var config = require('../config');

function load() {

}

function save() {

}

// when program startup.load the necessary information for user
loadAndSaveNecessary = function () {
    load();
    save();
};


var loginController = {

    onLogin: function (username, pwd) {
        var date = new Date();
        file.updateFile(config.authorizationPath, [username, pwd, date.toString()], config.authorizationTemplate);
    }
};

module.exports = loginController;