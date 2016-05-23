/**
 * Created by Saron on 2016/5/11.
 */

function OracleComponent() {
    "use strict";

    if (!(this instanceof OracleComponent)) {
        component = new OracleComponent();
    }
    else {
        component = this;
    }

    var component;
    var fs = require('fs');
    var linq = require('linq');
    var path = require('path');
    var utils = require('util');
    var BaseComponent = require('../../../framework/component/base.component.js');
    component.prototype = new BaseComponent();

    component.prototype.Initialize = function initialize(conf, option, callback) {

        var dbConn = null;
        if (utils.isObject(option) && option.hasOwnProperty('instanceName') && utils.isArray(conf['dbConnections'])) {
            var result = linq.from(conf['dbConnections']).where(function (conn) {
                return conn.instance === option['instanceName']
            }).toArray();
            if (result.length > 0) {
                dbConn = result[0];
            }
            else {
                callback(new Error('Cannot find the exactly database connection configuration, so the component initialization is failed'));
                return;
            }
        }
        else {
            callback(new Error('Cannot initialize the oracle component because pass the incorrect param'));
            return;
        }

        var provider = require('./oracle.provider')();
        provider.prototype.Initialize(dbConn, function (err, providerInstance) {
            if (err) {
                callback(err);
                return;
            }
            callback(null, providerInstance);
        });
        provider = null;
        dbConn = null;
        conf = null;
    };

    return component;
}

module.exports = OracleComponent;