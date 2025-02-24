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

// runs every 10 seconds hiiiiiiii
setInterval(injectBox, 10000);

// function to be injected into page
function createOrRemoveBox() {
    if (document.getElementById("flashcard-box")) return;

    // create box
    const box = document.createElement("div");
    const flashcard_text = {
        "front": "click meeee",
        "back": "clicked!"
    }

    box.id = "flashcard-box";
    box.innerText = flashcard_text.front // placeholder
    box.className = "flashcard-box" // class for css styling
    
    // function that runs when flashcard is clicked
    function flipFlashcard(element) {
        element.innerText = flashcard_text.back;
        setTimeout(function () {
            element.remove()
        }, 2000)
        card.classList.toggle('is-flipped');
    }

    // remove box on click
    box.onclick = () => {
        flipFlashcard(box);
    }

    document.body.appendChild(box);
}