function OracleClusterResourceStatus(next) {

    if (!(this instanceof OracleClusterResourceStatus)) {
        inspection = new OracleClusterResourceStatus(next);
    }
    else {
        inspection = this;
    }

    var inspection;
    inspection.aliasname = "OracleClusterResourceStatus";
    var utils = require('util');
    var BaseInspection = require('../../business_framework/inspection/base.inspection');
    inspection.prototype = new BaseInspection();

    inspection.prototype.Configure = function configure(outConfig) {

        inspection.description = "Read the cluster resource status for the oracle";
        inspection.tags = ["oracle_resource"];
        inspection.result = null;

        if (!utils.isNullOrUndefined(outConfig)) {
            inspection = inspection.prototype.AttachConfig(inspection, outConfig);
        }
    };

    inspection.prototype.Run = function run() {
        var inspectionResult = require('../../resources/storage/inspection.result');
        var inspectionMgr = require('../../resources/storage/inspection.collection');
        var ResultVerify = require('../testingBase_collection/oracle.resStatus.result.verify.js');
        var resultVerify = new ResultVerify();
        var results = null;
        var resultList = [];
        var outString = null;

        console.log("start run the cluster resource status inspection");
        // todo: write core logic here, the isFinal logic is used for callback inner,
        // at last i suppose that every logic should be use the callback to return the inspection result

        var SSH = require('simple-ssh');
        var ssh = new SSH({
            host: inspection.ipAddress,
            user: inspection.username,
            pass: inspection.password
        });

        ssh.exec('su - grid', {
            args: ['crsctl status res'],
            out: function (stdout) {
                outString = outString + stdout;
            },
            err: function (stderr) {
                console.log(stderr);
            },
            exit: function (stdout) {
                results = {
                    "server": inspection.ipAddress,
                    "check_status": resultVerify.prototype.Check(outString),
                    "description": inspection.description,
                    "result_detail": outString
                };
                resultList.push(results);
                inspection.result = {
                    "Group": 'Res Status',
                    "Result": resultList
                };
                inspectionResult.FillResult(inspectionMgr.GetGroupName(),inspection.result);

                if (inspectionMgr.Count() == inspectionResult.GetResultCount()) {
                    var event = require('../../framework/event/event.provider');
                    event.Publish("onInspectionEnd", inspectionResult.GetResult());
                    inspectionMgr = null;
                    inspectionResult = null;
                    results = null;
                    resultList = null;
                    outString = null;
                    resultVerify = null;
                    ResultVerify = null;
                }
            }
        }).start();
        ssh = null;
        if (inspection.prototype.Verification(next)) {
            next.prototype.Run();
        }
    };

    return inspection;
}

module.exports = OracleClusterResourceStatus;