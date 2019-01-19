"use strict";

const chai = require('chai');
const expect = chai.expect;
const Readable = require('stream').Readable;

const eventController = require('../eventcontroller');
const kafkaConnector = require('./kafkaconnectormock');

it(':) Post start event', function (done) {
    let event = {
        "t": "S",
        "a": "9735965b-e1cb-4d7f-adb9-a4adf457f61a",
        "u": "User001",
        "dt": "2018-12-19T16:36:02.632+01"
    };

    let req = new Readable();
    req.push(JSON.stringify(event));
    req.push(null);

    req.method = 'POST';
    req.headers = {
        'content-type': 'application/json'
    };

    let res = {
        end: verify
    };

    let counter = kafkaConnector.allCallData.counter;

    function verify(err) {
        if (err) {
            return done(err);
        }

        expect(res.statusCode).to.equal(200);

        expect(kafkaConnector.allCallData.counter).to.equal(counter + 1);
        expect(kafkaConnector.lastCallData.topicName).to.equal('launch_event');
        expect(kafkaConnector.lastCallData.key).to.equal('9735965b-e1cb-4d7f-adb9-a4adf457f61a');
        let actualEvent = JSON.parse(kafkaConnector.lastCallData.message);
        expect(actualEvent.t).to.equal('S');
        expect(actualEvent.a).to.equal('9735965b-e1cb-4d7f-adb9-a4adf457f61a');
        expect(actualEvent.u).to.equal('User001');
        expect(actualEvent.dt).to.equal('2018-12-19T16:36:02.632+01');
        expect(actualEvent.dts).not.be.null;

        return done();
    }

    eventController.postEvent(req, res, verify);
});

