/**
 * Created by Saron on 2016/4/5.
 */

function InspectionModule() {

    if (!(this instanceof InspectionModule)) {
        instance = new InspectionModule();
    }
    else {
        instance = this;
    }

    var instance;
    var BaseModule = require('../../framework/module/base.module');
    instance.prototype = new BaseModule();

    instance.prototype.Initialize = function initialize(app) {

        instance.prototype.RouteManager.RouteConfigure(app,
            "/api/inspection/run", require('../routes/inspection/inspection.route'));

        instance.prototype.RouteManager = null;
        app = null;
    };

    return instance;
}

module.exports = InspectionModule;