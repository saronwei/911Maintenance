/**
 * Created by cnyygydsk on 2016/5/10.
 */
function ClusterResStatusResultVerify() {

    if (!(this instanceof ClusterResStatusResultVerify)) {
        detector = new ClusterResStatusResultVerify();
    }
    else {
        detector = this;
    }

    var detector;
    var BaseDetection = require('../../business_framework/inspection/base.detection');
    detector.prototype = new BaseDetection();

    detector.prototype.Check = function check(result) {
        var n = (result.splice("OFFLINE")).length-1;
        if (n == 2){
            return true;
        }
        return false;
    };

    return detector;
}

module.exports = ClusterResStatusResultVerify;