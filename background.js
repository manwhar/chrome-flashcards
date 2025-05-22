// background.js

function createOrRemoveBox() {
  // Inline injection of flashcard CSS (if not already present)
  if (!document.getElementById("flashcard-styles")) {
    const style = document.createElement("style");
    style.id = "flashcard-styles";
    style.innerText = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
      
      /* Outer container for flashcard popup */
      .flashcard-box {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 200px;
        height: 100px;
        perspective: 1000px;
        cursor: pointer;
        z-index: 9999;
      }

      /* Inner container for flip effect */
      .flashcard-inner {
        position: relative;
        width: 100%;
        height: 100%;
        transition: transform 0.6s;
        transform-style: preserve-3d;
      }

      /* Common flashcard face styles */
      .flashcard-face {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 2px solid black;
        box-shadow: 2px 2px 10px rgba(0,0,0,0.3);
        font-size: 16px;
        font-weight: bold;
        color: white;
        font-family: 'Poppins', sans-serif;
      }

      /* Front face (default background can be overridden) */
      .flashcard-front {
        background: purple;
      }

      /* Back face (rotated 180deg) */
      .flashcard-back {
        background: skyblue;
        transform: rotateY(180deg);
      }

      /* Flip effect: when .flipped is on .flashcard-box, rotate inner */
      .flashcard-box.flipped .flashcard-inner {
        transform: rotateY(180deg);
      }

      /* Close (X) button styling */
      .close-button {
        position: absolute !important;
        top: -12px !important;
        right: -12px !important;
        width: 24px !important;
        height: 24px !important;
        background: rgba(0, 0, 0, 0.5) !important;
        color: white !important;
        border: none !important;
        border-radius: 50% !important;
        font-size: 14px !important;
        line-height: 24px !important;
        text-align: center !important;
        padding: 0 !important;
        margin: 0 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        z-index: 2 !important;
        outline: none !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // If the flashcard already exists, do nothing.
  if (document.getElementById("flashcard-box")) return;

  // Inline helper: compute contrast color
  function getContrastYIQ(hexcolor) {
    hexcolor = hexcolor.replace("#", "");
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "#000" : "#fff";
  }

  // Helper: darken a hex color by a given percentage
  function darkenColor(hex, percent) {
    hex = hex.replace("#", "");
    let num = parseInt(hex, 16);
    let r = (num >> 16) - Math.round(((num >> 16) * percent) / 100);
    let g = ((num >> 8) & 0x00FF) - Math.round((((num >> 8) & 0x00FF) * percent) / 100);
    let b = (num & 0x0000FF) - Math.round(((num & 0x0000FF) * percent) / 100);
    r = r < 0 ? 0 : r;
    g = g < 0 ? 0 : g;
    b = b < 0 ? 0 : b;
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  // Retrieve flashcards from groups storage.
  chrome.storage.local.get(["groups"], function (result) {
    const groups = result.groups || {};
    let allFlashcards = [];

    Object.entries(groups).forEach(([groupName, group]) => {
      // Skip any group with enabled === false
      if (group.enabled === false) return;

      if (group.flashcards && group.flashcards.length > 0) {
        group.flashcards.forEach((flashcard) => {
          allFlashcards.push({
            ...flashcard,
            group: groupName,
            groupColor: group.color
          });
        });
      }
    });

    if (allFlashcards.length === 0) {
      console.log("No flashcards found or no groups enabled.");
      return;
    }

    // Weighted random selection based on 'correctCount'
    let totalWeight = 0;
    const weights = allFlashcards.map((card) => {
      const count = card.correctCount || 0;
      const weight = count < 3 ? 1 : 0.2;
      totalWeight += weight;
      return weight;
    });

    let randomVal = Math.random() * totalWeight;
    let selectedIndex = 0;
    for (let i = 0; i < allFlashcards.length; i++) {
      randomVal -= weights[i];
      if (randomVal <= 0) {
        selectedIndex = i;
        break;
      }
    }

    const flashcard = allFlashcards[selectedIndex];
    const frontText = flashcard.front;
    const backText = flashcard.back;
    const groupColor = flashcard.groupColor || "#cd1fff";
    const textColor = getContrastYIQ(groupColor);
    const backColor = darkenColor(groupColor, 20);

    // Build the flashcard popup
    const box = document.createElement("div");
    box.id = "flashcard-box";
    box.className = "flashcard-box";

    // Randomly position the box in one of four corners.
    const positions = [
      { bottom: "20px", right: "20px" },
      { bottom: "20px", left: "20px" },
      { top: "20px", right: "20px" },
      { top: "20px", left: "20px" }
    ];
    Object.assign(box.style, positions[Math.floor(Math.random() * positions.length)]);

    const inner = document.createElement("div");
    inner.className = "flashcard-inner";

    const front = document.createElement("div");
    front.className = "flashcard-face flashcard-front";
    front.innerText = frontText;
    front.style.backgroundColor = groupColor;
    front.style.color = textColor;

    const back = document.createElement("div");
    back.className = "flashcard-face flashcard-back";
    back.innerText = backText;
    back.style.backgroundColor = backColor;
    back.style.color = textColor;

    inner.append(front, back);
    box.append(inner);

    const closeButton = document.createElement("button");
    closeButton.className = "close-button";
    closeButton.innerText = "X";
    closeButton.onclick = e => {
      e.stopPropagation();
      box.remove();
    };
    box.append(closeButton);

    box.onclick = () => box.classList.toggle("flipped");
    document.body.append(box);
  });
}

function startRandomInterval() {
  chrome.storage.local.get(["minInterval", "maxInterval"], function(data) {
    const minTime = data.minInterval || 5;
    const maxTime = data.maxInterval || 10;
    function scheduleNextInjection() {
      const randomTime = Math.floor(Math.random() * (maxTime - minTime + 1) + minTime) * 1000;
      setTimeout(() => {
        injectBox();
        scheduleNextInjection();
      }, randomTime);
    }
    scheduleNextInjection();
  });
}

function injectBox() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (!tabs.length) return;
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: createOrRemoveBox
    });
  });
}

startRandomInterval();
