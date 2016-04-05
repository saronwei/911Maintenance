/**
 * Created by Saron on 2016/4/5.
 */

function BaseModule() {

    return {
        RouteManager: require('../route/route.manage')(),
        SetEnable: setEnable,
        GetEnable: getEnable,
        Initialize: initialize
    };

    function setEnable(value) {
    }

    function getEnable() {
        return true;
    }

    function initialize(app) {
    }
}

module.exports = BaseModule;
