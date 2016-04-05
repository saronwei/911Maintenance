/**
 * Created by Saron on 2016/4/5.
 */

function ModuleManager() {

    var fs = require('fs');
    var utils = require('util');

    return {
        "Build": build
    };

    function build(app, path) {

        var modules = fs.readdirSync(path);
        if (!utils.isNullOrUndefined(modules) && modules.length > 0) {

            for (var i = 0, j = modules.length; i < j; i++) {
                var f = modules[i];
                var module = require(path + f)();
                if (utils.isNullOrUndefined(module) ||
                    utils.isNullOrUndefined(module.prototype) ||
                    module.prototype.hasOwnProperty('GetEnable') && !module.prototype.GetEnable()) {
                    f = null;
                    module = null;
                    continue;
                }
                if (module.prototype.hasOwnProperty('Initialize')) {
                    module.prototype.Initialize(app);
                }
                f = null;
            }
        }
    }
}

module.exports = ModuleManager;