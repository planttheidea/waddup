// external dependencies
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import isNumber from 'lodash/isNumber';
import isPlainObject from 'lodash/isPlainObject';
import noop from 'lodash/noop';

let subscriptions = new Map(),
    ids = new Map(),
    uid = -1;

/**
 * get all subscriptions currently in object
 *
 * @return {object}
 */
export const getSubscriptions = (...topics) => {
  if (!topics.length) {
    return subscriptions;
  }

  const retrievedTopics = topics.map((topic) => {
    return {
      subscribers: subscriptions.get(topic),
      topic
    };
  });

  return retrievedTopics.length === 1 ? retrievedTopics[0] : retrievedTopics;
};

/**
 * unsubscribe ID from the topic it was originally allocated to if it exists
 *
 * @param {number} id
 */
const performUnsubscribe = (id) => {
  if (!ids.has(id)) {
    return;
  }

  const {
    subscriber,
    topic
  } = ids.get(id);

  if (!subscriptions.has(topic)) {
    return;
  }

  const subscribers = subscriptions.get(topic);
  const indexOfSubscription = subscribers.indexOf(subscriber);

  if (!!~indexOfSubscription) {
    const updatedSubscriptions = [
      ...subscribers.slice(0, indexOfSubscription),
      ...subscribers.slice(indexOfSubscription + 1)
    ];

    subscriptions.set(topic, updatedSubscriptions);

    ids.delete(id);

    if (!updatedSubscriptions.length) {
      subscriptions.delete(topic);
    }
  }
};

/**
 * add function to array of subscriptions and return the id of the subscription
 *
 * @param {function} topicFunction
 * @param {Object} options
 * @param {number} [options.maxPublishCount]
 * @return {function(function, Object): number}
 */
const performSubscribe = (topicFunction = noop, options) => {
  return (topic) => {
    const id = ++uid;
    const subscribers = subscriptions.has(topic) ? subscriptions.get(topic) : [];
    const subscriber = {
      fn: (...args) => {
        topicFunction(...args);

        subscriber.publishCount++;

        if (subscriber.publishCount >= subscriber.options.maxPublishCount) {
          performUnsubscribe(id);
        }
      },
      options,
      publishCount: 0
    };

    ids.set(id, {
      subscriber,
      topic
    });

    subscriptions.set(topic, [
      ...subscribers,
      subscriber
    ]);

    return id;
  };
};


/**
 * trigger call of all functions subscribed to topic, passing the data to it
 *
 * @param {*} topic
 * @param {*} [data]
 */
export const publish = (topic, data) => {
  if (!topic) {
    throw new Error('You must provide a topic to publish.');
  }

  if (subscriptions.has(topic)) {
    subscriptions.get(topic).forEach((subscription) => {
      subscription.fn({
        data,
        topic
      });
    });
  }
};

/**
 * subscribe fn to topic(s) based on options passed
 *
 * @param {*} topics
 * @param {function|Object} [options={}]
 * @param {function} [fn=noop]
 * @returns {number|Array<number>}
 */
export const subscribe = (topics, options = {}, fn = noop) => {
  if (isFunction(options)) {
    fn = options;
    options = {};
  } else if (!isPlainObject(options)) {
    throw new TypeError('Options passed must be a plain object.');
  }

  if (isArray(topics)) {
    return topics.map(performSubscribe(fn, options));
  }

  return performSubscribe(fn, options)(topics);
};

/**
 * unsubscribe id(s) from future publishes
 *
 * @param {*} ids
 * @returns {Array<number>|number}
 */
export const unsubscribe = (ids) => {
  if (isNumber(ids)) {
    return performUnsubscribe(ids);
  }

  if (isArray(ids)) {
    return ids.map(performUnsubscribe);
  }

  throw new TypeError('You must pass either the ID or an array of IDs to unsubscribe from.');
};

export default {
  getSubscriptions,
  publish,
  subscribe,
  unsubscribe
};