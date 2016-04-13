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

    function machining(errorTag, msg) {

        try {
            var file = fs.readFileSync(
                path.join(process.cwd(), 'server', 'configs', 'environment', 'error.define.json'));
            if (!utils.isNullOrUndefined(file) && file.length > 0) {
                var errorDefines = JSON.parse(file.toString());
                file = null;
                for (var i in errorDefines) {
                    var errorDefine = errorDefines[i];
                    if (errorDefine.error_tag == errorTag) {
                        var error = new Error(msg);
                        error.status = errorDefine.status_code;
                        errorDefine = null;
                        return error;
                    }
                    errorDefine = null;
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}

module.exports = ErrorFactory;