/**
 * Created by Saron on 2016/5/24.
 */

function HardwareMemoryResultVerify() {

    if (!(this instanceof HardwareMemoryResultVerify)) {
        detector = new HardwareMemoryResultVerify();
    }
    else {
        detector = this;
    }

    var detector;
    var BaseDetection = require('../../business_framework/inspection/base.detection');
    detector.prototype = new BaseDetection();

    detector.prototype.Check = function check(result) {
        if (result < 90){
            return {
                "verify_result":"Pass"
            }
        }
        return{
            "problem_description":"High usage",
            "verify_result":"Fail criteria"
        } ;

    };

    return detector;
}

module.exports = HardwareMemoryResultVerify;