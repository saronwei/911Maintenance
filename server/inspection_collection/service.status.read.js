function ServiceStatusRead(next) {

    if (!(this instanceof ServiceStatusRead)) {
        inspection = new ServiceStatusRead(next);
    }
    else {
        inspection = this;
    }

    var inspection;
    inspection.aliasname = "serviceRead";
    var utils = require('util');
    var BaseInspection = require('../../business_framework/inspection/base.inspection');
    var inspectionResult = require('../../resources/storage/inspection.result');
    inspection.prototype = new BaseInspection();

    inspection.prototype.Configure = function configure(outConfig) {

        inspection.description = "Read the memory status for the server";
        inspection.tags = ["device_resource"];
        inspection.result = null;

        if (!utils.isNullOrUndefined(outConfig)) {
            inspection = inspection.prototype.AttachConfig(inspection, outConfig);
        }
    };

    inspection.prototype.Run = function run() {

        var isFinal = true;
        var ResultVerify = require('../../server/testingBase_collection/serviestatusresultverify');
        var resultverify = new ResultVerify();

        console.log("start run the service status read inspection");
        // todo: write core logic here, the isFinal logic is used for callback inner,
        // at last i suppose that every logic should be use the callback to return the inspection result

        var WmiClient = require('wmi-client');
        var wmi = new WmiClient({
            username: inspection.username,
            password: inspection.password,
            host: inspection.ipAddress
        });

        var constring = 'SELECT Name,Started FROM Win32_Service WHERE ';
        for (var i = 0; i <= inspection.serviceName.length - 1; i++) {
            if (i == 0) {
                constring = constring + ' Name = "' + inspection.serviceName[i] + '"';
            } else {
                constring += ' or Name ="' + inspection.serviceName[i] + '"';
            }
        }
        wmi.query(constring, function (err, result) {
            if (err == null) {
                var checkstatus = resultverify.prototype.Check(result);
                inspection.result = {
                    "server":inspection.ipAddress,
                    "result_detail":result,
                    "check_status":checkstatus,
                    "description":"service status read"
                };

                inspectionResult.FillResult(inspection);

                if (inspection.prototype.Verification(next)) {
                    isFinal = false;
                    next.prototype.Run();
                }

                if (isFinal) {
                    var event = require('../../framework/event/event.provider');
                    event.Publish("onInspectionEnd", inspectionResult.GetResult());
                }
            } else {
                console.log(err);
            }
        });
    };

    return inspection;
}

module.exports = ServiceStatusRead;