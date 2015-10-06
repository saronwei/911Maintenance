/**
 * Created by Saron on 2015/10/2.
 */

var bindingdic = [];

function c_obj() {

    // define the path of route
    var route = '';

    // define the key of the route, search the exactly controller by this property
    var key = '';

    // define controller object
    var value = null;
}

function c_filter(route, key, arr) {
    var j = 0;
    for (var i = 0, l = arr.length; i < l; i++) {
        if (arr[i].route == route && arr[i].key == key) {
            break;
        }
        j++;
    }
    return j;
}

function c_pathConvert(c_path) {
    return c_path.split('$');
}

function executeCore(route, key, f_name, arguments) {
    if (bindingdic == null || bindingdic.length == 0) return false;

    var result = c_filter(route, key, bindingdic);
    var controller = bindingdic[result];
    if (controller != null) {
        if (typeof controller.value[f_name] === 'function') {
            return controller.value[f_name].apply(this, arguments);
        }
    }
}

var controllerEngine = {

    binding: function (route, key, c_content) {

        var result = c_filter(route, key, bindingdic);

        if (result != bindingdic.length) {
            bindingdic[result].value = c_content;
            return;
        }

        if (bindingdic.length == 0 || result == bindingdic.length) {
            var ss = new c_obj();
            ss.key = key;
            ss.value = c_content;
            ss.route = route;
            bindingdic.push(ss);
        }
    },

    execute: function (c_path, arguments) {
        var result = c_pathConvert(c_path);
        if (result == null || result.length == 0) return false;
        executeCore(result[0], result[1], result[2], arguments);
        result = null;
    }
};

module.exports = controllerEngine;