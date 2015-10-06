/* Save the local setting or configurations,
 and then every file is this project can use these static resources... */

var config = {

    authorizationPath: __dirname + '/authorization.io',
    authorizationTemplate: '?LOCAL AUTHORIZATION INFORMATION\r\n------------------------------------------\r\n\r\nUSERNAME: {0};\r\nPASSWORD: {1};\r\n\r\nGENERATE TIME: {2};',
};

module.exports = config;