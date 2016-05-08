/**
 * Created by Saron on 2016/4/15.
 */

function PluginsCommandVerify() {

    if (!(this instanceof PluginsCommandVerify)) {
        condition = new PluginsCommandVerify();
    }
    else {
        condition = this;
    }

    var condition;
    var utils = require('util');
    var BaseCondition = require('../../framework/verification/base.condition.js');
    condition.prototype = new BaseCondition();

    condition.prototype.Verify = function verify(data) {
        var authenticationParams = require('../storage/authentication.parameters.js');
        var widget = authenticationParams.GetParameter("plugins");
        authenticationParams = null;
        if (utils.isNullOrUndefined(data)
            || utils.isNullOrUndefined(data['command'])
            || data['command'] == ""
            || utils.isNullOrUndefined(widget)
            || !widget().hasOwnProperty(data['command'])) {
            return false;
        }
    };

    condition.prototype.DoError = function doError() {
        var msg = "Cannot completed the business logic because we cannot find the correct command in current plugins";
        var error = condition.prototype.ErrorFactory.Machining("command_lost_error", msg);
        if (error) {
            error = new Error(msg);
            error.status = 417;
        }
        msg = null;
        throw error;
    };

    return condition;
}

module.exports = PluginsCommandVerify;
