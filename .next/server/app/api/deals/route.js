/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/deals/route";
exports.ids = ["app/api/deals/route"];
exports.modules = {

/***/ "(rsc)/./app/api/deals/route.ts":
/*!********************************!*\
  !*** ./app/api/deals/route.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   dynamic: () => (/* binding */ dynamic)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n// app/api/deals/route.ts\n\nconst dynamic = \"force-dynamic\";\nasync function GET(req) {\n    const { searchParams } = new URL(req.url);\n    const from = searchParams.get(\"from\") || \"AMS\";\n    const to = searchParams.get(\"to\") || \"IST\";\n    const depart = searchParams.get(\"depart\") || \"\"; // YYYY-MM-DD\n    const ret = searchParams.get(\"ret\") || \"\";\n    const maxPrice = searchParams.get(\"maxPrice\") || \"\";\n    const token = process.env.TRAVELPAYOUTS_API_TOKEN;\n    if (!token) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"API token missing\"\n        }, {\n            status: 500\n        });\n    }\n    try {\n        // KENDİ kullandığın gerçek Travelpayouts endpoint'ini buraya koy.\n        const url = new URL(\"https://api.travelpayouts.com/aviasales/v3/prices_for_dates\");\n        url.searchParams.set(\"origin\", from);\n        url.searchParams.set(\"destination\", to);\n        if (depart) url.searchParams.set(\"departure_at\", depart);\n        if (ret) url.searchParams.set(\"return_at\", ret);\n        if (maxPrice) url.searchParams.set(\"price_max\", maxPrice);\n        url.searchParams.set(\"currency\", \"EUR\");\n        url.searchParams.set(\"limit\", \"30\");\n        const res = await fetch(url.toString(), {\n            headers: {\n                \"X-Access-Token\": token\n            },\n            cache: \"no-store\"\n        });\n        if (!res.ok) throw new Error(`Upstream error ${res.status}`);\n        const raw = await res.json();\n        // normalize -> UI ile birebir alan isimleri\n        const items = (raw?.data || raw?.prices || raw || []).map((d, i)=>({\n                id: d.id ?? `${d.origin}-${d.destination}-${i}`,\n                origin: d.origin ?? from,\n                destination: d.destination ?? to,\n                airline: d.airline || d.gate || \"\",\n                price: d.price || d.value || 0,\n                depart_at: d.departure_at || d.depart_date || \"\",\n                return_at: d.return_at || d.return_date || \"\",\n                transfers: d.transfers ?? d.number_of_changes ?? 0,\n                link: d.link || d.deep_link || \"\"\n            }));\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            items\n        });\n    } catch (e) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: e.message\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LE9BQU87UUFBQyxHQUFHO1lBQUVqQyxRQUFRO1FBQUk7SUFDL0Q7QUFDRiIsInNvdXJjZXMiOlsiL2hvbWUvcnVtZWxpYWxpbWVobWV0L3Nwb3RtaWpudmx1Y2h0LWRlYWxzL2FwcC9hcGkvZGVhbHMvcm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gYXBwL2FwaS9kZWFscy9yb3V0ZS50c1xuaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSBcIm5leHQvc2VydmVyXCI7XG5leHBvcnQgY29uc3QgZHluYW1pYyA9IFwiZm9yY2UtZHluYW1pY1wiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKHJlcTogUmVxdWVzdCkge1xuICBjb25zdCB7IHNlYXJjaFBhcmFtcyB9ID0gbmV3IFVSTChyZXEudXJsKTtcbiAgY29uc3QgZnJvbSA9IHNlYXJjaFBhcmFtcy5nZXQoXCJmcm9tXCIpIHx8IFwiQU1TXCI7XG4gIGNvbnN0IHRvID0gc2VhcmNoUGFyYW1zLmdldChcInRvXCIpIHx8IFwiSVNUXCI7XG4gIGNvbnN0IGRlcGFydCA9IHNlYXJjaFBhcmFtcy5nZXQoXCJkZXBhcnRcIikgfHwgXCJcIjsgLy8gWVlZWS1NTS1ERFxuICBjb25zdCByZXQgPSBzZWFyY2hQYXJhbXMuZ2V0KFwicmV0XCIpIHx8IFwiXCI7XG4gIGNvbnN0IG1heFByaWNlID0gc2VhcmNoUGFyYW1zLmdldChcIm1heFByaWNlXCIpIHx8IFwiXCI7XG5cbiAgY29uc3QgdG9rZW4gPSBwcm9jZXNzLmVudi5UUkFWRUxQQVlPVVRTX0FQSV9UT0tFTjtcbiAgaWYgKCF0b2tlbikge1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBcIkFQSSB0b2tlbiBtaXNzaW5nXCIgfSwgeyBzdGF0dXM6IDUwMCB9KTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgLy8gS0VORMSwIGt1bGxhbmTEscSfxLFuIGdlcsOnZWsgVHJhdmVscGF5b3V0cyBlbmRwb2ludCdpbmkgYnVyYXlhIGtveS5cbiAgICBjb25zdCB1cmwgPSBuZXcgVVJMKFwiaHR0cHM6Ly9hcGkudHJhdmVscGF5b3V0cy5jb20vYXZpYXNhbGVzL3YzL3ByaWNlc19mb3JfZGF0ZXNcIik7XG4gICAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJvcmlnaW5cIiwgZnJvbSk7XG4gICAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJkZXN0aW5hdGlvblwiLCB0byk7XG4gICAgaWYgKGRlcGFydCkgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJkZXBhcnR1cmVfYXRcIiwgZGVwYXJ0KTtcbiAgICBpZiAocmV0KSB1cmwuc2VhcmNoUGFyYW1zLnNldChcInJldHVybl9hdFwiLCByZXQpO1xuICAgIGlmIChtYXhQcmljZSkgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJwcmljZV9tYXhcIiwgbWF4UHJpY2UpO1xuICAgIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwiY3VycmVuY3lcIiwgXCJFVVJcIik7XG4gICAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJsaW1pdFwiLCBcIjMwXCIpO1xuXG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2godXJsLnRvU3RyaW5nKCksIHtcbiAgICAgIGhlYWRlcnM6IHsgXCJYLUFjY2Vzcy1Ub2tlblwiOiB0b2tlbiB9LFxuICAgICAgY2FjaGU6IFwibm8tc3RvcmVcIixcbiAgICB9KTtcblxuICAgIGlmICghcmVzLm9rKSB0aHJvdyBuZXcgRXJyb3IoYFVwc3RyZWFtIGVycm9yICR7cmVzLnN0YXR1c31gKTtcbiAgICBjb25zdCByYXcgPSBhd2FpdCByZXMuanNvbigpO1xuXG4gICAgLy8gbm9ybWFsaXplIC0+IFVJIGlsZSBiaXJlYmlyIGFsYW4gaXNpbWxlcmlcbiAgICBjb25zdCBpdGVtcyA9IChyYXc/LmRhdGEgfHwgcmF3Py5wcmljZXMgfHwgcmF3IHx8IFtdKS5tYXAoKGQ6IGFueSwgaTogbnVtYmVyKSA9PiAoe1xuICAgICAgaWQ6IGQuaWQgPz8gYCR7ZC5vcmlnaW59LSR7ZC5kZXN0aW5hdGlvbn0tJHtpfWAsXG4gICAgICBvcmlnaW46IGQub3JpZ2luID8/IGZyb20sXG4gICAgICBkZXN0aW5hdGlvbjogZC5kZXN0aW5hdGlvbiA/PyB0byxcbiAgICAgIGFpcmxpbmU6IGQuYWlybGluZSB8fCBkLmdhdGUgfHwgXCJcIixcbiAgICAgIHByaWNlOiBkLnByaWNlIHx8IGQudmFsdWUgfHwgMCxcbiAgICAgIGRlcGFydF9hdDogZC5kZXBhcnR1cmVfYXQgfHwgZC5kZXBhcnRfZGF0ZSB8fCBcIlwiLFxuICAgICAgcmV0dXJuX2F0OiBkLnJldHVybl9hdCB8fCBkLnJldHVybl9kYXRlIHx8IFwiXCIsXG4gICAgICB0cmFuc2ZlcnM6IGQudHJhbnNmZXJzID8/IGQubnVtYmVyX29mX2NoYW5nZXMgPz8gMCxcbiAgICAgIGxpbms6IGQubGluayB8fCBkLmRlZXBfbGluayB8fCBcIlwiLFxuICAgIH0pKTtcblxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGl0ZW1zIH0pO1xuICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogZS5tZXNzYWdlIH0sIHsgc3RhdHVzOiA1MDAgfSk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJkeW5hbWljIiwiR0VUIiwicmVxIiwic2VhcmNoUGFyYW1zIiwiVVJMIiwidXJsIiwiZnJvbSIsImdldCIsInRvIiwiZGVwYXJ0IiwicmV0IiwibWF4UHJpY2UiLCJ0b2tlbiIsInByb2Nlc3MiLCJlbnYiLCJUUkFWRUxQQVlPVVRTX0FQSV9UT0tFTiIsImpzb24iLCJlcnJvciIsInN0YXR1cyIsInNldCIsInJlcyIsImZldGNoIiwidG9TdHJpbmciLCJoZWFkZXJzIiwiY2FjaGUiLCJvayIsIkVycm9yIiwicmF3IiwiaXRlbXMiLCJkYXRhIiwicHJpY2VzIiwibWFwIiwiZCIsImkiLCJpZCIsIm9yaWdpbiIsImRlc3RpbmF0aW9uIiwiYWlybGluZSIsImdhdGUiLCJwcmljZSIsInZhbHVlIiwiZGVwYXJ0X2F0IiwiZGVwYXJ0dXJlX2F0IiwiZGVwYXJ0X2RhdGUiLCJyZXR1cm5fYXQiLCJyZXR1cm5fZGF0ZSIsInRyYW5zZmVycyIsIm51bWJlcl9vZl9jaGFuZ2VzIiwibGluayIsImRlZXBfbGluayIsImUiLCJtZXNzYWdlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/deals/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdeals%2Froute&page=%2Fapi%2Fdeals%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdeals%2Froute.ts&appDir=%2Fhome%2Frumelialimehmet%2Fspotmijnvlucht-deals%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frumelialimehmet%2Fspotmijnvlucht-deals&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdeals%2Froute&page=%2Fapi%2Fdeals%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdeals%2Froute.ts&appDir=%2Fhome%2Frumelialimehmet%2Fspotmijnvlucht-deals%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frumelialimehmet%2Fspotmijnvlucht-deals&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _home_rumelialimehmet_spotmijnvlucht_deals_app_api_deals_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/deals/route.ts */ \"(rsc)/./app/api/deals/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/deals/route\",\n        pathname: \"/api/deals\",\n        filename: \"route\",\n        bundlePath: \"app/api/deals/route\"\n    },\n    resolvedPagePath: \"/home/rumelialimehmet/spotmijnvlucht-deals/app/api/deals/route.ts\",\n    nextConfigOutput,\n    userland: _home_rumelialimehmet_spotmijnvlucht_deals_app_api_deals_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZkZWFscyUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGZGVhbHMlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZkZWFscyUyRnJvdXRlLnRzJmFwcERpcj0lMkZob21lJTJGcnVtZWxpYWxpbWVobWV0JTJGc3BvdG1pam52bHVjaHQtZGVhbHMlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRmhvbWUlMkZydW1lbGlhbGltZWhtZXQlMkZzcG90bWlqbnZsdWNodC1kZWFscyZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDaUI7QUFDOUY7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9ob21lL3J1bWVsaWFsaW1laG1ldC9zcG90bWlqbnZsdWNodC1kZWFscy9hcHAvYXBpL2RlYWxzL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9kZWFscy9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2RlYWxzXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9kZWFscy9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9ob21lL3J1bWVsaWFsaW1laG1ldC9zcG90bWlqbnZsdWNodC1kZWFscy9hcHAvYXBpL2RlYWxzL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdeals%2Froute&page=%2Fapi%2Fdeals%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdeals%2Froute.ts&appDir=%2Fhome%2Frumelialimehmet%2Fspotmijnvlucht-deals%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frumelialimehmet%2Fspotmijnvlucht-deals&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdeals%2Froute&page=%2Fapi%2Fdeals%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdeals%2Froute.ts&appDir=%2Fhome%2Frumelialimehmet%2Fspotmijnvlucht-deals%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frumelialimehmet%2Fspotmijnvlucht-deals&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();