import React from "react"
// import { renderToString } from "react-dom/server"
// import { StaticRouter, matchPath } from "react-router-dom"
// import serialize from "serialize-javascript"
// import App from '../shared/App'
// import routes from '../shared/routes'

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 9400;
process.env.MONGO_HOST = process.env.MONGO_HOST || '192.168.1.81';
process.env.JWT_EXPIRE = process.env.JWT_EXPIRE || 200;

var _ = require('lodash');
var path = require('path');

var express = require('express');
var config = require('core-npm').config;
var db = require('core-npm').mongoose;



var app = express();

config.root = path.normalize(__dirname + '/..');
// expose the function to start the server instance
app.startServer = startServer;
app.serverShutdown = serverShutdown;

// Setup Express
require('core-npm').express(app);

var coreNPM = require('core-npm');


/////configure routes for frontend UI routing////////
// app.use('/api/users', coreNPM.userRoutes());

// Setup Routes
require('../../server/routes')(app);

// register the shutdown handler to close the database connection on interrupt signals
process
.on('SIGINT', serverShutdown)
.on('SIGTERM', serverShutdown);



/**
* Create an express http server and return it
* @api private
* @return
*/
function startServer() {
    var server = require('http').createServer(app);
    return server;
}
var coreNPM = require('core-npm');





// start sockets for this instance and start server
app.startServer().listen(app.get('port'), app.get('ip'), function serverStarted() {
    console.log('OPRS App started server on ip %s on port %d, in %s mode',
        app.get('ip'), app.get('port'), app.get('env'));
});



/**
* Shutdown handler
* Closes the database connection on iterrupt and exits the process
* @api private
*/
////enable script if mongodb connection establishment in environment
function serverShutdown() {
    db.connection.close(function connectionClose() {
        console.log('Database connection disconnected through app termination'); 
        process.exit(0);
    });
}