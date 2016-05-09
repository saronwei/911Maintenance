function DiskSpaceRead(next) {

    if (!(this instanceof DiskSpaceRead)) {
        inspection = new DiskSpaceRead(next);
    }
    else {
        inspection = this;
    }

    var inspection;
    inspection.aliasname = "diskRead";
    var utils = require('util');
    var BaseInspection = require('../../business_framework/inspection/base.inspection');
    var inspectionResult = require('../../resources/storage/inspection.result');
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

        var isFinal = true;
        var j=0;

        console.log("start run the disk usage read inspection");
        // todo: write core logic here, the isFinal logic is used for callback inner,
        // at last i suppose that every logic should be use the callback to return the inspection result

        for (var i = 0; i <= inspection.ipAddress.length - 1; i++)
        {
            var WmiClient = require('wmi-client');
            var wmi = new WmiClient({
                username: inspection.username,
                password: inspection.password,
                host: inspection.ipAddress[i]
            });

            wmi.query('SELECT Caption,FreeSpace FROM Win32_LogicalDisk where Caption ="C:"', function (err, result) {

                if (err == null) {
                    j++
                    inspection.result=(result[0].FreeSpace / 1073741824);
                    inspectionResult.FillResult(inspection);

                    if ( j== inspection.ipAddress.length ) {

                        if (isFinal) {
                            var event = require('../../framework/event/event.provider');
                            event.Publish("onInspectionEnd",inspectionResult.GetResult());
                        }
                    }
                }
            });
        }

        if (inspection.prototype.Verification(next)) {
            isFinal = false;
            next.prototype.Run();
        }
    };

    return inspection;
}

module.exports = DiskSpaceRead;