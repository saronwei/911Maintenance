/**
 * Created by Saron on 2016/4/6.
 */

function BaseCondition() {

    return {
        Verify: verify,
        DoError: doError,
        ErrorFactory: require('../error/error.factory')(),
        EventEmitter: require('../event/event.provider')
    };

    function verify(data) {
    }

    function doError() {
    }
}

module.exports = BaseCondition;
