/**
 * Created by Saron on 2016/4/8.
 */

function ErrorFactory() {

    var fs = require('fs');
    var path = require('path');
    var utils = require('util');

    return {
        Machining: machining
    };

    /*
     * @errorTag: error tag, use to find and return the right status code
     * @msg: custom message for the error happened
     */
    function machining(errorTag, msg) {

        try {
            var file = fs.readFileSync(path.join(process.cwd(), 'public', 'resources', 'environment', 'error.define.json'));
            if (!utils.isNullOrUndefined(file) && file.length > 0) {
                var errorDefines = JSON.parse(file.toString());
                file = null;
                for (var i in errorDefines) {
                    if (errorDefines[i].error_tag == errorTag) {
                        var error = new Error(msg);
                        error.status = errorDefine.status_code;
                        return error;
                    }
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}

module.exports = ErrorFactory;