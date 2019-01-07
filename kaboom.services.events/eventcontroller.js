"use strict";

const MAX_LENGTH = 10000;

const statusCodes = require('@artemkv/statuscodes');
const statusMessages = require('@artemkv/statusmessages');
const RestError = require('@artemkv/resterror');
const restStats = require('@artemkv/reststats');
const readJsonStream = require('@artemkv/readjsonstream');
const kafkaConnector = require('./kafkaconnector');

const postEvent = function (req, res, next) {
    // TODO: think about CORS

    if (req.method !== 'POST') {
        throw new RestError(statusCodes.MethodNotAllowed, statusMessages.MethodNotAllowed);
    }
    let contentType = req.headers['content-type'];
    if (contentType !== 'application/json') {
        throw new RestError(statusCodes.BadRequest, statusMessages.BadRequest);
    }

    let promise = new Promise(readJsonStream(req, MAX_LENGTH));

    promise
        .then(function sendToKafka(event) {
            validateEvent(event);
            let eventType = getEventType(event);
            return kafkaConnector.produce(eventType, eventType, JSON.stringify(event));
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
        throw new RestError(statusCodes.BadRequest, statusMessages.BadRequest);
    }
    if (!e.a) {
        throw new RestError(statusCodes.BadRequest, statusMessages.BadRequest);
    }
}

function getEventType(e) {
    if (e.t == "C") {
        return "crash_event"
    }
    if (e.t == "S") {
        return "launch_event";
    }
    throw new RestError(statusCodes.BadRequest, statusMessages.BadRequest);
}

exports.postEvent = postEvent;