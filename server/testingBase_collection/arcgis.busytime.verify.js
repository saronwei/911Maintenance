/**
 * Created by Saron on 2016/5/11.
 */

function ArcgisBusyTimeVerify() {

    "use strict";

    if (!(this instanceof ArcgisBusyTimeVerify)) {
        detector = new ArcgisBusyTimeVerify();
    }
    else {
        detector = this;
    }

    var detector;
    var utils = require('util');
    var BaseDetection = require('../../business_framework/inspection/base.detection');
    detector.prototype = new BaseDetection();

    detector.prototype.Check = function check(result) {

        var final, verifyResult = null;
        if (!utils.isObject(result) && utils.isString(result)) {
            final = JSON.parse(result.toString());
        }
        else{
            final =  result;
        }
        if (final.hasOwnProperty('perMachine')) {
            for (var i = 0, j = final['perMachine'].length; i < j; i++) {
                var machine = final['perMachine'][i];
                verifyResult = machine['totalBusyTime'] / machine['transactions'] / 1000 < 1;
                if (!verifyResult) {
                    return {
                        "problem_description": "The response time of machine ["+ machine['machineName']
                        + "] dose not meet the standard",
                        "verify_result": "Fail criteria"
                    }
                }
            }
        }
        else {
            return {
                "problem_description": "There has no server machines in the arcgis server cluster",
                "verify_result": "Fail criteria"
            }
        }
        if (verifyResult) {
            return {
                "verify_result": "Pass"
            }
        }
    };

    return detector;
}

module.exports = ArcgisBusyTimeVerify;