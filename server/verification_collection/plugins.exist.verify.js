/**
 * Created by Saron on 2016/4/15.
 */

function PluginsExistVerify() {

    if (!(this instanceof PluginsExistVerify)) {
        condition = new PluginsExistVerify();
    }
    else {
        condition = this;
    }

    var condition;
    var utils = require('util');
    var path = require('path');
    var pluginsName = null;
    var BaseCondition = require('../../framework/verification/base.condition');
    condition.prototype = new BaseCondition();

    condition.prototype.Verify = function verify(data) {

        if (utils.isNullOrUndefined(data) || utils.isNullOrUndefined(data['name']) || data['name'] == "") {
            return false;
        }

        pluginsName = data['name'];
        var pluginsPath = path.join(process.cwd(), 'server', 'plugins_collection');
        var plugins = require(pluginsPath + name);
        return {
            "verifyResult": !utils.isNullOrUndefined(plugins),
            "passParam": {
                "name": "plugins",
                "content": plugins
            }
        }
    };

    condition.prototype.DoError = function doError() {

        var msg = "Cannot completed the business logic because we lost a dependency plugins [" + pluginsName + "]";
        var error = condition.prototype.ErrorFactory.Machining("plugins_lost_error", msg);
        if (utils.isNullOrUndefined(error)) {
            error = new Error(msg);
            error.status = 417;
            msg = null;
        }
        pluginsName = null;
        throw error;
    };

    return condition;
}

module.exports = PluginsExistVerify;
