/**
 * Created by Saron on 2016/5/18.
 */

function ArcgisComponent() {
    "use strict";

    if (!(this instanceof ArcgisComponent)) {
        component = new ArcgisComponent();
    }
    else {
        component = this;
    }

    var component;
    var linq = require('linq');
    var utils = require('util');
    var BaseComponent = require('../../../framework/component/base.component');
    component.prototype = new BaseComponent();

    component.prototype.Initialize = function initialize(conf, option, callback) {

        if (!utils.isObject(conf)) {
            callback(new Error("Cannot initialize the arcgis component by passing the incorrect conf"));
            return;
        }
        if (!utils.isObject(option)) {
            callback(new Error("Cannot initialize the arcgis component by passing the incorrect option"));
            return;
        }
        var result = linq.from(conf['servers']).where(function (server) {
            return server['hostname'] === option['hostname'];
        }).toArray();
        if (result.length > 0) {
            var provider = require('./arcgis.provider')();
            provider.prototype.Initialize(result[0], {},
                function (err, providerInstance) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    callback(null, providerInstance);
                });
            provider = null;
        }
        else {
            callback(new Error('Cannot initial the arcgis component because there are not exactly server config'));
        }
        result = null;
    };

    return component;
}

module.exports = ArcgisComponent;