var waddup =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	/**
	 * convenience function, returning pure map
	 *
	 * @return {{}}
	 */
	var createBareObject = function createBareObject() {
	    return Object.create(null);
	};
	
	var subscriptions = createBareObject(),
	    ids = createBareObject(),
	    uid = -1;
	
	/**
	 * empty function used for defaults
	 */
	var noop = function noop() {};
	
	/**
	 * get all subscriptions currently in object
	 *
	 * @return {object}
	 */
	var getSubscriptions = function getSubscriptions() {
	    return subscriptions;
	};
	
	/**
	 * based on object passed, get its type in lowercase string format
	 *
	 * @param {any} object
	 * @return {string}
	 */
	var getType = function getType(object) {
	    return Object.prototype.toString.call(object).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
	};
	
	/**
	 * unsubscribe ID from the topic it was originally allocated to if it exists
	 *
	 * @param {string} id
	 */
	var performUnsubscribe = function performUnsubscribe(id) {
	    var topicSubscription = ids[id];
	
	    if (topicSubscription) {
	        var _ids$id = ids[id];
	        var subscription = _ids$id.subscription;
	        var topic = _ids$id.topic;
	
	        var subscribers = subscriptions[topic];
	        var indexOfSubscription = subscribers.indexOf(subscription);
	
	        if (indexOfSubscription !== -1) {
	            subscriptions[topic] = [].concat(_toConsumableArray(subscribers.slice(0, indexOfSubscription)), _toConsumableArray(subscribers.slice(indexOfSubscription + 1)));
	
	            delete ids[id];
	
	            if (!subscriptions[topic].length) {
	                delete subscriptions[topic];
	            }
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
	var performSubscribe = function performSubscribe(topic) {
	    var topicFunction = arguments.length <= 1 || arguments[1] === undefined ? noop : arguments[1];
	    var options = arguments[2];
	
	    var id = ++uid;
	    var subscribers = subscriptions[topic] || [];
	
	    var _options$isPublishedO = options.isPublishedOnce;
	    var isPublishedOnce = _options$isPublishedO === undefined ? false : _options$isPublishedO;
	
	
	    var callTopicFunction = function callTopicFunction(topicCalled, data) {
	        topicFunction(topicCalled, data);
	    };
	    var subscription = !isPublishedOnce ? callTopicFunction : function (topicCalled, data) {
	        callTopicFunction(topicCalled, data);
	
	        performUnsubscribe(id);
	    };
	
	    ids[id] = {
	        subscription: subscription,
	        topic: topic
	    };
	
	    subscriptions[topic] = [].concat(_toConsumableArray(subscribers), [subscription]);
	
	    return id;
	};
	
	/**
	 * trigger call of all functions subscribed to topic, passing the data to it
	 *
	 * @param {string} topic
	 * @param {any} data
	 */
	var publish = function publish(topic, data) {
	    if (!topic) {
	        throw new Error('You must provide a topic to publish.');
	    }
	
	    var subscriptionsToPublish = subscriptions[topic] || [];
	
	    subscriptionsToPublish.forEach(function (subscription) {
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
	var subscribe = function subscribe(topics, fn) {
	    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	
	    var topicsType = getType(topics);
	
	    switch (topicsType) {
	        case 'string':
	            return performSubscribe(topics, fn, options);
	
	        case 'array':
	            return topics.map(function (topic) {
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
	var unsubscribe = function unsubscribe(ids) {
	    var idsType = getType(ids);
	
	    switch (idsType) {
	        case 'number':
	            performUnsubscribe(ids);
	            break;
	
	        case 'array':
	            ids.forEach(function (id) {
	                performUnsubscribe(id);
	            });
	
	            break;
	
	        default:
	            throw new Error('You must pass either the ID or an array of IDs to unsubscribe from.');
	    }
	};
	
	exports.getSubscriptions = getSubscriptions;
	exports.publish = publish;
	exports.subscribe = subscribe;
	exports.unsubscribe = unsubscribe;
	exports.default = {
	    getSubscriptions: getSubscriptions,
	    publish: publish,
	    subscribe: subscribe,
	    unsubscribe: unsubscribe
	};

/***/ }
/******/ ]);
//# sourceMappingURL=waddup.js.map