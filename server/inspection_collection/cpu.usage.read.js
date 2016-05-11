function CpuUsageRead(next) {

    if (!(this instanceof CpuUsageRead)) {
        inspection = new CpuUsageRead(next);
    }
    else {
        inspection = this;
    }

    var inspection;
    inspection.aliasname = "cpuRead";
    var utils = require('util');
    var BaseInspection = require('../../business_framework/inspection/base.inspection');
    var inspectionResult = require('../../resources/storage/inspection.result');
    inspection.prototype = new BaseInspection();

    inspection.prototype.Configure = function configure(outConfig) {

        inspection.description = "Read the cpu usage for the server";
        inspection.tags = ["device_resource"];
        inspection.result = null;

        if (!utils.isNullOrUndefined(outConfig)) {
            inspection = inspection.prototype.AttachConfig(inspection, outConfig);
        }
    };

    inspection.prototype.Run = function run() {

        var ResultVerify=require('../../server/testingBase_collection/cpuandmemoryresultverify');
        var isFinal = true;
        var j=0;

        console.log("start run the cpu usage read inspection");
        // todo: write core logic here, the isFinal logic is used for callback inner,
        // at last i suppose that every logic should be use the callback to return the inspection result

        for (var i = 0; i <= inspection.ipAddress.length - 1; i++) {
            var WmiClient = require('wmi-client');
            var wmi = new WmiClient({
                username: inspection.username,
                password: inspection.password,
                host: inspection.ipAddress[i]
            });

            wmi.query('SELECT Role,LoadPercentage FROM Win32_Processor', function (err, result) {
                if (err == null) {
                    j++;
                    var resultverify = ResultVerify.Check(result[0].LoadPercentage);
                    inspection.result = {
                        "server":inspection.ipAddress[j-1],
                        "result_detail":result[0].LoadPercentage,
                        "check_status":resultverify,
                        "description":"cpu usage read"
                    };

                    inspectionResult.FillResult(inspection);
                    if (j == inspection.ipAddress.length ) {

                        if (inspection.prototype.Verification(next)) {
                            isFinal = false;
                            next.prototype.Run();
                        }

                        if (isFinal) {
                            var event = require('../../framework/event/event.provider');
                            event.Publish("onInspectionEnd",inspectionResult.GetResult());
                        }
                    }
                } else {
                    console.log(err);
                }
            });
        }
    };

    return inspection;
}

module.exports = CpuUsageRead;