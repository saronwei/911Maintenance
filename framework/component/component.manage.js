/**
 * Created by Saron on 2016/5/3.
 */

function ComponentManager() {
    "use strict";

    var path = require('path');
    var utils = require('util');

    return {
        InitializeComponent: initializeComponent
    };

    /*
     * @packageName: the name of the component, but first it's a folder name
     * @option: the custom param to initialize the component, can be [ null ]
     * @callback: upstream function to receive the result of the execution
     */
    function initializeComponent(packageName, option, callback) {

        if (!utils.isFunction(callback)) {

        }
        if (utils.isNullOrUndefined(packageName) || packageName === "") {
            callback(null);
            return;
        }
        var storage = require('../../resources/storage/component.permanent.collection');
        var provider = storage['GetComponent'](packageName);
        if (!utils.isNullOrUndefined(provider) && provider != "") {
            callback(provider);
            return;
        }

        var fileDetector = require('../file/file.detector')();
        fileDetector.Probe(path.join('../../resources/component_collection/', packageName),
            "component.conf", null,
            function initializeCore(config) {

                if (!utils.isNullOrUndefined(config)) {
                    var name = config['component'];
                    if (utils.isNullOrUndefined(name) || name === "") {
                        callback(null);
                        return;
                    }
                    var component = require(path.join('../../resources/component_collection/', packageName, name))();
                    if (component.prototype && component.prototype.hasOwnProperty('Initialize')) {
                        component.prototype.Initialize(option, function (err, providerInstance) {
                            if (err) {
                                callback(null);
                                return;
                            }
                            if (!utils.isNullOrUndefined(providerInstance)) {
                                storage['PushToCollection'](name, providerInstance);
                                storage = null;
                            }
                            callback(!utils.isNullOrUndefined(providerInstance) ? providerInstance : null);
                        });
                    }
                    else {
                        callback(null);
                    }
                }
            });

        fileDetector = null;
    }
}

module.exports = ComponentManager;