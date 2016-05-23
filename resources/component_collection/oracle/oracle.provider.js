/**
 * Created by Saron on 2016/5/11.
 */

function OracleProvider() {
    "use strict";

    if (!(this instanceof OracleProvider)) {
        provider = new OracleProvider();
    }
    else {
        provider = this;
    }

    var provider;
    var conn, oracledb, parentCallback = null;
    var BaseDbProvider = require('../../../framework/component/database/database.provider.js');
    provider.prototype = new BaseDbProvider();

    provider.prototype.Initialize = function init(dbConn, callback) {

        process.env.LOCAL = dbConn.connectionString;
        oracledb = require('oracledb');
        parentCallback = callback;
        oracledb.getConnection(
            {
                user: dbConn.username,
                password: dbConn.password,
                connectionString: dbConn.connectionString
            }, onConnection);
    };

    provider.prototype.Query = function query(statement, params, option, callback) {

        option['outFormat'] = oracledb.OBJECT;

        conn.execute(statement, params, option, function (err, result) {
            if (err) {
                callback(err);
                return;
            }
            provider.prototype.Release();
            callback(null, result.rows);
        });
    };

    provider.prototype.Release = function release() {
        conn.release(function (err) {
            console.log(err);
        });
        conn = null;
        oracledb = null;
    };

    function onConnection(err, connection) {

        if (err) {
            parentCallback(err);
            return;
        }
        if (connection) {
            conn = connection;
            parentCallback(null, provider);
        }
    }

    return provider;
}

module.exports = OracleProvider;