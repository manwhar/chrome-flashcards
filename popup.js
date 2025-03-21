document.addEventListener("DOMContentLoaded", function () {
    // populate group dropdown on load.
    populateGroupDropdown();
  });
  
  function populateGroupDropdown() {
    chrome.storage.local.get(["flashcards"], function (result) {
      const flashcards = result.flashcards || {};
      const groupSelect = document.getElementById("groupSelect");
      groupSelect.innerHTML = ""; // clear previous options
  
      // if no groups exist, add a default group.
      const groups = Object.keys(flashcards);
      if (groups.length === 0) {
        const defaultOption = document.createElement("option");
        defaultOption.value = "Default";
        defaultOption.text = "Default";
        groupSelect.appendChild(defaultOption);
      } else {
        groups.forEach(groupName => {
          const option = document.createElement("option");
          option.value = groupName;
          option.text = groupName;
          groupSelect.appendChild(option);
        });
      }
    });
  }
  
  document.getElementById("saveButton").addEventListener("click", function () {
    const questionInput = document.getElementById("questionInput");
    const answerInput = document.getElementById("answerInput");
    const groupSelect = document.getElementById("groupSelect");
  
    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();
    const group = groupSelect.value;
  
    if (!group) {
      alert("Please select a group.");
      return;
    }
    if (!question || !answer) {
      alert("Please enter both a question and an answer.");
      return;
    }
  
    chrome.storage.local.get(["flashcards"], function (result) {
      let flashcards = result.flashcards || {};
  
      // make group if it doesn't exist.
      if (!flashcards[group]) {
        flashcards[group] = [];
      }
  
      // add the new flashcard 
      flashcards[group].push({ front: question, back: answer });
  
      chrome.storage.local.set({ flashcards }, function () {
        if (chrome.runtime.lastError) {
          console.error("Error saving flashcard:", chrome.runtime.lastError);
        } else {
          // CLEAR the input fields after successful save.
          questionInput.value = "";
          answerInput.value = "";
          alert("Flashcard saved to group: " + group);
          // repopulate dropdown in case new groups were added elsewhere.
          populateGroupDropdown();
        }
      });
    });
  });