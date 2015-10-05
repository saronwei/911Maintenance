/**
 * Created by Saron on 2015/9/30.
 */

//var express = require('express');
//var router = express.Router();
var fileManager = require('./fileController');

var authorization = function(){};

var convertToAuthModel = function(data)
{

};

var readAuthorization = function (path)
{
    //check authinfo by localfile, if check successfully return true;
    //else show message to let the user register
    var data = fileManager.readFile(path);
    var authModel = null;
    if(data!= null && data.length != 0){
        authModel = convertToAuthModel(data);
    }
    return authModel;

};

authorization.onAuth = function(res, path){
    var authModel = readAuthorization(path);
    //to-do: request to get the permission from the server,
    //and then compare with the local authorization
    if(authModel != null)
    {
        res.render('./',{ title:'Express' });
    }
    else
    {
        console.log('permission check failed, please re-check your permissions or register an account');
        res.render('./login',{ permissionCode:'quito',password:'123'});
        //res.render('./login',{ permissionCode:authModel.permissionCode,password:authModel.password});
    }
};

//router.get('/',function(req, res, next){
//   //var authSuccess = onAuth((res, exports.authorizationPath));
//   //res.send(authSuccess);
//    console.log('start to authorization');
//});

module.exports = authorization;

