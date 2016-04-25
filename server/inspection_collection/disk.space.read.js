function DiskSpaceRead(next) {

    if (!(this instanceof DiskSpaceRead)) {
        inspection = new DiskSpaceRead(next);
    }
    else {
        inspection = this;
    }

    var inspection;
    var utils = require('util');
    var BaseInspection = require('../../framework/business/inspection/base.inspection');
    var inspectionResult=require('../../server/storage/inspection.rsult');
    inspection.prototype = new BaseInspection();

    inspection.prototype.Configure = function configure(outConfig) {

        inspection.description = "Read the disk usage for the server";
        inspection.aliasname = "diskRead";
        inspection.tags = ["device_resource"];
        inspection.result = null;

        if (!utils.isNullOrUndefined(outConfig)) {
            inspection = inspection.prototype.AttachConfig(inspection, outConfig);
        }
    };

    inspection.prototype.Run = function run() {

        var isFinal = true;

        console.log("start run the disk usage read inspection");
        // todo: write core logic here, the isFinal logic is used for callback inner,
        // at last i suppose that every logic should be use the callback to return the inspection result

        for(i=0;i<=inspection.ipAddress.lengh-1;i++)\
        {
            var WmiClient=requre('wmi-client');
            var wmi =new WmiClient({
                username:inspection.username,
                password:inspection.password,
                host:inspection.ipAddress[i]
            });

            wmi.query('SELECT Caption,FreeSpace FROM Win32_LogicalDisk where Caption ="C:"',function (err,result){
        
                if (err == null){
                    inspection.result.add(result[0].FreeSpace/1073741824);

                    if (i==inspection.ipAddress.lengh-1){

                        inspectionResult.fillResult(inspection);

                        if (inspection.prototype.Verification(next)) {
                            isFinal = false;
                            next.prototype.Run();
                        };

                        if (isFinal) {
                            var event = require('../../framework/event/event.provider');
                            event.Publish("onInspectionEnd", {
                                    "disk": 0.23
                                });
                         };
                    } 
                }else{
                    consoel.log(err);
                }；  
            });
        }
    };

    return inspection;
}

module.exports = DiskSpaceRead;