/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _srtTable = __webpack_require__(2);

	var _srtProcessing = __webpack_require__(5);

	var srtTable = new _srtTable.SrtTable();
	var srtProcessing = new _srtProcessing.SrtProcessing('#srtFile');

	srtProcessing.events.on('data', function (content) {
	    srtTable.createTable('#table-container', content);

	    srtTable.events.on('changedData', function (data) {
	        console.log('Data was changed', data);
	        srtProcessing.downloadFile(data);
	    });
	}).on('error', function (error) {
	    console.error(error);
	});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.SrtTable = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _srtRow = __webpack_require__(3);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var EventEmitter = __webpack_require__(4);

	/*--------private section-----------*/

	function _initRowEventsListeners(row) {
	    var _this = this;

	    row.events.on('edited', function () {
	        _this.events.emit('changedData', _this.data);
	    });
	    row.events.on('deleted', function (data) {
	        var index = _this.data.findIndex(function (item) {
	            return item.id === data.id;
	        });
	        if (!!~index) {
	            _this.data.splice(index, 1);
	            _this.events.emit('changedData', _this.data);
	        }
	    });
	}

	function _createTable(containerBlock) {
	    var table = containerBlock.querySelector('table');
	    if (table) {
	        containerBlock.removeChild(table);
	    }

	    table = document.createElement('table');
	    table.classList.add('table');

	    return table;
	}

	function _createRow(table, index, data) {
	    var row = new _srtRow.Row(table, index, data[index], {
	        deleteAllowed: index !== data.length - 1
	    });

	    this.rows.push(row);

	    return row;
	}

	/*--------public section-----------*/

	var SrtTable = exports.SrtTable = function () {
	    function SrtTable() {
	        _classCallCheck(this, SrtTable);

	        this.data = {};
	        this.rows = [];
	        this.events = new EventEmitter();
	    }

	    _createClass(SrtTable, [{
	        key: 'createTable',
	        value: function createTable(container, data) {
	            this.data = data;

	            var containerBlock = document.querySelector(container);
	            var table = _createTable.call(this, containerBlock);

	            new _srtRow.HeaderRow(table);

	            for (var trNum = 0; trNum < data.length; trNum++) {
	                var row = _createRow.call(this, table, trNum, data);
	                _initRowEventsListeners.call(this, row);
	            }

	            containerBlock.appendChild(table);
	        }
	    }]);

	    return SrtTable;
	}();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var EventEmitter = __webpack_require__(4);

	/*--------private section-----------*/

	function _initHeader(table) {
	    var _this = this;

	    var row = table.insertRow(-1);
	    ['ID', 'Start time', 'End time', 'Text', 'Actions'].forEach(function (title) {
	        var cell = row.insertCell(-1);
	        _initCell.call(_this, cell, title);
	    });
	}

	function _initCell(cell, data, field) {
	    if (data) {
	        var span = document.createElement('span');

	        span.innerHTML = data;
	        cell.appendChild(span);

	        var input = null;
	        if (field === 'text') {
	            span.classList.add('edit-span');

	            input = document.createElement('input');
	            input.classList.add('form-control', 'edit-input', 'hide');
	            input.value = data;

	            cell.appendChild(input);
	        }
	    }
	}

	function _initActionButtons(cell) {
	    var _this2 = this;

	    this.btnEdit = _createButton.call(this, cell, ['btn', 'btn-primary', 'mr-2', 'edit-btn'], 'Edit');
	    this.btnSave = _createButton.call(this, cell, ['btn', 'btn-success', 'mr-2', 'hide'], 'Save');
	    this.btnCancel = _createButton.call(this, cell, ['btn', 'btn-secondary', 'mr-2', 'hide'], 'Cancel');

	    if (this.params.deleteAllowed) {
	        this.btnDelete = _createButton.call(this, cell, ['btn', 'btn-danger'], 'Delete');
	    }

	    this.btnEdit.addEventListener('click', function () {
	        return _edit.call(_this2);
	    });
	    this.btnCancel.addEventListener('click', function () {
	        return _cancel.call(_this2);
	    });
	    this.btnSave.addEventListener('click', function () {
	        return _save.call(_this2);
	    });

	    if (this.btnDelete) {
	        this.btnDelete.addEventListener('click', function () {
	            return _delete.call(_this2);
	        });
	    }
	}

	function _createButton(cell, classes, text) {
	    var _btn$classList;

	    var btn = document.createElement('button');
	    (_btn$classList = btn.classList).add.apply(_btn$classList, _toConsumableArray(classes));
	    btn.innerText = text;

	    cell.appendChild(btn);

	    return btn;
	}

	function _edit() {
	    this.element.querySelector('.edit-span').classList.add('hide');
	    this.element.querySelector('.edit-input').classList.remove('hide');

	    this.btnEdit.classList.add('hide');
	    this.btnSave.classList.remove('hide');

	    this.btnCancel.classList.remove('hide');
	    if (this.btnDelete) {
	        this.btnDelete.classList.add('hide');
	    }
	}

	function _cancel() {
	    this.element.querySelector('.edit-span').classList.remove('hide');
	    this.element.querySelector('.edit-input').classList.add('hide');

	    this.btnSave.classList.add('hide');
	    this.btnEdit.classList.remove('hide');

	    this.btnCancel.classList.add('hide');
	    if (this.btnDelete) {
	        this.btnDelete.classList.remove('hide');
	    }
	}

	function _save() {
	    var input = this.element.querySelector('.edit-input');
	    if (input) {
	        this.data.text = input.value;

	        this.element.classList.add('table-warning');
	        this.element.querySelector('.edit-span').innerHTML = input.value;

	        this.events.emit('edited', this.data);

	        _cancel.call(this);
	    }
	}

	function _delete() {
	    this.element.remove();
	    this.events.emit('deleted', this.data);
	}

	/*--------public section-----------*/

	var Row = exports.Row = function Row(table, index, data, params) {
	    _classCallCheck(this, Row);

	    this.element = null;
	    this.index = null;
	    this.data = null;
	    this.params = {};
	    this.btnCancel = null;
	    this.btnDelete = null;
	    this.btnSave = null;
	    this.btnEdit = null;
	    this.events = new EventEmitter();

	    this.index = index;
	    this.data = data;
	    this.params = params;

	    var row = this.element = table.insertRow(-1);
	    row.setAttribute('data-id', data['id']);

	    for (var property in data) {
	        if (data.hasOwnProperty(property)) {
	            var _cell = row.insertCell(-1);
	            _initCell.call(this, _cell, data[property], property);
	        }
	    }

	    var cell = row.insertCell(-1);
	    _initCell.call(this, cell, null);
	    _initActionButtons.call(this, cell);
	};

	var HeaderRow = exports.HeaderRow = function HeaderRow(table) {
	    _classCallCheck(this, HeaderRow);

	    _initHeader.call(this, table);
	};

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	var R = typeof Reflect === 'object' ? Reflect : null
	var ReflectApply = R && typeof R.apply === 'function'
	  ? R.apply
	  : function ReflectApply(target, receiver, args) {
	    return Function.prototype.apply.call(target, receiver, args);
	  }

	var ReflectOwnKeys
	if (R && typeof R.ownKeys === 'function') {
	  ReflectOwnKeys = R.ownKeys
	} else if (Object.getOwnPropertySymbols) {
	  ReflectOwnKeys = function ReflectOwnKeys(target) {
	    return Object.getOwnPropertyNames(target)
	      .concat(Object.getOwnPropertySymbols(target));
	  };
	} else {
	  ReflectOwnKeys = function ReflectOwnKeys(target) {
	    return Object.getOwnPropertyNames(target);
	  };
	}

	function ProcessEmitWarning(warning) {
	  if (console && console.warn) console.warn(warning);
	}

	var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
	  return value !== value;
	}

	function EventEmitter() {
	  EventEmitter.init.call(this);
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._eventsCount = 0;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	var defaultMaxListeners = 10;

	Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
	  enumerable: true,
	  get: function() {
	    return defaultMaxListeners;
	  },
	  set: function(arg) {
	    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
	      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
	    }
	    defaultMaxListeners = arg;
	  }
	});

	EventEmitter.init = function() {

	  if (this._events === undefined ||
	      this._events === Object.getPrototypeOf(this)._events) {
	    this._events = Object.create(null);
	    this._eventsCount = 0;
	  }

	  this._maxListeners = this._maxListeners || undefined;
	};

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
	  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
	    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
	  }
	  this._maxListeners = n;
	  return this;
	};

	function $getMaxListeners(that) {
	  if (that._maxListeners === undefined)
	    return EventEmitter.defaultMaxListeners;
	  return that._maxListeners;
	}

	EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
	  return $getMaxListeners(this);
	};

	EventEmitter.prototype.emit = function emit(type) {
	  var args = [];
	  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
	  var doError = (type === 'error');

	  var events = this._events;
	  if (events !== undefined)
	    doError = (doError && events.error === undefined);
	  else if (!doError)
	    return false;

	  // If there is no 'error' event listener then throw.
	  if (doError) {
	    var er;
	    if (args.length > 0)
	      er = args[0];
	    if (er instanceof Error) {
	      // Note: The comments on the `throw` lines are intentional, they show
	      // up in Node's output if this results in an unhandled exception.
	      throw er; // Unhandled 'error' event
	    }
	    // At least give some kind of context to the user
	    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
	    err.context = er;
	    throw err; // Unhandled 'error' event
	  }

	  var handler = events[type];

	  if (handler === undefined)
	    return false;

	  if (typeof handler === 'function') {
	    ReflectApply(handler, this, args);
	  } else {
	    var len = handler.length;
	    var listeners = arrayClone(handler, len);
	    for (var i = 0; i < len; ++i)
	      ReflectApply(listeners[i], this, args);
	  }

	  return true;
	};

	function _addListener(target, type, listener, prepend) {
	  var m;
	  var events;
	  var existing;

	  if (typeof listener !== 'function') {
	    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
	  }

	  events = target._events;
	  if (events === undefined) {
	    events = target._events = Object.create(null);
	    target._eventsCount = 0;
	  } else {
	    // To avoid recursion in the case that type === "newListener"! Before
	    // adding it to the listeners, first emit "newListener".
	    if (events.newListener !== undefined) {
	      target.emit('newListener', type,
	                  listener.listener ? listener.listener : listener);

	      // Re-assign `events` because a newListener handler could have caused the
	      // this._events to be assigned to a new object
	      events = target._events;
	    }
	    existing = events[type];
	  }

	  if (existing === undefined) {
	    // Optimize the case of one listener. Don't need the extra array object.
	    existing = events[type] = listener;
	    ++target._eventsCount;
	  } else {
	    if (typeof existing === 'function') {
	      // Adding the second element, need to change to array.
	      existing = events[type] =
	        prepend ? [listener, existing] : [existing, listener];
	      // If we've already got an array, just append.
	    } else if (prepend) {
	      existing.unshift(listener);
	    } else {
	      existing.push(listener);
	    }

	    // Check for listener leak
	    m = $getMaxListeners(target);
	    if (m > 0 && existing.length > m && !existing.warned) {
	      existing.warned = true;
	      // No error code for this since it is a Warning
	      // eslint-disable-next-line no-restricted-syntax
	      var w = new Error('Possible EventEmitter memory leak detected. ' +
	                          existing.length + ' ' + String(type) + ' listeners ' +
	                          'added. Use emitter.setMaxListeners() to ' +
	                          'increase limit');
	      w.name = 'MaxListenersExceededWarning';
	      w.emitter = target;
	      w.type = type;
	      w.count = existing.length;
	      ProcessEmitWarning(w);
	    }
	  }

	  return target;
	}

	EventEmitter.prototype.addListener = function addListener(type, listener) {
	  return _addListener(this, type, listener, false);
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.prependListener =
	    function prependListener(type, listener) {
	      return _addListener(this, type, listener, true);
	    };

	function onceWrapper() {
	  var args = [];
	  for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
	  if (!this.fired) {
	    this.target.removeListener(this.type, this.wrapFn);
	    this.fired = true;
	    ReflectApply(this.listener, this.target, args);
	  }
	}

	function _onceWrap(target, type, listener) {
	  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
	  var wrapped = onceWrapper.bind(state);
	  wrapped.listener = listener;
	  state.wrapFn = wrapped;
	  return wrapped;
	}

	EventEmitter.prototype.once = function once(type, listener) {
	  if (typeof listener !== 'function') {
	    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
	  }
	  this.on(type, _onceWrap(this, type, listener));
	  return this;
	};

	EventEmitter.prototype.prependOnceListener =
	    function prependOnceListener(type, listener) {
	      if (typeof listener !== 'function') {
	        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
	      }
	      this.prependListener(type, _onceWrap(this, type, listener));
	      return this;
	    };

	// Emits a 'removeListener' event if and only if the listener was removed.
	EventEmitter.prototype.removeListener =
	    function removeListener(type, listener) {
	      var list, events, position, i, originalListener;

	      if (typeof listener !== 'function') {
	        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
	      }

	      events = this._events;
	      if (events === undefined)
	        return this;

	      list = events[type];
	      if (list === undefined)
	        return this;

	      if (list === listener || list.listener === listener) {
	        if (--this._eventsCount === 0)
	          this._events = Object.create(null);
	        else {
	          delete events[type];
	          if (events.removeListener)
	            this.emit('removeListener', type, list.listener || listener);
	        }
	      } else if (typeof list !== 'function') {
	        position = -1;

	        for (i = list.length - 1; i >= 0; i--) {
	          if (list[i] === listener || list[i].listener === listener) {
	            originalListener = list[i].listener;
	            position = i;
	            break;
	          }
	        }

	        if (position < 0)
	          return this;

	        if (position === 0)
	          list.shift();
	        else {
	          spliceOne(list, position);
	        }

	        if (list.length === 1)
	          events[type] = list[0];

	        if (events.removeListener !== undefined)
	          this.emit('removeListener', type, originalListener || listener);
	      }

	      return this;
	    };

	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

	EventEmitter.prototype.removeAllListeners =
	    function removeAllListeners(type) {
	      var listeners, events, i;

	      events = this._events;
	      if (events === undefined)
	        return this;

	      // not listening for removeListener, no need to emit
	      if (events.removeListener === undefined) {
	        if (arguments.length === 0) {
	          this._events = Object.create(null);
	          this._eventsCount = 0;
	        } else if (events[type] !== undefined) {
	          if (--this._eventsCount === 0)
	            this._events = Object.create(null);
	          else
	            delete events[type];
	        }
	        return this;
	      }

	      // emit removeListener for all listeners on all events
	      if (arguments.length === 0) {
	        var keys = Object.keys(events);
	        var key;
	        for (i = 0; i < keys.length; ++i) {
	          key = keys[i];
	          if (key === 'removeListener') continue;
	          this.removeAllListeners(key);
	        }
	        this.removeAllListeners('removeListener');
	        this._events = Object.create(null);
	        this._eventsCount = 0;
	        return this;
	      }

	      listeners = events[type];

	      if (typeof listeners === 'function') {
	        this.removeListener(type, listeners);
	      } else if (listeners !== undefined) {
	        // LIFO order
	        for (i = listeners.length - 1; i >= 0; i--) {
	          this.removeListener(type, listeners[i]);
	        }
	      }

	      return this;
	    };

	function _listeners(target, type, unwrap) {
	  var events = target._events;

	  if (events === undefined)
	    return [];

	  var evlistener = events[type];
	  if (evlistener === undefined)
	    return [];

	  if (typeof evlistener === 'function')
	    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

	  return unwrap ?
	    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
	}

	EventEmitter.prototype.listeners = function listeners(type) {
	  return _listeners(this, type, true);
	};

	EventEmitter.prototype.rawListeners = function rawListeners(type) {
	  return _listeners(this, type, false);
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  if (typeof emitter.listenerCount === 'function') {
	    return emitter.listenerCount(type);
	  } else {
	    return listenerCount.call(emitter, type);
	  }
	};

	EventEmitter.prototype.listenerCount = listenerCount;
	function listenerCount(type) {
	  var events = this._events;

	  if (events !== undefined) {
	    var evlistener = events[type];

	    if (typeof evlistener === 'function') {
	      return 1;
	    } else if (evlistener !== undefined) {
	      return evlistener.length;
	    }
	  }

	  return 0;
	}

	EventEmitter.prototype.eventNames = function eventNames() {
	  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
	};

	function arrayClone(arr, n) {
	  var copy = new Array(n);
	  for (var i = 0; i < n; ++i)
	    copy[i] = arr[i];
	  return copy;
	}

	function spliceOne(list, index) {
	  for (; index + 1 < list.length; index++)
	    list[index] = list[index + 1];
	  list.pop();
	}

	function unwrapListeners(arr) {
	  var ret = new Array(arr.length);
	  for (var i = 0; i < ret.length; ++i) {
	    ret[i] = arr[i].listener || arr[i];
	  }
	  return ret;
	}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var FileSaver = __webpack_require__(6);
	var EventEmitter = __webpack_require__(4);

	/*--------private section-----------*/

	function _serialize(rawData) {
	    try {
	        var resultJson = [];
	        var dataArray = rawData.split('\n\r');
	        dataArray.forEach(function (item) {
	            item = item.trim();
	            if (!item) {
	                console.warn('Empty subtitle');
	                return true;
	            }

	            item = item.split('\n').filter(function (item) {
	                return !!item;
	            });
	            if (item.length < 3) {
	                throw new Error('Wrong data');
	            }

	            var id = +item.shift();
	            if (isNaN(id)) {
	                throw new Error('Wrong id');
	            }

	            var time = item.shift().split('-->');
	            if (time.length !== 2) {
	                throw new Error('Wrong time');
	            }

	            resultJson.push({
	                id: id,
	                startTime: time[0].trim(),
	                endTime: time[1].trim(),
	                text: item.join('<br/>')
	            });
	        });

	        return resultJson;
	    } catch (e) {
	        return e;
	    }
	}

	function _deserialize(dataArray) {
	    if (!dataArray.length) {
	        return '';
	    }

	    return dataArray.map(function (item) {
	        return item.id + '\n' + item.startTime + ' --> ' + item.endTime + '\n' + item.text.replace('<br/>', '\n') + '\n';
	    }).join('\r\n');
	}

	/*--------public section-----------*/

	var SrtProcessing = exports.SrtProcessing = function () {
	    function SrtProcessing(element) {
	        _classCallCheck(this, SrtProcessing);

	        this.events = new EventEmitter();

	        var events = this.events;
	        var input = document.querySelector(element);

	        if (!input) {
	            return;
	        }

	        input.addEventListener("click", function () {
	            this.value = '';
	        });

	        input.addEventListener("change", function () {
	            var _this = this;

	            if (this.files && this.files[0]) {
	                var reader = new FileReader();
	                var srtFile = this.files[0];

	                reader.readAsText(srtFile);

	                reader.addEventListener('error', function (e) {
	                    events.emit('error', 'Reading file error');
	                });

	                reader.addEventListener('loadend', function (e) {
	                    if (!e.target.result) {
	                        events.emit('error', 'File is empty');
	                        return;
	                    }

	                    var resultJsonData = _serialize.call(_this, e.target.result);
	                    if (Array.isArray(resultJsonData)) {
	                        events.emit('data', resultJsonData);
	                    } else {
	                        events.emit('error', 'Parsing data error. ' + resultJsonData);
	                    }
	                });
	            }
	        });
	    }

	    _createClass(SrtProcessing, [{
	        key: 'downloadFile',
	        value: function downloadFile(data) {
	            data = _deserialize.call(this, data);
	            saveAs(new Blob([data], {
	                type: 'text/plain;charset=utf-8'
	            }), 'result.srt');
	        }
	    }]);

	    return SrtProcessing;
	}();

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(global) {(function(a,b){if(true)!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (b), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if("undefined"!=typeof exports)b();else{b(),a.FileSaver={exports:{}}.exports}})(this,function(){"use strict";function b(a,b){return"undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(b,c,d){var e=new XMLHttpRequest;e.open("GET",b),e.responseType="blob",e.onload=function(){a(e.response,c,d)},e.onerror=function(){console.error("could not download file")},e.send()}function d(a){var b=new XMLHttpRequest;return b.open("HEAD",a,!1),b.send(),200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"))}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b)}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof global&&global.global===global?global:void 0,a=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href)},4E4),setTimeout(function(){e(j)},0))}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else{var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i)})}}:function(a,b,d,e){if(e=e||open("","_blank"),e&&(e.document.title=e.document.body.innerText="downloading..."),"string"==typeof a)return c(a,b,d);var g="application/octet-stream"===a.type,h=/constructor/i.test(f.HTMLElement)||f.safari,i=/CriOS\/[\d]+/.test(navigator.userAgent);if((i||g&&h)&&"object"==typeof FileReader){var j=new FileReader;j.onloadend=function(){var a=j.result;a=i?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),e?e.location.href=a:location=a,e=null},j.readAsDataURL(a)}else{var k=f.URL||f.webkitURL,l=k.createObjectURL(a);e?e.location=l:location.href=l,e=null,setTimeout(function(){k.revokeObjectURL(l)},4E4)}});f.saveAs=a.saveAs=a,"undefined"!=typeof module&&(module.exports=a)});

	//# sourceMappingURL=FileSaver.min.js.map
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ })
/******/ ]);