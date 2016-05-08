/**
 * Created by Saron on 2016/4/5.
 */

function InspectionService() {

    return {
        OneKeyInspection: oneKeyInspection
    };

    function paramsCheck(params) {

        var verifyProvider = require('../../../framework/verification/verification.provider')();
        var centerVerify = require('../.././verification_collection/inspection.center.verify')();
        var groupVerify = require('../.././verification_collection/inspection.groupName.verify')();

        verifyProvider.Attach(centerVerify);
        verifyProvider.Attach(groupVerify);
        verifyProvider.PerformValidation(params);

        verifyProvider = null;
        centerVerify = null;
        groupVerify = null;
    }

    function oneKeyInspection(params) {

        paramsCheck(params);

        var inspectionManager = require('../../../business_framework/inspection/inspection.manage')(params.center);
        inspectionManager.RunGroup(params.groupName);
        inspectionManager = null;
    }
}

module.exports = InspectionService;
