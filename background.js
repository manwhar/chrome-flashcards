// function to be injected into page
function createOrRemoveBox() {
    if (document.getElementById("flashcard-box")) return;
  
    // retrieve data from flashcard storage
    chrome.storage.local.get(["flashcards"], function (result) {
      console.log("Retrieved data:", result.flashcards);
  
      // make sure any flashcards exist
      if (!result.flashcards || Object.keys(result.flashcards).length === 0) {
        console.log("No flashcards found.");
        return;
      }
  
      // --- Weighted Random Selection Based on 'known' status ---
      const keys = Object.keys(result.flashcards);
      let totalWeight = 0;
      let weights = [];
      keys.forEach(key => {
        let card = result.flashcards[key];
        // Use correctCount if exists, else default to 0.
        let count = card.correctCount || 0;
        // If card is not yet "known" (< 3 correct), weight = 1; if known, weight = 0.2.
        let weight = count < 3 ? 1 : 0.2;
        weights.push(weight);
        totalWeight += weight;
      });
      let randomVal = Math.random() * totalWeight;
      let selectedKey;
      for (let i = 0; i < keys.length; i++) {
        randomVal -= weights[i];
        if (randomVal <= 0) {
          selectedKey = keys[i];
          break;
        }
      }
      const flashcard = result.flashcards[selectedKey];
      const frontText = flashcard["front"];
      const backText = flashcard["back"];
  
      console.log("Selected flashcard:", selectedKey, flashcard);
  
      // --- Build the Flashcard Popup ---
      // Outer container
      const box = document.createElement("div");
      box.id = "flashcard-box";
      box.className = "flashcard-box";
      // Basic inline styles (adjust as needed or move to a CSS file)
      box.style.position = "fixed";
      box.style.top = "50%";
      box.style.left = "50%";
      box.style.transform = "translate(-50%, -50%)";
      box.style.zIndex = "9999";
      box.style.backgroundColor = "#fff";
      box.style.padding = "20px";
      box.style.borderRadius = "10px";
      box.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)";
  
      // Inner container for flip effect
      const inner = document.createElement("div");
      inner.className = "flashcard-inner";
      inner.style.position = "relative";
      inner.style.transition = "transform 0.6s";
      inner.style.transformStyle = "preserve-3d";
  
      // Front face
      const front = document.createElement("div");
      front.className = "flashcard-face flashcard-front";
      front.innerText = frontText;
      front.style.position = "absolute";
      front.style.backfaceVisibility = "hidden";
  
      // Back face
      const back = document.createElement("div");
      back.className = "flashcard-face flashcard-back";
      back.innerText = backText;
      back.style.position = "absolute";
      back.style.transform = "rotateY(180deg)";
      back.style.backfaceVisibility = "hidden";
  
      inner.appendChild(front);
      inner.appendChild(back);
      box.appendChild(inner);
  
      // --- Add the Close (X) Button ---
      const closeButton = document.createElement("button");
      closeButton.className = "close-button";
      closeButton.innerText = "X";
      closeButton.style.position = "absolute";
      closeButton.style.top = "10px";
      closeButton.style.right = "10px";
      closeButton.onclick = (e) => {
        e.stopPropagation();
        box.remove();
      };
      box.appendChild(closeButton);
  
      // --- Add the Check (✓) Button ---
      const checkButton = document.createElement("button");
      checkButton.className = "check-button";
      checkButton.innerText = "✓";
      checkButton.style.position = "absolute";
      checkButton.style.top = "10px";
      checkButton.style.left = "10px";
      // Hide by default until the card is flipped
      checkButton.style.display = "none";
      checkButton.onclick = (e) => {
        e.stopPropagation();
        // Increment the correct count for this flashcard
        flashcard.correctCount = (flashcard.correctCount || 0) + 1;
        console.log("Updated correct count for", selectedKey, flashcard.correctCount);
        // Update the flashcard in storage
        chrome.storage.local.get(["flashcards"], function (data) {
          let allFlashcards = data.flashcards;
          allFlashcards[selectedKey] = flashcard;
          chrome.storage.local.set({ flashcards: allFlashcards });
        });
        // Remove the popup after marking as known
        box.remove();
      };
      box.appendChild(checkButton);
  
      // --- Flip Event Handling ---
      box.onclick = () => {
        box.classList.toggle("flipped");
        if (box.classList.contains("flipped")) {
          // When flipped, show the check button and flip inner container
          checkButton.style.display = "block";
          inner.style.transform = "rotateY(180deg)";
        } else {
          // When unflipped, hide the check button
          checkButton.style.display = "none";
          inner.style.transform = "rotateY(0deg)";
        }
      };
  
      document.body.appendChild(box);
    });
  }
  