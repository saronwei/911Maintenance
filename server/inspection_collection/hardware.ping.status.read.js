function HardwarePingStatusRead(next) {

    if (!(this instanceof HardwarePingStatusRead)) {
        inspection = new HardwarePingStatusRead(next);
    }
    else {
        inspection = this;
    }

    var inspection;
    inspection.aliasname = "HardwarePingStatusRead";
    var utils = require('util');
    var BaseInspection = require('../../business_framework/inspection/base.inspection');
    inspection.prototype = new BaseInspection();

    inspection.prototype.Configure = function configure(outConfig) {

        inspection.description = "Read the ping status for the server";
        inspection.tags = ["device_resource"];
        inspection.result = null;

        if (!utils.isNullOrUndefined(outConfig)) {
            inspection = inspection.prototype.AttachConfig(inspection, outConfig);
        }
    };

    inspection.prototype.Run = function run() {
        var inspectionResult = require('../../resources/storage/inspection.result');
        var ResultVerify = require('../testingBase_collection/hardware.ping.result.verify.js');
        var inspectionMgr = require('../../resources/storage/inspection.collection');
        var WmiClient = require('wmi-client');
        var resultVerify = new ResultVerify();
        var j = 0;
        var results = null;
        var resultList = [];

        console.log("start run the ping status read inspection");
        // todo: write core logic here, the isFinal logic is used for callback inner,
        // at last i suppose that every logic should be use the callback to return the inspection result

        for (var i = 0; i <= inspection.ipAddress.length - 1; i++) {
            var wmi = new WmiClient({
                username: null,
                password: null,
                host: '127.0.0.1'
            });

            var constring = 'SELECT Address,PrimaryAddressResolutionStatus FROM Win32_PingStatus where Address ="' + inspection.ipAddress[i] + '"';
            wmi.query(constring, function (err, result) {
                if (err == null) {
                    j++;
                    var checkstatus = resultVerify.prototype.Check(result[0].PrimaryAddressResolutionStatus);
                    results = {
                        "server": inspection.ipAddress[j - 1],
                        "result_detail": result[0].PrimaryAddressResolutionStatus,
                        "check_status": checkstatus,
                        "description": "ping status read"
                    };
                    resultList.push(results);

                    if (j == inspection.ipAddress.length) {
                        inspection.result = {
                            "Group": 'Ping',
                            "Result": resultList
                        };
                        inspectionResult.FillResult(inspection.result);

                        if (inspectionMgr.Count() == inspectionResult.GetResult().length) {
                            var event = require('../../framework/event/event.provider');
                            event.Publish("onInspectionEnd", inspectionResult.GetResult());
                            inspectionMgr = null;
                            inspectionResult = null;
                            results = null;
                            resultList = null;
                            j = null;
                            resultVerify = null;
                            ResultVerify = null;
                        }
                    }
                } else {
                    console.log(err);
                }
            });
        }

        wmi = null;
        if (inspection.prototype.Verification(next)) {
            next.prototype.Run();
        }
    };

    return inspection;
}

module.exports = HardwarePingStatusRead;