/**
 * Created by Saron on 2016/5/11.
 */

function OracleRecoveryUsageRead(next) {
    "use strict";

    if (!(this instanceof OracleRecoveryUsageRead)) {
        inspection = new OracleRecoveryUsageRead(next);
    }
    else {
        inspection = this;
    }

    var inspection;
    var utils = require('util');
    inspection.aliasname = "OracleRecoveryUsageRead";
    var BaseInspection = require('../../business_framework/inspection/base.inspection');
    inspection.prototype = new BaseInspection();

    inspection.prototype.Configure = function configure(outConfig) {

        inspection.description = "Check the flash recovery area usage of oracle database";
        inspection.result = null;
        inspection.tags = ["database_resource"];

        if (!utils.isNullOrUndefined(outConfig)) {
            inspection = inspection.prototype.AttachConfig(inspection, outConfig);
        }
    };

    inspection.prototype.Run = function run() {

        console.log("start run the oracle recovery area usage inspection");
        var componentMgr = require('../../framework/component/component.manage')();
        componentMgr.InitializeComponent('oracle', {"instanceName": inspection.instanceName},
            function (provider) {
                if (utils.isObject(provider) && provider != {}) {
                    provider.prototype.Query("select * from v$flash_recovery_area_usage",
                        [], {}, onFinished)
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

        console.log(result);

        var inspectionResult = require('../../resources/storage/inspection.result');
        var inspectionCollection = require('../../resources/storage/inspection.collection');
        var recoveryUsageVerification = require('../testingBase_collection/oracle.recovery.usage.verify')();


        inspection.result = {
            "server": "oracle database",
            "check_status": recoveryUsageVerification.prototype.Check(result),
            "description": inspection.description,
            "result_detail": result
        };
        inspectionResult.FillResult(inspectionCollection.GetGroupName(), inspection.result);

        if (inspectionResult.GetResultCount() === inspectionCollection.Count()) {
            var event = require('../../framework/event/event.provider');
            event.Publish('onInspectionEnd', inspectionResult.GetResult());
            event = null;
        }

        inspectionResult = null;
        inspectionCollection = null;
    }

    return inspection;
}

module.exports = OracleRecoveryUsageRead;