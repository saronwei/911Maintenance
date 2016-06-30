function BusinessServiceStatusRead(next) {

    if (!(this instanceof BusinessServiceStatusRead)) {
        inspection = new BusinessServiceStatusRead(next);
    }
    else {
        inspection = this;
    }

    var inspection;
    inspection.aliasname = "BusinessServiceStatusRead";
    var utils = require('util');
    var BaseInspection = require('../../business_framework/inspection/base.inspection');
    inspection.prototype = new BaseInspection();

    inspection.prototype.Configure = function configure(outConfig) {

        inspection.description = "Read the  status read for the server";
        inspection.tags = ["device_resource"];
        inspection.result = null;

        if (!utils.isNullOrUndefined(outConfig)) {
            inspection = inspection.prototype.AttachConfig(inspection, outConfig);
        }
    };

    inspection.prototype.Run = function run() {
        console.log("start run the service status read inspection");
        // todo: write core logic here, the isFinal logic is used for callback inner,
        // at last i suppose that every logic should be use the callback to return the inspection result

        var WmiClient = require('wmi-client');
        var wmi = new WmiClient({
            username: inspection.username,
            password: inspection.password,
            host: inspection.ipAddress
        });

        var constring = 'SELECT Name,Started FROM Win32_Service';
        wmi.query(constring,callBack);
        wmi = null;
        if (inspection.prototype.Verification(next)) {
            next.prototype.Run();
        }
    };

    function callBack(err,result){
        var inspectionResult = require('../../resources/storage/inspection.result');
        var inspectionMgr = require('../../resources/storage/inspection.collection');
        var ResultVerify = require('../testingBase_collection/business.serviceStatus.result.verify');
        var resultVerify = new ResultVerify();

        if (err == null) {
            inspection.result = {
                "server":inspection.ipAddress,
                "check_status":resultVerify.prototype.Check(result,inspection.serviceName),
                "description":inspection.description,
                "result_detail":null
            };
            inspectionResult.FillResult(inspectionMgr.GetGroupName(),inspection.result);

            if (inspectionMgr.Count() == inspectionResult.GetResultCount()) {
                var event = require('../../framework/event/event.provider');
                event.Publish("onInspectionEnd", inspectionResult.GetResult());
                inspectionMgr = null;
                inspectionResult = null;
                resultVerify = null;
                ResultVerify = null;
            }
        } else {
            console.log(err);
        }
    }

    return inspection;
}

module.exports = BusinessServiceStatusRead;