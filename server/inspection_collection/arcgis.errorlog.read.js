/**
 * Created by Saron on 2016/5/18.
 */

function ArcgisErrorLogRead(next) {
    "use strict";

    if (!(this instanceof ArcgisErrorLogRead)) {
        inspection = new ArcgisErrorLogRead(next);
    }
    else {
        inspection = this;
    }

    var inspection;
    var utils = require('util');
    inspection.aliasname = "ArcgisErrorLogRead";
    var BaseInspection = require('../../business_framework/inspection/base.inspection');
    inspection.prototype = new BaseInspection();

    inspection.prototype.Configure = function configure(outConfig) {

        inspection.description = "Check the error logs from the arcgis server ";
        inspection.tags = ["services_check"];
        inspection.result = null;

        if (utils.isObject(outConfig) && outConfig != {}) {
            inspection.prototype.AttachConfig(inspection, outConfig);
        }
    };

    inspection.prototype.Run = function run() {

        console.log("Start running the arcgis error logs inspection");

        var componentMgr = require('../../framework/component/component.manage')();
        componentMgr.InitializeComponent('arcgis', {"hostname": inspection.hostname},
            function (provider) {
                if (utils.isObject(provider)) {
                    var current = new Date();
                    var option = {
                        "path": inspection.path,
                        "method": inspection.method ? inspection.method : "GET",
                        "params": {
                            "f": "json",
                            "startTime": current.setUTCHours(0, 0, 0, 0),
                            "endTime": current.setUTCHours(23, 59, 59, 0),
                            "sinceLastStart": true,
                            "level": "SEVERE",
                            "filter": "services=System/SampleWorldCities.MapServer"
                        }
                    };
                    current = null;
                    provider.prototype.Access(option, onFinished);
                }
            });

        componentMgr = null;

        if (inspection.prototype.Verification(next)) {
            next.prototype.Run();
        }
    };

    /* Private method defines */

    function onFinished(err, result) {

        if (err) {
            throw err;
        }
        if (utils.isObject(result)) {

            var inspectionResults = require('../../resources/storage/inspection.result');
            var inspectionCollection = require('../../resources/storage/inspection.collection');
            var errorLogsVerification = require('../testingBase_collection/arcgis.errorlogs.verify')();

            inspection.result = {
                "server": "arcgis server",
                "check_status": errorLogsVerification.prototype.Check(result),
                "description": inspection.description,
                "result_detail": result
            };
            inspectionResults.FillResult(inspectionCollection.GetGroupName(), inspection.result);

            if (inspectionResults.GetResultCount() === inspectionCollection.Count()) {
                var event = require('../../framework/event/event.provider.js');
                event.Publish('onInspectionEnd', inspectionResults.GetResult());
                event = null;
            }

            errorLogsVerification = null;
            inspectionCollection = null;
            inspectionResults = null;
        }

    }

    return inspection;
}

module.exports = ArcgisErrorLogRead;