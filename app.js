"use strict";

const dotenv = require('dotenv');
const connect = require('connect');
const favicon = require('serve-favicon');
const restStats = require('@artemkv/reststats');
const errorHandler = require('@artemkv/errorhandler');
const myRequest = require('@artemkv/myrequest');
const requestId = require('./requestid');
const requestTime = require('./requesttime');
const version = require('./myversion');
const eventController = require('./eventcontroller');
const logger = require('./logger');

dotenv.config();

let server = connect();

server
    .use(restStats.countRequest)
    .use(requestTime)
    .use(requestId)

    // favicon
    .use(favicon('./favicon.ico'))

    // Used for testing / health checks
    .use('/error', errorHandler.handleError)
    .use('/resterror', errorHandler.handleRestError)

    // Assemble my request
    .use(myRequest)

    // Log session
    .use(function (req, res, next) {
        logger.logSession(req.my.path);
        return next();
    })

    // Statistics endpoint
    .use('/stats', restStats.getStats)

    // Do business
    .use('/event', eventController.postEvent)

    // Handles errors
    .use(function (err, req, res, next) {
        console.log(err);
        logger.logFailedRequest(req, res, err);
        next(err);
    })
    .use(errorHandler.handle404)
    .use(errorHandler.catchAll);

// Start the server
let env = process.env;
let port = env.NODE_PORT || 8600;
let ip = env.NODE_IP || 'localhost';
server.listen(port, ip, function () {
    console.log('Application started');
    console.log('http://' + ip + ":" + port + '/');
    logger.initialize();
    logger.log('Application started: http://' + ip + ":" + port + '/');
    restStats.initialize(version);
});