/**
 * Created by Saron on 2016/5/21.
 */

function OracleRecoveryUsageVerify() {
    "use strict";

    if (!(this instanceof OracleRecoveryUsageVerify)) {
        detector = new OracleRecoveryUsageVerify();
    }
    else {
        detector = this;
    }

    var detector;
    var utils = require('util');
    var BaseDetector = require('../../business_framework/inspection/inspection.result.detector');
    detector.prototype = new BaseDetector();

    detector.prototype.Check = function check(result) {
        if (utils.isArray(result) && result.length > 0) {
            for (var i = 0, j = result.length; i < j; i++) {
                var item = result[i];
                if (item.hasOwnProperty('FILE_TYPE') && item['FILE_TYPE'] === "ARCHIVED LOG") {
                    if (item['PERCENT_SPACE_USED'] > 7) {
                        return {
                            "problem_description":"The archived logs were not deleted by DP backup tactics, please check the golden gate service",
                            "verify_result" : "Fail criteria"
                        }
                    }
                    else{
                        return {
                            "verify_result" : "Pass"
                        }
                    }
                }
            }
        }
        else{
            return {
                "problem_description": "Cannot verify the result, because lost some important conditions",
                "verify_result": "Unchecked"
            }
        }
    };

    return detector;
}

module.exports = OracleRecoveryUsageVerify;