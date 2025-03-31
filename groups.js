// groups.js - Renders groups as styled cards with mini flashcard boxes

document.addEventListener("DOMContentLoaded", function() {
  const groupCards = document.getElementById("groupCards");
  const addGroupIcon = document.getElementById("addGroupIcon");
  const newGroupForm = document.getElementById("newGroupForm");
  const saveGroupBtn = document.getElementById("saveGroupBtn");
  const newGroupNameInput = document.getElementById("newGroupName");
  const newGroupColorInput = document.getElementById("newGroupColor");

  // Toggle new group form when the Add Group icon is clicked
  addGroupIcon.addEventListener("click", function() {
    if (newGroupForm.style.display === "none" || newGroupForm.style.display === "") {
      newGroupForm.style.display = "block";
      newGroupNameInput.focus();
    } else {
      newGroupForm.style.display = "none";
    }
  });

  // Function to load groups and render them as cards
  function loadGroups() {
    chrome.storage.local.get(["groups"], function(data) {
      const groups = data.groups || {};
      groupCards.innerHTML = "";

      if (Object.keys(groups).length === 0) {
        groupCards.innerHTML = "<p style='text-align:center; color:#333;'>No groups created.</p>";
        return;
      }

      Object.keys(groups).forEach(groupName => {
        const groupData = groups[groupName];

        // Create group card container
        const card = document.createElement("div");
        card.className = "group-card";
        card.style.background = "#f9f9f9";

        // On hover, change background to group's assigned color
        card.addEventListener("mouseover", function() {
          card.style.background = groupData.color;
        });
        // On mouseout, revert background if not selected
        card.addEventListener("mouseout", function() {
          if (!card.classList.contains("selected")) {
            card.style.background = "#f9f9f9";
          }
        });
        // On click, toggle selection so the background remains the group's color
        card.addEventListener("click", function() {
          card.classList.toggle("selected");
          if (card.classList.contains("selected")) {
            card.style.background = groupData.color;
          } else {
            card.style.background = "#f9f9f9";
          }
        });

        // Group title
        const title = document.createElement("div");
        title.className = "group-title";
        title.innerText = groupName;
        card.appendChild(title);

        // Container for flashcards in this group
        const flashcardsContainer = document.createElement("div");
        flashcardsContainer.className = "flashcards-container";

        if (groupData.flashcards && groupData.flashcards.length > 0) {
          groupData.flashcards.forEach(flashcard => {
            const flashcardItem = document.createElement("div");
            flashcardItem.className = "flashcard-item";

            const frontDiv = document.createElement("div");
            frontDiv.className = "flashcard-front";
            frontDiv.innerText = flashcard.front;

            const backDiv = document.createElement("div");
            backDiv.className = "flashcard-back";
            backDiv.innerText = flashcard.back;

            flashcardItem.appendChild(frontDiv);
            flashcardItem.appendChild(backDiv);
            flashcardsContainer.appendChild(flashcardItem);
          });
        } else {
          const noFlashcards = document.createElement("div");
          noFlashcards.className = "no-flashcards";
          noFlashcards.innerText = "No flashcards.";
          flashcardsContainer.appendChild(noFlashcards);
        }

        card.appendChild(flashcardsContainer);
        groupCards.appendChild(card);
      });
    });
  }

  loadGroups();

  // Save new group functionality
  saveGroupBtn.addEventListener("click", function() {
    const groupName = newGroupNameInput.value.trim();
    const groupColor = newGroupColorInput.value;
    if (!groupName) {
      alert("Please enter a valid group name.");
      return;
    }
    chrome.storage.local.get(["groups"], function(data) {
      const groups = data.groups || {};
      if (groups[groupName]) {
        alert("Group already exists.");
        return;
      }
      groups[groupName] = { flashcards: [], color: groupColor };
      chrome.storage.local.set({ groups: groups }, function() {
        loadGroups();
        newGroupNameInput.value = "";
        newGroupForm.style.display = "none";
      });
    });
  });
});
