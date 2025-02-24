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
    front.innerText = "click meeee";
    // make back 
    const back = document.createElement("div");
    back.className = "flashcard-face flashcard-back";
    back.innerText = "clicked!";
  
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
  }
  