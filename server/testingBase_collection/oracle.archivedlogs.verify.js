/**
 * Created by Saron on 2016/5/21.
 */

function OracleArchivedLogsVerify() {
    "use strict";

    if (!(this instanceof OracleArchivedLogsVerify)) {
        detector = new OracleArchivedLogsVerify();
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
            var current = new Date();
            var finals = linq.from(result).where(function (item) {
                return Math.floor((current - item['COMPLETION_TIME']) / (24 * 3600 * 1000)) > 14;
            }).toArray();
            current = null;
            if (finals.length > 0) {
                return {
                    "problem_description": "There are two weeks before records of the archived log, " +
                    "Please check the DP backup strategies or remove these archived logs by manually",
                    "verify_result": "Failed criteria"
                }
            }
        }
        return {
            "verify_result": "pass"
        };
    };

    return detector;
}

module.exports = OracleArchivedLogsVerify;