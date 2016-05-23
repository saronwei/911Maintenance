function HardwareCpuUsageRead(next) {

    if (!(this instanceof HardwareCpuUsageRead)) {
        inspection = new HardwareCpuUsageRead(next);
    }
    else {
        inspection = this;
    }

    var inspection;
    inspection.aliasname = "HardwareCpuUsageRead";
    var utils = require('util');
    var BaseInspection = require('../../business_framework/inspection/base.inspection');
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
        var WmiClient = require('wmi-client');
        console.log("start run the cpu usage read inspection");
        // todo: write core logic here, the isFinal logic is used for callback inner,
        // at last i suppose that every logic should be use the callback to return the inspection result

        for (var i = 0; i <= inspection.ipAddress.length - 1; i++) {
            var wmi = new WmiClient({
                username: inspection.username,
                password: inspection.password,
                host: inspection.ipAddress[i]
            });

            wmi.query('SELECT Role,LoadPercentage FROM Win32_Processor', callBack);
        }
        wmi = null;
        if (inspection.prototype.Verification(next)) {
            next.prototype.Run();
        }
    };
    function callBack(err,result) {
        var inspectionResult = require('../../resources/storage/inspection.result');
        var inspectionMgr = require('../../resources/storage/inspection.collection');
        var ResultVerify = require('../testingBase_collection/hardware.cpu.result.verify');
        var resultVerify = new ResultVerify();
        var results = null
        var resultList = [];
        var j = 0;
        if (err == null) {
            j++;
            results = {
                "server":inspection.ipAddress[j-1],
                "check_status":resultVerify.prototype.Check(result[0].LoadPercentage),
                "description":inspection.description,
                "result_detail":result[0].LoadPercentage
            };
            resultList.push(results);
            if (j == inspection.ipAddress.length ) {
                inspection.result = {
                    "Group":'Cpu',
                    "Result":resultList
                };
                inspectionResult.FillResult(inspectionMgr.GetGroupName(),inspection.result);
                if (inspectionMgr.Count() == inspectionResult.GetResultCount()) {
                    var event = require('../../framework/event/event.provider');
                    event.Publish("onInspectionEnd",inspectionResult.GetResult());
                    inspectionMgr = null;
                    inspectionResult = null;
                    results = null;
                    resultList = null;
                    resultVerify = null;
                    ResultVerify = null;
                    j = null;
                }
            }
        } else {
            console.log(err);
        }
    }

    return inspection;
}

module.exports = HardwareCpuUsageRead;