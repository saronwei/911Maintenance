/**
 * Created by Saron on 2016/5/20.
 */

function ArcgisErrorLogsVerify() {
    "use strict";

    if (!(this instanceof ArcgisErrorLogsVerify)) {
        detector = new ArcgisErrorLogsVerify();
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
            && result.hasOwnProperty('messages')
            && utils.isArray(result['messages'])) {
            if (result['messages'].length > 0) {
                return {
                    "problem_description": "There has some error logs, please check the arcgis server status",
                    "verify_result": "Fail criteria"
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

module.exports = ArcgisErrorLogsVerify;