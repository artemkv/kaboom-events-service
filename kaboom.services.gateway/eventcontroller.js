"use strict";

const MAX_LENGTH = 10000;

const statusCodes = require('@artemkv/statuscodes');
const statusMessages = require('@artemkv/statusmessages');
const RestError = require('@artemkv/resterror');
const restStats = require('@artemkv/reststats');
const readJsonStream = require('@artemkv/readjsonstream');
const commitLog = require('./commitlog');

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
        .then(function (event) {
            console.log(event); // TODO: remove

            commitLog.addEvent(JSON.stringify(event));

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