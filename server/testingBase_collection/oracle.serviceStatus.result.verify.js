/**
 * Created by cnyygydsk on 2016/5/10.
 */
function OracleServiceStatusResultVerify() {

    if (!(this instanceof OracleServiceStatusResultVerify)) {
        detector = new OracleServiceStatusResultVerify();
    }
    else {
        detector = this;
    }

    var detector;
    var BaseDetection = require('../../business_framework/inspection/base.detection');
    detector.prototype = new BaseDetection();

    detector.prototype.Check = function check(result) {
        if (result.indexOf("online") > 0 || result.indexOf("running") > 0){
            return{
                "verify_result":"Pass"
            }
        }
        return {
            "problem_description":"Server status is wrong",
            "verify_result": "Fail criteria"
        };
        
    };

    return detector;
}

module.exports = OracleServiceStatusResultVerify;