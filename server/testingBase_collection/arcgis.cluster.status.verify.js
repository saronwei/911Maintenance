/**
 * Created by Saron on 2016/5/20.
 */

function ArcgisClusterStatusVerify() {
    "use strict";

    if (!(this instanceof ArcgisClusterStatusVerify)) {
        detector = new ArcgisClusterStatusVerify();
    }
    else {
        detector = this;
    }

    var detector;
    var utils = require('util');
    var BaseDetector = require('../../business_framework/inspection/inspection.result.detector');
    detector.prototype = new BaseDetector();

    detector.prototype.Check = function check(result) {

        if (utils.isObject(result) && result.hasOwnProperty('machines') && utils.isArray(result['machines'])) {
            for (var i = 0, j = result['machines']; i < j; i++) {
                var machine = result['machines'][i];
                var verifyResult = machine['configuredState'] === "STARTED" && machine['realTimeState'] === "STARTED";
                if (!verifyResult) {
                    return {
                        "problem_description": "The machine [" + machine['machineName'] + "] in the cluster now is unavailable",
                        "verify_result": "Fail criteria"
                    }
                }
            }
        }
        else {
            return {
                "problem_description": "Cannot verify the result, because lost some important conditions",
                "verify_result": "Unchecked"
            }
        }
        return {
            "verify_result": "Pass"
        }
    };

    return detector;
}

module.exports = ArcgisClusterStatusVerify;