/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*************************!*\
  !*** ./src/devtools.ts ***!
  \*************************/

chrome.devtools.panels.create("OData $batch", // Title of the panel
"", // Path to the icon (optional, "" if none)
"panel.html", // HTML file for the panel's content
(panel) => {
    console.log("Custom OData Batch DevTools panel created!");
});

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2dG9vbHMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUMzQixjQUFjLEVBQVMscUJBQXFCO0FBQzVDLEVBQUUsRUFBcUIsMENBQTBDO0FBQ2pFLFlBQVksRUFBVyxvQ0FBb0M7QUFDM0QsQ0FBQyxLQUFLLEVBQUUsRUFBRTtJQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsNENBQTRDLENBQUMsQ0FBQztBQUM1RCxDQUFDLENBQ0YsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2Nocm9tZS1leHQtb2RhdGEtYmF0Y2gtdmlld2VyLy4vc3JjL2RldnRvb2xzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImNocm9tZS5kZXZ0b29scy5wYW5lbHMuY3JlYXRlKFxuICBcIk9EYXRhICRiYXRjaFwiLCAgICAgICAgLy8gVGl0bGUgb2YgdGhlIHBhbmVsXG4gIFwiXCIsICAgICAgICAgICAgICAgICAgICAvLyBQYXRoIHRvIHRoZSBpY29uIChvcHRpb25hbCwgXCJcIiBpZiBub25lKVxuICBcInBhbmVsLmh0bWxcIiwgICAgICAgICAgLy8gSFRNTCBmaWxlIGZvciB0aGUgcGFuZWwncyBjb250ZW50XG4gIChwYW5lbCkgPT4geyAgICAgICAgICAgLy8gQ2FsbGJhY2sgZnVuY3Rpb24gd2hlbiBwYW5lbCBpcyBjcmVhdGVkXG4gICAgY29uc29sZS5sb2coXCJDdXN0b20gT0RhdGEgQmF0Y2ggRGV2VG9vbHMgcGFuZWwgY3JlYXRlZCFcIik7XG4gIH1cbik7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9