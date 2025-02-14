function getTextFromPage() {
    return document.body.innerText.slice(0, 1000); // Limit text to avoid large payloads
}

function getVisibleText() {
    let visibleText = "";

    // Get all elements in the body
    let elements = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, div, span, li");

    elements.forEach((element) => {
        // Check if element is visible in the viewport
        let rect = element.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
            visibleText += element.innerText + " ";
        }
    });

    return visibleText.slice(0, 1000); // Limit length to avoid large payloads
}

var active = true;
var intervalID = null;

const mascotImages = [chrome.runtime.getURL("imgs/img_01.png"),
    chrome.runtime.getURL("imgs/img_02.png"),
    chrome.runtime.getURL("imgs/img_03.png")];
const idleMessages = ["thinking...", "just existing...", "tired to speak..."];


async function sendTextToBackend() {
    if (!active) {
        return;
    }
    const text = getTextFromPage();
    // const text = getVisibleText()

    try {
        const response = await fetch("http://127.0.0.1:8000/get_response", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: text })
        });

        const data = await response.json();

        console.log(data.response)

        updatePopupText(data.response);
        
    } catch (error) {
        console.error("Error fetching AI response:", error);
    }
}

function createFloatingPopup() {
    // Check if the popup already exists
    if (document.getElementById("tsuza-popup")) return;

    // Create popup container
    let popup = document.createElement("div");
    popup.id = "tsuza-popup";
    popup.style.position = "fixed";
    popup.style.bottom = "20px";
    popup.style.right = "20px";
    popup.style.width = "250px";
    popup.style.padding = "15px";
    popup.style.backgroundColor = "#222";
    popup.style.color = "#fff";
    popup.style.borderRadius = "10px";
    popup.style.boxShadow = "0px 4px 6px rgba(0,0,0,0.1)";
    popup.style.zIndex = "9999";
    popup.style.fontFamily = "Arial, sans-serif";
    popup.style.textAlign = "center";

    // Mascot Image
    let mascotImg = document.createElement("img");
    mascotImg.id = "mascot-img";
    mascotImg.src = mascotImages[0]; // Default image
    mascotImg.style.width = "100px";
    mascotImg.style.height = "150px";
    mascotImg.style.display = "block";
    mascotImg.style.margin = "0 auto";
    popup.appendChild(mascotImg);

    // Create response text area
    let responseText = document.createElement("p");
    responseText.style.padding = "10px";
    responseText.id = "tsuza-response";
    responseText.innerText = "Waiting for response...";
    popup.appendChild(responseText);

    // Create Hide Button
    let hideButton = document.createElement("button");
    hideButton.innerText = "Hide";
    hideButton.style.marginTop = "10px";
    hideButton.style.padding = "5px 10px";
    hideButton.style.border = "none";
    hideButton.style.borderRadius = "5px";
    hideButton.style.cursor = "pointer";
    hideButton.style.backgroundColor = "#FF4444";
    hideButton.style.color = "#fff";
    
    hideButton.onclick = function () {
        popup.style.display = "none";
        active = false;
        chrome.storage.local.set({ tsuzaActive: false });

        // Stop API calls
        if (intervalId) {
            clearInterval(intervalID);
            intervalID = null;
        }
    };

    popup.appendChild(hideButton);
    document.body.appendChild(popup);
}

function updatePopupText(message) {
    let responseElement = document.getElementById("tsuza-response");
    let mascotImg = document.getElementById("mascot-img");

    if (responseElement) {
        if (message.trim()) {
            mascotImg.src = mascotImages[Math.floor(Math.random() * mascotImages.length)]; // Change mascot
            responseElement.innerText = message;
        } else {
            mascotImg.src = mascotImages[0]; // Default mascot
            responseElement.innerText = idleMessages[Math.floor(Math.random() * idleMessages.length)]; // Show idle msg
        }
        // responseElement.innerText = message;

        // Auto-hide text after 10 seconds
        setTimeout(() => {
            mascotImg.src = mascotImages[0]; // Back to default mascot
            responseElement.innerText = idleMessages[Math.floor(Math.random() * idleMessages.length)];
        }, 10000);
    }
}



// Initialize the popup only when the extension action is clicked
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "start_extension") {
        createFloatingPopup();
        active = true;
        chrome.storage.local.set({ tsuzaActive: true });
        
        // Start API calls only if they aren't already running
        if (!intervalID) {
            sendTextToBackend(); // First call immediately
            intervalID = setInterval(sendTextToBackend, 15000);
        }
    }
});

// Restore popup state on page load
window.onload = function () {
    chrome.storage.local.get("tsuzaActive", function (data) {
        if (data.tsuzaActive) {
            active = true;
            createFloatingPopup();
            if (!intervalID) {
                sendTextToBackend();
                intervalID = setInterval(sendTextToBackend, 15000);
            }
        }
    });
};

// createFloatingPopup();
// if (active){
//     sendTextToBackend();

    // Trigger every 30 seconds
    // setInterval(sendTextToBackend, 15000);
    // window.addEventListener("scroll", () => {
    //     sendTextToBackend();
    // });
// }
