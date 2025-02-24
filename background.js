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
setInterval(injectBox, 1000);

// function to be injected into page
function createOrRemoveBox() {
    if (document.getElementById("flashcard-box")) return;

    // make the flashcard
    const box = document.createElement("div");
    box.id = "flashcard-box";
    box.className = "flashcard-box";

    // text on flashcard
    const flashcard_text = {
        front: "click meeee",
        back: "clicked!"
    };

    // the test on front side
    box.innerText = flashcard_text.front;

    // whatmakes it flip
    function flipFlashcard() {
        box.classList.toggle("is-flipped");
        // toggle text for 0.6 seconds to avoid visual glitch
        setTimeout(() => {
            box.innerText = box.classList.contains("is-flipped") ? flashcard_text.back : flashcard_text.front;
        }, 300);
        // make flashcard go away after 5 seconds
        setTimeout(() => {
            box.remove();
        }, 5000);
    }

    // Click event to flip the flashcard
    box.onclick = flipFlashcard;
    document.body.appendChild(box);
}
