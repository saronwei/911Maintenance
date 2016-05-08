/**
 * Created by Saron on 2016/4/5.
 */

function InspectionStore() {

    var collection = [];
    var linq = require('linq');

    return {
        Count: count,
        GetInspections: getInspections,
        PushToInspections: pushToInspections
    };

    function count() {
        return collection.length;
    }

    function getInspections() {
        return collection;
    }

    function pushToInspections(group) {

        var result = linq.from(collection).where(function (item) {
            //noinspection JSUnresolvedVariable
            return item ? item.inspection.aliasname == group.inspection.aliasname : false;
        }).toArray();
        if (result.length == 0) {
            collection.push(group);
        }
    }
}

module.exports = new InspectionStore();