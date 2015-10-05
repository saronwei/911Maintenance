/**
 * Created by Saron on 2015/10/1.
 */

var fs = require('fs');
var fileManager = {};

fileManager.createFile = function(path)
{
    var exist = fs.existsSync(path);
    if(!exist){
        fs.open(path,'w'
            ,function(err,fd){
                if(err){
                    return console.error(err);
                }
                console.log('file has created');
            });
    }
}

fileManager.updateFile = function (path,data,template) {

}

fileManager.readFile = function(path)
{
    var exist = fs.existsSync(path);
    if(!exist) return null;

    return fs.readFileSync(path);
    console.log('operation read complete');
}

module.exports = fileManager;