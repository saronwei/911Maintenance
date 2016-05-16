/**
 * Created by Saron on 2016/4/5.
 */

function MemoryUsageRead(next) {

    if (!(this instanceof MemoryUsageRead)) {
        inspection = new MemoryUsageRead(next);
    }
    else {
        inspection = this;
    }

    var inspection;
    inspection.aliasname = "memoryRead";
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

        var ResultVerify = require('../../server/testingBase_collection/cpuandmemoryresultverify');
        var inspectionMgr = require('../../resources/storage/inspection.collection');
        var inspectionResult = require('../../resources/storage/inspection.result');
        var WmiClient = require('wmi-client');
        var j = 0;
        var resultverify = new ResultVerify();
        var results = null;
        var resultList = [];
        console.log("start run the memory usage read inspection");
        // todo: write core logic here, the isFinal logic is used for callback inner,
        // at last i suppose that every logic should be use the callback to return the inspection result

        for (var i = 0; i <= inspection.ipAddress.length - 1; i++) {
            var wmi = new WmiClient({
                username: inspection.username,
                password: inspection.password,
                host: inspection.ipAddress[i]
            });

            wmi.query('SELECT FreePhysicalMemory,TotalVisibleMemorySize FROM Win32_OperatingSystem', function (err, result) {
                if (err == null) {
                    j++;
                    var checkstatus = resultverify.prototype.Check(100 - (result[0].FreePhysicalMemory / result[0].TotalVisibleMemorySize * 100));
                    results = {
                        "server":inspection.ipAddress[j-1],
                        "result_detail":100 - (result[0].FreePhysicalMemory / result[0].TotalVisibleMemorySize * 100),
                        "check_status":checkstatus,
                        "description":"memory usage read"
                    };
                    resultList.push(results);
                    if (j == inspection.ipAddress.length) {
                        inspection.result = {
                            "Group":'Memory',
                            "Result":resultList
                        }
                        inspectionResult.FillResult(inspection.result);
                        if (inspectionMgr.Count() == inspectionResult.GetResult().length) {
                            var event = require('../../framework/event/event.provider');
                            event.Publish("onInspectionEnd", inspectionResult.GetResult());
                            inspectionMgr = null;
                            inspectionResult = null;
                            j = null;
                            resultList = null;
                            results = null;
                            checkstatus = null;
                            ResultVerify = null;
                            resultverify = null;
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

module.exports = MemoryUsageRead;