it(':) Post crash event', function (done) {
    let event = {
        "t": "C",
        "a": "9735965b-e1cb-4d7f-adb9-a4adf457f61a",
        "u": "User002",
        "dt": "2018-12-19T16:46:01.454+01",
        "m": "Hello Exception K8s!",
        "d": "amF2YS5sYW5nLklsbGVnYWxTdGF0ZUV4Y2VwdGlvbjogQ291bGQgbm90IGV4ZWN1dGUgbWV0aG9kIGZvciBhbmRyb2lkOm9uQ2xpY2sKCWF0IGFuZHJvaWQudmlldy5WaWV3JERlY2xhcmVkT25DbGlja0xpc3RlbmVyLm9uQ2xpY2soVmlldy5qYXZhOjUzNzQpCglhdCBhbmRyb2lkLnZpZXcuVmlldy5wZXJmb3JtQ2xpY2soVmlldy5qYXZhOjYyOTQpCglhdCBhbmRyb2lkLnZpZXcuVmlldyRQZXJmb3JtQ2xpY2sucnVuKFZpZXcuamF2YToyNDc3MCkKCWF0IGFuZHJvaWQub3MuSGFuZGxlci5oYW5kbGVDYWxsYmFjayhIYW5kbGVyLmphdmE6NzkwKQoJYXQgYW5kcm9pZC5vcy5IYW5kbGVyLmRpc3BhdGNoTWVzc2FnZShIYW5kbGVyLmphdmE6OTkpCglhdCBhbmRyb2lkLm9zLkxvb3Blci5sb29wKExvb3Blci5qYXZhOjE2NCkKCWF0IGFuZHJvaWQuYXBwLkFjdGl2aXR5VGhyZWFkLm1haW4oQWN0aXZpdHlUaHJlYWQuamF2YTo2NDk0KQoJYXQgamF2YS5sYW5nLnJlZmxlY3QuTWV0aG9kLmludm9rZShOYXRpdmUgTWV0aG9kKQoJYXQgY29tLmFuZHJvaWQuaW50ZXJuYWwub3MuUnVudGltZUluaXQkTWV0aG9kQW5kQXJnc0NhbGxlci5ydW4oUnVudGltZUluaXQuamF2YTo0MzgpCglhdCBjb20uYW5kcm9pZC5pbnRlcm5hbC5vcy5aeWdvdGVJbml0Lm1haW4oWnlnb3RlSW5pdC5qYXZhOjgwNykKQ2F1c2VkIGJ5OiBqYXZhLmxhbmcucmVmbGVjdC5JbnZvY2F0aW9uVGFyZ2V0RXhjZXB0aW9uCglhdCBqYXZhLmxhbmcucmVmbGVjdC5NZXRob2QuaW52b2tlKE5hdGl2ZSBNZXRob2QpCglhdCBhbmRyb2lkLnZpZXcuVmlldyREZWNsYXJlZE9uQ2xpY2tMaXN0ZW5lci5vbkNsaWNrKFZpZXcuamF2YTo1MzY5KQoJLi4uIDkgbW9yZQpDYXVzZWQgYnk6IGphdmEubGFuZy5JbGxlZ2FsU3RhdGVFeGNlcHRpb246IEhlbGxvIEV4Y2VwdGlvbiEKCWF0IG5ldC5hcnRlbWt2LmthYm9vbWV2ZW50Z2VuZXJhdG9yLk1haW5BY3Rpdml0eS5vbkdlbmVyaWNFeGNlcHRpb25CdXR0b25DbGljayhNYWluQWN0aXZpdHkuamF2YToyMikKCS4uLiAxMSBtb3JlCg=="
    };

    let req = new Readable();
    req.push(JSON.stringify(event));
    req.push(null);

    req.method = 'POST';
    req.headers = {
        'content-type': 'application/json'
    };

    let res = {
        end: verify
    };

    let counter = kafkaConnector.allCallData.counter;

    function verify(err) {
        if (err) {
            return done(err);
        }

        expect(res.statusCode).to.equal(200);

        expect(kafkaConnector.allCallData.counter).to.equal(counter + 1);
        expect(kafkaConnector.lastCallData.topicName).to.equal('crash_event');
        expect(kafkaConnector.lastCallData.key).to.equal('9735965b-e1cb-4d7f-adb9-a4adf457f61a');
        let actualEvent = JSON.parse(kafkaConnector.lastCallData.message);
        expect(actualEvent.t).to.equal('C');
        expect(actualEvent.a).to.equal('9735965b-e1cb-4d7f-adb9-a4adf457f61a');
        expect(actualEvent.u).to.equal('User002');
        expect(actualEvent.dt).to.equal('2018-12-19T16:46:01.454+01');
        expect(actualEvent.m).to.equal('Hello Exception K8s!');
        expect(actualEvent.d).to.equal('amF2YS5sYW5nLklsbGVnYWxTdGF0ZUV4Y2VwdGlvbjogQ291bGQgbm90IGV4ZWN1dGUgbWV0aG9kIGZvciBhbmRyb2lkOm9uQ2xpY2sKCWF0IGFuZHJvaWQudmlldy5WaWV3JERlY2xhcmVkT25DbGlja0xpc3RlbmVyLm9uQ2xpY2soVmlldy5qYXZhOjUzNzQpCglhdCBhbmRyb2lkLnZpZXcuVmlldy5wZXJmb3JtQ2xpY2soVmlldy5qYXZhOjYyOTQpCglhdCBhbmRyb2lkLnZpZXcuVmlldyRQZXJmb3JtQ2xpY2sucnVuKFZpZXcuamF2YToyNDc3MCkKCWF0IGFuZHJvaWQub3MuSGFuZGxlci5oYW5kbGVDYWxsYmFjayhIYW5kbGVyLmphdmE6NzkwKQoJYXQgYW5kcm9pZC5vcy5IYW5kbGVyLmRpc3BhdGNoTWVzc2FnZShIYW5kbGVyLmphdmE6OTkpCglhdCBhbmRyb2lkLm9zLkxvb3Blci5sb29wKExvb3Blci5qYXZhOjE2NCkKCWF0IGFuZHJvaWQuYXBwLkFjdGl2aXR5VGhyZWFkLm1haW4oQWN0aXZpdHlUaHJlYWQuamF2YTo2NDk0KQoJYXQgamF2YS5sYW5nLnJlZmxlY3QuTWV0aG9kLmludm9rZShOYXRpdmUgTWV0aG9kKQoJYXQgY29tLmFuZHJvaWQuaW50ZXJuYWwub3MuUnVudGltZUluaXQkTWV0aG9kQW5kQXJnc0NhbGxlci5ydW4oUnVudGltZUluaXQuamF2YTo0MzgpCglhdCBjb20uYW5kcm9pZC5pbnRlcm5hbC5vcy5aeWdvdGVJbml0Lm1haW4oWnlnb3RlSW5pdC5qYXZhOjgwNykKQ2F1c2VkIGJ5OiBqYXZhLmxhbmcucmVmbGVjdC5JbnZvY2F0aW9uVGFyZ2V0RXhjZXB0aW9uCglhdCBqYXZhLmxhbmcucmVmbGVjdC5NZXRob2QuaW52b2tlKE5hdGl2ZSBNZXRob2QpCglhdCBhbmRyb2lkLnZpZXcuVmlldyREZWNsYXJlZE9uQ2xpY2tMaXN0ZW5lci5vbkNsaWNrKFZpZXcuamF2YTo1MzY5KQoJLi4uIDkgbW9yZQpDYXVzZWQgYnk6IGphdmEubGFuZy5JbGxlZ2FsU3RhdGVFeGNlcHRpb246IEhlbGxvIEV4Y2VwdGlvbiEKCWF0IG5ldC5hcnRlbWt2LmthYm9vbWV2ZW50Z2VuZXJhdG9yLk1haW5BY3Rpdml0eS5vbkdlbmVyaWNFeGNlcHRpb25CdXR0b25DbGljayhNYWluQWN0aXZpdHkuamF2YToyMikKCS4uLiAxMSBtb3JlCg==');
        expect(actualEvent.dts).not.be.null;

        return done();
    }

    eventController.postEvent(req, res, verify);
});