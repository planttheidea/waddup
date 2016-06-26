waddup
===

A simple publish / subscribe library without dependencies

#### Purpose

To provide straigntforward and multifunctional publish / subscribe capabilities that is not dependent on another library or framework. It is built with the intention of having as minimal a footprint as possible, while still providing versatility in its usage.

#### Usage

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

#### Size

* Uncompressed: 13.3KB
* Minified: 1.83KB
* Minified and gzipped: 997B

**publish**

Publish a topic, usually upon some other event. This topic can be subscribed to by an unlimited number of functions.
* topic `{string}` *required*
  * Unique name given to topic
* data `{any}` *optional*
  * Data that is passed to the second argument of the subscription

```javascript
import {
    publish
} from 'waddup';

var div = document.getElementById('div');

div.addEventListener('click', () => {
  publisH('div-clicked');

  publish('div-clicked-with-id', {
    id: div.id
  });
});
```

**subscribe** 

*returns `{number}` id of subscription, or `{array<number>}` of ids based on topic(s) passed*

Subscribe to a topic, so that a specific function you pass in will be executed upon each publishing of that topic.
* topic(s) `{string|array<string>}` *required*
  * Topic(s) to which you are subscribing
* fn `{function}` *required*
  * Function that will be executed upon each publishing of given topic
* options `{object}` *optional*
  * Options passed to subscription action
  * Available options:
    * isPublishedOnce `{boolean}` *defaults to false*

```javascript
import {
    subscribe
} from 'waddup';

const persistentSubscription = subscribe('div-clicked', (topic, data) => {
    console.log(`${topic} fired with data: `, data);
});

const oneTimeOptions = {
    isPublishedOnce: true
};
const oneTimeSubscription = subscribe('div-clicked', (topic) => {
    console.log(`This callback for ${topic} will only be fired once.`);
), oneTimeOptions);
```

**unsubscribe**

Remove subscription(s) to a topic based on subscription id passed in.
* id(s) `{number|array<number>}` *required*
  * Single id, or array of ids, to remove subscriptions for

```javascript
import {
    unsubscribe
} from 'waddup';

unsubscribe(peristentSubscription);
```

**getSubscriptions**

*returns `{object}` map of `{[topic]: array<object>}` of functions to topic*

Convenience function to see the complete list of subscriptions at any given time

```javascript
import {
    getSubscriptions
} from 'waddup';

const subscriptions = getSubscriptions();

console.log(subscriptions);

/* let's pretend I've added a bunch, so it provides:
{
    foo: [
        fooFunction,
        fooFunction2
    ],
    bar: [
        barFunction
    ]
}
*/
```

#### Development

Standard practice, clone the repo and `npm i` to get the dependencies. The following npm scripts are available:
* build => build unminified dist version with source map and NODE_ENV=development via webpack
* build-minified => build minified dist version with NODE_ENV=production via webpack
* dev => start webpack playground App for eyeball testing
* lint => run ESLint on all files in `src` folder (also runs on `dev` script)
* prepublish => run `lint`, `test`, `transpile`, `build`, and `build-minified` scripts
* test => run AVA with NODE_ENV=test on all files in `test` folder
* test:watch => run same script as `test` but keep persistent watcher
* transpile => run Babel on all files in `src` folder (transpiled to `lib` folder)