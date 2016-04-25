/**
 * Created by Saron on 2016/4/5.
 */

function MemoryUsageRead(next) {

    if (!(this instanceof MemoryUsageRead)) {
        inspection = new MemoryUsageRead(next);
    }
    else {
        inspection = this;
    }

    var inspection;
    inspection.aliasname = "memoryRead";
    var utils = require('util');
    var BaseInspection = require('../../business_framework/inspection/base.inspection');
    inspection.prototype = new BaseInspection();

    inspection.prototype.Configure = function configure(outConfig) {

        inspection.description = "Read the memory usage for the server";
        inspection.tags = ["device_resource"];
        inspection.result = null;

        if (!utils.isNullOrUndefined(outConfig)) {
            inspection = inspection.prototype.AttachConfig(inspection, outConfig);
        }
    };

    inspection.prototype.Run = function run() {

        var isFinal = true;

        console.log("start run the memory usage read inspection");
        // todo: write core logic here, the isFinal logic is used for callback inner,
        // at last i suppose that every logic should be use the callback to return the inspection result
        if (isFinal) {
            var event = require('../../framework/event/event.provider');
            event.Publish("onInspectionEnd", {
                "memory": 0.23
            });
        }

        if (inspection.prototype.Verification(next)) {
            isFinal = false;
            next.prototype.Run();
        }
    };

    return inspection;
}

module.exports = MemoryUsageRead;