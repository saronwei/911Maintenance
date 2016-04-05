/**
 * Created by Saron on 2016/4/5.
 */

function InspectionService() {

    var utils = require('util');

    return {
        OneKeyInspection: oneKeyInspection
    };

    function oneKeyInspection(params) {

        if (utils.isNullOrUndefined(params)) {
            return false;
        }
        var InspectionManager = require('../../../framework/inspection/inspection.manage')(params.center);
        var inspectionCollection = require('../../storage/inspection.collection');
        if (inspectionCollection.Count() > 0) {
            InspectionManager.RunGroup(params.groupName);
        }
    }
}

module.exports = InspectionService;
