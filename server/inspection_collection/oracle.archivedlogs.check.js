/**
 * Created by Saron on 2016/5/21.
 */

function OracleArchivedLogsCheck(next) {
    "use strict";

    if (!(this instanceof OracleArchivedLogsCheck)) {
        inspection = new OracleArchivedLogsCheck(next);
    }
    else {
        inspection = this;
    }

    var inspection;
    inspection.aliasname = "OracleArchivedLogsCheck";
    var utils = require('util');
    var BaseInspection = require('../../business_framework/inspection/base.inspection');
    inspection.prototype = new BaseInspection();

    inspection.prototype.Configure = function configure(outConfig) {

        inspection.description = "Check the archived logs were expired";
        inspection.result = null;
        inspection.tags = ["database_resource"];

        if (!utils.isNullOrUndefined(outConfig)) {
            inspection = inspection.prototype.AttachConfig(inspection, outConfig);
        }
    };

    inspection.prototype.Run = function run() {

        console.log("start run the oracle archived logs date inspection");

        var componentMgr = require('../../framework/component/component.manage')();
        componentMgr.InitializeComponent("oracle", {"instanceName": inspection.instanceName},
            function (provider) {
                if (utils.isObject(provider)) {
                    provider.prototype.Query("select name,completion_time from v$archived_log where name is not null",
                        [], {}, onFinished);
                    provider = null;
                }
                else {
                    throw new Error("Cannot run the current inspection " +
                        "because the dependency oracle component is unavailable");
                }
            });
        componentMgr = null;

        if (inspection.prototype.Verification(next)) {
            next.prototype.Run();
        }
    };

    function onFinished(err, result) {
        if (err) {
            throw err;
        }

        var inspectionResult = require('../../resources/storage/inspection.result');
        var inspectionCollection = require('../../resources/storage/inspection.collection');
        var archivedLogsVerification = require('../testingBase_collection/oracle.archivedlogs.verify')();

        inspection.result = {
            "server": "oracle database",
            "check_status": archivedLogsVerification.prototype.Check(result),
            "description": inspection.description,
            "result_detail": result
        };

        inspectionResult.FillResult(inspectionCollection.GetGroupName(), inspection.result);
        if (inspectionResult.GetResultCount() === inspectionCollection.Count()) {
            var event = require('../../framework/event/event.provider');
            event.Publish("onInspectionEnd", inspectionResult.GetResult());
            event = null;
        }

        inspectionResult = null;
        inspectionCollection = null;
        archivedLogsVerification = null;
    }

    return inspection;
}

module.exports = OracleArchivedLogsCheck;