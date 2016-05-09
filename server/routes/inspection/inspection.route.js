/**
 * Created by Saron on 2016/4/5.
 */

var express = require('express');
var router = express.Router();

router.use('/', function (req, res, next) {

    var event = require('../../../framework/event/event.provider');

    function onInspectionEnd(result) {

        var inspectionResults = require('../../../resources/storage/inspection.result');
        inspectionResults.Clear();
        inspectionResults = null;
        
        // todo : send the inspection results to the client
        res.send(result);
        event.CancelListen("onInspectionEnd", onInspectionEnd);
        event=null;
    }

    event.Listen("onInspectionEnd", onInspectionEnd);

    var service = require('./inspection.service')();
    if (service.hasOwnProperty(req.query.api)) {
        service[req.query.api](req.query);
        //var sandbox = require('../../../framework/sandbox/sandbox.launcher');
        //sandbox(service[req.query.api], req.query).Release();
    }

    service = null;

});

module.exports = router;

