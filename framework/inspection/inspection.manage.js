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
        organizeInspections();

        configPath = null;
    }

    function readCenterInspections(path) {

        var configs = fs.readdirSync(path);
        if (!utils.isNullOrUndefined(configs) && configs.length > 0) {
            for (var i in configs) {
                var config = configs[i];
                if (fs.statSync(path + config).isDirectory()) {
                    readCenterInspections(path + config);
                }
                else {
                    var arr = config.split('.');
                    if (arr[0] == center) {
                        groups = require(path + config);
                        break;
                    }
                }
            }
        }
    }

    function organizeInspections() {

        var inspectionCollection = require('../../server/storage/inspection.collection');
        var inspectionPath = path.join(process.cwd(), 'server/inspection_collection/');
        var collection = fs.readdirSync(inspectionPath);

        if (!utils.isNullOrUndefined(groups) && !utils.isNullOrUndefined(collection) && collection.length > 0) {
            var groupName = null;
            for (var i in collection) {
                var inspection = require(inspectionPath + collection[i])();
                inspection.prototype.Configure();
                var result = linq.from(groups).where(function (item) {
                    for (var i in item['inspection_collection']) {
                        var outConfig = item['inspection_collection'][i];
                        if (inspection.aliasname == outConfig.aliasname) {
                            groupName = item.group_name;
                            inspection.prototype.Configure(outConfig);
                            outConfig = null;
                            break;
                        }
                        outConfig = null;
                    }
                    return !utils.isNullOrUndefined(groupName);
                }).toArray();
                if (result.length > 0) {
                    var inspectionGroup = {
                        "groupName": groupName,
                        "inspection": inspection
                    };
                    inspectionCollection.PushToInspections(inspectionGroup);
                    inspectionGroup = null;
                }
                inspection = null;
            }
        }

        groups = null;
        collection = null;
        inspectionCollection = null;
    }

    return {
        RunGroup: runGroup
    };

    function runGroup(groupName) {

        var current, next = null;
        var inspectionCollection = require('../../server/storage/inspection.collection');

        var inspections = linq.from(inspectionCollection.GetInspections()).where(function (item) {
            return item.groupName == groupName;
        }).toArray();

        if (inspections.length > 0) {
            for (var i in inspections) {
                //noinspection JSUnusedAssignment
                if (utils.isNullOrUndefined(current)) {
                    current = inspections[i].inspection;
                }
                if (i < inspections.length - 1) {
                    next = inspections[i + 1].inspection;
                    current = next(current);
                }
            }
        }

        if (!utils.isNullOrUndefined(current)
            && current.prototype
            && current.prototype.hasOwnProperty('Run')) {
            current.prototype.Run();
        }
        else {
            var error = new Error("Cannot run the inspection by group: [" + groupName + "] because there has no inspection item yet");
            error.status = 412;
            throw error;
        }
    }
}

module.exports = InspectionManager;