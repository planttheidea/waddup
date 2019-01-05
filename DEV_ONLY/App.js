import React from 'react';
import {render} from 'react-dom';

import waddup from '../src';

console.group('subscription assignment');

const subscribeToFoo = (isPublishedOnce = false) => {
  const options = !isPublishedOnce
    ? undefined
    : {
      maxPublishCount: 1,
    };

  return waddup.subscribe('foo', options, ({data, topic}) => {
    console.log('hello world');

    if (data) {
      console.log(`I have data for ${topic}!`, data);
    }
  });
};

const fooId = subscribeToFoo();

console.log(fooId);
console.log(waddup.getSubscriptions('foo'));

waddup.publish('foo');
waddup.publish('foo', {
  foo: 'bar',
});

console.groupEnd('subscription assignment');

console.group('unsubscribe removes item');

waddup.unsubscribe(fooId);
waddup.publish('foo', 'should not be called because it is unsubscribed');
console.log(waddup.getSubscriptions());

console.groupEnd('unsubscribe removes item');

console.group('subscribe with maxPublishCount only publishes once');

subscribeToFoo(true);

waddup.publish('foo');
waddup.publish('foo', "foo called when it shouldn't be");

console.log(waddup.getSubscriptions());

console.groupEnd('subscribe with maxPublishCount only publishes once');

console.group('subscribe to multiple topics');

const multipleIds = waddup.subscribe(['foo', 'bar'], ({data, topic}) => {
  if (data) {
    console.log(`${topic} was called with data `, data);
  } else {
    console.log(`${topic} was called without data `);
  }
});

console.log(multipleIds);
console.log(waddup.getSubscriptions());

waddup.publish('foo', {
  stuff: 'for foo',
});
waddup.publish('bar', {
  stuff: 'for bar',
});

console.groupEnd('subscribe to multiple topics');

console.group('unsubscribe from topic assigned to multiple topics');

waddup.unsubscribe(multipleIds[0]);

waddup.publish('foo');
waddup.publish('bar');

console.log(waddup.getSubscriptions());

console.groupEnd('unsubscribe from topic assigned to multiple topics');

const App = () => <div>App</div>;

const div = document.createElement('div');

div.id = 'app-container';

render(<App />, div);

document.body.appendChild(div);
