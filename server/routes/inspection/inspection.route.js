var express = require('express');
var router = express.Router();

router.use('/', function (req, res, next) {

    var event = require('../../../framework/event/event.provider');

    function onInspectionEnd(result) {

        var inspectionResults = require('../../../resources/storage/inspection.result');
        var inspectionCollection = require('../../../resources/storage/inspection.collection');
        inspectionCollection.Clear();
        inspectionResults.Clear();
        inspectionResults = null;
        inspectionCollection = null;

        // todo : send the inspection results to the client
        res.jsonp(JSON.stringify(result));
        event.CancelListen("onInspectionEnd", onInspectionEnd);
        event = null;
    }

    event.Listen("onInspectionEnd", onInspectionEnd);

    var service = require('./inspection.service')();
    if (service.hasOwnProperty(req.query.api)) {
        // service[req.query.api](req.query);
        var sandbox = require('../../../framework/sandbox/sandbox.launcher');
        sandbox(service[req.query.api], req.query);
    }

    service = null;

});

module.exports = router;

