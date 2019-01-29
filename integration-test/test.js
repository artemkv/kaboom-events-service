"use strict";

const SERVICE_URL = `http://${process.env.NODE_IP || 'localhost'}:${process.env.NODE_PORT || 8600}`;

const chai = require('chai');
const expect = chai.expect;
const request = require('request');

describe('[REST Api Test Suite]', function () {
    it(':) Health check', function (done) {
        request.get(`${SERVICE_URL}/health`, function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    it(':( Try accessing root', function (done) {
        request.get(SERVICE_URL, function (error, response, body) {
            expect(response.statusCode).to.equal(404);

            let expectedError = {
                error: "Not Found"
            };
            let actual = JSON.parse(body);
            expect(actual).to.deep.equal(expectedError);

            done();
        });
    });

    it(':( Try accessing non-existing page', function (done) {
        request.get(`${SERVICE_URL}/xxx`, function (error, response, body) {
            expect(response.statusCode).to.equal(404);

            let expectedError = {
                error: "Not Found"
            };
            let actual = JSON.parse(body);
            expect(actual).to.deep.equal(expectedError);

            done();
        });
    });

    it(':( Handle error', function (done) {
        request.get(`${SERVICE_URL}/error`, function (error, response, body) {
            expect(response.statusCode).to.equal(500);

            let expectedError = {
                error: "Test error"
            };
            let actual = JSON.parse(body);
            expect(actual).to.deep.equal(expectedError);

            done();
        });
    });

    it(':( Handle REST error', function (done) {
        request.get(`${SERVICE_URL}/resterror`, function (error, response, body) {
            expect(response.statusCode).to.equal(501);

            let expectedError = {
                error: "Not Implemented"
            };
            let actual = JSON.parse(body);
            expect(actual).to.deep.equal(expectedError);

            done();
        });
    });

    it(':) Post start event', function (done) {
        let event = { "t": "S", "a": "9735965b-e1cb-4d7f-adb9-a4adf457f61a", "dt": "2018-12-19T16:36:02.632+01" }
        let options = {
            url: `${SERVICE_URL}/event`,
            headers: {
                'Content-Type': 'application/json'
            },
            body: Buffer.from(JSON.stringify(event))
        };
        request.post(options, function (error, response, body) {
            expect(response.statusCode).to.equal(200);

            done();
        });
    });

    it(':( Post event without type', function (done) {
        let event = { "a": "9735965b-e1cb-4d7f-adb9-a4adf457f61a", "dt": "2018-12-19T16:36:02.632+01" }
        let options = {
            url: `${SERVICE_URL}/event`,
            headers: {
                'Content-Type': 'application/json'
            },
            body: Buffer.from(JSON.stringify(event))
        };
        request.post(options, function (error, response, body) {
            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    it(':( Post event with unknown type', function (done) {
        let event = { "t": "X", "a": "9735965b-e1cb-4d7f-adb9-a4adf457f61a", "dt": "2018-12-19T16:36:02.632+01" }
        let options = {
            url: `${SERVICE_URL}/event`,
            headers: {
                'Content-Type': 'application/json'
            },
            body: Buffer.from(JSON.stringify(event))
        };
        request.post(options, function (error, response, body) {
            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    it(':( Post event without application id', function (done) {
        let event = { "t": "C", "dt": "2018-12-19T16:36:02.632+01" }
        let options = {
            url: `${SERVICE_URL}/event`,
            headers: {
                'Content-Type': 'application/json'
            },
            body: Buffer.from(JSON.stringify(event))
        };
        request.post(options, function (error, response, body) {
            expect(response.statusCode).to.equal(400);
            done();
        });
    });
});