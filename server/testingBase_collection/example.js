/**
 * Created by Saron on 2016/5/11.
 */

function Example() {

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
        return false;
    };

    return detector;
}

module.exports = Example;