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
    var inspectionresult = require('../../resources/storage/inspection.result');
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
        var ResultVerify=require('../../server/testingBase_collection/cpuandmemoryresultverify');
        var resultverify = new ResultVerify();

        console.log("start run the memory usage read inspection");
        // todo: write core logic here, the isFinal logic is used for callback inner,
        // at last i suppose that every logic should be use the callback to return the inspection result
        var j = 0;
        for (var i = 0; i <= inspection.ipAddress.length - 1; i++) {
            var WmiClient = require('wmi-client');
            var wmi = new WmiClient({
                username: inspection.username,
                password: inspection.password,
                host: inspection.ipAddress[i]
            });

            wmi.query('SELECT FreePhysicalMemory,TotalVisibleMemorySize FROM Win32_OperatingSystem', function (err, result) {
                if (err == null) {
                    j++;
                    var checkstatus = resultverify.prototype.Check(100 - (result[0].FreePhysicalMemory / result[0].TotalVisibleMemorySize * 100));
                    inspection.result = {
                        "server":inspection.ipAddress[j-1],
                        "result_detail":100 - (result[0].FreePhysicalMemory / result[0].TotalVisibleMemorySize * 100),
                        "check_status":checkstatus,
                        "description":"memory usage read"
                    };
                    inspectionresult.FillResult(inspection);
                    if (j == inspection.ipAddress.length) {

                        if (inspection.prototype.Verification(next)) {
                            isFinal = false;
                            next.prototype.Run();
                        }

                        if (isFinal) {
                            var event = require('../../framework/event/event.provider');
                            event.Publish("onInspectionEnd", inspectionresult.GetResult());
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

module.exports = MemoryUsageRead;