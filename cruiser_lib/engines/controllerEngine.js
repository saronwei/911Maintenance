/**
 * Created by Saron on 2015/10/2.
 */

function c_obj(){
    var key = '';
    var route = '';
    var value = null;
}

function c_filter(route,key,arr)
{
    var j = 0;
    var result = null;
    for(var i= 0,l= arr.length;i<l;i++)
    {
        if(arr[i].route == route && arr[i].key == key)
        {
            //result = arr[i];
            break;
        }
        j++;
    }
    return j;
}

var controllerEngine = {
    bindingdic: new Array(),
    binding: function (route, key, c_content) {

        var result = c_filter(route,key,this.bindingdic);

        if(result!=this.bindingdic.length){
            this.bindingdic[result].value = c_content;
        }

        if(this.bindingdic.length == 0 || result[0] == this.bindingdic.length)
        {
            var ss = new c_obj();
            ss.key = key;
            ss.value = c_content;
            ss.route = route;
            this.bindingdic.push(ss);
        }
    },

    execute: function(route,key,f_name,arguments){
        if(this.bindingdic == null || this.bindingdic.length == 0) return false;

        var result = c_filter(route,key,this.bindingdic);
        var controller = this.bindingdic[result];
        if(controller != null){
            if(typeof controller.value[f_name] === 'function'){
                //var arg = controller.value[f_name].arguments;
               return controller.value[f_name].apply(this,arguments);
            }
        }
    }
};

module.exports = controllerEngine;