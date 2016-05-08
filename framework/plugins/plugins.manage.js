/**
 * Created by Saron on 2016/4/15.
 */

function PluginsManager() {

    var path = require('path');
    var utils = require('util');

    function prerequisitesCheck(name, command) {

        var data = {
            "name": name,
            "command": command
        };
        var verifyProvider = require('../verification/verification.provider')();
        var existVerify = require('../../resources/verification_collection/plugins.exist.verify')();
        var commandVerify = require('../../resources/verification_collection/plugins.command.verify')();

        verifyProvider.Attach(existVerify);
        verifyProvider.Attach(commandVerify);
        verifyProvider.PerformValidation(data);

        data = null;
        verifyProvider = null;
        existVerify = null;
        commandVerify = null;
    }

    return {
        CommandExecute: commandExecute
    };

    function commandExecute(name, command, params, callback) {
        prerequisitesCheck(name, command);

        var plugins = require(path.join(process.cwd(), "public", "resources", "plugins_collection", name))();
        plugins[command](params, function (err, result) {
            plugins.prototype.Release();
            plugins = null;
            if (err && err instanceof Error) {
                var errorFactory = require('../error/error.factory')();
                var error = errorFactory.Machining("plugins_execute_error");
                errorFactory = null;
                if (utils.isNullOrUndefined(error)) {
                    error = new Error("Cannot completed the business logic because there has some inner exceptions");
                    error.status = 417;
                    throw error;
                }
            }
            if (callback) {
                callback(result);
            }
        });
    }

}

module.exports = PluginsManager;