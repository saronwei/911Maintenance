/**
 * Created by cnyygydsk on 2016/5/10.
 */
function HardwareCpuResultVerify() {

    if (!(this instanceof HardwareCpuResultVerify)) {
        detector = new HardwareCpuResultVerify();
    }
    else {
        detector = this;
    }

    var detector;
    var BaseDetection = require('../../business_framework/inspection/base.detection');
    detector.prototype = new BaseDetection();

    detector.prototype.Check = function check(result) {
        return result < 90;
        
    };

    return detector;
}

module.exports = HardwareCpuResultVerify;