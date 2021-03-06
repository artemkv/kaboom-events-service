[![CircleCI](https://circleci.com/gh/artemkv/kaboom-events-service.svg?style=svg)](https://circleci.com/gh/artemkv/kaboom-events-service)

Kaboom Events Service

# API

POST to /event to register application launch/crash

Event:
```
	t: type
		S: app start
		C: app crash
	a: unique applicaiton id. Provided upon registration
	u: unique user id. Generated inside the user app
	dt: date and time (on the client)
	m: message
	d: details (Base64-encoded)
```	

Launch event:
```
{"t":"S","a":"9735965b-e1cb-4d7f-adb9-a4adf457f61a","u":"ceb2a540-48c7-40ec-bc22-24ffd54d880d","dt":"2018-12-19T16:36:02.632+01"}
```

Crash event:
```
{"t":"C","a":"9735965b-e1cb-4d7f-adb9-a4adf457f61a","u":"ceb2a540-48c7-40ec-bc22-24ffd54d880d","dt":"2018-12-19T16:46:01.454+01","m":"Hello Exception!","d":"amF2YS5sYW5nLklsbGVnYWxTdGF0ZUV4Y2VwdGlvbjogQ291bGQgbm90IGV4ZWN1dGUgbWV0aG9kIGZvciBhbmRyb2lkOm9uQ2xpY2sKCWF0IGFuZHJvaWQudmlldy5WaWV3JERlY2xhcmVkT25DbGlja0xpc3RlbmVyLm9uQ2xpY2soVmlldy5qYXZhOjUzNzQpCglhdCBhbmRyb2lkLnZpZXcuVmlldy5wZXJmb3JtQ2xpY2soVmlldy5qYXZhOjYyOTQpCglhdCBhbmRyb2lkLnZpZXcuVmlldyRQZXJmb3JtQ2xpY2sucnVuKFZpZXcuamF2YToyNDc3MCkKCWF0IGFuZHJvaWQub3MuSGFuZGxlci5oYW5kbGVDYWxsYmFjayhIYW5kbGVyLmphdmE6NzkwKQoJYXQgYW5kcm9pZC5vcy5IYW5kbGVyLmRpc3BhdGNoTWVzc2FnZShIYW5kbGVyLmphdmE6OTkpCglhdCBhbmRyb2lkLm9zLkxvb3Blci5sb29wKExvb3Blci5qYXZhOjE2NCkKCWF0IGFuZHJvaWQuYXBwLkFjdGl2aXR5VGhyZWFkLm1haW4oQWN0aXZpdHlUaHJlYWQuamF2YTo2NDk0KQoJYXQgamF2YS5sYW5nLnJlZmxlY3QuTWV0aG9kLmludm9rZShOYXRpdmUgTWV0aG9kKQoJYXQgY29tLmFuZHJvaWQuaW50ZXJuYWwub3MuUnVudGltZUluaXQkTWV0aG9kQW5kQXJnc0NhbGxlci5ydW4oUnVudGltZUluaXQuamF2YTo0MzgpCglhdCBjb20uYW5kcm9pZC5pbnRlcm5hbC5vcy5aeWdvdGVJbml0Lm1haW4oWnlnb3RlSW5pdC5qYXZhOjgwNykKQ2F1c2VkIGJ5OiBqYXZhLmxhbmcucmVmbGVjdC5JbnZvY2F0aW9uVGFyZ2V0RXhjZXB0aW9uCglhdCBqYXZhLmxhbmcucmVmbGVjdC5NZXRob2QuaW52b2tlKE5hdGl2ZSBNZXRob2QpCglhdCBhbmRyb2lkLnZpZXcuVmlldyREZWNsYXJlZE9uQ2xpY2tMaXN0ZW5lci5vbkNsaWNrKFZpZXcuamF2YTo1MzY5KQoJLi4uIDkgbW9yZQpDYXVzZWQgYnk6IGphdmEubGFuZy5JbGxlZ2FsU3RhdGVFeGNlcHRpb246IEhlbGxvIEV4Y2VwdGlvbiEKCWF0IG5ldC5hcnRlbWt2LmthYm9vbWV2ZW50Z2VuZXJhdG9yLk1haW5BY3Rpdml0eS5vbkdlbmVyaWNFeGNlcHRpb25CdXR0b25DbGljayhNYWluQWN0aXZpdHkuamF2YToyMikKCS4uLiAxMSBtb3JlCg=="}
```

# Environment Variables

```
NODE_PORT=8600
NODE_IP=localhost
KAFKA_BROKER_LIST=localhost:9092
```
