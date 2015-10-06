/**
 * Created by Saron on 2015/9/30.
 */

var fileManager = require('./fileController');

function convertToAuthModel(data) {
    var temp = data.toString();
};

function readAuthorization(path) {
    //check authinfo by localfile, if check successfully return true;
    //else show message to let the user register
    var data = fileManager.readFile(path);
    var authModel = null;
    if (data != null && data.length != 0) {
        authModel = convertToAuthModel(data);
    }
    return authModel;

};

var authorization = {

    onAuth: function (res, path) {
        var authModel = readAuthorization(path);
        //to-do: request to get the permission from the server,
        //and then compare with the local authorization
        if (authModel != null) {
            res.render('./', {title: '911 Maintenance Home'});
        }
        else {
            console.log('permission check failed, please re-check your permissions or register an account');
            res.render('./login');
        }
    },
}

module.exports = authorization;

