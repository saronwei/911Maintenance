/**
 * Created by Saron on 2016/4/5.
 */

function InspectionStore() {

    var collection = [];
    var linq = require('linq');

    return {
        Count: count,
        GetGroupName: getGroupName,
        GetInspections: getInspections,
        PushToInspections: pushToInspections,
        Clear: clear
    };

    function count() {
        return collection.length;
    }

    function getInspections() {
        return collection;
    }

    function getGroupName() {
        return collection[0].groupName;
    }

    function pushToInspections(group) {

        var result = linq.from(collection).where(function (item) {
            return item ? item.inspection == group.inspection : false;
        }).toArray();
        if (result.length == 0) {
            collection.push(group);
        }
        result = null;
    }

    function clear() {
        collection = null;
        collection = [];
    }
}

module.exports = new InspectionStore();