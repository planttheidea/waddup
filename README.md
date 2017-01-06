# waddup

### Table of contents
* [Usage](#usage)
* [Size](#size)
* [API](#api)
* [Support](#support)
* [Development](#development)

### Breaking change notice

If you were using v1.x.x, there are a few changes when moving to v2.x.x:
* `Map` polyfill may be required depending on your targeted browser support (check [support])
  * Previously used standard objects, `Map` change was to allow non-string objects
* Subscribe handlers now receive a single parameter, an object with `data` and `topic` as properties
  * Previously received `topic` and then `data` as individual parameters, change was to allow avoidance of topic reference if not needed

### Usage

```javascript
// ES2015
import waddup from 'waddup';

// or you can import individual functions
import {
  getSubscriptions,
  publish,
  subscribe,
  unsubscribe
} from 'waddup';

// CommonJS
const waddup = require('waddup').default;

// script
const waddup = window.waddup;
```

### Size

* Uncompressed: 14.8kB
* Minified: 3.39kB
* Minified and gzipped: 1.5kB

### API

`publish(topic)`

Publish a topic, usually upon some other event. This topic can be subscribed to by an unlimited number of functions, and can be any object type.
* topic `{*}` *required*
  * Any object you want to use as a unique identifier
* data `{*}` *optional*
  * Data that is passed to the second argument of the subscription

```javascript
import {
  publish
} from 'waddup';

const div = document.getElementById('div');

div.addEventListener('click', () => {
  // go classic and use a string
  publish('div-clicked');

  // or use whatever you want
  publish(div, {
    id: div.id
  });
});
```

`subscribe(topic[, options][, fn]])`

*returns `{number}` id of subscription, or `{Array<number>}` of ids based on topic(s) passed*

Subscribe to a topic, so that a specific function you pass in will be executed upon each publishing of that topic.
* topic(s) `{*|Array<*>}` *required*
  * Topic(s) to which you are subscribing
* options `{object}` *optional, defaults to fn*
  * Options passed to subscription action
  * Available options:
    * maxPublishCount `{number}` *defaults to Infinity*
* fn `{function}` *required*
  * Function that will be executed upon each publishing of given topic

```javascript
import {
    subscribe
} from 'waddup';

// do a standard subscription
const div = document.getElementById('div');

const persistentSubscription = subscribe(div, ({data, topic}) => {
  console.log(topic, data);
});

// or provide options
const options = {
  maxPublishCount: 1
};
const oneTimeSubscription = subscribe('div-clicked', options, ({topic}) => {
  console.log(`This callback for ${topic} will only be fired once.`);
});

// or do multiple subscriptions that use the same handler at once
const subscriptions = subscribe([div, 'div-clicked'], ({topic}) => {
  console.log(`${topic} will fire for either one of the published events!`);
});
```

`unsubscribe(id)`

Remove subscription(s) to a topic based on subscription id passed in.
* id(s) `{number|Array<number>}` *required*
  * Single id, or array of ids, to remove subscriptions for

```javascript
import {
  subscribe
  unsubscribe
} from 'waddup';

// unsubscribe a single id
const id = subscribe('foo', () => {});

unsubscribe(id);

// or multiples
const otherId = subscribe('bar', () => {});

unsubscribe([id, otherId]);
```

`getSubscriptions([...topics])`;

*returns `{Array<Object>|Object|Map}` either the complete list of subscriptions, a subset Array of subscriptions, or a single subscription*

Convenience function to see subscriptions that are currently active. If no topics are passed you get the complete list, or if you pass a topic you get that subscription, or if you pass multiple topics you get an Array of matching subscriptions.

```javascript
import {
  getSubscriptions,
  subscribe
} from 'waddup';

const array = ['bar', 'baz'];

subscribe('foo', () => {
  console.log('foo');
});
subscribe(array, () => {
  console.log('array');
});

const subscriptions = getSubscriptions(); // Map {"foo" => 
```

### Support

Support for the following browsers natively:
* Edge (all)
* Chrome
* Chrome for Android
* Firefox
* Firefox Mobile
* Opera (25+)
* Safari (7.1+)
* Safari Mobile (8+)
* Internet Explorer (11+)

Support for the following browsers when including polyfill for [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map):
* Opera (15-)
* Safari (7-)
* Safari Mobile (7.1-)
* Internet Explorer (9-10)
* Android Browser (all)
* Opera Mobile (all)

### Development

Standard practice, clone the repo and `npm i` to get the dependencies. The following npm scripts are available:
* build => build unminified dist version with source map and NODE_ENV=development via webpack
* build-minified => build minified dist version with NODE_ENV=production via webpack
* dev => start webpack playground App for eyeball testing
* lint => run ESLint on all files in `src` folder (also runs on `dev` script)
* prepublish => run `lint`, `test`, `transpile`, `build`, and `build-minified` scripts
* test => run AVA with NODE_ENV=test on all files in `test` folder
* test:watch => run same script as `test` but keep persistent watcher
* transpile => run Babel on all files in `src` folder (transpiled to `lib` folder)
