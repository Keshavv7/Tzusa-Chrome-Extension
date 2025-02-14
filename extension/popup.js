// document.addEventListener("DOMContentLoaded", function () {
//     const responseElement = document.getElementById("response");

//     // Listen for messages from content.js
//     chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//         if (request.message) {
//             responseElement.innerText = request.message;

//             // Erase text after 10 seconds
//             setTimeout(() => {
//                 responseElement.innerText = "";
//             }, 10000);
//         }
//     });
// });

document.getElementById("start").addEventListener("click", function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "start_extension" });
    });
});

