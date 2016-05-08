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
    var utils = require('util');
    var BaseInspection = require('../../framework/business/inspection/base.inspection');
    var inspectionresult=require('../../server/storage/inspection.result');
    inspection.prototype = new BaseInspection();

    inspection.prototype.Configure = function configure(outConfig) {

        inspection.description = "Read the memory usage for the server";
        inspection.aliasname = "memoryRead";
        inspection.tags = ["device_resource"];
        inspection.result = null;

        if (!utils.isNullOrUndefined(outConfig)) {
            inspection = inspection.prototype.AttachConfig(inspection, outConfig);
        }
    };

    inspection.prototype.Run = function run() {

        var isFinal = true;

        console.log("start run the memory usage read inspection");
        // todo: write core logic here, the isFinal logic is used for callback inner,
        // at last i suppose that every logic should be use the callback to return the inspection result

        for (i=0;inspection.ipAddress.length;i++)
        {
            var WmiClient=requre('wmi-client');
            var wmi =new WmiClient({
                username:inspection.username,
                password:inspection.password,
                host:inspection.ipAddress[i]
            });

            wmi.query('SELECT FreePhysicalMemory,TotalVisibleMemorySize FROM Win32_OperatingSystem',function (err,result){
                if (err == null){
                    inspection.result.add(100-(result[0].FreePhysicalMemory/result[0].TotalVisibleMemorySize*100));

                    if(i==inspection.ipAddress.length-1){
                        inspectionresult.fillResult(inspection);
        
                        if (isFinal) {
                            var event = require('../../framework/event/event.provider');
                            event.Publish("onInspectionEnd", {
                                "memory": 0.23
                            });
                        }
                    }
                }else{
                    console.log(err);
                }
            });
        };

        if (inspection.prototype.Verification(next)) {
            isFinal = false;
            next.prototype.Run();
        }
    };

    return inspection;
}

module.exports = MemoryUsageRead;