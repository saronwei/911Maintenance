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
            var authenticationParams = require('../../resources/storage/authentication.parameters');
            for (var c in conditionCollection) {
                var condition = conditionCollection[c];
                if (!utils.isNullOrUndefined(condition)
                    && condition.prototype && condition.prototype.hasOwnProperty('Verify')) {
                    var result = condition.prototype.Verify(data);
                    var isCorrect = utils.isBoolean(result) ? result : result.verifyResult;
                    if (!isCorrect && condition.prototype.hasOwnProperty('DoError')) {
                        condition.prototype.DoError();
                        continue;
                    }
                    if (result.hasOwnProperty('passParam')) {
                        authenticationParams.PassParameters(result.passParam);
                    }
                    isCorrect = null;
                    result = null;
                }
                condition = null;
            }
            authenticationParams.ReleaseAll();
            authenticationParams = null;
            conditionCollection = null;
        }
    }
}

module.exports = VerificationProvider;