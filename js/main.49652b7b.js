/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "49652b7ba35227452c27"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
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
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(7)(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AutoZindex_1 = __webpack_require__(9);
const guid_1 = __webpack_require__(10);
// 基础元素
class BasicElement {
    constructor(option) {
        this.x = 0;
        this.y = 0;
        this.offsetX = option.offsetX;
        this.offsetY = option.offsetY;
        this.id = guid_1.default();
        this.zindex = option.zindex ? option.zindex : AutoZindex_1.default.getIndex();
        this.active = false;
        this.event = {};
        this.parent = null;
    }
    updatePosition(x, y) {
        this.x = x;
        this.y = y;
    }
    addEvent(key, fn) {
        this.event[key] = this.event[key] || [];
        this.event[key].push(fn);
    }
    dispatchEvent(key) {
        this.event[key] && this.event[key].forEach((item) => item(this));
    }
}
exports.default = BasicElement;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function flatArrayChildren(array) {
    let res = [];
    function h(arr) {
        arr.forEach((item) => {
            res.push(item);
            item.children && h(item.children);
            item.buildInChildren && h(item.buildInChildren);
        });
    }
    h(array);
    return res;
}
exports.default = flatArrayChildren;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const getElementPoints_1 = __webpack_require__(14);
const isCollision_1 = __webpack_require__(15);
function CheckCollision(elms, elm, type, cb) {
    // 更新优化，碰撞检测消耗很大，这里不用和所有的元素检测，根据elm的范围获取一定范围就行了
    // 这个优化没办法通用，必须根据具体应用去做，比如我们这里，单元格是60，子弹是最大占位是20，那么以子弹为中心，100px外的元素显然是不可能发生碰撞的
    // 比如2个坦克的碰撞，t2.x一定要大于t1.x - 60 不满足这个条件，是不可能碰撞的，都不用检测
    // 这样筛选之后范围可以极大的缩小
    let checkElms = elms.filter(item => {
        return type.includes(item.type) &&
            item.id != elm.id &&
            (item.x > elm.x - 80 && item.y > elm.y - 80 && item.x < elm.x + elm.w + 80 && item.y < elm.y + elm.h + 80);
    });
    // 子弹的检测对象数直接从几百个降低到2-5个
    let p = false;
    for (let i = 0; i < checkElms.length; i++) {
        if (isCollision_1.default(getElementPoints_1.default(checkElms[i]), getElementPoints_1.default(elm))) {
            p = true;
            cb(checkElms[i]);
            break;
        }
    }
    return p;
}
exports.default = CheckCollision;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Timer {
    constructor(fn, interval) {
        this.interval = interval;
        this.fn = fn;
        this.lastTime = 0;
        this.timer = null;
        this.loop(0);
    }
    loop(timestamp) {
        this.timer = requestAnimationFrame(Timer.prototype.loop.bind(this));
        if (timestamp - this.lastTime > this.interval) {
            this.lastTime = timestamp;
            typeof this.fn == "function" && this.fn();
        }
    }
    clear() {
        cancelAnimationFrame(this.timer);
        this.timer = null;
    }
}
exports.default = Timer;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// 配置信息
exports.default = {
    // 关卡
    shut: {
        // 第一关
        one: {
            tuzhuan: [[60, 60], [180, 60], [300, 60], [420, 60], [540, 60], [660, 60],
                [60, 120], [180, 120], [300, 120], [420, 120], [540, 120], [660, 120],
                [60, 180], [180, 180], [300, 180], [420, 180], [540, 180], [660, 180],
                [60, 240], [180, 240], [540, 240], [660, 240],
                [120, 360], [180, 360], [540, 360], [600, 360],
                [60, 480], [180, 480], [540, 480], [660, 480],
                [60, 540], [180, 540], [540, 540], [660, 540],
                [60, 600], [180, 600], [540, 600], [660, 600],
                [60, 660], [180, 660], [540, 660], [660, 660],
                [300, 420], [420, 420],
                [300, 480], [360, 480], [420, 480],
                [300, 540], [420, 540],
                [300, 660], [360, 660], [420, 660],
                [300, 720], [420, 720]],
            tiezhuan: [
                [0, 360], [720, 360],
            ],
            shuizhuan: [
                [300, 300], [420, 300],
            ]
        }
    },
    // 舞台信息
    stage: {
        w: 780,
        h: 780
    },
    // 土砖信息
    tuzhuan: {
        w: 60,
        h: 60
    },
    // 心脏信息
    heart: {
        w: 60,
        h: 60,
        startX: 360,
        startY: 720
    },
    // 我方坦克信息
    tank: {
        w: 60,
        h: 60,
        startX: 480,
        startY: 720
    },
    // 敌方坦克信息
    enemytank: {
        w: 60,
        h: 60
    },
    // 子弹信息
    bullet: {
        w: 10,
        h: 20
    }
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// 坐标系向量
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    // 获取向量的长度
    getLength() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    // 向量相加
    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }
    // 向量相减
    sub(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }
    // 向量点积
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    // 返回法向量
    perp() {
        return new Vector(this.y, -this.x);
    }
    // 单位向量
    unit() {
        let d = this.getLength();
        return d ? new Vector(this.x / d, this.y / d) : new Vector(0, 0);
    }
}
exports.default = Vector;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 子弹，从起点位置到终点位置，中间做碰撞检测，碰撞了就销毁
Object.defineProperty(exports, "__esModule", { value: true });
const BasicElement_1 = __webpack_require__(0);
const CheckCollision_1 = __webpack_require__(2);
const flatArrayChildren_1 = __webpack_require__(1);
const Timer_1 = __webpack_require__(3);
class Bullet extends BasicElement_1.default {
    constructor(option) {
        super(option);
        this.sx = option.sx;
        this.sy = option.sy;
        this.ex = option.ex;
        this.ey = option.ey;
        this.x = this.sx;
        this.y = this.sy;
        this.status = 1;
        this.w = option.w;
        this.h = option.h;
        this.hurt = option.hurt || 1;
        this.direction = option.direction; // 直接初始化传入即可，不再更新，子弹不拐弯
        this.type = "EnemyBullet";
        this.directionImage = {
            "up": "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1cf340800f0e476f8a49c601f77ee3ca~tplv-k3u1fbpfcp-watermark.image?",
            "right": "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70c72db3e5fe4c7fb5102723aaac7fc5~tplv-k3u1fbpfcp-watermark.image?",
            "down": "https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32d4613039964a069e302307b64c46e0~tplv-k3u1fbpfcp-watermark.image?",
            "left": "https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00aa9225712c45979c4ef85913b0f305~tplv-k3u1fbpfcp-watermark.image?",
        };
        this.image = new Image();
        this.image.src = this.directionImage[this.direction];
        this.speed = 10; // 根据这个speed和fps算出dx和dy,
        this.fps = 16;
        // 初始化就发射出去
        this.fire();
    }
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    }
    destroy() {
        this.status = 0;
        this.timer.clear();
        this.parent.remove(this);
    }
    fire() {
        this.timer = new Timer_1.default(() => {
            // 从初始位置逐渐运动到终止位置，这里暂时只处理y，x不变，100次（可以优化成动态速率）
            // this.y += this.ey / 1000
            // 进行碰撞检测
            // 先拿到场景里所有要检测碰撞的元素，这里固定获取TextElm
            // let elms = flatArrayChildren(this.parent.children);
            // let textElms = elms.filter(item => item.type == "TextElm")
            // let p = false
            // for(let i = 0;i < textElms.length;i++) {
            //     if(isCollision(getElementPoints(textElms[i]), getElementPoints(this))) {
            //         p = true
            //         return
            //     }
            // }
            // // 更新 如果碰了，就停止变化，这里只考虑y，因为下面有元素，y就被托住了
            // if(!p) {
            //     this.y += this.ey / 1000
            // }
            // if(this.y >= this.ey) {
            //     this.timer.clear()
            // }
            // 子弹需要考虑碰撞，有子弹对敌方坦克的，也有敌方子弹对我们坦克的，还有子弹对墙体的，墙体还要分类型，子弹还要分等级和类型，这里简化一点，任何东西和子弹对上了，就挂了
            let elms = flatArrayChildren_1.default(this.parent.children);
            let p = CheckCollision_1.default(elms, this, ["Brick", "Tank", "Heart"], (elm) => {
                elm.gotShot(this.hurt);
                this.destroy();
            });
            if (!p) {
                this.x += this.ex - this.sx != 0 ? Math.sign(this.ex - this.sx) * this.speed : 0;
                this.y += this.ey - this.sy != 0 ? Math.sign(this.ey - this.sy) * this.speed : 0;
            }
            if (this.x < -10 || this.x > 1210 || this.y < -10 || this.y > 810) {
                this.destroy();
            }
        }, this.fps);
    }
}
exports.default = Bullet;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Brick_1 = __webpack_require__(8);
const Stage_1 = __webpack_require__(11);
const Tank_1 = __webpack_require__(12);
const Config_1 = __webpack_require__(4);
const Heart_1 = __webpack_require__(19);
const EnemyTank_1 = __webpack_require__(20);
const SteelBrick_1 = __webpack_require__(21);
const WaterBrick_1 = __webpack_require__(22);
const SeniorEnemyTank_1 = __webpack_require__(23);
const Star_1 = __webpack_require__(24);
const Throttle_1 = __webpack_require__(25);
// 初始化一个800 * 700的舞台
let s2 = new Stage_1.default(document.getElementById("stage"));
let allzhuan = Config_1.default.shut.one;
Object.keys(allzhuan).forEach(key => {
    allzhuan[key].forEach(item => {
        if (key == "tuzhuan") {
            let t = new Brick_1.default({
                x: item[0],
                y: item[1],
                w: Config_1.default.tuzhuan.w,
                h: Config_1.default.tuzhuan.h
            });
            s2.add(t);
        }
        if (key == "tiezhuan") {
            let t = new SteelBrick_1.default({
                x: item[0],
                y: item[1],
                w: Config_1.default.tuzhuan.w,
                h: Config_1.default.tuzhuan.h
            });
            s2.add(t);
        }
        if (key == "shuizhuan") {
            let t = new WaterBrick_1.default({
                x: item[0],
                y: item[1],
                w: Config_1.default.tuzhuan.w,
                h: Config_1.default.tuzhuan.h
            });
            s2.add(t);
        }
    });
});
let heart = new Heart_1.default({
    x: Config_1.default.heart.startX,
    y: Config_1.default.heart.startY,
    w: Config_1.default.heart.w,
    h: Config_1.default.heart.h
});
s2.add(heart);
let tank = new Tank_1.default({
    x: Config_1.default.tank.startX,
    y: Config_1.default.tank.startY,
    w: Config_1.default.tank.w,
    h: Config_1.default.tank.h
});
s2.add(tank);
function tankAction(e) {
    switch (e.code) {
        case "ArrowUp":
            tank.setDirection("up");
            tank.move();
            break;
        case "ArrowRight":
            tank.setDirection("right");
            tank.move();
            break;
        case "ArrowDown":
            tank.setDirection("down");
            tank.move();
            break;
        case "ArrowLeft":
            tank.setDirection("left");
            tank.move();
            break;
        case "Space":
            tank.fire();
            break;
        default:
            break;
    }
}
let throttleTankMove = Throttle_1.default(tankAction, 100);
document.getElementById("btn-begin").addEventListener("click", () => {
    document.body.removeChild(document.getElementById("btn-begin"));
    let enemyTanks = [[60, 0], [180, 0], [300, 0], [420, 0]];
    enemyTanks.forEach(item => {
        let t = new EnemyTank_1.default({
            x: item[0],
            y: item[1],
            w: 60,
            h: 60
        });
        t.action();
        s2.add(t);
    });
    let senemyTanks = [[540, 0], [660, 0], [180, 420], [540, 420]];
    senemyTanks.forEach(item => {
        let t = new SeniorEnemyTank_1.default({
            x: item[0],
            y: item[1],
            w: 60,
            h: 60
        });
        t.action();
        s2.add(t);
    });
    // let set = new SeniorEnemyTank({
    //     x: 720,
    //     y: 720,
    //     w: 60,
    //     h: 60
    // })
    // s2.add(set)
    // let set2 = new SeniorEnemyTank({
    //     x: 720,
    //     y: 660,
    //     w: 60,
    //     h: 60
    // })
    // s2.add(set2)
    // let set2 = new EnemyTank({
    //     x: 720,
    //     y: 660,
    //     w: 60,
    //     h: 60
    // })
    // s2.add(set2)
    let star = new Star_1.default({
        x: 480,
        y: 500,
        w: 30,
        h: 30
    });
    s2.add(star);
    document.addEventListener("keydown", throttleTankMove);
});


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BasicElement_1 = __webpack_require__(0);
class Brick extends BasicElement_1.default {
    constructor(option) {
        super({});
        this.x = option.x;
        this.y = option.y;
        this.w = option.w;
        this.h = option.h;
        this.type = "Brick";
        this.image = new Image();
        this.image.src = "https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62326ab976a84c968bef496c1a15b2cb~tplv-k3u1fbpfcp-watermark.image?";
    }
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    }
    gotShot() {
        this.destroy();
    }
    destroy() {
        this.parent.remove(this);
    }
    pointInElement(x, y) {
        // 假设内置close大小为20*20，在元素右上角
        // 这个判断还是要加上offset，更新后，子元素的xy就是container的xy
        return this.x <= x && this.y <= y && this.x + this.w >= x && this.y + this.h >= y;
    }
}
exports.default = Brick;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// 自增的zindex，由于zindex是一个重要的判断点击元素字段，除非用户传递，否则后加入的一律自增，这样就会排在上层
let AutoZindex = (function () {
    class Singleton {
        constructor() {
            this.zindex = 1000;
            this.nindex = 1000;
            this.hindex = 10000;
            if (Singleton.instance) {
                return Singleton.instance;
            }
            return Singleton.instance = this;
        }
        getIndex() {
            return ++this.zindex;
        }
        getNindex() {
            return --this.nindex;
        }
        getHindex() {
            return ++this.hindex;
        }
    }
    var sin = new Singleton();
    return sin;
})();
exports.default = AutoZindex;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function guid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0, v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
exports.default = guid;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const flatArrayChildren_1 = __webpack_require__(1);
// 舞台类
class Stage {
    constructor(canvas) {
        // mouseDown作为事件函数，this指向要处理
        this.mouseDown = (e) => {
            let that = this;
            // 缓存target的位置
            this.clickX = e.offsetX;
            this.clickY = e.offsetY;
            // 根据点击的点，找到在框内的元素（最大zindex，有可能重叠的）
            // 先假设只有rect
            // 把children和children的children拍平，然后判断元素的位置
            this.flatElements = flatArrayChildren_1.default(this.children);
            // 先找到点击的元素（多个）
            let clickElements = this.flatElements.filter((item) => {
                return item.pointInElement && item.pointInElement(e.offsetX, e.offsetY, that.ctx);
            });
            // 再找到zindex最大的那个
            let target = clickElements.find((item) => item.zindex == Math.max(...clickElements.map((item) => item.zindex)));
            // this.clearChildrenActive();
            // console.log(target)
            if (target) {
                // **知道点击了那个taget，应该把target的点击事件处理暴露出去，而不是都丢在这里**
                this.target = target;
                this.target.active = true;
                // 还要处理鼠标点下的位置与target左上角的位置
                this.targetDx = this.clickX - target.x;
                this.targetDy = this.clickY - target.y;
                this.canvas.style.cursor = "all-scroll";
                this.target.dispatchEvent && this.target.dispatchEvent("click");
                this.canvas.addEventListener("mousemove", this.targetMove, false);
            }
        };
        this.targetMove = (e) => {
            let moveX = e.offsetX - this.clickX;
            let moveY = e.offsetY - this.clickY;
            if (Math.abs(moveX) > 5 || Math.abs(moveY) > 5) {
                this.isDrag = true;
            }
            this.target.dispatchEvent && this.target.dispatchEvent("move");
            // 本身可以拖拽的元素
            // 更新，拖拽动作改成自定义事件处理，各元素自行添加move事件
            // Stage.DragElement.indexOf(this.target.type) != -1
            //     ? this.target.updatePosition && this.target.updatePosition(this.clickX + moveX - this.targetDx, this.clickY + moveY - this.targetDy)
            //     : this.target.parent.updatePosition && this.target.parent.updatePosition(
            //           this.clickX + moveX - this.targetDx - this.target.offsetX,
            //           this.clickY + moveY - this.targetDy - this.target.offsetY
            //       );
        };
        // 初始化canvas
        this.canvas = typeof canvas == "string" ? document.getElementById(canvas) : canvas;
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.ctx = this.canvas.getContext("2d");
        this.children = [];
        this.flatElements = [];
        // 当前点击选中的元素
        this.target = null;
        // 点击位置相对canvas的xy偏移量
        this.clickX = null;
        this.clickY = null;
        // 点击位置相对元素的起始位置，比如矩形的左上顶点，圆形的圆心
        this.targetDx = 0;
        this.targetDy = 0;
        // 增加拖拽状态判断，mousemove了才是拖拽，否则只是点击
        this.isDrag = false;
        // 直接可以拖拽的元素，还有一些是要放入container，目前只有container能直接操作，其余都要放入container
        Stage.DragElement = ["container"];
        this.initEvent();
    }
    initEvent() {
        // 先添加down监听，达成条件后再添加move监听
        this.canvas.addEventListener("mousedown", this.mouseDown);
        document.addEventListener("mouseup", () => {
            this.canvas.style.cursor = "";
            if (this.isDrag) {
                this.clearChildrenActive();
                this.isDrag = false;
                // this.target = null
            }
            this.target && this.target.dispatchEvent && this.target.dispatchEvent("mouseup");
            this.target = null;
            this.canvas.removeEventListener("mousemove", this.targetMove, false);
        });
    }
    clearChildrenActive() {
        // 清除所有元素的选中状态
        this.children.forEach((item) => item.setActive(false));
    }
    add(child) {
        this.children.push(child);
        child.parent = this;
        this.render();
    }
    remove(child) {
        let index = this.children.findIndex((item) => item.id == child.id);
        index != -1 && this.children.splice(index, 1);
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1);
    }
    render() {
        requestAnimationFrame(Stage.prototype.render.bind(this));
        this.clear();
        this.children.sort((a, b) => {
            return a.zindex - b.zindex;
        });
        // 渲染子元素的时候，根据zindex来进行先后渲染
        this.children.forEach((item) => item.draw(this.ctx));
    }
}
exports.default = Stage;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BasicElement_1 = __webpack_require__(0);
const Bullet_1 = __webpack_require__(13);
const flatArrayChildren_1 = __webpack_require__(1);
const Config_1 = __webpack_require__(4);
const CheckCollision_1 = __webpack_require__(2);
class Tank extends BasicElement_1.default {
    constructor(option) {
        super({});
        this.x = option.x;
        this.y = option.y;
        this.w = option.w;
        this.h = option.h;
        this.type = "Tank";
        this.direction = "up";
        this.directionImage = {
            "up": "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bca9c499b8174b65b39c462b5cd9139e~tplv-k3u1fbpfcp-watermark.image?",
            "right": "https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d5bd37c406a4ae3932389acb5d486fa~tplv-k3u1fbpfcp-watermark.image?",
            "down": "https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b942170125284efe9789d89e5c0df736~tplv-k3u1fbpfcp-watermark.image?",
            "left": "https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0af07850e9464e9c931e62167bc61547~tplv-k3u1fbpfcp-watermark.image?",
        };
        this.image = new Image();
        this.image.src = this.directionImage[this.direction];
        this.parent = null;
        this.speed = 10;
        this.star = 0;
        this.bullet = null;
    }
    draw(ctx) {
        this.image.src = this.directionImage[this.direction];
        ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    }
    pointInElement(x, y) {
        // 假设内置close大小为20*20，在元素右上角
        // 这个判断还是要加上offset，更新后，子元素的xy就是container的xy
        return this.x <= x && this.y <= y && this.x + this.w >= x && this.y + this.h >= y;
    }
    setDirection(d) {
        this.direction = d;
    }
    gotShot() {
        this.destroy();
    }
    destroy() {
        this.parent.remove(this);
    }
    move() {
        let elms;
        // 即将碰撞，先处理xy，如果碰撞了返还
        switch (this.direction) {
            case "up":
                if (this.y >= this.speed) {
                    this.y -= this.speed;
                }
                elms = flatArrayChildren_1.default(this.parent.children);
                CheckCollision_1.default(elms, this, ["WaterBrick", "SteelBrick", "Brick", "EnemyTank", "SeniorEnemyTank"], (elm) => {
                    this.y += this.speed;
                });
                // 单独加上吃道具逻辑，后续可以扩展
                CheckCollision_1.default(elms, this, ["Star"], (elm) => {
                    elm.eat(this);
                });
                break;
            case "right":
                if (this.x < Config_1.default.stage.w - Config_1.default.tank.w) {
                    this.x += this.speed;
                }
                elms = flatArrayChildren_1.default(this.parent.children);
                CheckCollision_1.default(elms, this, ["WaterBrick", "SteelBrick", "Brick", "EnemyTank", "SeniorEnemyTank"], (elm) => {
                    this.x -= this.speed;
                });
                // 单独加上吃道具逻辑，后续可以扩展
                CheckCollision_1.default(elms, this, ["Star"], (elm) => {
                    elm.eat(this);
                });
                break;
            case "down":
                if (this.y < Config_1.default.stage.h - Config_1.default.tank.h) {
                    this.y += this.speed;
                }
                elms = flatArrayChildren_1.default(this.parent.children);
                CheckCollision_1.default(elms, this, ["WaterBrick", "SteelBrick", "Brick", "EnemyTank", "SeniorEnemyTank"], (elm) => {
                    this.y -= this.speed;
                });
                // 单独加上吃道具逻辑，后续可以扩展
                CheckCollision_1.default(elms, this, ["Star"], (elm) => {
                    elm.eat(this);
                });
                break;
            case "left":
                if (this.x >= this.speed) {
                    this.x -= this.speed;
                }
                elms = flatArrayChildren_1.default(this.parent.children);
                CheckCollision_1.default(elms, this, ["WaterBrick", "SteelBrick", "Brick", "EnemyTank", "SeniorEnemyTank"], (elm) => {
                    this.x += this.speed;
                });
                // 单独加上吃道具逻辑，后续可以扩展
                CheckCollision_1.default(elms, this, ["Star"], (elm) => {
                    elm.eat(this);
                });
                break;
        }
    }
    fire() {
        var _a;
        let opt = {};
        if ((_a = this.bullet) === null || _a === void 0 ? void 0 : _a.status) {
            return;
        }
        switch (this.direction) {
            case "up":
                opt = {
                    sx: this.x + this.w / 2 - Config_1.default.bullet.w / 2,
                    sy: this.y - Config_1.default.bullet.h,
                    ex: this.x + this.w / 2 - Config_1.default.bullet.w / 2,
                    ey: -Config_1.default.bullet.h,
                    w: Config_1.default.bullet.w,
                    h: Config_1.default.bullet.h,
                    direction: "up",
                    hurt: this.star + 1
                };
                break;
            case "right":
                opt = {
                    sx: this.x + this.w,
                    sy: this.y + this.h / 2 - Config_1.default.bullet.w / 2,
                    ex: Config_1.default.stage.w + Config_1.default.bullet.h,
                    ey: this.y + this.h / 2 - Config_1.default.bullet.w / 2,
                    w: Config_1.default.bullet.h,
                    h: Config_1.default.bullet.w,
                    direction: "right",
                    hurt: this.star + 1
                };
                break;
            case "down":
                opt = {
                    sx: this.x + this.w / 2 - Config_1.default.bullet.w / 2,
                    sy: this.y + this.h,
                    ex: this.x + this.w / 2 - Config_1.default.bullet.w / 2,
                    ey: Config_1.default.stage.h + Config_1.default.bullet.h,
                    w: Config_1.default.bullet.w,
                    h: Config_1.default.bullet.h,
                    direction: "down",
                    hurt: this.star + 1
                };
                break;
            case "left":
                opt = {
                    sx: this.x - Config_1.default.bullet.h,
                    sy: this.y + this.h / 2 - Config_1.default.bullet.w / 2,
                    ex: -Config_1.default.bullet.h,
                    ey: this.y + this.h / 2 - Config_1.default.bullet.w / 2,
                    w: Config_1.default.bullet.h,
                    h: Config_1.default.bullet.w,
                    direction: "left",
                    hurt: this.star + 1
                };
                break;
            default:
                break;
        }
        this.bullet = new Bullet_1.default(opt);
        this.parent.add(this.bullet);
    }
}
exports.default = Tank;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 子弹，从起点位置到终点位置，中间做碰撞检测，碰撞了就销毁
Object.defineProperty(exports, "__esModule", { value: true });
const BasicElement_1 = __webpack_require__(0);
const CheckCollision_1 = __webpack_require__(2);
const flatArrayChildren_1 = __webpack_require__(1);
const Timer_1 = __webpack_require__(3);
class Bullet extends BasicElement_1.default {
    constructor(option) {
        super(option);
        this.sx = option.sx;
        this.sy = option.sy;
        this.ex = option.ex;
        this.ey = option.ey;
        this.x = this.sx;
        this.y = this.sy;
        this.w = option.w;
        this.h = option.h;
        this.status = 1;
        this.hurt = option.hurt || 1;
        this.direction = option.direction; // 直接初始化传入即可，不再更新，子弹不拐弯
        this.type = "Bullet";
        this.image = new Image();
        this.directionImage = {
            "up": "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1cf340800f0e476f8a49c601f77ee3ca~tplv-k3u1fbpfcp-watermark.image?",
            "right": "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70c72db3e5fe4c7fb5102723aaac7fc5~tplv-k3u1fbpfcp-watermark.image?",
            "down": "https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32d4613039964a069e302307b64c46e0~tplv-k3u1fbpfcp-watermark.image?",
            "left": "https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00aa9225712c45979c4ef85913b0f305~tplv-k3u1fbpfcp-watermark.image?",
        };
        this.image.src = this.directionImage[this.direction];
        this.speed = 10; // 根据这个speed和fps算出dx和dy,
        this.fps = 16;
        // 初始化就发射出去
        this.fire();
    }
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    }
    destroy() {
        this.status = 0;
        this.timer.clear();
        this.parent.remove(this);
    }
    fire() {
        this.timer = new Timer_1.default(() => {
            // 从初始位置逐渐运动到终止位置，这里暂时只处理y，x不变，100次（可以优化成动态速率）
            // this.y += this.ey / 1000
            // 进行碰撞检测
            // 先拿到场景里所有要检测碰撞的元素，这里固定获取TextElm
            // let elms = flatArrayChildren(this.parent.children);
            // let textElms = elms.filter(item => item.type == "TextElm")
            // let p = false
            // for(let i = 0;i < textElms.length;i++) {
            //     if(isCollision(getElementPoints(textElms[i]), getElementPoints(this))) {
            //         p = true
            //         return
            //     }
            // }
            // // 更新 如果碰了，就停止变化，这里只考虑y，因为下面有元素，y就被托住了
            // if(!p) {
            //     this.y += this.ey / 1000
            // }
            // if(this.y >= this.ey) {
            //     this.timer.clear()
            // }
            // let dx = this.ex - this.sx != 0 ? (this.speed * this.fps) / (this.ex - this.sx) : 0
            // let dy = this.ey - this.sy != 0 ? (this.speed * this.fps) / (this.ey - this.sy) : 0
            // 子弹需要考虑碰撞，有子弹对敌方坦克的，也有敌方子弹对我们坦克的，还有子弹对墙体的，墙体还要分类型，子弹还要分等级和类型，这里简化一点，任何东西和子弹对上了，就挂了
            let elms = flatArrayChildren_1.default(this.parent.children);
            let p = CheckCollision_1.default(elms, this, ["SteelBrick", "Brick", "EnemyTank", "Heart", "SeniorEnemyTank"], (elm) => {
                this.destroy();
                elm.gotShot(this.hurt);
            });
            if (!p) {
                this.x += this.ex - this.sx != 0 ? Math.sign(this.ex - this.sx) * this.speed : 0;
                this.y += this.ey - this.sy != 0 ? Math.sign(this.ey - this.sy) * this.speed : 0;
            }
            if (this.x < -10 || this.x > 1210 || this.y < -10 || this.y > 810) {
                this.destroy();
            }
        }, this.fps);
    }
}
exports.default = Bullet;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getElementPoints(element) {
    let t = [];
    t.push({
        x: element.x,
        y: element.y,
    });
    t.push({
        x: element.x + element.w,
        y: element.y,
    });
    t.push({
        x: element.x + element.w,
        y: element.y + element.h,
    });
    t.push({
        x: element.x,
        y: element.y + element.h,
    });
    return {
        points: t,
    };
}
exports.default = getElementPoints;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const getAxes_1 = __webpack_require__(16);
const getProjection_1 = __webpack_require__(17);
function isCollision(poly, poly2) {
    let axes1 = getAxes_1.default(poly.points);
    let axes2 = getAxes_1.default(poly2.points);
    let axes = [...axes1, ...axes2];
    for (let ax of axes) {
        let p1 = getProjection_1.default(ax, poly.points);
        let p2 = getProjection_1.default(ax, poly2.points);
        if (!p1.overlaps(p2)) {
            return false;
        }
    }
    return true;
}
exports.default = isCollision;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = __webpack_require__(5);
// 获取多个点的所有投影轴
function getAxes(points) {
    let axes = [];
    for (let i = 0, j = points.length - 1; i < j; i++) {
        let v1 = new Vector_1.default(points[i].x, points[i].y);
        let v2 = new Vector_1.default(points[i + 1].x, points[i + 1].y);
        axes.push(v1.sub(v2).perp().unit());
    }
    let firstPoint = points[0];
    let lastPoint = points[points.length - 1];
    let v1 = new Vector_1.default(lastPoint.x, lastPoint.y);
    let v2 = new Vector_1.default(firstPoint.x, firstPoint.y);
    axes.push(v1.sub(v2).perp().unit());
    return axes;
}
exports.default = getAxes;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Projection_1 = __webpack_require__(18);
const Vector_1 = __webpack_require__(5);
// 获取投影轴上的投影，参数为投影轴向量
function getProjection(v, points) {
    let min = Number.MAX_SAFE_INTEGER;
    let max = Number.MIN_SAFE_INTEGER;
    points.forEach(point => {
        let p = new Vector_1.default(point.x, point.y);
        let dotProduct = p.dot(v);
        min = Math.min(min, dotProduct);
        max = Math.max(max, dotProduct);
    });
    return new Projection_1.default(min, max);
}
exports.default = getProjection;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// 投影
class Projection {
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }
    // 2个投影是否重叠
    overlaps(p) {
        return this.max > p.min && this.min < p.max;
    }
}
exports.default = Projection;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BasicElement_1 = __webpack_require__(0);
class Heart extends BasicElement_1.default {
    constructor(option) {
        super(option);
        this.x = option.x;
        this.y = option.y;
        this.w = option.w;
        this.h = option.h;
        this.type = "Heart";
        this.image = new Image();
        this.image.src = "https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f68715959d4e4576813677bc2a96ae68~tplv-k3u1fbpfcp-watermark.image?";
    }
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    }
    gotShot() {
        this.destroy();
    }
    destroy() {
        // 心脏都被摧毁了，直接GG
        this.parent.remove(this);
        alert("GG");
        location.reload();
    }
    pointInElement(x, y) {
        // 假设内置close大小为20*20，在元素右上角
        // 这个判断还是要加上offset，更新后，子元素的xy就是container的xy
        return this.x <= x && this.y <= y && this.x + this.w >= x && this.y + this.h >= y;
    }
}
exports.default = Heart;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BasicElement_1 = __webpack_require__(0);
const flatArrayChildren_1 = __webpack_require__(1);
const Config_1 = __webpack_require__(4);
const Timer_1 = __webpack_require__(3);
const EnemyBullet_1 = __webpack_require__(6);
const CheckCollision_1 = __webpack_require__(2);
class EnemyTank extends BasicElement_1.default {
    constructor(option) {
        super({});
        this.x = option.x;
        this.y = option.y;
        this.w = option.w;
        this.h = option.h;
        this.type = "EnemyTank";
        this.direction = "down";
        this.directionImage = {
            "up": "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0e5a75625244b448aa1c55685600ede~tplv-k3u1fbpfcp-watermark.image?",
            "right": "https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d1730fe64e54f7b95827c5ec5670616~tplv-k3u1fbpfcp-watermark.image?",
            "down": "https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a6ec18d23fd437f880b150d09bef42d~tplv-k3u1fbpfcp-watermark.image?",
            "left": "https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e99ded7a1e3496cb46671dd1a35f6ad~tplv-k3u1fbpfcp-watermark.image?",
        };
        this.image = new Image();
        this.image.src = this.directionImage[this.direction];
        this.parent = null;
        this.speed = 10;
        this.actionTimer = null;
        this.moveTimer = null;
        this.bullet = null;
    }
    draw(ctx) {
        this.image.src = this.directionImage[this.direction];
        ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    }
    pointInElement(x, y) {
        // 假设内置close大小为20*20，在元素右上角
        // 这个判断还是要加上offset，更新后，子元素的xy就是container的xy
        return this.x <= x && this.y <= y && this.x + this.w >= x && this.y + this.h >= y;
    }
    setDirection(d) {
        this.direction = d;
    }
    gotShot() {
        this.destroy();
    }
    destroy() {
        this.actionTimer && this.actionTimer.clear();
        this.moveTimer && this.moveTimer.clear();
        this.parent.remove(this);
    }
    action() {
        this.actionTimer = new Timer_1.default(() => {
            this.fire();
        }, 800);
        this.moveTimer = new Timer_1.default(() => {
            this.move();
        }, 800);
    }
    randomDirection() {
        this.setDirection(['up', 'down', 'right', 'left'][Math.floor(Math.random() * 4)]);
    }
    move() {
        let elms;
        // 即将碰撞，先处理xy，如果碰撞了返还
        switch (this.direction) {
            case "up":
                if (this.y >= this.speed) {
                    this.y -= this.speed;
                }
                else {
                    this.randomDirection();
                }
                elms = flatArrayChildren_1.default(this.parent.children);
                CheckCollision_1.default(elms, this, ["WaterBrick", "SteelBrick", "Brick", "Tank", "EnemyTank", "SeniorEnemyTank"], (elm) => {
                    this.y += this.speed;
                    // 碰到墙了就随机换方向
                    this.randomDirection();
                });
                break;
            case "right":
                if (this.x < Config_1.default.stage.w - Config_1.default.tank.w) {
                    this.x += this.speed;
                }
                else {
                    this.randomDirection();
                }
                elms = flatArrayChildren_1.default(this.parent.children);
                CheckCollision_1.default(elms, this, ["WaterBrick", "SteelBrick", "Brick", "Tank", "EnemyTank", "SeniorEnemyTank"], (elm) => {
                    this.x -= this.speed;
                    this.randomDirection();
                });
                break;
            case "down":
                if (this.y < Config_1.default.stage.h - Config_1.default.tank.h) {
                    this.y += this.speed;
                }
                else {
                    this.randomDirection();
                }
                elms = flatArrayChildren_1.default(this.parent.children);
                CheckCollision_1.default(elms, this, ["WaterBrick", "SteelBrick", "Brick", "Tank", "EnemyTank", "SeniorEnemyTank"], (elm) => {
                    this.y -= this.speed;
                    this.randomDirection();
                });
                break;
            case "left":
                if (this.x >= this.speed) {
                    this.x -= this.speed;
                }
                else {
                    this.randomDirection();
                }
                elms = flatArrayChildren_1.default(this.parent.children);
                CheckCollision_1.default(elms, this, ["WaterBrick", "SteelBrick", "Brick", "Tank", "EnemyTank", "SeniorEnemyTank"], (elm) => {
                    this.x += this.speed;
                    this.randomDirection();
                });
                break;
        }
    }
    fire() {
        var _a;
        let opt = {};
        if ((_a = this.bullet) === null || _a === void 0 ? void 0 : _a.status) {
            return;
        }
        switch (this.direction) {
            case "up":
                opt = {
                    sx: this.x + this.w / 2 - Config_1.default.bullet.w / 2,
                    sy: this.y - Config_1.default.bullet.h,
                    ex: this.x + this.w / 2 - Config_1.default.bullet.w / 2,
                    ey: -Config_1.default.bullet.h,
                    w: Config_1.default.bullet.w,
                    h: Config_1.default.bullet.h,
                    direction: "up"
                };
                break;
            case "right":
                opt = {
                    sx: this.x + this.w,
                    sy: this.y + this.h / 2 - Config_1.default.bullet.w / 2,
                    ex: Config_1.default.stage.w + Config_1.default.bullet.h,
                    ey: this.y + this.h / 2 - Config_1.default.bullet.w / 2,
                    w: Config_1.default.bullet.h,
                    h: Config_1.default.bullet.w,
                    direction: "right"
                };
                break;
            case "down":
                opt = {
                    sx: this.x + this.w / 2 - Config_1.default.bullet.w / 2,
                    sy: this.y + this.h,
                    ex: this.x + this.w / 2 - Config_1.default.bullet.w / 2,
                    ey: Config_1.default.stage.h + Config_1.default.bullet.h,
                    w: Config_1.default.bullet.w,
                    h: Config_1.default.bullet.h,
                    direction: "down"
                };
                break;
            case "left":
                opt = {
                    sx: this.x - Config_1.default.bullet.h,
                    sy: this.y + this.h / 2 - Config_1.default.bullet.w / 2,
                    ex: -Config_1.default.bullet.h,
                    ey: this.y + this.h / 2 - Config_1.default.bullet.w / 2,
                    w: Config_1.default.bullet.h,
                    h: Config_1.default.bullet.w,
                    direction: "left"
                };
                break;
            default:
                break;
        }
        this.bullet = new EnemyBullet_1.default(opt);
        this.parent.add(this.bullet);
    }
}
exports.default = EnemyTank;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BasicElement_1 = __webpack_require__(0);
class SteelBrick extends BasicElement_1.default {
    constructor(option) {
        super({});
        this.x = option.x;
        this.y = option.y;
        this.w = option.w;
        this.h = option.h;
        this.type = "SteelBrick";
        this.image = new Image();
        this.image.src = "https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1d344bb8024465288dddd59cf04c1fd~tplv-k3u1fbpfcp-watermark.image?";
    }
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    }
    gotShot() {
        // do nothing
    }
    destroy() {
        this.parent.remove(this);
    }
    pointInElement(x, y) {
        return this.x <= x && this.y <= y && this.x + this.w >= x && this.y + this.h >= y;
    }
}
exports.default = SteelBrick;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BasicElement_1 = __webpack_require__(0);
class WaterBrick extends BasicElement_1.default {
    constructor(option) {
        super({});
        this.x = option.x;
        this.y = option.y;
        this.w = option.w;
        this.h = option.h;
        this.type = "WaterBrick";
        this.image = new Image();
        this.image.src = "https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/235172dd563c40ceaff26677d1d9765a~tplv-k3u1fbpfcp-watermark.image?";
    }
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    }
    destroy() {
        this.parent.remove(this);
    }
    pointInElement(x, y) {
        return this.x <= x && this.y <= y && this.x + this.w >= x && this.y + this.h >= y;
    }
}
exports.default = WaterBrick;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BasicElement_1 = __webpack_require__(0);
const flatArrayChildren_1 = __webpack_require__(1);
const Config_1 = __webpack_require__(4);
const Timer_1 = __webpack_require__(3);
const EnemyBullet_1 = __webpack_require__(6);
const CheckCollision_1 = __webpack_require__(2);
class SeniorEnemyTank extends BasicElement_1.default {
    constructor(option) {
        super({});
        this.x = option.x;
        this.y = option.y;
        this.w = option.w;
        this.h = option.h;
        this.type = "SeniorEnemyTank";
        this.direction = "down";
        this.directionImage = {
            "up": "https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51aba0e4e8b34e779c4756afe4893b63~tplv-k3u1fbpfcp-watermark.image?",
            "right": "https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/05551f12df3a45ef8507fddd509a24e1~tplv-k3u1fbpfcp-watermark.image?",
            "down": "https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70eb1fad055c46758d258e2d178ca6e1~tplv-k3u1fbpfcp-watermark.image?",
            "left": "https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e56d3c82e63f4dcc9ae1f3032058822a~tplv-k3u1fbpfcp-watermark.image?",
        };
        this.lifeCount = 4;
        this.image = new Image();
        this.image.src = this.directionImage[this.direction];
        this.parent = null;
        this.speed = 10;
        this.actionTimer = null;
        this.moveTimer = null;
        this.bullet = null;
    }
    draw(ctx) {
        this.image.src = this.directionImage[this.direction];
        ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    }
    pointInElement(x, y) {
        // 假设内置close大小为20*20，在元素右上角
        // 这个判断还是要加上offset，更新后，子元素的xy就是container的xy
        return this.x <= x && this.y <= y && this.x + this.w >= x && this.y + this.h >= y;
    }
    setDirection(d) {
        this.direction = d;
    }
    gotShot(hurt) {
        this.lifeCount -= hurt;
        if (this.lifeCount <= 0) {
            this.destroy();
        }
    }
    destroy() {
        this.actionTimer && this.actionTimer.clear();
        this.moveTimer && this.moveTimer.clear();
        this.parent.remove(this);
    }
    action() {
        this.actionTimer = new Timer_1.default(() => {
            this.fire();
        }, 600);
        this.moveTimer = new Timer_1.default(() => {
            this.move();
        }, 600);
    }
    randomDirection() {
        this.setDirection(['up', 'down', 'right', 'left'][Math.floor(Math.random() * 4)]);
    }
    move() {
        let elms;
        // 即将碰撞，先处理xy，如果碰撞了返还
        switch (this.direction) {
            case "up":
                if (this.y >= this.speed) {
                    this.y -= this.speed;
                }
                else {
                    this.randomDirection();
                }
                elms = flatArrayChildren_1.default(this.parent.children);
                CheckCollision_1.default(elms, this, ["WaterBrick", "SteelBrick", "Brick", "Tank", "EnemyTank"], (elm) => {
                    this.y += this.speed;
                    // 碰到墙了就随机换方向
                    this.randomDirection();
                });
                break;
            case "right":
                if (this.x < Config_1.default.stage.w - Config_1.default.tank.w) {
                    this.x += this.speed;
                }
                else {
                    this.randomDirection();
                }
                elms = flatArrayChildren_1.default(this.parent.children);
                CheckCollision_1.default(elms, this, ["WaterBrick", "SteelBrick", "Brick", "Tank", "EnemyTank"], (elm) => {
                    this.x -= this.speed;
                    this.randomDirection();
                });
                break;
            case "down":
                if (this.y < Config_1.default.stage.h - Config_1.default.tank.h) {
                    this.y += this.speed;
                }
                else {
                    this.randomDirection();
                }
                elms = flatArrayChildren_1.default(this.parent.children);
                CheckCollision_1.default(elms, this, ["WaterBrick", "SteelBrick", "Brick", "Tank", "EnemyTank"], (elm) => {
                    this.y -= this.speed;
                    this.randomDirection();
                });
                break;
            case "left":
                if (this.x >= this.speed) {
                    this.x -= this.speed;
                }
                else {
                    this.randomDirection();
                }
                elms = flatArrayChildren_1.default(this.parent.children);
                CheckCollision_1.default(elms, this, ["WaterBrick", "SteelBrick", "Brick", "Tank", "EnemyTank"], (elm) => {
                    this.x += this.speed;
                    this.randomDirection();
                });
                break;
        }
    }
    fire() {
        var _a;
        let opt = {};
        if ((_a = this.bullet) === null || _a === void 0 ? void 0 : _a.status) {
            return;
        }
        switch (this.direction) {
            case "up":
                opt = {
                    sx: this.x + this.w / 2 - Config_1.default.bullet.w / 2,
                    sy: this.y - Config_1.default.bullet.h,
                    ex: this.x + this.w / 2 - Config_1.default.bullet.w / 2,
                    ey: -Config_1.default.bullet.h,
                    w: Config_1.default.bullet.w,
                    h: Config_1.default.bullet.h,
                    direction: "up"
                };
                break;
            case "right":
                opt = {
                    sx: this.x + this.w,
                    sy: this.y + this.h / 2 - Config_1.default.bullet.w / 2,
                    ex: Config_1.default.stage.w + Config_1.default.bullet.h,
                    ey: this.y + this.h / 2 - Config_1.default.bullet.w / 2,
                    w: Config_1.default.bullet.h,
                    h: Config_1.default.bullet.w,
                    direction: "right"
                };
                break;
            case "down":
                opt = {
                    sx: this.x + this.w / 2 - Config_1.default.bullet.w / 2,
                    sy: this.y + this.h,
                    ex: this.x + this.w / 2 - Config_1.default.bullet.w / 2,
                    ey: Config_1.default.stage.h + Config_1.default.bullet.h,
                    w: Config_1.default.bullet.w,
                    h: Config_1.default.bullet.h,
                    direction: "down"
                };
                break;
            case "left":
                opt = {
                    sx: this.x - Config_1.default.bullet.h,
                    sy: this.y + this.h / 2 - Config_1.default.bullet.w / 2,
                    ex: -Config_1.default.bullet.h,
                    ey: this.y + this.h / 2 - Config_1.default.bullet.w / 2,
                    w: Config_1.default.bullet.h,
                    h: Config_1.default.bullet.w,
                    direction: "left"
                };
                break;
            default:
                break;
        }
        this.bullet = new EnemyBullet_1.default(opt);
        this.parent.add(this.bullet);
    }
}
exports.default = SeniorEnemyTank;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BasicElement_1 = __webpack_require__(0);
class Star extends BasicElement_1.default {
    constructor(option) {
        super(option);
        this.x = option.x;
        this.y = option.y;
        this.w = option.w;
        this.h = option.h;
        this.type = "Star";
        this.image = new Image();
        this.image.src = "https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff55a350760744afbd08653ebdae1e1f~tplv-k3u1fbpfcp-watermark.image?";
    }
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    }
    eat(elm) {
        // 星星不中弹，但是会被坦克吃，给吃的目标升级
        elm.star++;
        this.destroy();
    }
    destroy() {
        this.parent.remove(this);
    }
    pointInElement(x, y) {
        // 假设内置close大小为20*20，在元素右上角
        // 这个判断还是要加上offset，更新后，子元素的xy就是container的xy
        return this.x <= x && this.y <= y && this.x + this.w >= x && this.y + this.h >= y;
    }
}
exports.default = Star;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function Throttle(fn, delay) {
    var last, deferTime;
    return function (args) {
        var that = this;
        var now = +new Date();
        // 接着如果上个时间间隔里已经执行了fn，last存在，且时间间隔还未结束，设置一个定时器间隔执行，且重置last时间
        if (last && now < last + delay) {
            clearTimeout(deferTime);
            deferTime = setTimeout(function () {
                last = now;
                fn.call(that, args);
            }, delay);
        }
        else {
            // 一进来的时候last为空，直接执行fn，然后把执行时间记录为last
            last = now;
            fn.call(that, args);
        }
    };
}
exports.default = Throttle;


/***/ })
/******/ ]);
//# sourceMappingURL=main.49652b7b.js.map