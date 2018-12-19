"use strict";

const connect = require('connect');
const favicon = require('serve-favicon');
const restStats = require('@artemkv/reststats');
const errorHandler = require('@artemkv/errorhandler');
const myRequest = require('@artemkv/myrequest');
const version = require('./myversion');
const eventController = require('./eventcontroller');
const commitLog = require('./commitlog');

let server = connect();

server
    .use(restStats.countRequest)

    // favicon
    .use(favicon('./favicon.ico'))
    
    // Used for testing / health checks
    .use('/error', errorHandler.handleError)
    .use('/resterror', errorHandler.handleRestError)

    // Assemble my request
    .use(myRequest)
    
    // Statistics endpoint
    .use('/stats', restStats.getStats)

    // Do business
    .use('/event', eventController.postEvent)

    // Handles errors
    .use(errorHandler.handle404)
    .use(errorHandler.catchAll);

// Start the server
let env = process.env;
let port = env.NODE_PORT || 8000;
let ip = env.NODE_IP || '192.168.1.5'; // TODO: hard-coded IP
server.listen(port, ip, function () {
    console.log('Application started');
    console.log('http://' + ip + ":" + port + '/');
    restStats.initialize(version);
    commitLog.initialize();
});