function ClusterResourceStatus(next) {

    if (!(this instanceof ClusterResourceStatus)) {
        inspection = new ClusterResourceStatus(next);
    }
    else {
        inspection = this;
    }

    var inspection;
    inspection.aliasname = "clusterResourceStatus";
    var utils = require('util');
    var BaseInspection = require('../../business_framework/inspection/base.inspection');
    var inspectionResult = require('../../resources/storage/inspection.result');
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

        var isFinal = true;
        var ResultVerify=require('../../server/testingBase_collection/clusterresstatusresultverify');

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
            exit: function (stdout) {
                var resultverify = ResultVerify.prototype.Check(stdout);
                inspection.result = {
                    "server":inspection.ipAddress,
                    "result_detail":stdout,
                    "check_status":resultverify,
                    "description":"cluster resource status"
                }

                inspectionResult.FillResult(inspection);

                if (inspection.prototype.Verification(next)) {
                    isFinal = false;
                    next.prototype.Run();
                }

                if (isFinal) {
                    var event = require('../../framework/event/event.provider');
                    event.Publish("onInspectionEnd",inspectionResult.GetResult());
                }
            },
            err: function (stderr) {
                console.log(stderr);
            }
        }).start();


    };

    return inspection;
}

module.exports = ClusterResourceStatus;