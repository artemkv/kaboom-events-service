"use strict";

const dotenv = require('dotenv');
const kafka = require('node-rdkafka');

dotenv.config();

function produce(topicName, key, message) {
    var producer = new kafka.Producer({
        'client.id': 'kaboom.services.events',
        'metadata.broker.list': process.env.KAFKA_BROKER_LIST,
        'dr_cb': true // generate delivery-report
    });

    let promise = new Promise(function (resolve, reject) {
        producer.connect();
        producer.setPollInterval(100);

        producer.on('ready', function () {
            try {
                producer.produce(topicName, null, Buffer.from(message), key, Date.now());
            } catch (err) {
                reject(err);
            }
        });

        producer.on('delivery-report', function (err, report) {
            if (err) {
                reject(err);
            }
            resolve(report);
        });

        producer.on('event.error', function (err) {
            reject(err);
        })
    });

    return promise;
}

exports.produce = produce;