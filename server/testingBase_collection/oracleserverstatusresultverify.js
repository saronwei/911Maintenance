/**
 * Created by cnyygydsk on 2016/5/10.
 */
function OracleServerStatusResultVerify() {

    if (!(this instanceof OracleServerStatusResultVerify)) {
        detector = new OracleServerStatusResultVerify();
    }
    else {
        detector = this;
    }

    var detector;
    var BaseDetection = require('../../business_framework/inspection/base.detection');
    detector.prototype = new BaseDetection();

    detector.prototype.Check = function check(result) {
        if (result.indexOf("online") > 0 || result.indexOf("running") > 0){
            return true;
        }
        return false;
    };

    return detector;
}

module.exports = OracleServerStatusResultVerify;