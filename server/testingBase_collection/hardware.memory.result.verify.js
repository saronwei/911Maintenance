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
        return result < 90;

    };

    return detector;
}

module.exports = HardwareMemoryResultVerify;