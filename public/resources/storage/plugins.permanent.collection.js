/**
 * Created by Saron on 2016/4/15.
 */

function PermanentPluginsCollection() {

    var linq = require('linq');
    var collection = [];

    return {
        GetPlugins: getPlugins,
        PushToCollection: pushToCollection,
        ReleasePlugins: releasePlugins,
        ReleaseAll: releaseAll
    };

    function getPlugins(name) {
        var result = linq.from(collection).where(function (item) {
            return item.name == name;
        }).toArray();
        return result && result.length > 0 ? result[0] : null;
    }

    function pushToCollection(plugins) {
        var result = linq.from(collection).where(function (item) {
            return item ? item.name == plugins.name : false;
        }).toArray();
        if (result.length == 0) {
            collection.push(plugins);
        }
    }

    function releasePlugins(name) {
        for (var i in collection) {
            var current = collection[i];
            if (current.name == name) {
                current.prototype.Release();
                current = null;
                collection.splice(i, 1);
                break;
            }
        }
    }

    function releaseAll() {
        collection = null;
        collection = [];
    }
}

module.exports = new PermanentPluginsCollection();