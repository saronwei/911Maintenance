/**
 * Created by Saron on 2016/4/6.
 */

function InspectionGroupNameVerify() {

    if (!(this instanceof InspectionGroupNameVerify)) {
        condition = new InspectionGroupNameVerify();
    }
    else {
        condition = this;
    }

    var condition;
    var utils = require('util');
    var BaseCondition = require('../../framework/verification/base.condition');
    condition.prototype = new BaseCondition();

    condition.prototype.Verify = function verify(data) {
        return !utils.isNullOrUndefined(data)
            && data.hasOwnProperty('groupName')
            && !utils.isNullOrUndefined(data['groupName'])
            && data['groupName'] != "";
    };

    condition.prototype.DoError = function doError() {
        var msg = "Cannot run the inspection because of passing the incorrect group name";
        var error = condition.prototype.ErrorFactory.Machining("request_params_error", msg);
        if (utils.isNullOrUndefined(error)) {
            error = new Error(msg);
            error.status = 412;
        }
        msg = null;
        throw error;
    };

    return condition;
}

module.exports = InspectionGroupNameVerify;