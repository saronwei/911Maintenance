/**
 * Created by Saron on 2016/4/5.
 */

function BaseModule() {

    var isEnable = true;
    var utils = require('util');

    return {
        RouteManager: require('../route/route.manage')(),
        SetEnable: setEnable,
        GetEnable: getEnable,
        Initialize: initialize
    };

    function setEnable(value) {
        if (utils.isBoolean(value)) {
            isEnable = value;
        }
    }

    function getEnable() {
        return isEnable;
    }

    function initialize(app) {
    }
}

module.exports = BaseModule;
