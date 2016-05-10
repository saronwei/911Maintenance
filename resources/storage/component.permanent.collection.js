/**
 * Created by Saron on 2016/5/3.
 */

function PermanentComponentCollection() {
    "use strict";

    var utils = require('util');
    var linq = require('linq');
    var collection = [];

    return {
        PushToCollection: pushToCollection,
        GetComponent: getComponent,
        ReleaseComponent: releaseComponent,
        ReleaseAll: releaseAll
    };

    function pushToCollection(componentName, provider) {

        if (utils.isNullOrUndefined(collection)) {
            collection = [];
        }

        var result = linq.from(collection).where(function (item) {
            return item.component == componentName;
        }).toArray();
        if (result.length === 0) {
            var cache = {
                "component": componentName,
                "provider": provider
            };
            collection.push(cache);
            cache = null;
        }
        result = null;
    }

    function getComponent(componentName) {
        var result = linq.from(collection).where(function (item) {
            return item.component == componentName;
        }).toArray();
        return result.length > 0 ? result[0] : null;
    }

    function releaseComponent(component) {
        for (var i = 0, j = collection.length; i < j; i++) {
            var current = collection[i];
            if (current.component === component) {
                current.prototype.Release();
                current = null;
                collection.splice(i, 1);
                break;
            }
            current = null;
        }
    }

    function releaseAll() {
        for (var i = 0, j = collection.length; i < j; i++) {
            var current = collection[i];
            current.prototype.Release();
            current = null;
        }
        collection = null;
    }
}

module.exports = new PermanentComponentCollection();