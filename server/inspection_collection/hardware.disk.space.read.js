function HardwareDiskSpaceRead(next) {

    if (!(this instanceof HardwareDiskSpaceRead)) {
        inspection = new HardwareDiskSpaceRead(next);
    }
    else {
        inspection = this;
    }

    var j = 0;
    var results = null;
    var resultList = [];
    var inspection;
    inspection.aliasname = "HardwareDiskSpaceRead";
    var utils = require('util');
    var BaseInspection = require('../../business_framework/inspection/base.inspection');
    inspection.prototype = new BaseInspection();

    inspection.prototype.Configure = function configure(outConfig) {

        inspection.description = "Read the disk usage for the server";
        inspection.tags = ["device_resource"];
        inspection.result = null;

        if (!utils.isNullOrUndefined(outConfig)) {
            inspection = inspection.prototype.AttachConfig(inspection, outConfig);
        }
    };

    inspection.prototype.Run = function run() {
        var WmiClient = require('wmi-client');
        console.log("start run the disk usage read inspection");
        // todo: write core logic here, the isFinal logic is used for callback inner,
        // at last i suppose that every logic should be use the callback to return the inspection result

        for (var i = 0; i <= inspection.ipAddress.length - 1; i++) {
            var wmi = new WmiClient({
                username: inspection.username,
                password: inspection.password,
                host: inspection.ipAddress[i]
            });

            wmi.query('SELECT Caption,FreeSpace FROM Win32_LogicalDisk where Caption ="C:"', callBack);
        }

        wmi = null;
        if (inspection.prototype.Verification(next)) {
            next.prototype.Run();
        }
    };

    function callBack(err,result){
        var inspectionResult = require('../../resources/storage/inspection.result');
        var inspectionMgr = require('../../resources/storage/inspection.collection');
        var ResultVerify = require('../testingBase_collection/hardware.diskspace.result.verify.js');
        var resultVerify = new ResultVerify();



        if (err == null) {
            j++;
            results = {
                "server": inspection.ipAddress[j - 1],
                "check_status": resultVerify.prototype.Check(result[0].FreeSpace / 1073741824),
                "description": inspection.description,
                "result_detail": result[0].FreeSpace / 1073741824
            };
            resultList.push(results);

            if (j == inspection.ipAddress.length) {
                inspection.result = {
                    "Group": 'Disk',
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
        }
    }
    return inspection;
}

module.exports = HardwareDiskSpaceRead;