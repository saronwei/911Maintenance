/**
 * Created by Saron on 2016/4/16.
 */

function AuthenticationParameters() {

    var linq = require('linq');
    var collection = [];

    return {
        PassParameters: passParameters,
        GetParameter: getParameter,
        ReleaseAll: releaseAll
    };

    function passParameters(param) {

        for (var i in collection) {
            var old = collection[i];
            if (old.name == param.name) {
                collection.splice(i, 1, param);
                return;
            }
        }
        collection.push(param);
    }

    function getParameter(name) {

        var result = linq.from(collection).where(function (item) {
            return item ? item.name == name : false;
        }).toArray();
        return result && result.length > 0 ? result[0].content : null;
    }

    function releaseAll() {
        collection = null;
        collection = [];
    }
}

module.exports = new AuthenticationParameters();