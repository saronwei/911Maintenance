/**
 * Created by Saron on 2016/6/19.
 */

function InspectionEnvironmentService() {

    "use strict";

    var path = require('path');
    var utils = require('util');
    var linq = require('linq');

    return {
        GetInspectionItems: getInspectionItems
    };

    function getInspectionItems(center, callback) {

        var fileDetector = require('../../../framework/file/file.detector')();
        fileDetector.Probe(path.join(process.cwd(), 'server', 'configs', 'center_inspections'),
            center + ".json", null,
            function (config) {
                if (utils.isObject(config) && utils.isArray(config)) {
                    if (utils.isFunction(callback)) {
                        var items = linq.from(config).select("v=>v.group_name").toArray();
                        callback(items);
                        items = null;
                    }
                }
            })
    }
}

module.exports = InspectionEnvironmentService;