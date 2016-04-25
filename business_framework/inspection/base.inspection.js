/**
 * Created by Saron on 2016/4/5.
 */

function BaseInspection() {

    var utils = require('util');

    return {
        Verification: verification,
        Configure: configure,
        AttachConfig: attachConfig,
        Run: run
    };

    function verification(inspection) {
        return inspection && inspection.prototype && inspection.prototype.hasOwnProperty('Run');
    }

    function configure(outConfig) {
    }

    function attachConfig(inspection, outConfig) {

        if (!utils.isNullOrUndefined(outConfig)) {
            for (var prop in outConfig) {
                if (utils.isNullOrUndefined(inspection[prop])) {
                    inspection[prop] = outConfig[prop];
                }
            }
        }

        return inspection;
    }

    function run() {
    }
}

module.exports = BaseInspection;
