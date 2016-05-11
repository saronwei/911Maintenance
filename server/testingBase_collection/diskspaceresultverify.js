/**
 * Created by cnyygydsk on 2016/5/10.
 */
function DiskSpaceResultVerify() {

    if (!(this instanceof DiskSpaceResultVerify)) {
        detector = new DiskSpaceResultVerify();
    }
    else {
        detector = this;
    }

    var detector;
    var BaseDetection = require('../../business_framework/inspection/base.detection');
    detector.prototype = new BaseDetection();

    detector.prototype.Check = function check(result) {
        if (result < 15){
            return true;
        }
        return false;
    };

    return detector;
}

module.exports = DiskSpaceResultVerify;