function ServerStackStatus(next) {

    if (!(this instanceof ServerStackStatus)) {
        inspection = new ServerStackStatus(next);
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

        inspection.description = "Read the server stack status for the oracle";
        inspection.aliasname = "serverstackStatus";
        inspection.tags = ["oracle_resource"];
        inspection.result = null;

        if (!utils.isNullOrUndefined(outConfig)) {
            inspection = inspection.prototype.AttachConfig(inspection, outConfig);
        }
    };

    inspection.prototype.Run = function run() {

        var isFinal = true;

        console.log("start run the server stack status inspection");
        // todo: write core logic here, the isFinal logic is used for callback inner,
        // at last i suppose that every logic should be use the callback to return the inspection result

        var SSH=require('simple-ssh');
        var ssh=new SSH({
        	host:inspection.ipAddress,
        	user:inspection.username,
        	pass:inspection.password
        });

        ssh.exec('su - grid',{
        	args:['crsctl check crs'],
        	out:function(stdout){
        		inspection.result=stdout;

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
        	},
        	err:function (stderr) {
        		console.log(stderr);
        	}
        }).start();

    };

    return inspection;
}

module.exports = ServerStackStatus;