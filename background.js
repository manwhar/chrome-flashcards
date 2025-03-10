// inject script into current active tab
function injectBox() {
    chrome.tabs.query({ active:true, currentWindow: true}, (tabs) => {
        if (tabs.length === 0) return;
        const tabId = tabs[0].id;

        chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: createOrRemoveBox
        });
    });
}

// runs every second
let intervalTime = 5000; // Default time
let intervalId;

function startTimer() {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(injectBox, intervalTime);
}

// Load timer from storage
chrome.storage.sync.get("timerInterval", function (data) {
    if (data.timerInterval) {
        intervalTime = data.timerInterval;
    }
    startTimer();
});

// Listen for updates
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "updateTimer") {
        chrome.storage.sync.get("timerInterval", function (data) {
            if (data.timerInterval) {
                intervalTime = data.timerInterval;
                startTimer();
            }
        });
    }
});

// function to be injected into page
function createOrRemoveBox() {
    if (document.getElementById("flashcard-box")) return;
    
    // retrieve data from flashcard storage
    chrome.storage.local.get(["flashcards"], function(result) {
        
        console.log("Retrieved data:", result.flashcards);
        
        // make sure any flashcards exist
        if (!result.flashcards || Object.keys(result.flashcards).length === 0) {
            console.log("No flashcards found.");
            return;
        }
    
        // pick a random flashcard to display
        const keys = Object.keys(result.flashcards);
        const flashcard = result.flashcards[keys[Math.floor(Math.random() * keys.length)]];
        const frontText = flashcard["front"];
        const backText = flashcard["back"]; 
    
        console.log("Front:", frontText);
        console.log("Back:", backText);
        
        // make outer container (for perspective)
        const box = document.createElement("div");
        box.id = "flashcard-box";
        box.className = "flashcard-box";
    
        // make inner container that will actually flip
        const inner = document.createElement("div");
        inner.className = "flashcard-inner";
    
        // make front 
        const front = document.createElement("div");
        front.className = "flashcard-face flashcard-front";
        front.innerText = frontText;
        // make back 
        const back = document.createElement("div");
        back.className = "flashcard-face flashcard-back";
        back.innerText = backText;
    
        // make the close (x) button and append it to the outer container (so it does not flip)
        const closeButton = document.createElement("button");
        closeButton.className = "close-button";
        closeButton.innerText = "X";
        closeButton.onclick = (e) => {
            e.stopPropagation();
            box.remove();
        };
        box.appendChild(closeButton);
        
        // append front/back to inner container, then inner container to outer box
        inner.appendChild(front);
        inner.appendChild(back);
        box.appendChild(inner);
    
        // flip event
        box.onclick = () => {
        box.classList.toggle("flipped");
        };
    
        document.body.appendChild(box);
    });
}
  