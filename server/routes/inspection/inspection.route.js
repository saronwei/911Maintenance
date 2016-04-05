/**
 * Created by Saron on 2016/4/5.
 */

var express = require('express');
var router = express.Router();

router.use('/', function (req, res, next) {

    var event = require('../../../framework/event/event.provider');
    event.Listen("onInspectionEnd", function () {
        // todo : send the inspection results to the client
        res.send({
            "message": "inspection is run over"
        });
    });

    var service = require('./inspection.service')();
    if (service.hasOwnProperty(req.query.api)) {
        service[req.query.api]({
            "center": "quito",
            "groupName": "Common Inspections"
        });
    }

});

module.exports = router;

