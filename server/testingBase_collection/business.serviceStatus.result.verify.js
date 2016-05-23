/**
 * Created by cnyygydsk on 2016/5/10.
 */
function ServiceStatusResultVerify() {

    if (!(this instanceof ServiceStatusResultVerify)) {
        detector = new ServiceStatusResultVerify();
    }
    else {
        detector = this;
    }

    var detector;
    var BaseDetection = require('../../business_framework/inspection/base.detection');
    detector.prototype = new BaseDetection();

    detector.prototype.Check = function check(result,serviceName) {
        var tag = 0;
        for (var i = 0;i <= result.length-1;i++){
            if (serviceName.indexOf(result[i].Name) >= 0){
                if(result[i].Started == false){
                    return {
                        "problem_description":"Server status is wrong,"+"Please check the status.",
                        "verify_result":"Failed criteria"

                    };
                }
                tag++;
            }
        }
        if (tag == serviceName.length){
            return {
                "verify_result": "Pass"
            };
        }
        tag = null;
        return {
            "problem_description":"In the name of the service configuration section there is an error,"+
                "please check the service name is correct",
            "verify_result":"Failed criteria"
        };
    };

    return detector;
}

module.exports = ServiceStatusResultVerify;