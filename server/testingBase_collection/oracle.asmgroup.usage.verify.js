/**
 * Created by Saron on 2016/5/22.
 */

function OracleAsmGroupUsageVerify() {
    "use strict";

    if (!(this instanceof OracleAsmGroupUsageVerify)) {
        detector = new OracleAsmGroupUsageVerify();
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
                if (item.hasOwnProperty('FREE_MB')
                    && item.hasOwnProperty('TOTAL_MB')
                    && item['FREE_MB'] / item['TOTAL_MB'] < 0.2) {
                    return {
                        "problem_description": "The asm usage check is failed because the section ["
                        + item['NAME'] + "] space usage percent was under 20%",
                        "verify_result": "Fail criteria"
                    };
                }
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

module.exports = OracleAsmGroupUsageVerify;