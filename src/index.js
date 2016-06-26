/**
 * convenience function, returning pure map
 *
 * @return {{}}
 */
const createBareObject = () => {
    return Object.create(null);
};

let subscriptions = createBareObject(),
    ids = createBareObject(),
    uid = -1;

/**
 * empty function used for defaults
 */
const noop = () => {};

/**
 * get all subscriptions currently in object
 *
 * @return {object}
 */
const getSubscriptions = () => {
  return subscriptions;
};

/**
 * based on object passed, get its type in lowercase string format
 *
 * @param {any} object
 * @return {string}
 */
const getType = (object) => {
    return Object.prototype.toString.call(object).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
};

/**
 * unsubscribe ID from the topic it was originally allocated to
 *
 * @param {string} id
 */
const performUnsubscribe = (id) => {
    const {
        subscription,
        topic
    } = ids[id];
    const subscribers = subscriptions[topic];
    const indexOfSubscription = subscribers.indexOf(subscription);

    if (indexOfSubscription !== -1) {
        subscriptions[topic] = [
            ...subscribers.slice(0, indexOfSubscription),
            ...subscribers.slice(indexOfSubscription + 1)
        ];

        delete ids[id];

        if (!subscriptions[topic].length) {
            delete subscriptions[topic];
        }
    }
};

/**
 * add function to array of subscriptions and return the id of the subscription
 *
 * @param {string} topic
 * @param {function} topicFunction
 * @param {object} options={}
 * @return {number}
 */
const performSubscribe = (topic, topicFunction = noop, options) => {
    const id = ++uid;
    const subscribers = subscriptions[topic] || [];

    const {
        isPublishedOnce = false
    } = options;

    const callTopicFunction = (topicCalled, data) => {
        topicFunction(topicCalled, data);
    };
    const subscription = !isPublishedOnce ? callTopicFunction : (topicCalled, data) => {
        callTopicFunction(topicCalled, data);

        performUnsubscribe(id);
    };

    ids[id] = {
        subscription,
        topic
    };

    subscriptions[topic] = [
        ...subscribers,
        subscription
    ];

    return id;
};


/**
 * trigger call of all functions subscribed to topic, passing the data to it
 *
 * @param {string} topic
 * @param {any} data
 */
const publish = (topic, data) => {
    if (!topic) {
        throw new Error('You must provide a topic to publish.');
    }

    let subscriptionsToPublish = subscriptions[topic] || [];

    subscriptionsToPublish.forEach((subscription) => {
        subscription(topic, data);
    });
};

/**
 * subscribe fn to topic(s) based on options passed
 *
 * @param {string|array<string>} topics
 * @param {function} fn
 * @param {object} options
 * @return {number|array<number>}
 */
const subscribe = (topics, fn, options = {}) => {
    const topicsType = getType(topics);

    switch (topicsType) {
        case 'string':
            return performSubscribe(topics, fn, options);

        case 'array':
            return topics.map((topic) => {
               return performSubscribe(topic, fn, options);
            });

        default:
            throw new Error('You must pass either the name of the topic or an array of topics to subscribe to.');
    }
};

/**
 * unsubscribe id(s) from future publishes
 *
 * @param {string|array<string>} ids
 */
const unsubscribe = (ids) => {
    const idsType = getType(ids);

    switch (idsType) {
        case 'number':
            performUnsubscribe(ids);
            break;

        case 'array':
            ids.forEach((id) => {
               performUnsubscribe(id);
            });

            break;

        default:
            throw new Error('You must pass either the ID or an array of IDs to unsubscribe from.');
    }
};

export {getSubscriptions};
export {publish};
export {subscribe};
export {unsubscribe};

export default {
    getSubscriptions,
    publish,
    subscribe,
    unsubscribe
};
