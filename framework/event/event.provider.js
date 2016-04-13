/**
 * Created by Saron on 2016/4/6.
 */

function GlobalEventEmitter() {

    var EventEmitter = require('events').EventEmitter;
    var event = new EventEmitter();

    return {
        Provider: event,
        Listen: event.on,
        ListenOnce: event.once,
        CancelListen: event.removeListener,
        CancelAll: event.removeAllListeners,
        Publish: event.emit
    }
}

module.exports = GlobalEventEmitter();