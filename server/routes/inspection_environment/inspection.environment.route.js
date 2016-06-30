/**
 * Created by Saron on 2016/6/19.
 */

var express = require('express');
var router = express.Router();

router.use('/', function (req, res, next) {
    "use strict";

    var service = require('./inspection.environment.service')();
    service[req.query.api](req.query.center, function (items) {
        var utils = require('util');
        if (utils.isArray(items) && items.length > 0) {
            var result = {
                "inspection_items": items
            };
            res.jsonp(JSON.stringify(result));
        }
        else {
            res.status(404).jsonp(JSON.stringify({
                "error": "There was no inspection items yet"
            }));
        }

    });

    service = null;
});

module.exports = router;