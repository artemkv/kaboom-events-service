"use strict";

const fs = require('fs');
const memdata = require('./memdata');
const dateTimeUtil = require('@artemkv/datetimeutil');

let _commitLogDir = `${__dirname}/commit_log`;

function getFileName() {
    return './commit_log/' + dateTimeUtil.getSortableDate() + '.log';
}

function logEvent(event) {
    fs.appendFile(getFileName(), JSON.stringify(event) + "\n", function (err) {
        // In case of errors, data will be lost. This is current limitation
    });
}

const initialize = function () {
    // Create commit log dir, if doesn't yet exist
    if (!fs.existsSync(_commitLogDir)) {
        fs.mkdirSync(_commitLogDir);
    }

    // Load events // TODO: heavy on memory
    fs.readdirSync(_commitLogDir).sort().forEach(function (file) {
        console.log(`${dateTimeUtil.getTimeStamp()} Loading ${file}...`);
        let log = fs.readFileSync(`${_commitLogDir}/${file}`, 'utf8');
        let records = log.split("\n");
        for (let i = 0, len = records.length; i < len; i++) {
            let json = records[i];
            if (json) {
                let record = JSON.parse(records[i]);
                memdata.addEvent(record);
            }
        }
    });

    console.log(`${dateTimeUtil.getTimeStamp()} All loaded`);
}

const addEvent = function (event) {
    // asynchronously persist on disk in append-only log
    logEvent(event);
    // update in-memory projection
    memdata.addEvent(event);
}

exports.initialize = initialize;
exports.addEvent = addEvent;