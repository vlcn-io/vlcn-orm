/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "?8e01":
/*!************************!*\
  !*** crypto (ignored) ***!
  \************************/
/***/ (() => {

eval("/* (ignored) */\n\n//# sourceURL=webpack://@aphro/todo-mvc/crypto_(ignored)?");

/***/ }),

/***/ "?6772":
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/***/ (() => {

eval("/* (ignored) */\n\n//# sourceURL=webpack://@aphro/todo-mvc/fs_(ignored)?");

/***/ }),

/***/ "?b168":
/*!**********************!*\
  !*** path (ignored) ***!
  \**********************/
/***/ (() => {

eval("/* (ignored) */\n\n//# sourceURL=webpack://@aphro/todo-mvc/path_(ignored)?");

/***/ }),

/***/ "../../packages/absurd-sql-connector/lib/pkg.js":
/*!******************************************************!*\
  !*** ../../packages/absurd-sql-connector/lib/pkg.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ('@aphro/absurd-sql');\n//# sourceMappingURL=pkg.js.map\n\n//# sourceURL=webpack://@aphro/todo-mvc/../../packages/absurd-sql-connector/lib/pkg.js?");

/***/ }),

/***/ "../../packages/absurd-sql-connector/lib/worker/worker.js":
/*!****************************************************************!*\
  !*** ../../packages/absurd-sql-connector/lib/worker/worker.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _aphro_sql_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @aphro/sql.js */ \"../../node_modules/.pnpm/@aphro+sql.js@1.7.0/node_modules/@aphro/sql.js/dist/sql-wasm.js\");\n/* harmony import */ var _aphro_absurd_sql__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @aphro/absurd-sql */ \"../../node_modules/.pnpm/@aphro+absurd-sql@0.0.53/node_modules/@aphro/absurd-sql/dist/index.js\");\n/* harmony import */ var _aphro_absurd_sql_dist_indexeddb_backend_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @aphro/absurd-sql/dist/indexeddb-backend.js */ \"../../node_modules/.pnpm/@aphro+absurd-sql@0.0.53/node_modules/@aphro/absurd-sql/dist/indexeddb-backend.js\");\n/* harmony import */ var _pkg_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../pkg.js */ \"../../packages/absurd-sql-connector/lib/pkg.js\");\n\n\n\n\nasync function init() {\n    let SQL = await _aphro_sql_js__WEBPACK_IMPORTED_MODULE_0__({ locateFile: file => file });\n    // let SQL = await initSqlJs({ locateFile: file => '/assets/js/sql.wasm' });\n    let sqlFS = new _aphro_absurd_sql__WEBPACK_IMPORTED_MODULE_1__.SQLiteFS(SQL.FS, new _aphro_absurd_sql_dist_indexeddb_backend_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"]());\n    SQL.register_for_idb(sqlFS);\n    SQL.FS.mkdir('/sql');\n    SQL.FS.mount(sqlFS, {}, '/sql');\n    let db = new SQL.Database('/sql/db.sqlite', { filename: true });\n    db.exec(`\n    PRAGMA page_size=8192;\n    PRAGMA journal_mode=MEMORY;\n  `);\n    self.addEventListener('message', async function ({ data }) {\n        const { pkg, event, id, queryObj } = data;\n        if (pkg !== _pkg_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"]) {\n            return;\n        }\n        if (event !== 'query') {\n            return;\n        }\n        // console.log(queryObj);\n        if (queryObj.bindings) {\n            let stmt;\n            let rows = [];\n            try {\n                stmt = db.prepare(queryObj.sql);\n                stmt.bind(queryObj.bindings);\n                while (stmt.step())\n                    rows.push(stmt.getAsObject());\n            }\n            catch (e) {\n                self.postMessage({\n                    pkg: _pkg_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"],\n                    event: 'query-response',\n                    id,\n                    error: {\n                        message: e.message,\n                    },\n                });\n                return;\n            }\n            finally {\n                if (stmt != null) {\n                    stmt.free();\n                }\n            }\n            self.postMessage({\n                pkg: _pkg_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"],\n                event: 'query-response',\n                id,\n                result: rows,\n            });\n        }\n        else {\n            try {\n                db.exec(queryObj.sql);\n            }\n            catch (e) {\n                self.postMessage({\n                    pkg: _pkg_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"],\n                    event: 'query-response',\n                    id,\n                    error: e,\n                });\n                return;\n            }\n            self.postMessage({\n                pkg: _pkg_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"],\n                event: 'query-response',\n                id,\n                result: [],\n            });\n        }\n    });\n    self.postMessage({\n        pkg: _pkg_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"],\n        event: 'ready',\n    });\n}\ninit();\n//# sourceMappingURL=worker.js.map\n\n//# sourceURL=webpack://@aphro/todo-mvc/../../packages/absurd-sql-connector/lib/worker/worker.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// the startup function
/******/ 	__webpack_require__.x = () => {
/******/ 		// Load entry module and return exports
/******/ 		// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 		var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_pnpm_aphro_absurd-sql_0_0_53_node_modules_aphro_absurd-sql_dist_index_js-19597a"], () => (__webpack_require__("../../packages/absurd-sql-connector/lib/worker/worker.js")))
/******/ 		__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 		return __webpack_exports__;
/******/ 	};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks and sibling chunks for the entrypoint
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/importScripts chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "already loaded"
/******/ 		var installedChunks = {
/******/ 			"packages_absurd-sql-connector_lib_worker_worker_js": 1
/******/ 		};
/******/ 		
/******/ 		// importScripts chunk loading
/******/ 		var installChunk = (data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			while(chunkIds.length)
/******/ 				installedChunks[chunkIds.pop()] = 1;
/******/ 			parentChunkLoadingFunction(data);
/******/ 		};
/******/ 		__webpack_require__.f.i = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					importScripts(__webpack_require__.p + __webpack_require__.u(chunkId));
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk_aphro_todo_mvc"] = self["webpackChunk_aphro_todo_mvc"] || [];
/******/ 		var parentChunkLoadingFunction = chunkLoadingGlobal.push.bind(chunkLoadingGlobal);
/******/ 		chunkLoadingGlobal.push = installChunk;
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/startup chunk dependencies */
/******/ 	(() => {
/******/ 		var next = __webpack_require__.x;
/******/ 		__webpack_require__.x = () => {
/******/ 			return __webpack_require__.e("vendors-node_modules_pnpm_aphro_absurd-sql_0_0_53_node_modules_aphro_absurd-sql_dist_index_js-19597a").then(next);
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	
/******/ })()
;