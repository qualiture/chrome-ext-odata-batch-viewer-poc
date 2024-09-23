/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/panel.ts":
/*!**********************!*\
  !*** ./src/panel.ts ***!
  \**********************/
/***/ (function() {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Get the div where the XHR list will be displayed
const xhrListDiv = document.getElementById("xhr-list");
const xhrNoDataDiv = document.getElementById("xhr-no-data");
// Function to clear the XHR list when the page is reloaded
function clearXHRList() {
    xhrListDiv.innerHTML = "";
    xhrListDiv.hidden = true;
    xhrNoDataDiv.hidden = false;
    xhrNoDataDiv.innerHTML = "<p>No requests yet.</p>";
}
// Check the current theme of the Chrome DevTools
const theme = chrome.devtools.panels.themeName;
// Dynamically apply the theme to the document body
function applyTheme() {
    const body = document.body;
    if (theme === "dark") {
        body.classList.add("dark-theme");
        body.classList.remove("light-theme");
    }
    else {
        body.classList.add("light-theme");
        body.classList.remove("dark-theme");
    }
}
// Apply the theme on page load
applyTheme();
// Optionally, listen for theme changes (though DevTools does not provide a direct listener for theme changes, this is future-proofing)
// chrome.devtools.panels.onThemeChanged.addListener(() => {
//   applyTheme();
// });
// Listen to the page navigation event
chrome.devtools.network.onNavigated.addListener(() => {
    console.log("Page navigated!");
    console.log("chrome.devtools.panels.themeName", chrome.devtools.panels.themeName);
    clearXHRList(); // Clear the list when the page is navigated or refreshed
});
function createTableRow(val1, val2, alternate = false) {
    // Create and apply styles for the first column
    const firstColumnStyle = 'width: 120px; font-weight: bold;';
    const row = document.createElement('tr');
    // Create first column (with fixed width)
    const firstColumn = document.createElement('td');
    firstColumn.style.cssText = firstColumnStyle;
    firstColumn.innerText = val1;
    row.appendChild(firstColumn);
    // Create second column
    const secondColumn = document.createElement('td');
    secondColumn.innerText = val2;
    row.appendChild(secondColumn);
    if (alternate) {
        row.className = 'alternate';
    }
    return row;
}
function createTableRowWithJSON(val1, val2, alternate = false) {
    // Create and apply styles for the first column
    const firstColumnStyle = 'width: 120px; vertical-align: top; font-weight: bold;';
    const row = document.createElement('tr');
    // Create first column (with fixed width)
    const firstColumn = document.createElement('td');
    firstColumn.style.cssText = firstColumnStyle;
    firstColumn.innerText = val1;
    row.appendChild(firstColumn);
    // Create second column
    const secondColumn = document.createElement('td');
    const jsonElement = document.createElement("pretty-json");
    jsonElement.textContent = val2;
    secondColumn.appendChild(jsonElement);
    row.appendChild(secondColumn);
    if (alternate) {
        row.className = 'alternate';
    }
    return row;
}
// Listen to network requests
chrome.devtools.network.onRequestFinished.addListener((request) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Filter out non-XHR requests
    if ((request._resourceType === "xhr" || request._resourceType === "fetch") &&
        request.request.url.includes("$batch")) {
        xhrNoDataDiv.hidden = true;
        xhrListDiv.hidden = false;
        // Extract relevant information
        const method = request.request.method;
        const url = request.request.url;
        const status = request.response.status;
        // Create the table element
        const table = document.createElement('table');
        table.style.width = '100%';
        // Create a new element to display the request
        // const xhrElement = document.createElement("p");
        const formData = (_a = request.request.postData) === null || _a === void 0 ? void 0 : _a.text;
        const boundary = formData === null || formData === void 0 ? void 0 : formData.split("\r\n")[0];
        const requests = [];
        if (boundary) {
            const parts = formData === null || formData === void 0 ? void 0 : formData.split(boundary);
            parts === null || parts === void 0 ? void 0 : parts.forEach((part) => __awaiter(void 0, void 0, void 0, function* () {
                // console.log("PART", part);
                const lines = part.split("\r\n");
                const types = ["GET", "POST", "PUT", "PATCH", "DELETE"];
                const requestInBatch = lines.find((line) => types.some((type) => line.includes(type)));
                if (requestInBatch) {
                    // console.log("ODATA REQUEST", requestInBatch);
                    const payload = lines.find((line) => line.startsWith("{"));
                    request.getContent((content, encoding) => {
                        const decodedContent = atob(content);
                        // console.log("RESPONSE data", atob(decodedContent));
                        const responseParts = decodedContent.split(boundary);
                        responseParts.forEach((part) => {
                            // console.log("RESPONSE PART", part);
                            const responseLines = part.split("\r\n");
                            if (responseLines.length > 2) {
                                const response = responseLines[responseLines.length - 2];
                                const odataRequest = {
                                    request: requestInBatch,
                                    payload,
                                    response,
                                };
                                // Append the row to the table
                                table.appendChild(createTableRow("Request", odataRequest.request, true));
                                // const requestElement = document.createElement("p");
                                // requestElement.appendChild(document.createElement("span")).innerText = "Request: ";
                                // requestElement.innerText = `Request: ${odataRequest.request}`;
                                // xhrElement.appendChild(requestElement);
                                if (payload) {
                                    table.appendChild(createTableRowWithJSON("Payload", payload, true));
                                    // const payloadElement = document.createElement("p");
                                    // payloadElement.innerText = "Payload:";
                                    // xhrElement.appendChild(payloadElement);
                                    // const payloadJSONElement = document.createElement("pretty-json");
                                    // const payloadFormatted = JSON.stringify(JSON.parse(odataRequest.payload as string), null, 2);
                                    // payloadJSONElement.textContent = payloadFormatted; // ? JSON.stringify(odataRequest.response, null, 2) : "";
                                    // xhrElement.appendChild(payloadJSONElement);
                                }
                                table.appendChild(createTableRowWithJSON("Response", odataRequest.response));
                                // const responseElement = document.createElement("p");
                                // responseElement.innerText = "Response:";
                                // xhrElement.appendChild(responseElement);
                                // const jsonElement = document.createElement("pretty-json");
                                // const jsonFormatted = JSON.stringify(JSON.parse(odataRequest.response as string), null, 2);
                                // jsonElement.textContent = odataRequest.response as string; // ? JSON.stringify(odataRequest.response, null, 2) : "";
                                // xhrElement.appendChild(jsonElement);
                                // const jsonElement = document.createElement("pretty-json");
                                // const jsonFormatted = JSON.stringify(JSON.parse(odataRequest.response as string), null, 2);
                                // jsonElement.innerHTML = jsonFormatted; // ? JSON.stringify(odataRequest.response, null, 2) : "";
                                // xhrElement.appendChild(jsonElement);
                                // xhrListDiv!.appendChild(xhrElement);
                                xhrListDiv.appendChild(table);
                            }
                        });
                    });
                }
            }));
        }
    }
}));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/panel.ts"]();
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBMEM7Z0NBRTFDLElBQUksT0FBTyxFQUFFLENBQUM7b0NBQ2IsS0FBSyxDQUFDLFdBQVcsQ0FBQyxzQkFBc0IsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7b0NBQ3BFLHNEQUFzRDtvQ0FDdEQseUNBQXlDO29DQUN6QywwQ0FBMEM7b0NBRTFDLG9FQUFvRTtvQ0FDcEUsZ0dBQWdHO29DQUNoRywrR0FBK0c7b0NBQy9HLDhDQUE4QztnQ0FDL0MsQ0FBQztnQ0FFRCxLQUFLLENBQUMsV0FBVyxDQUFDLHNCQUFzQixDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsUUFBa0IsQ0FBQyxDQUFDLENBQUM7Z0NBQ3ZGLHVEQUF1RDtnQ0FDdkQsMkNBQTJDO2dDQUMzQywyQ0FBMkM7Z0NBRTNDLDZEQUE2RDtnQ0FDN0QsOEZBQThGO2dDQUM5Rix1SEFBdUg7Z0NBQ3ZILHVDQUF1QztnQ0FHdkMsNkRBQTZEO2dDQUM3RCw4RkFBOEY7Z0NBQzlGLG1HQUFtRztnQ0FDbkcsdUNBQXVDO2dDQUd2Qyx1Q0FBdUM7Z0NBQ3ZDLFVBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7NEJBQ2hDLENBQUM7d0JBQ0YsQ0FBQyxDQUFDLENBQUM7b0JBQ0osQ0FBQyxDQUFDLENBQUM7Z0JBQ0osQ0FBQztZQUNGLENBQUMsRUFBQyxDQUFDO1FBQ0osQ0FBQztJQUNBLENBQUM7QUFDSCxDQUFDLEVBQUMsQ0FBQzs7Ozs7Ozs7VUV6Tkg7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2Nocm9tZS1leHQtb2RhdGEtYmF0Y2gtdmlld2VyLy4vc3JjL3BhbmVsLnRzIiwid2VicGFjazovL2Nocm9tZS1leHQtb2RhdGEtYmF0Y2gtdmlld2VyL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dC1vZGF0YS1iYXRjaC12aWV3ZXIvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2Nocm9tZS1leHQtb2RhdGEtYmF0Y2gtdmlld2VyL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBHZXQgdGhlIGRpdiB3aGVyZSB0aGUgWEhSIGxpc3Qgd2lsbCBiZSBkaXNwbGF5ZWRcbmNvbnN0IHhockxpc3REaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInhoci1saXN0XCIpO1xuY29uc3QgeGhyTm9EYXRhRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ4aHItbm8tZGF0YVwiKTtcblxuLy8gRnVuY3Rpb24gdG8gY2xlYXIgdGhlIFhIUiBsaXN0IHdoZW4gdGhlIHBhZ2UgaXMgcmVsb2FkZWRcbmZ1bmN0aW9uIGNsZWFyWEhSTGlzdCgpIHtcblx0eGhyTGlzdERpdiEuaW5uZXJIVE1MID0gXCJcIjtcblx0eGhyTGlzdERpdiEuaGlkZGVuID0gdHJ1ZTtcblxuXHR4aHJOb0RhdGFEaXYhLmhpZGRlbiA9IGZhbHNlO1xuXHR4aHJOb0RhdGFEaXYhLmlubmVySFRNTCA9IFwiPHA+Tm8gcmVxdWVzdHMgeWV0LjwvcD5cIjtcbn1cblxudHlwZSBPRGF0YUJhdGNoID0ge1xuICByZXF1ZXN0czogT0RhdGFSZXF1ZXN0W107XG59O1xuXG50eXBlIE9EYXRhUmVxdWVzdCA9IHtcbiAgcmVxdWVzdDogc3RyaW5nO1xuICBwYXlsb2FkPzogc3RyaW5nO1xuICByZXNwb25zZTogdW5rbm93bjtcbn07XG5cbi8vIENoZWNrIHRoZSBjdXJyZW50IHRoZW1lIG9mIHRoZSBDaHJvbWUgRGV2VG9vbHNcbmNvbnN0IHRoZW1lID0gY2hyb21lLmRldnRvb2xzLnBhbmVscy50aGVtZU5hbWU7XG5cbi8vIER5bmFtaWNhbGx5IGFwcGx5IHRoZSB0aGVtZSB0byB0aGUgZG9jdW1lbnQgYm9keVxuZnVuY3Rpb24gYXBwbHlUaGVtZSgpIHtcbiAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XG5cbiAgaWYgKHRoZW1lID09PSBcImRhcmtcIikge1xuICAgIGJvZHkuY2xhc3NMaXN0LmFkZChcImRhcmstdGhlbWVcIik7XG4gICAgYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwibGlnaHQtdGhlbWVcIik7XG4gIH0gZWxzZSB7XG4gICAgYm9keS5jbGFzc0xpc3QuYWRkKFwibGlnaHQtdGhlbWVcIik7XG4gICAgYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwiZGFyay10aGVtZVwiKTtcbiAgfVxufVxuXG4vLyBBcHBseSB0aGUgdGhlbWUgb24gcGFnZSBsb2FkXG5hcHBseVRoZW1lKCk7XG5cbi8vIE9wdGlvbmFsbHksIGxpc3RlbiBmb3IgdGhlbWUgY2hhbmdlcyAodGhvdWdoIERldlRvb2xzIGRvZXMgbm90IHByb3ZpZGUgYSBkaXJlY3QgbGlzdGVuZXIgZm9yIHRoZW1lIGNoYW5nZXMsIHRoaXMgaXMgZnV0dXJlLXByb29maW5nKVxuLy8gY2hyb21lLmRldnRvb2xzLnBhbmVscy5vblRoZW1lQ2hhbmdlZC5hZGRMaXN0ZW5lcigoKSA9PiB7XG4vLyAgIGFwcGx5VGhlbWUoKTtcbi8vIH0pO1xuXG4vLyBMaXN0ZW4gdG8gdGhlIHBhZ2UgbmF2aWdhdGlvbiBldmVudFxuY2hyb21lLmRldnRvb2xzLm5ldHdvcmsub25OYXZpZ2F0ZWQuYWRkTGlzdGVuZXIoKCkgPT4ge1xuICBjb25zb2xlLmxvZyhcIlBhZ2UgbmF2aWdhdGVkIVwiKTtcbiAgY29uc29sZS5sb2coXCJjaHJvbWUuZGV2dG9vbHMucGFuZWxzLnRoZW1lTmFtZVwiLCBjaHJvbWUuZGV2dG9vbHMucGFuZWxzLnRoZW1lTmFtZSk7XG5cbiAgY2xlYXJYSFJMaXN0KCk7IC8vIENsZWFyIHRoZSBsaXN0IHdoZW4gdGhlIHBhZ2UgaXMgbmF2aWdhdGVkIG9yIHJlZnJlc2hlZFxufSk7XG5cbmZ1bmN0aW9uIGNyZWF0ZVRhYmxlUm93KHZhbDE6IHN0cmluZywgdmFsMjogc3RyaW5nLCBhbHRlcm5hdGU6IGJvb2xlYW4gPSBmYWxzZSkge1xuXHQvLyBDcmVhdGUgYW5kIGFwcGx5IHN0eWxlcyBmb3IgdGhlIGZpcnN0IGNvbHVtblxuXHRjb25zdCBmaXJzdENvbHVtblN0eWxlID0gJ3dpZHRoOiAxMjBweDsgZm9udC13ZWlnaHQ6IGJvbGQ7JztcblxuXHRjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xuXHQvLyBDcmVhdGUgZmlyc3QgY29sdW1uICh3aXRoIGZpeGVkIHdpZHRoKVxuXHRjb25zdCBmaXJzdENvbHVtbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG5cdGZpcnN0Q29sdW1uLnN0eWxlLmNzc1RleHQgPSBmaXJzdENvbHVtblN0eWxlO1xuXHRmaXJzdENvbHVtbi5pbm5lclRleHQgPSB2YWwxO1xuXHRyb3cuYXBwZW5kQ2hpbGQoZmlyc3RDb2x1bW4pO1xuXG5cdC8vIENyZWF0ZSBzZWNvbmQgY29sdW1uXG5cdGNvbnN0IHNlY29uZENvbHVtbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG5cdHNlY29uZENvbHVtbi5pbm5lclRleHQgPSB2YWwyO1xuXHRyb3cuYXBwZW5kQ2hpbGQoc2Vjb25kQ29sdW1uKTtcblxuXHRpZiAoYWx0ZXJuYXRlKSB7XG5cdFx0cm93LmNsYXNzTmFtZSA9ICdhbHRlcm5hdGUnO1xuXHR9XG5cblx0cmV0dXJuIHJvdztcbn1cblxuZnVuY3Rpb24gY3JlYXRlVGFibGVSb3dXaXRoSlNPTih2YWwxOiBzdHJpbmcsIHZhbDI6IHN0cmluZywgYWx0ZXJuYXRlOiBib29sZWFuID0gZmFsc2UpIHtcblx0Ly8gQ3JlYXRlIGFuZCBhcHBseSBzdHlsZXMgZm9yIHRoZSBmaXJzdCBjb2x1bW5cblx0Y29uc3QgZmlyc3RDb2x1bW5TdHlsZSA9ICd3aWR0aDogMTIwcHg7IHZlcnRpY2FsLWFsaWduOiB0b3A7IGZvbnQtd2VpZ2h0OiBib2xkOyc7XG5cblx0Y29uc3Qgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcblx0Ly8gQ3JlYXRlIGZpcnN0IGNvbHVtbiAod2l0aCBmaXhlZCB3aWR0aClcblx0Y29uc3QgZmlyc3RDb2x1bW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuXHRmaXJzdENvbHVtbi5zdHlsZS5jc3NUZXh0ID0gZmlyc3RDb2x1bW5TdHlsZTtcblx0Zmlyc3RDb2x1bW4uaW5uZXJUZXh0ID0gdmFsMTtcblx0cm93LmFwcGVuZENoaWxkKGZpcnN0Q29sdW1uKTtcblxuXHQvLyBDcmVhdGUgc2Vjb25kIGNvbHVtblxuXHRjb25zdCBzZWNvbmRDb2x1bW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuXHRjb25zdCBqc29uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwcmV0dHktanNvblwiKTtcblx0anNvbkVsZW1lbnQudGV4dENvbnRlbnQgPSB2YWwyO1xuXHRzZWNvbmRDb2x1bW4uYXBwZW5kQ2hpbGQoanNvbkVsZW1lbnQpO1xuXG5cdHJvdy5hcHBlbmRDaGlsZChzZWNvbmRDb2x1bW4pO1xuXG5cdGlmIChhbHRlcm5hdGUpIHtcblx0XHRyb3cuY2xhc3NOYW1lID0gJ2FsdGVybmF0ZSc7XG5cdH1cblxuXHRyZXR1cm4gcm93O1xufVxuXG4vLyBMaXN0ZW4gdG8gbmV0d29yayByZXF1ZXN0c1xuY2hyb21lLmRldnRvb2xzLm5ldHdvcmsub25SZXF1ZXN0RmluaXNoZWQuYWRkTGlzdGVuZXIoYXN5bmMgKHJlcXVlc3QpID0+IHtcbiAgLy8gRmlsdGVyIG91dCBub24tWEhSIHJlcXVlc3RzXG4gIGlmIChcbiAgICAocmVxdWVzdC5fcmVzb3VyY2VUeXBlID09PSBcInhoclwiIHx8IHJlcXVlc3QuX3Jlc291cmNlVHlwZSA9PT0gXCJmZXRjaFwiKSAmJlxuICAgIHJlcXVlc3QucmVxdWVzdC51cmwuaW5jbHVkZXMoXCIkYmF0Y2hcIilcbiAgKSB7XG5cdHhock5vRGF0YURpdiEuaGlkZGVuID0gdHJ1ZTtcblx0eGhyTGlzdERpdiEuaGlkZGVuID0gZmFsc2U7XG5cblx0Ly8gRXh0cmFjdCByZWxldmFudCBpbmZvcm1hdGlvblxuICAgIGNvbnN0IG1ldGhvZCA9IHJlcXVlc3QucmVxdWVzdC5tZXRob2Q7XG4gICAgY29uc3QgdXJsID0gcmVxdWVzdC5yZXF1ZXN0LnVybDtcbiAgICBjb25zdCBzdGF0dXMgPSByZXF1ZXN0LnJlc3BvbnNlLnN0YXR1cztcblxuXHQvLyBDcmVhdGUgdGhlIHRhYmxlIGVsZW1lbnRcblx0Y29uc3QgdGFibGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0YWJsZScpO1xuXHR0YWJsZS5zdHlsZS53aWR0aCA9ICcxMDAlJztcblxuXHRcblxuICAgIC8vIENyZWF0ZSBhIG5ldyBlbGVtZW50IHRvIGRpc3BsYXkgdGhlIHJlcXVlc3RcbiAgICAvLyBjb25zdCB4aHJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG5cblx0Y29uc3QgZm9ybURhdGEgPSByZXF1ZXN0LnJlcXVlc3QucG9zdERhdGE/LnRleHQ7XG5cdGNvbnN0IGJvdW5kYXJ5ID0gZm9ybURhdGE/LnNwbGl0KFwiXFxyXFxuXCIpWzBdO1xuXG5cdGNvbnN0IHJlcXVlc3RzOiBPRGF0YVJlcXVlc3RbXSA9IFtdO1xuXG5cdGlmIChib3VuZGFyeSkge1xuXHRcdGNvbnN0IHBhcnRzID0gZm9ybURhdGE/LnNwbGl0KGJvdW5kYXJ5KTtcblxuXHRcdHBhcnRzPy5mb3JFYWNoKGFzeW5jIChwYXJ0KSA9PiB7XG5cdFx0XHQvLyBjb25zb2xlLmxvZyhcIlBBUlRcIiwgcGFydCk7XG5cblx0XHRcdGNvbnN0IGxpbmVzID0gcGFydC5zcGxpdChcIlxcclxcblwiKTtcblx0XHRcdGNvbnN0IHR5cGVzID0gW1wiR0VUXCIsIFwiUE9TVFwiLCBcIlBVVFwiLCBcIlBBVENIXCIsIFwiREVMRVRFXCJdO1xuXHRcdFx0Y29uc3QgcmVxdWVzdEluQmF0Y2ggPSBsaW5lcy5maW5kKChsaW5lKSA9PlxuXHRcdFx0XHR0eXBlcy5zb21lKCh0eXBlKSA9PiBsaW5lLmluY2x1ZGVzKHR5cGUpKVxuXHRcdFx0KTtcblxuXHRcdFx0aWYgKHJlcXVlc3RJbkJhdGNoKSB7XG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKFwiT0RBVEEgUkVRVUVTVFwiLCByZXF1ZXN0SW5CYXRjaCk7XG5cblx0XHRcdFx0Y29uc3QgcGF5bG9hZCA9IGxpbmVzLmZpbmQoKGxpbmUpID0+IGxpbmUuc3RhcnRzV2l0aChcIntcIikpO1xuXG5cdFx0XHRcdHJlcXVlc3QuZ2V0Q29udGVudCgoY29udGVudCwgZW5jb2RpbmcpID0+IHtcblx0XHRcdFx0XHRjb25zdCBkZWNvZGVkQ29udGVudCA9IGF0b2IoY29udGVudCk7XG5cdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coXCJSRVNQT05TRSBkYXRhXCIsIGF0b2IoZGVjb2RlZENvbnRlbnQpKTtcblx0XHRcblx0XHRcdFx0XHRjb25zdCByZXNwb25zZVBhcnRzID0gZGVjb2RlZENvbnRlbnQuc3BsaXQoYm91bmRhcnkpO1xuXHRcdFxuXHRcdFx0XHRcdHJlc3BvbnNlUGFydHMuZm9yRWFjaCgocGFydCkgPT4ge1xuXHRcdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coXCJSRVNQT05TRSBQQVJUXCIsIHBhcnQpO1xuXHRcdFxuXHRcdFx0XHRcdFx0Y29uc3QgcmVzcG9uc2VMaW5lcyA9IHBhcnQuc3BsaXQoXCJcXHJcXG5cIik7XG5cdFx0XG5cdFx0XHRcdFx0XHRpZiAocmVzcG9uc2VMaW5lcy5sZW5ndGggPiAyKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHJlc3BvbnNlID0gcmVzcG9uc2VMaW5lc1tyZXNwb25zZUxpbmVzLmxlbmd0aCAtIDJdO1xuXHRcdFxuXHRcdFx0XHRcdFx0XHRjb25zdCBvZGF0YVJlcXVlc3Q6IE9EYXRhUmVxdWVzdCA9IHtcblx0XHRcdFx0XHRcdFx0XHRyZXF1ZXN0OiByZXF1ZXN0SW5CYXRjaCxcblx0XHRcdFx0XHRcdFx0XHRwYXlsb2FkLFxuXHRcdFx0XHRcdFx0XHRcdHJlc3BvbnNlLFxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFxuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0Ly8gQXBwZW5kIHRoZSByb3cgdG8gdGhlIHRhYmxlXG5cdFx0XHRcdFx0XHRcdHRhYmxlLmFwcGVuZENoaWxkKGNyZWF0ZVRhYmxlUm93KFwiUmVxdWVzdFwiLCBvZGF0YVJlcXVlc3QucmVxdWVzdCwgdHJ1ZSkpO1xuXG5cdFx0XHRcdFx0XHRcdC8vIGNvbnN0IHJlcXVlc3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG5cdFx0XHRcdFx0XHRcdC8vIHJlcXVlc3RFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpKS5pbm5lclRleHQgPSBcIlJlcXVlc3Q6IFwiO1xuXHRcdFx0XHRcdFx0XHQvLyByZXF1ZXN0RWxlbWVudC5pbm5lclRleHQgPSBgUmVxdWVzdDogJHtvZGF0YVJlcXVlc3QucmVxdWVzdH1gO1xuXHRcdFx0XHRcdFx0XHQvLyB4aHJFbGVtZW50LmFwcGVuZENoaWxkKHJlcXVlc3RFbGVtZW50KTtcblxuXHRcdFx0XHRcdFx0XHRpZiAocGF5bG9hZCkge1xuXHRcdFx0XHRcdFx0XHRcdHRhYmxlLmFwcGVuZENoaWxkKGNyZWF0ZVRhYmxlUm93V2l0aEpTT04oXCJQYXlsb2FkXCIsIHBheWxvYWQsIHRydWUpKTtcblx0XHRcdFx0XHRcdFx0XHQvLyBjb25zdCBwYXlsb2FkRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuXHRcdFx0XHRcdFx0XHRcdC8vIHBheWxvYWRFbGVtZW50LmlubmVyVGV4dCA9IFwiUGF5bG9hZDpcIjtcblx0XHRcdFx0XHRcdFx0XHQvLyB4aHJFbGVtZW50LmFwcGVuZENoaWxkKHBheWxvYWRFbGVtZW50KTtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIGNvbnN0IHBheWxvYWRKU09ORWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwcmV0dHktanNvblwiKTtcblx0XHRcdFx0XHRcdFx0XHQvLyBjb25zdCBwYXlsb2FkRm9ybWF0dGVkID0gSlNPTi5zdHJpbmdpZnkoSlNPTi5wYXJzZShvZGF0YVJlcXVlc3QucGF5bG9hZCBhcyBzdHJpbmcpLCBudWxsLCAyKTtcblx0XHRcdFx0XHRcdFx0XHQvLyBwYXlsb2FkSlNPTkVsZW1lbnQudGV4dENvbnRlbnQgPSBwYXlsb2FkRm9ybWF0dGVkOyAvLyA/IEpTT04uc3RyaW5naWZ5KG9kYXRhUmVxdWVzdC5yZXNwb25zZSwgbnVsbCwgMikgOiBcIlwiO1xuXHRcdFx0XHRcdFx0XHRcdC8vIHhockVsZW1lbnQuYXBwZW5kQ2hpbGQocGF5bG9hZEpTT05FbGVtZW50KTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdHRhYmxlLmFwcGVuZENoaWxkKGNyZWF0ZVRhYmxlUm93V2l0aEpTT04oXCJSZXNwb25zZVwiLCBvZGF0YVJlcXVlc3QucmVzcG9uc2UgYXMgc3RyaW5nKSk7XG5cdFx0XHRcdFx0XHRcdC8vIGNvbnN0IHJlc3BvbnNlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuXHRcdFx0XHRcdFx0XHQvLyByZXNwb25zZUVsZW1lbnQuaW5uZXJUZXh0ID0gXCJSZXNwb25zZTpcIjtcblx0XHRcdFx0XHRcdFx0Ly8geGhyRWxlbWVudC5hcHBlbmRDaGlsZChyZXNwb25zZUVsZW1lbnQpO1xuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0Ly8gY29uc3QganNvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicHJldHR5LWpzb25cIik7XG5cdFx0XHRcdFx0XHRcdC8vIGNvbnN0IGpzb25Gb3JtYXR0ZWQgPSBKU09OLnN0cmluZ2lmeShKU09OLnBhcnNlKG9kYXRhUmVxdWVzdC5yZXNwb25zZSBhcyBzdHJpbmcpLCBudWxsLCAyKTtcblx0XHRcdFx0XHRcdFx0Ly8ganNvbkVsZW1lbnQudGV4dENvbnRlbnQgPSBvZGF0YVJlcXVlc3QucmVzcG9uc2UgYXMgc3RyaW5nOyAvLyA/IEpTT04uc3RyaW5naWZ5KG9kYXRhUmVxdWVzdC5yZXNwb25zZSwgbnVsbCwgMikgOiBcIlwiO1xuXHRcdFx0XHRcdFx0XHQvLyB4aHJFbGVtZW50LmFwcGVuZENoaWxkKGpzb25FbGVtZW50KTtcblxuXG5cdFx0XHRcdFx0XHRcdC8vIGNvbnN0IGpzb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInByZXR0eS1qc29uXCIpO1xuXHRcdFx0XHRcdFx0XHQvLyBjb25zdCBqc29uRm9ybWF0dGVkID0gSlNPTi5zdHJpbmdpZnkoSlNPTi5wYXJzZShvZGF0YVJlcXVlc3QucmVzcG9uc2UgYXMgc3RyaW5nKSwgbnVsbCwgMik7XG5cdFx0XHRcdFx0XHRcdC8vIGpzb25FbGVtZW50LmlubmVySFRNTCA9IGpzb25Gb3JtYXR0ZWQ7IC8vID8gSlNPTi5zdHJpbmdpZnkob2RhdGFSZXF1ZXN0LnJlc3BvbnNlLCBudWxsLCAyKSA6IFwiXCI7XG5cdFx0XHRcdFx0XHRcdC8vIHhockVsZW1lbnQuYXBwZW5kQ2hpbGQoanNvbkVsZW1lbnQpO1xuXG5cblx0XHRcdFx0XHRcdFx0Ly8geGhyTGlzdERpdiEuYXBwZW5kQ2hpbGQoeGhyRWxlbWVudCk7XG5cdFx0XHRcdFx0XHRcdHhockxpc3REaXYhLmFwcGVuZENoaWxkKHRhYmxlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbiAgfVxufSk7XG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IHt9O1xuX193ZWJwYWNrX21vZHVsZXNfX1tcIi4vc3JjL3BhbmVsLnRzXCJdKCk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=