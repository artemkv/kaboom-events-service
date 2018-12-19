"use strict";

const statusCodes = require('@artemkv/statuscodes');
const statusMessages = require('@artemkv/statusmessages');
const RestError = require('@artemkv/resterror');

let readJSON = function (stream, maxLength) {
    let chunks = [];
    let length = 0;

    return function resolver(resolve, reject) {
        stream.on('data', (chunk) => {
            try {
                // Store in memory
                length += chunk.byteLength;
                if (length > maxLength) {
                    reject(new RestError(statusCodes.BadRequest, statusMessages.BadRequest));
                }
                chunks.push(chunk);
            } catch (err) {
                reject(err);
            }
        });
        stream.on('end', () => {
            try {
                let body = Buffer.concat(chunks).toString();
                let json;
                try {
                    json = JSON.parse(body);
                } catch (jsonError) {
                    reject(new RestError(statusCodes.BadRequest, statusMessages.BadRequest));
                }
                resolve(json);
            } catch (err) {
                reject(err);
            }
        });
        stream.on('error', (err) => {
            reject(err);
        });
    }
};

module.exports = readJSON;