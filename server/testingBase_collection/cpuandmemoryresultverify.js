/**
 * Created by cnyygydsk on 2016/5/10.
 */
function CpuAndMomeryResultVerify() {

    if (!(this instanceof CpuAndMomeryResultVerify)) {
        detector = new CpuAndMomeryResultVerify();
    }
    else {
        detector = this;
    }

    var detector;
    var BaseDetection = require('../../business_framework/inspection/base.detection');
    detector.prototype = new BaseDetection();

    detector.prototype.Check = function check(result) {
        if (result < 90){
            return true ;
        }
        return false;
    };

    return detector;
}

module.exports = CpuAndMomeryResultVerify;