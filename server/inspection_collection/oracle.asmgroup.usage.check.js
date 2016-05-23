/**
 * Created by Saron on 2016/5/21.
 */

function OracleAsmGroupUsageCheck(next) {
    "use strict";

    if (!(this instanceof OracleAsmGroupUsageCheck)) {
        inspection = new OracleAsmGroupUsageCheck(next);
    }
    else {
        inspection = this;
    }

    var inspection;
    inspection.aliasname = "OracleAsmGroupUsageCheck";
    var utils = require('util');
    var BaseInspection = require('../../business_framework/inspection/base.inspection');
    inspection.prototype = new BaseInspection();

    inspection.prototype.Configure = function configure(outConfig) {

        inspection.description = "Check the oracle asm group environment usage";
        inspection.tags = ["database_resource"];
        inspection.result = null;

        if (utils.isObject(outConfig) && outConfig != {}) {
            inspection.prototype.AttachConfig(inspection, outConfig);
        }
    };

    inspection.prototype.Run = function run() {

        console.log("start run the oracle asm disk space usage inspection");

        var componentMgr = require('../../framework/component/component.manage')();
        componentMgr.InitializeComponent("oracle", {"instanceName": inspection.instanceName},
            function (provider) {
                if (utils.isObject(provider) && provider != {}) {
                    provider.prototype.Query("select name,total_mb,free_mb from v$asm_disk",
                        [], {}, onFinished);
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
        var asmUsageVerification = require('../testingBase_collection/oracle.asmgroup.usage.verify')();

        inspection.result = {
            "server": "oracle database",
            "check_status": asmUsageVerification.prototype.Check(result),
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
        asmUsageVerification = null;
    }

    return inspection;
}

module.exports = OracleAsmGroupUsageCheck;