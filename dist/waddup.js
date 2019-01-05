(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("waddup", [], factory);
	else if(typeof exports === 'object')
		exports["waddup"] = factory();
	else
		root["waddup"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
// external dependencies
var isArray = Array.isArray;


var noop = function noop() {};

var subscriptions = new Map(),
    ids = new Map(),
    uid = -1;

/**
 * get all subscriptions currently in object
 *
 * @return {object}
 */
var getSubscriptions = exports.getSubscriptions = function getSubscriptions() {
  for (var _len = arguments.length, topics = Array(_len), _key = 0; _key < _len; _key++) {
    topics[_key] = arguments[_key];
  }

  if (!topics.length) {
    return subscriptions;
  }

  var retrievedTopics = topics.map(function (topic) {
    return {
      subscribers: subscriptions.get(topic),
      topic: topic
    };
  });

  return retrievedTopics.length === 1 ? retrievedTopics[0] : retrievedTopics;
};

/**
 * unsubscribe ID from the topic it was originally allocated to if it exists
 *
 * @param {number} id
 */
var performUnsubscribe = function performUnsubscribe(id) {
  if (!ids.has(id)) {
    return;
  }

  var _ids$get = ids.get(id),
      subscriber = _ids$get.subscriber,
      topic = _ids$get.topic;

  if (!subscriptions.has(topic)) {
    return;
  }

  var subscribers = subscriptions.get(topic);
  var indexOfSubscription = subscribers.indexOf(subscriber);

  if (~indexOfSubscription) {
    var updatedSubscriptions = subscribers.filter(function (subscriberIgnored, index) {
      return index !== indexOfSubscription;
    });

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
var performSubscribe = function performSubscribe() {
  var topicFunction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;
  var options = arguments[1];
  return function (topic) {
    var id = ++uid;

    var subscribers = subscriptions.has(topic) ? subscriptions.get(topic) : [];
    var subscriber = {
      fn: function fn() {
        topicFunction.apply(undefined, arguments);

        subscriber.publishCount++;

        if (subscriber.publishCount >= subscriber.options.maxPublishCount) {
          performUnsubscribe(id);
        }
      },

      options: options,
      publishCount: 0
    };

    ids.set(id, {
      subscriber: subscriber,
      topic: topic
    });

    subscriptions.set(topic, [].concat(subscribers, [subscriber]));

    return id;
  };
};

/**
 * trigger call of all functions subscribed to topic, passing the data to it
 *
 * @param {*} topic
 * @param {*} [data]
 */
var publish = exports.publish = function publish(topic, data) {
  if (!topic) {
    throw new Error('You must provide a topic to publish.');
  }

  var subscribers = subscriptions.get(topic);

  if (isArray(subscribers)) {
    subscribers.forEach(function (subscription) {
      return subscription.fn({
        data: data,
        topic: topic
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
var subscribe = exports.subscribe = function subscribe(topics) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var fn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;

  var isOptionsFunction = typeof options === 'function';
  var handler = isOptionsFunction ? options : fn;
  var config = isOptionsFunction ? {} : options;

  if (typeof handler === 'function' && config && config.constructor === Object) {
    return isArray(topics) ? topics.map(performSubscribe(handler, config)) : performSubscribe(handler, config)(topics);
  }

  throw new TypeError('Options passed must be a plain object.');
};

/**
 * unsubscribe id(s) from future publishes
 *
 * @param {*} ids
 * @returns {Array<number>|number}
 */
var unsubscribe = exports.unsubscribe = function unsubscribe(ids) {
  if (typeof ids === 'number') {
    return performUnsubscribe(ids);
  }

  if (isArray(ids)) {
    return ids.map(performUnsubscribe);
  }

  throw new TypeError('You must pass either the ID or an array of IDs to unsubscribe from.');
};

exports.default = {
  getSubscriptions: getSubscriptions,
  publish: publish,
  subscribe: subscribe,
  unsubscribe: unsubscribe
};

/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /home/tquetano/git/waddup/src/index.js */"./src/index.js");


/***/ })

/******/ });
});
//# sourceMappingURL=waddup.js.map