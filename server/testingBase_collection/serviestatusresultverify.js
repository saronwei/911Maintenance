/**
 * Created by cnyygydsk on 2016/5/10.
 */
function ServiceStatusResultVerify() {

    if (!(this instanceof Example)) {
        detector = new Example();
    }
    else {
        detector = this;
    }

    var detector;
    var BaseDetection = require('../../business_framework/inspection/base.detection');
    detector.prototype = new BaseDetection();

    detector.prototype.Check = function check(result) {
        for (var i = 0;i <= result.length-1;i++){
            if (result[i].Started == false){
                return false;
            }
        }
        return true;
    };

    return detector;
}

module.exports = Example;