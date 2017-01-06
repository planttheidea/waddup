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
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.unsubscribe = exports.subscribe = exports.publish = exports.getSubscriptions = undefined;
	
	var _isArray = __webpack_require__(2);
	
	var _isArray2 = _interopRequireDefault(_isArray);
	
	var _isFunction = __webpack_require__(3);
	
	var _isFunction2 = _interopRequireDefault(_isFunction);
	
	var _isNumber = __webpack_require__(6);
	
	var _isNumber2 = _interopRequireDefault(_isNumber);
	
	var _isPlainObject = __webpack_require__(8);
	
	var _isPlainObject2 = _interopRequireDefault(_isPlainObject);
	
	var _noop = __webpack_require__(11);
	
	var _noop2 = _interopRequireDefault(_noop);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } // external dependencies
	
	
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
	
	  if (!!~indexOfSubscription) {
	    var updatedSubscriptions = [].concat(_toConsumableArray(subscribers.slice(0, indexOfSubscription)), _toConsumableArray(subscribers.slice(indexOfSubscription + 1)));
	
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
	  var topicFunction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _noop2.default;
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
	
	    subscriptions.set(topic, [].concat(_toConsumableArray(subscribers), [subscriber]));
	
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
	
	  if (subscriptions.has(topic)) {
	    subscriptions.get(topic).forEach(function (subscription) {
	      subscription.fn({
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
	  var fn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _noop2.default;
	
	  if ((0, _isFunction2.default)(options)) {
	    fn = options;
	    options = {};
	  } else if (!(0, _isPlainObject2.default)(options)) {
	    throw new TypeError('Options passed must be a plain object.');
	  }
	
	  if ((0, _isArray2.default)(topics)) {
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
	var unsubscribe = exports.unsubscribe = function unsubscribe(ids) {
	  if ((0, _isNumber2.default)(ids)) {
	    return performUnsubscribe(ids);
	  }
	
	  if ((0, _isArray2.default)(ids)) {
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

/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;
	
	module.exports = isArray;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(4),
	    isObject = __webpack_require__(5);
	
	/** `Object#toString` result references. */
	var asyncTag = '[object AsyncFunction]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    proxyTag = '[object Proxy]';
	
	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  if (!isObject(value)) {
	    return false;
	  }
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 9 which returns 'object' for typed arrays and other constructors.
	  var tag = baseGetTag(value);
	  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
	}
	
	module.exports = isFunction;


/***/ },
/* 4 */
/***/ function(module, exports) {

	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;
	
	/**
	 * Converts `value` to a string using `Object.prototype.toString`.
	 *
	 * @private
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 */
	function objectToString(value) {
	  return nativeObjectToString.call(value);
	}
	
	module.exports = objectToString;


/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return value != null && (type == 'object' || type == 'function');
	}
	
	module.exports = isObject;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(4),
	    isObjectLike = __webpack_require__(7);
	
	/** `Object#toString` result references. */
	var numberTag = '[object Number]';
	
	/**
	 * Checks if `value` is classified as a `Number` primitive or object.
	 *
	 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
	 * classified as numbers, use the `_.isFinite` method.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a number, else `false`.
	 * @example
	 *
	 * _.isNumber(3);
	 * // => true
	 *
	 * _.isNumber(Number.MIN_VALUE);
	 * // => true
	 *
	 * _.isNumber(Infinity);
	 * // => true
	 *
	 * _.isNumber('3');
	 * // => false
	 */
	function isNumber(value) {
	  return typeof value == 'number' ||
	    (isObjectLike(value) && baseGetTag(value) == numberTag);
	}
	
	module.exports = isNumber;


/***/ },
/* 7 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return value != null && typeof value == 'object';
	}
	
	module.exports = isObjectLike;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(4),
	    getPrototype = __webpack_require__(9),
	    isObjectLike = __webpack_require__(7);
	
	/** `Object#toString` result references. */
	var objectTag = '[object Object]';
	
	/** Used for built-in method references. */
	var funcProto = Function.prototype,
	    objectProto = Object.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/** Used to infer the `Object` constructor. */
	var objectCtorString = funcToString.call(Object);
	
	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.8.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
	    return false;
	  }
	  var proto = getPrototype(value);
	  if (proto === null) {
	    return true;
	  }
	  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
	  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
	    funcToString.call(Ctor) == objectCtorString;
	}
	
	module.exports = isPlainObject;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var overArg = __webpack_require__(10);
	
	/** Built-in value references. */
	var getPrototype = overArg(Object.getPrototypeOf, Object);
	
	module.exports = getPrototype;


/***/ },
/* 10 */
/***/ function(module, exports) {

	/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */
	function overArg(func, transform) {
	  return function(arg) {
	    return func(transform(arg));
	  };
	}
	
	module.exports = overArg;


/***/ },
/* 11 */
/***/ function(module, exports) {

	/**
	 * This method returns `undefined`.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.3.0
	 * @category Util
	 * @example
	 *
	 * _.times(2, _.noop);
	 * // => [undefined, undefined]
	 */
	function noop() {
	  // No operation performed.
	}
	
	module.exports = noop;


/***/ }
/******/ ]);
//# sourceMappingURL=waddup.js.map