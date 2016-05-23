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

        inspection.description = "Read the memory status for the server";
        inspection.tags = ["device_resource"];
        inspection.result = null;

        if (!utils.isNullOrUndefined(outConfig)) {
            inspection = inspection.prototype.AttachConfig(inspection, outConfig);
        }
    };

    inspection.prototype.Run = function run() {
        var inspectionResult = require('../../resources/storage/inspection.result');
        var inspectionMgr = require('../../resources/storage/inspection.collection');
        var ResultVerify = require('../testingBase_collection/business.serviceStatus.result.verify');
        var resultVerify = new ResultVerify();
        var results = null;
        var resultList =[];

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
                var checkstatus = resultVerify.prototype.Check(result);
                results = {
                    "server":inspection.ipAddress,
                    "result_detail":result,
                    "check_status":checkstatus,
                    "description":"service status read"
                };
                resultList.push(results);
                inspection.result = {
                    "Group":'Server Status',
                    "Result":resultList
                };
                inspectionResult.FillResult(inspection.result);

                if (inspectionMgr.Count() == inspectionResult.GetResult().length) {
                    var event = require('../../framework/event/event.provider');
                    event.Publish("onInspectionEnd", inspectionResult.GetResult());
                    inspectionMgr = null;
                    inspectionResult = null;
                    i = null;
                    results = null;
                    resultList = null;
                    resultVerify = null;
                    ResultVerify = null;
                }
            } else {
                console.log(err);
            }
        });

        wmi = null;
        if (inspection.prototype.Verification(next)) {
            next.prototype.Run();
        }
    };

    return inspection;
}

module.exports = BusinessServiceStatusRead;