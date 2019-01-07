"use strict";

const MAX_LENGTH = 10000;

const statusCodes = require('@artemkv/statuscodes');
const statusMessages = require('@artemkv/statusmessages');
const RestError = require('@artemkv/resterror');
const restStats = require('@artemkv/reststats');
const readJsonStream = require('@artemkv/readjsonstream');
const kafkaConnector = require('./kafkaconnector');

const postEvent = function (req, res, next) {
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
            console.log(event); // TODO: remove

            // TODO: correct event type
            return kafkaConnector.produce("eventtype", JSON.stringify(event));
        })
        .then(function done(report) {
            console.log(report); // TODO: remove

            res.statusCode = statusCodes.OK;
            res.end();

            restStats.countRequestByEndpoint("event");
            restStats.updateResponseStats(req, res);
        })
        .catch(function (err) {
            next(err);
        });
}

exports.postEvent = postEvent;