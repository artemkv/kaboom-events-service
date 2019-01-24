"use strict";

const MAX_LENGTH = 10000;

const statusCodes = require('@artemkv/statuscodes');
const statusMessages = require('@artemkv/statusmessages');
const RestError = require('@artemkv/resterror');
const restStats = require('@artemkv/reststats');
const readJsonStream = require('@artemkv/readjsonstream');
const contentTypeParser = require('content-type');
const kafkaConnector = require('./connectorprovider').getKafkaConnector();

const postEvent = function (req, res, next) {
    if (req.method !== 'POST') {
        throw new RestError(statusCodes.MethodNotAllowed, statusMessages.MethodNotAllowed);
    }
    let contentType = req.headers['content-type'];
    if (!contentType) {
        throw new RestError(statusCodes.BadRequest, 'content-type header was not found.');
    }
    let contentTypeParsed = contentTypeParser.parse(contentType);
    if (contentTypeParsed.type !== 'application/json') {
        let message = `invalid value of content-type header. Expected: 'application/json', Actual: ${contentTypeParsed.type}.`;
        throw new RestError(statusCodes.BadRequest, message);
    }

    let promise = new Promise(readJsonStream(req, MAX_LENGTH));

    promise
        .then(function sendToKafka(event) {
            validateEvent(event);
            event.dts = new Date();
            let eventType = getEventType(event);
            let appId = getAppId(event);
            return kafkaConnector.produce(eventType, appId, JSON.stringify(event));
        })
        .then(function done() {
            res.statusCode = statusCodes.OK;
            res.end();

            restStats.countRequestByEndpoint("event");
            restStats.updateResponseStats(req, res);
        })
        .catch(function (err) {
            next(err);
        });
}

function validateEvent(e) {
    if (!e.t) {
        throw new RestError(statusCodes.BadRequest, 'event does not have type specified in property "t".');
    }
    if (!e.a) {
        throw new RestError(statusCodes.BadRequest, 'event does not have appCode specified in property "a".');
    }
}

function getEventType(e) {
    if (e.t == "C") {
        return "crash_event"
    }
    if (e.t == "S") {
        return "launch_event";
    }
    throw new RestError(statusCodes.BadRequest, `Unknown event type ${e.t}. Allowed values: "C" (crash), "S" (start).`);
}

function getAppId(e) {
    return e.a;
}

exports.postEvent = postEvent;