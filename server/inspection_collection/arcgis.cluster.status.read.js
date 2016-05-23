/**
 * Created by Saron on 2016/5/18.
 */

function ArcgisClusterStatusCheck(next) {
    "use strict";

    if (!(this instanceof ArcgisClusterStatusCheck)) {
        inspection = new ArcgisClusterStatusCheck(next);
    }
    else {
        inspection = this;
    }

    var inspection;
    var utils = require('util');
    inspection.aliasname = "ArcgisClusterStatusCheck";
    var BaseInspection = require('../../business_framework/inspection/base.inspection');
    inspection.prototype = new BaseInspection();

    inspection.prototype.Configure = function configure(outConfig) {

        inspection.description = "Check the cluster status from the arcgis server ";
        inspection.tags = ["services_check"];
        inspection.result = null;

        if (utils.isObject(outConfig) && outConfig != {}) {
            inspection.prototype.AttachConfig(inspection, outConfig);
        }
    };

    inspection.prototype.Run = function run() {

        console.log("Start running the arcgis cluster status inspection");

        var componentMgr = require('../../framework/component/component.manage')();
        componentMgr.InitializeComponent('arcgis', {"hostname": inspection.hostname},
            function (provider) {
                if (utils.isObject(provider)) {
                    var option = {
                        "path": inspection.path,
                        "params": {
                            "f": "json"
                        }
                    };
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
            var clusterStatusVerification = require('../testingBase_collection/arcgis.cluster.status.verify')();

            inspection.result = {
                "server": "arcgis server",
                "check_status": clusterStatusVerification.prototype.Check(result),
                "description": inspection.description,
                "result_detail": result
            };
            inspectionResults.FillResult(inspectionCollection.GetGroupName(), inspection.result);

            if (inspectionResults.GetResultCount() === inspectionCollection.Count()) {
                var event = require('../../framework/event/event.provider');
                event.Publish('onInspectionEnd', inspectionResults.GetResult());
                event = null;
            }

            clusterStatusVerification = null;
            inspectionCollection = null;
            inspectionResults = null;
        }

    }

    return inspection;
}

module.exports = ArcgisClusterStatusCheck;