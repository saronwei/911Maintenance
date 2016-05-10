function PingStatusRead(next) {

    if (!(this instanceof PingStatusRead)) {
        inspection = new PingStatusRead(next);
    }
    else {
        inspection = this;
    }

    var inspection;
    inspection.aliasname = "pingStatus";
    var utils = require('util');
    var BaseInspection = require('../../business_framework/inspection/base.inspection');
    var inspectionResult = require('../../resources/storage/inspection.result');
    inspection.prototype = new BaseInspection();

    inspection.prototype.Configure = function configure(outConfig) {

        inspection.description = "Read the memory usage for the server";
        inspection.tags = ["device_resource"];
        inspection.result = null;

        if (!utils.isNullOrUndefined(outConfig)) {
            inspection = inspection.prototype.AttachConfig(inspection, outConfig);
        }
    };

    inspection.prototype.Run = function run() {

        var isFinal = true;
        var j = 0;

        console.log("start run the ping status read inspection");
        // todo: write core logic here, the isFinal logic is used for callback inner,
        // at last i suppose that every logic should be use the callback to return the inspection result

        for (var i = 0; i <= inspection.ipAddress.length - 1; i++) {
            var WmiClient = require('wmi-client');
            var wmi = new WmiClient({
                username: null,
                password: null,
                host: '127.0.0.1'
            });

            var constring = 'SELECT Address,PrimaryAddressResolutionStatus FROM Win32_PingStatus where Address ="' + inspection.ipAddress[i] + '"';
            wmi.query(constring, function (err, result) {
                if (err == null) {
                    j++;
                    inspection.result = (result[0].PrimaryAddressResolutionStatus);
                    inspectionResult.FillResult(inspection);

                    if (j == inspection.ipAddress.length) {

                        if (inspection.prototype.Verification(next)) {
                            isFinal = false;
                            next.prototype.Run();
                        }

                        if (isFinal) {
                            var event = require('../../framework/event/event.provider');
                            event.Publish("onInspectionEnd", inspectionResult.GetResult());
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

module.exports = PingStatusRead;