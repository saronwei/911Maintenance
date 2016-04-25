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
    var inspectionResult = require('../../server/storage/inspection.result');
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

        var isFinal = true;

        console.log("start run the cpu usage read inspection");
        // todo: write core logic here, the isFinal logic is used for callback inner,
        // at last i suppose that every logic should be use the callback to return the inspection result

        for (i = 0; i <= inspection.ipAddress.lengh - 1; i++) {
            var WmiClient = requre('wmi-client');
            var wmi = new WmiClient({
                username: inspection.username,
                password: inspection.password,
                host: inspection.ipAddress[i]
            });

            wmi.query('SELECT Role,LoadPercentage FROM Win32_Processor', function (err, result) {
                if (err == null) {
                    inspection.result.add(result[0].LoadPercentage);

                    if (i == inspection.ipAddress.lengh - 1) {

                        inspectionResult.fillResult(inspection);

                        if (inspection.prototype.Verification(next)) {
                            isFinal = false;
                            next.prototype.Run();
                        }

                        if (isFinal) {
                            var event = require('../../framework/event/event.provider');
                            event.Publish("onInspectionEnd", {
                                "cpu": 0.23
                            });
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