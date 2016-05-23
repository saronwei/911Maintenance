/**
 * Created by Saron on 2016/5/22.
 */

function OracleUserPasswordCheck(next) {
    "use strict";

    if (!(this instanceof OracleUserPasswordCheck)) {
        inspection = new OracleUserPasswordCheck(next);
    }
    else {
        inspection = this;
    }

    var inspection;
    inspection.aliasname = "OracleUserPasswordCheck";
    var utils = require('util');
    var BaseInspection = require('../../business_framework/inspection/base.inspection');
    inspection.prototype = new BaseInspection();

    inspection.prototype.Configure = function configure(outConfig) {

        inspection.description = "Check the every database user's password status was unlimited";
        inspection.tags = ['database_resource'];
        inspection.result = null;

        if (utils.isObject(outConfig) && outConfig != {}) {
            inspection.prototype.AttachConfig(inspection, outConfig);
        }
    };

    inspection.prototype.Run = function run() {

        console.log("start run the password expiration policy inspection");

        var componentMgr = require('../../framework/component/component.manage')();
        componentMgr.InitializeComponent("oracle", {"instanceName": inspection.instanceName},
            function (provider) {
                if (utils.isObject(provider) && provider != {}) {
                    provider.prototype.Query("select username,account_status,b.* from dba_users a,dba_profiles b where a.profile=b.profile and resource_name='PASSWORD_LIFE_TIME'",
                        [], {}, onFinished);
                }
                else {
                    throw new Error("Cannot run the current inspection " +
                        "because the dependency oracle component is unavailable");
                }
            });
        componentMgr = null;

        if (inspection.prototype.Verification(next)) {
            next.prototype.Run();
        }
    };

    function onFinished(err, result) {
        if (err) {
            throw err;
        }

        var inspectionResult = require('../../resources/storage/inspection.result');
        var inspectionCollection = require('../../resources/storage/inspection.collection');
        var userPasswordVerification = require('../testingBase_collection/oracle.user.password.verify')();

        inspection.result = {
            "server": "oracle database",
            "check_status": userPasswordVerification.prototype.Check(result),
            "description": inspection.description,
            "result_detail": result
        };
        inspectionResult.FillResult(inspectionCollection.GetGroupName(), inspection.result);

        if (inspectionResult.GetResultCount() === inspectionCollection.Count()) {
            var event = require('../../framework/event/event.provider');
            event.Publish('onInspectionEnd', inspectionResult.GetResult());
            event = null;
        }

        inspectionResult = null;
        inspectionCollection = null;
    }

    return inspection;
}

module.exports = OracleUserPasswordCheck;