/**
 * Created by Saron on 2016/4/6.
 */

function InspectionResult() {

    var executeResults = [];

    return {
        FillResult: fillResult,
        GetResult: getResult,
        GetResultCount: getResultCount,
        Clear: clear,
        Initialize: initialize
    };

    function fillResult(groupName, result) {

        var utils = require('util');
        var linq = require('linq');
        if (utils.isNullOrUndefined(executeResults)) {
            initialize();
        }
        var final = linq.from(executeResults).where(function (item) {
            return item.name === groupName;
        }).toArray();
        if (final.length === 0) {
            var group = {
                "name": groupName,
                "collection": []
            };
            group.collection.push(result);
            executeResults.push(group);
            group = null;
        }
        else {
            final[0].collection.push(result);
            executeResults.splice(0, 1, final[0]);
        }

        final = null;
        utils = null;
        linq = null;
    }

    function getResult() {
        return executeResults[0];
    }

    function getResultCount() {
        return executeResults[0].collection.length;
    }

    function clear() {
        executeResults = null;
    }

    function initialize() {
        executeResults = [];
    }
}

module.exports = new InspectionResult();