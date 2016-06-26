import test from 'ava';
import sinon from 'sinon';

import {
    getSubscriptions,
    publish,
    subscribe,
    unsubscribe
} from '../src';

const isArray = (object) => {
    return Object.prototype.toString.call(object) === '[object Array]';
};

let subscription,
    subscriptionFunction;

test('if getSubscriptions returns the appropriate starting subscriptions', (t) => {
    const subscriptions = getSubscriptions();

    t.deepEqual(subscriptions, {});
});

test('if subscribe adds subscription', (t) => {
    subscriptionFunction = sinon.spy();

    subscription = subscribe('foo', subscriptionFunction);

    const subscriptions = getSubscriptions();

    t.is(subscription, 0);
    t.true(isArray(subscriptions.foo));
    t.is(subscriptions.foo.length, 1);
});

test('if publishing will fire stub', (t) => {
    const publishData = {
        data: 'for foo'
    };

    publish('foo', publishData);

    t.true(subscriptionFunction.calledOnce);
    t.true(subscriptionFunction.calledWith('foo'));
    t.deepEqual(subscriptionFunction.getCall(0).args[1], publishData);
});

test('if unsubscribe will remove subscription', (t) => {
    unsubscribe(subscription);

    const subscriptions = getSubscriptions();

    t.deepEqual(subscriptions, {});

    publish('foo');

    t.false(subscriptionFunction.calledTwice);
});