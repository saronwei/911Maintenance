/**
 * Created by cnyygydsk on 2016/5/10.
 */
function PingStatusResultVerify() {

    if (!(this instanceof PingStatusResultVerify)) {
        detector = new PingStatusResultVerify();
    }
    else {
        detector = this;
    }

    var detector;
    var BaseDetection = require('../../business_framework/inspection/base.detection');
    detector.prototype = new BaseDetection();

    detector.prototype.Check = function check(result) {
        return result == 0;
        
    };

    return detector;
}

module.exports = PingStatusResultVerify;
