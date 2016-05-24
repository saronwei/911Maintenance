/**
 * Created by Saron on 2016/4/5.
 */

function HardwareMemoryUsageRead(next) {

    if (!(this instanceof HardwareMemoryUsageRead)) {
        inspection = new HardwareMemoryUsageRead(next);
    }
    else {
        inspection = this;
    }

    var j = 0;
    var results = null;
    var resultList = [];
    var inspection;
    inspection.aliasname = "HardwareMemoryUsageRead";
    var utils = require('util');
    var BaseInspection = require('../../business_framework/inspection/base.inspection');
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
        var WmiClient = require('wmi-client');
        console.log("start run the memory usage read inspection");
        // todo: write core logic here, the isFinal logic is used for callback inner,
        // at last i suppose that every logic should be use the callback to return the inspection result

        for (var i = 0; i <= inspection.ipAddress.length - 1; i++) {
            var wmi = new WmiClient({
                username: inspection.username,
                password: inspection.password,
                host: inspection.ipAddress[i]
            });

            wmi.query('SELECT FreePhysicalMemory,TotalVisibleMemorySize FROM Win32_OperatingSystem',
                callBack);
        }
        wmi = null;
        if (inspection.prototype.Verification(next)) {
            next.prototype.Run();
        }
    };
    function callBack(err,result){
        var ResultVerify = require('../testingBase_collection/hardware.cpu.result.verify');
        var inspectionMgr = require('../../resources/storage/inspection.collection');
        var inspectionResult = require('../../resources/storage/inspection.result');

        var resultverify = new ResultVerify();


        if (err == null) {
            j++;
            var outresult = 100 - (result[0].FreePhysicalMemory / result[0].TotalVisibleMemorySize * 100);
            results = {
                "server": inspection.ipAddress[j - 1],
                "check_status": resultverify.prototype.Check(outresult),
                "description": inspection.description,
                "result_detail": outresult
            };
            resultList.push(results);
            if (j == inspection.ipAddress.length) {
                inspection.result = {
                    "Group": 'Memory',
                    "Result": resultList
                };
                inspectionResult.FillResult(inspectionMgr.GetGroupName(),inspection.result);
                if (inspectionMgr.Count() == inspectionResult.GetResultCount()) {
                    var event = require('../../framework/event/event.provider');
                    event.Publish("onInspectionEnd", inspectionResult.GetResult());
                    inspectionMgr = null;
                    inspectionResult = null;
                    j = null;
                    resultList = null;
                    results = null;
                    ResultVerify = null;
                    resultverify = null;
                }
            }
        } else {
            console.log(err);
        }
    }
    return inspection;
}

module.exports = HardwareMemoryUsageRead;