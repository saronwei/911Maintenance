/**
 * Created by Saron on 2016/4/5.
 */

function RouteManager() {

    return {
        RouteConfigure: routeConfigure
    };

    function routeConfigure(app, uri, route) {
        console.log(uri);
        app.use(uri, route);
    }
}

module.exports = RouteManager;