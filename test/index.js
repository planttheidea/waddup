import test from 'ava';
import sinon from 'sinon';

import {
  getSubscriptions,
  publish,
  subscribe,
  unsubscribe,
} from '../src';

let subscription, subscriptionFunction;

test('if getSubscriptions returns the appropriate starting subscriptions', (t) => {
  const subscriptions = getSubscriptions();

  t.true(subscriptions instanceof global.Map);
});

test('if subscribe adds subscription', (t) => {
  const topic = 'foo';

  subscription = subscribe(topic);

  t.is(subscription, 0);

  const subscriptions = getSubscriptions(topic);

  t.true(subscriptions && subscriptions.constructor === Object);

  t.true(Array.isArray(subscriptions.subscribers));
  t.is(subscriptions.topic, topic);

  const subscriber = subscriptions.subscribers[0];

  t.deepEqual(subscriber.options, {});
  t.is(subscriber.publishCount, 0);
});

test('if publishing will fire stub', (t) => {
  subscriptionFunction = sinon.spy();

  const topic = {
    foo: 'bar',
  };
  const data = {
    data: 'for foo',
  };

  subscription = subscribe(topic, subscriptionFunction);

  publish(topic, data);

  t.true(subscriptionFunction.calledOnce);

  const [arg] = subscriptionFunction.getCall(0).args;

  t.deepEqual(arg, {
    data,
    topic,
  });
});

test('if unsubscribe will remove subscription', (t) => {
  subscriptionFunction = sinon.spy();

  const topic = 123;

  subscription = subscribe(topic);

  const subscriptions = getSubscriptions();

  t.true(subscriptions.has(topic));

  unsubscribe(subscription);

  t.false(subscriptions.has(topic));

  publish(topic);

  t.false(subscriptionFunction.called);
});
