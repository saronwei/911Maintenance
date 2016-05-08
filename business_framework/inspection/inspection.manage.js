/**
 * Created by Saron on 2016/4/5.
 */

function InspectionManager(center) {

    var groups = [];
    var fs = require('fs');
    var path = require('path');
    var linq = require('linq');
    var utils = require('util');

    init();

    function init() {
        var configPath = path.join(process.cwd(), "/server/configs/center_inspections/");
        readCenterInspections(configPath);
        configPath = null;
    }

    function readCenterInspections(place) {

        var configs = fs.readdirSync(place);
        if (!utils.isNullOrUndefined(configs) && configs.length > 0) {
            for (var i in configs) {
                var config = configs[i];
                var readPath = path.join(place, config);
                if (fs.statSync(readPath).isDirectory()) {
                    readCenterInspections(readPath);
                }
                else {
                    var arr = config.split('.');
                    if (arr[0] == center) {
                        groups = require(readPath);
                        readPath = null;
                        break;
                    }
                }
                readPath = null;
            }
        }
        configs = null;
    }

    function organizeInspections(groupName) {

        if (!utils.isNullOrUndefined(groups) && !utils.isNullOrUndefined(groupName) && groupName != "") {

            var inspectionCollection = require('../../resources/storage/inspection.collection');
            var inspectionPath = path.join(process.cwd(), 'server', 'inspection_collection');
            var collection = fs.readdirSync(inspectionPath);

            var result = linq.from(groups).where(function (group) {
                return group.group_name === groupName;
            }).toArray();
            var currentGroup = !utils.isNullOrUndefined(result) && result.length > 0 ? result[0] : null;
            if (!utils.isNullOrUndefined(currentGroup)) {
                var inspection = null;
                for (var i in currentGroup.inspection_collection) {
                    var outConfig = currentGroup.inspection_collection[i];
                    if (outConfig.hasOwnProperty('filename') && outConfig.filename != "") {
                        inspection = require(path.join(inspectionPath, outConfig.filename));
                    }
                    else {
                        var r = linq.from(collection).where(function (item) {
                            var source = require(path.join(inspectionPath, item))();
                            //noinspection JSReferencingMutableVariableFromClosure
                            return source.aliasname != "" && source.aliasname == outConfig.aliasname;
                        }).toArray();
                        if (r.length > 0) {
                            inspection = require(path.join(inspectionPath, r[0]));
                        }
                    }
                    if (!utils.isNullOrUndefined(inspection)) {
                        var inspectionGroup = {
                            "groupName": groupName,
                            "inspection": inspection,
                            "configuration": outConfig
                        };
                        inspectionCollection.PushToInspections(inspectionGroup);
                        inspectionGroup = null;
                    }
                    inspection = null;
                    outConfig = null;
                }
            }

            result = null;
            groups = null;
            currentGroup = null;
            collection = null;
            inspectionPath = null;
            inspectionCollection = null;
        }
    }

    return {
        RunGroup: runGroup
    };

    function runGroup(groupName) {

        var current, next = null;
        var inspectionCollection = require('../../resources/storage/inspection.collection');
        organizeInspections(groupName);

        var inspections = linq.from(inspectionCollection.GetInspections()).where(function (item) {
            return item.groupName == groupName;
        }).toArray();

        if (utils.isArray(inspections) && inspections.length > 0) {
            for (var i = 0, j = inspections.length; i < j; i++) {

                if (utils.isNullOrUndefined(current)) {
                    current = inspections[i].inspection();
                    current.prototype.Configure(inspections[i].configuration);
                }
                if (i < inspections.length - 1) {
                    next = inspections[i + 1].inspection;
                    current = next(current);
                    current.prototype.Configure(inspections[i + 1].configuration);
                }
            }
        }
        next = null;
        inspections = null;
        inspectionCollection = null;

        if (!utils.isNullOrUndefined(current)
            && current.prototype
            && current.prototype.hasOwnProperty('Run')) {
            current.prototype.Run();
            current = null;
        }
        else {
            var error = new Error("Cannot run the inspection by group: [" + groupName
                + "] because there has no inspection item yet");
            error.status = 412;
            throw error;
        }
    }
}

module.exports = InspectionManager;