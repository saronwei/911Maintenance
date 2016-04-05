/**
 * Created by Saron on 2016/4/6.
 */

function GlobalEventEmitter() {

    var EventEmitter = require('events').EventEmitter;
    var event = new EventEmitter();

    return {
        Listen: event.on,
        Publish: event.emit
    }
}

module.exports = GlobalEventEmitter();