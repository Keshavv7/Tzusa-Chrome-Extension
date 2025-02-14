

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     if (changeInfo.status === "complete" && tab.url && !tab.url.startsWith("chrome://")) {
//         chrome.scripting.executeScript({
//             target: { tabId: tabId },
//             files: ["content.js"]
//         });
//     }
// });

chrome.runtime.onInstalled.addListener(() => {
    console.log("Tsuza Extension Installed");
});

// Keep listening for messages even when popup is closed
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message) {
        chrome.storage.local.set({ latestResponse: request.message });
    }
});
