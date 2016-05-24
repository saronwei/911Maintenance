function HardwarePingStatusRead(next) {

    if (!(this instanceof HardwarePingStatusRead)) {
        inspection = new HardwarePingStatusRead(next);
    }
    else {
        inspection = this;
    }

    var j = 0;
    var results = null;
    var resultList = [];
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
        var WmiClient = require('wmi-client');

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
            wmi.query(constring, callBack );
        }

        wmi = null;
        if (inspection.prototype.Verification(next)) {
            next.prototype.Run();
        }
    };
    function callBack(err,result){
        var inspectionResult = require('../../resources/storage/inspection.result');
        var ResultVerify = require('../testingBase_collection/hardware.ping.result.verify.js');
        var inspectionMgr = require('../../resources/storage/inspection.collection');
        var resultVerify = new ResultVerify();


        if (err == null) {
            j++;
            results = {
                "server": inspection.ipAddress[j - 1],
                "check_status": resultVerify.prototype.Check(result[0].PrimaryAddressResolutionStatus),
                "description": inspection.description,
                "result_detail": result[0].PrimaryAddressResolutionStatus
            };
            resultList.push(results);

            if (j == inspection.ipAddress.length) {
                inspection.result = {
                    "Group": 'Ping',
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
                    j = null;
                    resultVerify = null;
                    ResultVerify = null;
                }
            }
        } else {
            console.log(err);
        }
    }
    return inspection;
}

module.exports = HardwarePingStatusRead;