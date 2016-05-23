/**
 * Created by Saron on 2016/5/22.
 */

function OracleUserPasswordVerify() {
    "use strict";

    if (!(this instanceof OracleUserPasswordVerify)) {
        detector = new OracleUserPasswordVerify();
    }
    else {
        detector = this;
    }

    var detector;
    var linq = require('linq');
    var utils = require('util');
    var BaseDetector = require('../../business_framework/inspection/inspection.result.detector');
    detector.prototype = new BaseDetector();

    detector.prototype.Check = function check(result) {
        if (utils.isArray(result) && result.length > 0) {
            var finals = linq.from(result).where(function (item) {
                if (item['PROFILE'] != "MONITORING_PROFILE" && item['ACCOUNT_STATUS'] === "OPEN") {
                    return item['LIMIT'] != "UNLIMITED";
                }
            }).toArray();
            if (finals.length > 0) {
                return {
                    "problem_description": "Some accounts have password expiration policy exception, " +
                    "please check these accounts and make sure they are not limit",
                    "verify_result": "Unchecked"
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
        };
    };

    return detector;

}

module.exports = OracleUserPasswordVerify;