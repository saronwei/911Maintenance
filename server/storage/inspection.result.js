/**
 * Created by Saron on 2016/4/6.
 */

function InspectionResult() {

    var executeResults = [];

    return {
        FillResult: fillResult,
        GetResult: getResult,
        Clear: clear,
        Initialize: initialize
    };

    function fillResult(inspection) {
        executeResults.push(inspection);
    }

    function getResult() {
        return executeResults;
    }

    function clear() {
        executeResults = null;
    }

    function initialize() {
        executeResults = [];
    }
}

module.exports = new InspectionResult();