/**
 * Created by Saron on 2016/4/15.
 */

function DbProviderPlugins() {

    if (!(this instanceof DbProviderPlugins)) {
        plugins = new DbProviderPlugins();
    }
    else {
        plugins = this;
    }

    var plugins;
    var BasePlugins = require('./base.plugins');
    plugins.prototype = new BasePlugins();
    plugins.prototype.Query = null;
    plugins.prototype.Get = null;
    plugins.prototype.Upsert = null;
    plugins.prototype.Remove = null;

    return plugins;
}

module.exports = DbProviderPlugins;