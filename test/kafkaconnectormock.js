"use strict";

let lastCallData = {};
let allCallData = {
    counter: 0
};
console.log('initializing connector mock...');

function produce(topicName, key, message) {
    let promise = new Promise(function (resolve, reject) {
        lastCallData.topicName = topicName;
        lastCallData.key = key;
        lastCallData.message = message;

        allCallData.counter++;

        process.nextTick(resolve);
    });

    return promise;
}

exports.allCallData = allCallData;
exports.lastCallData = lastCallData;
exports.produce = produce;