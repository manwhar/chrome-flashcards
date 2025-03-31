// popup.js - Handles adding new flashcards and populating the group dropdown.

document.addEventListener("DOMContentLoaded", function() {
  const groupDropdown = document.getElementById("groupDropdown");
  const saveFlashcardBtn = document.getElementById("saveFlashcardBtn");
  const frontInput = document.getElementById("frontInput");
  const backInput = document.getElementById("backInput");

  // Populate the dropdown with available groups.
  function populateGroupDropdown() {
    chrome.storage.local.get(["groups"], function(data) {
      const groups = data.groups || {};
      groupDropdown.innerHTML = "";
      // If no groups exist, show "Uncategorized".
      if (Object.keys(groups).length === 0) {
        const option = document.createElement("option");
        option.value = "Uncategorized";
        option.text = "Uncategorized";
        groupDropdown.appendChild(option);
      } else {
        for (let groupName in groups) {
          const option = document.createElement("option");
          option.value = groupName;
          option.text = groupName;
          groupDropdown.appendChild(option);
        }
      }
    });
  }

  populateGroupDropdown();

  // Save flashcard to the selected group.
  saveFlashcardBtn.addEventListener("click", function() {
    const frontText = frontInput.value.trim();
    const backText = backInput.value.trim();
    const selectedGroup = groupDropdown.value;

    if (!frontText || !backText) {
      alert("Please enter both front and back text for the flashcard.");
      return;
    }

    chrome.storage.local.get(["groups"], function(data) {
      const groups = data.groups || {};
      // If the selected group does not exist (for example, "Uncategorized"), create it.
      if (!groups[selectedGroup]) {
        groups[selectedGroup] = { flashcards: [], color: "#cccccc" }; // Default color.
      }
      const newFlashcard = {
        front: frontText,
        back: backText,
        correctCount: 0
      };
      groups[selectedGroup].flashcards.push(newFlashcard);
      chrome.storage.local.set({ groups: groups }, function() {
        alert("Flashcard saved successfully!");
        frontInput.value = "";
        backInput.value = "";
      });
    });
  });
});
