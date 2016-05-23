/**
 * Created by Saron on 2016/5/21.
 */

function OracleFileAutoExtensibleVerify() {
    "use strict";

    if (!(this instanceof OracleFileAutoExtensibleVerify)) {
        detector = new OracleFileAutoExtensibleVerify();
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
                return item['AUTOEXTENSIBLE'] != "YES";
            }).toArray();
            if (finals.length > 0) {
                return {
                    "problem_description": "There are some not auto extensible files of oracle database, please check and change the 'AUTOEXTENSIBLE' to the 'YES'",
                    "verify_result": "Failed criteria"
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

module.exports = OracleFileAutoExtensibleVerify;

