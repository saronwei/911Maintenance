function OracleClusterServiceStatus(next) {

    if (!(this instanceof OracleClusterServiceStatus)) {
        inspection = new OracleClusterServiceStatus(next);
    }
    else {
        inspection = this;
    }

    var inspection;
    inspection.aliasname = "OracleClusterServiceStatus";
    var utils = require('util');
    var BaseInspection = require('../../business_framework/inspection/base.inspection');
    inspection.prototype = new BaseInspection();

    inspection.prototype.Configure = function configure(outConfig) {

        inspection.description = "Read the server stack status for the oracle";
        inspection.tags = ["oracle_resource"];
        inspection.result = null;

        if (!utils.isNullOrUndefined(outConfig)) {
            inspection = inspection.prototype.AttachConfig(inspection, outConfig);
        }
    };

    inspection.prototype.Run = function run() {
        var inspectionResult = require('../../resources/storage/inspection.result');
        var inspectionMgr = require('../../resources/storage/inspection.collection');
        var ResultVerify = require('../testingBase_collection/oracle.serviceStatus.result.verify.js');
        var resultVerify = new ResultVerify();
        var results = null;
        var resultList = [];

        console.log("start run the server stack status inspection");
        // todo: write core logic here, the isFinal logic is used for callback inner,
        // at last i suppose that every logic should be use the callback to return the inspection result

        var SSH = require('simple-ssh');
        var ssh = new SSH({
            host: inspection.ipAddress,
            user: inspection.username,
            pass: inspection.password
        });

        ssh.exec('su - grid', {
            args: ['crsctl check crs'],
            out: function (stdout) {
                var checkstatus = resultVerify.prototype.Check(stdout);
                results = {
                    "server":inspection.ipAddress,
                    "result_detail":stdout,
                    "check_status":checkstatus,
                    "description":"server stack status"
                };
                resultList.push(results);
            },
            err: function (stderr) {
                console.log(stderr);
            },
            exit:function(stdout){
                inspection.result = {
                    "Group":'Crs Status',
                    "Result":resultList
                };
                inspectionResult.FillResult(inspection.result);
                if (inspectionMgr.Count() == inspectionResult.GetResult().length) {
                    var event = require('../../framework/event/event.provider');
                    event.Publish("onInspectionEnd",inspectionResult.GetResult());
                    inspectionMgr = null;
                    inspectionResult = null;
                    results = null;
                    resultList = null;
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

module.exports = OracleClusterServiceStatus;