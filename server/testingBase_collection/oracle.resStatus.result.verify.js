/**
 * Created by cnyygydsk on 2016/5/10.
 */
function OracleResStatusResultVerify() {

    if (!(this instanceof OracleResStatusResultVerify)) {
        detector = new OracleResStatusResultVerify();
    }
    else {
        detector = this;
    }

    var detector;
    var BaseDetection = require('../../business_framework/inspection/base.detection');
    detector.prototype = new BaseDetection();

    detector.prototype.Check = function check(result) {
        var n = (result.split("OFFLINE")).length-1;
        if(n == 4){
            return {
                "verify_result":"Pass"
            }
        }
        return {
            "problem_description":"Resource Status Error",
            "verify_result":"Fail criteria"
        };
        
    };

    return detector;
}

module.exports = OracleResStatusResultVerify;