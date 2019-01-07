"use strict";

const dotenv = require('dotenv');
const kafka = require('node-rdkafka');

dotenv.config();

function produce(key, message) {
    var producer = new kafka.Producer({
        'client.id': 'kaboom.services.events',
        'metadata.broker.list': process.env.KAFKA_BROKER_LIST,
        'dr_cb': true // specifies that we want a delivery-report event to be generated
    });

    let promise = new Promise(function (resolve, reject) {
        producer.connect();
        producer.setPollInterval(100);

        producer.on('ready', function () {
            try {
                producer.produce(
                    // Topic name
                    'launch_event', // TODO:
                    // Optionally we can manually specify a partition for the message
                    // this defaults to -1 - which will use librdkafka's default partitioner
                    // (consistent random for keyed messages, random for unkeyed messages)
                    null,
                    // Message to send. Must be a buffer
                    Buffer.from(message),
                    // Optional key
                    key,
                    // You can send a timestamp here. If your broker version supports it,
                    // it will get added. Otherwise, we default to 0
                    Date.now()
                );
            } catch (err) {
                reject(err);
            }
        });

        // To use this event, you must set request.required.acks to 1 or -1 in topic configuration
        producer.on('delivery-report', function (err, report) {
            if (err) {
                reject(err);
            }
            resolve(report);
        });

        // Any errors we encounter, including connection errors
        producer.on('event.error', function (err) {
            reject(err);
        })
    });

    return promise;
}

exports.produce = produce;