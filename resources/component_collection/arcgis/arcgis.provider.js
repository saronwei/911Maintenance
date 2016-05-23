/**
 * Created by Saron on 2016/5/18.
 */

function ArcgisProvider() {
    "use strict";

    if (!(this instanceof ArcgisProvider)) {
        provider = new ArcgisProvider();
    }
    else {
        provider = this;
    }

    var provider, options, token, parentCallback;
    provider.prototype = {};
    var http = require('http');
    var utils = require('util');

    provider.prototype.Initialize = function initialize(conf, option, callback) {

        if (utils.isNullOrUndefined(conf)
            || !conf.hasOwnProperty('authorization')
            || !utils.isObject(conf['authorization'])) {

            callback(new Error('Cannot initialize the arcgis provider by passing the incorrect param conf'));
            return;
        }
        if (!utils.isFunction(callback)) {
            callback(new Error('Cannot initialize the arcgis provider by passing the incorrect param callback'));
            return;
        }

        parentCallback = callback;

        options = {
            hostname: conf.hostname,
            port: conf.port,
            path: '/arcgis/admin/generateToken?',
            method: 'POST',
            headers: conf.headers
        };

        for (var prop in conf['authorization']) {
            var value = conf['authorization'][prop];
            options.path += prop + "=" + value + "&";
            value = null;
        }

        var request = http.request(options, onInitialFinished);
        request.on('error', onError);
        request.end();

        request = null;
    }
    ;

    provider.prototype.Access = function access(option, callback) {

        if (!utils.isObject(option) || option === {}) {
            callback(new Error('Cannot access the arcgis server api by passing the incorrect option'));
            return;
        }

        for (var prop in option) {
            if (!utils.isNullOrUndefined(options[prop])) {
                options[prop] = option[prop];
            }
        }
        if (option.hasOwnProperty('params')) {
            for (var p in option['params']) {
                var value = option['params'][p];
                options.path += p + "=" + value + "&";
                value = null;
            }
        }

        options.path += "token=" + token;
        parentCallback = callback;

        var request = http.request(options, onRequestBack);
        request.on('error', onError);
        request.end();

        request = null;
    };

    /* Private method defines */

    function onInitialFinished(res) {
        res.on('data', onReceiveToken);
    }

    function onRequestBack(res) {
        res.on('data', onReceiveResult);
    }

    function onReceiveToken(result) {

        if (!utils.isNullOrUndefined(result)) {
            token = result.toString();
            parentCallback(null, provider);
        }
        else {
            parentCallback(new Error('Cannot get the permission to visit the arcgis server'));
        }
    }

    function onReceiveResult(result) {
        if (!utils.isNullOrUndefined(result)) {
            parentCallback(null, JSON.parse(result.toString()));
        }
        else {
            parentCallback(new Error('Cannot get any result by visiting arcgis'));
        }
    }


    function onError(err) {
    }

    return provider;
}

module.exports = ArcgisProvider;