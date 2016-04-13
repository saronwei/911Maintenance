/**
 * Created by Saron on 2016/4/5.
 */

function VerificationProvider() {

    var conditionCollection = [];
    var utils = require('util');

    return {
        Attach: attach,
        PerformValidation: performValidation
    };

    function attach(condition) {
        conditionCollection.push(condition);
    }

    function performValidation(data) {
        if (conditionCollection.length > 0) {
            for (var c in conditionCollection) {
                var condition = conditionCollection[c];
                if (!utils.isNullOrUndefined(condition)
                    && condition.prototype && condition.prototype.hasOwnProperty('Verify')) {
                    var result = condition.prototype.Verify(data);
                    if (!result && condition.prototype.hasOwnProperty('DoError')) {
                        condition.prototype.DoError();
                    }
                }
                condition = null;
            }
        }
    }
}

module.exports = VerificationProvider;