/**
 * Created by Saron on 2016/5/20.
 */

function ArcgisServiceStatusVerify() {
    "use strict";

    if (!(this instanceof ArcgisServiceStatusVerify)) {
        detector = new ArcgisServiceStatusVerify();
    }
    else {
        detector = this;
    }

    var detector;
    var utils = require('util');
    var BaseDetector = require('../../business_framework/inspection/inspection.result.detector');
    detector.prototype = new BaseDetector();

    detector.prototype.Check = function check(result) {
        if (utils.isObject(result)
            && result.hasOwnProperty('configuredState')
            && result.hasOwnProperty('realTimeState')) {
            var verifyResult = result['configuredState'] === "STARTED" && result['realTimeState'] === "STARTED";
            if (!verifyResult) {
                return {
                    "problem_description": "The map service status now is stopped, please fix this problem as soon as possible",
                    "verify_result": "Fail criteria"
                };
            }
        }
        else{
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

module.exports = ArcgisServiceStatusVerify;