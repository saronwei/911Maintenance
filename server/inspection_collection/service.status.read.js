function ServiceStatusRead(next) {

    if (!(this instanceof ServiceStatusRead)) {
        inspection = new ServiceStatusRead(next);
    }
    else {
        inspection = this;
    }

    var inspection;
    var utils = require('util');
    var BaseInspection = require('../../framework/business/inspection/base.inspection');
    var inspectionresult=require('../../server/stotage/inspection.result');
    inspection.prototype = new BaseInspection();

    inspection.prototype.Configure = function configure(outConfig) {

        inspection.description = "Read the memory status for the server";
        inspection.aliasname = "serviceRead";
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

        var WmiClient=requre('wmi-client');
        var wmi =new WmiClient({
            username:inspection.username,
            password:inspection.password,
            host:inspection.ipAddress
        });

        var constring='SELECT Name,Started FROM Win32_Service';
		for (var i=0;i<=inspection.serviceName.length-1;i++){
			if (i==0){
				constring=constring+' Name = "'+NameList[i]+'"';
			}else{
				constring+=' or Name ="'+NameList[i]+'"';
			}
		}
		wmi.query(constring,function (err,result){
			if (err == null){
				inspection.result.add(result);

                inspectionresult.fillResult(inspection);

                if (inspection.prototype.Verification(next)) {
                    isFinal = false;
                    next.prototype.Run();
                }


                if (isFinal) {
                    var event = require('../../framework/event/event.provider');
                    event.Publish("onInspectionEnd", {
                        "memory": 0.23
                    });
                }
			}else{
                console.log(err);
            }
		});

    };

    return inspection;
}

module.exports = ServiceStatusRead;