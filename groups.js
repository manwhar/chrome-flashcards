// groups.js - Renders groups as styled cards with tiny delete buttons

document.addEventListener("DOMContentLoaded", function() {
  const groupCards = document.getElementById("groupCards");
  const addGroupIcon = document.getElementById("addGroupIcon");
  const newGroupForm = document.getElementById("newGroupForm");
  const saveGroupBtn = document.getElementById("saveGroupBtn");
  const newGroupNameInput = document.getElementById("newGroupName");
  const newGroupColorInput = document.getElementById("newGroupColor");

  // Toggle new group form
  addGroupIcon.addEventListener("click", () => {
    newGroupForm.style.display = newGroupForm.style.display === "block" ? "none" : "block";
    if (newGroupForm.style.display === "block") newGroupNameInput.focus();
  });

  // Load and render all groups
  function loadGroups() {
    chrome.storage.local.get(["groups"], ({ groups = {} }) => {
      groupCards.innerHTML = "";
      if (Object.keys(groups).length === 0) {
        groupCards.innerHTML = "<p style='text-align:center; color:#333;'>No groups created.</p>";
        return;
      }

      Object.entries(groups).forEach(([groupName, groupData]) => {
        // Card container
        const card = document.createElement("div");
        card.className = "group-card";
        card.style.background = "#f9f9f9";
        card.style.position = "relative";

        // Hover & select behavior
        card.addEventListener("mouseover", () => card.style.background = groupData.color);
        card.addEventListener("mouseout", () => {
          if (!card.classList.contains("selected")) card.style.background = "#f9f9f9";
        });
        card.addEventListener("click", () => {
          card.classList.toggle("selected");
          card.style.background = card.classList.contains("selected") ? groupData.color : "#f9f9f9";
        });

        // Title
        const title = document.createElement("div");
        title.className = "group-title";
        title.innerText = groupName;
        card.appendChild(title);

        // Delete-group icon
        const deleteGroup = document.createElement("img");
        deleteGroup.src = "Images/deleteIcon.png";
        deleteGroup.className = "delete-group-icon";
        Object.assign(deleteGroup.style, {
          position: "absolute",
          top: "8px",
          right: "8px",
          width: "20px",
          height: "20px",
          cursor: "pointer"
        });
        deleteGroup.addEventListener("click", e => {
          e.stopPropagation();
          if (confirm(`Delete group “${groupName}” and all its cards?`)) {
            chrome.storage.local.get(["groups"], ({ groups = {} }) => {
              delete groups[groupName];
              chrome.storage.local.set({ groups }, loadGroups);
            });
          }
        });
        card.appendChild(deleteGroup);

        // Flashcards container
        const fcContainer = document.createElement("div");
        fcContainer.className = "flashcards-container";

        if (groupData.flashcards?.length > 0) {
          groupData.flashcards.forEach((flashcard, idx) => {
            const item = document.createElement("div");
            item.className = "flashcard-item";
            item.style.position = "relative";

            const front = document.createElement("div");
            front.className = "flashcard-front";
            front.innerText = flashcard.front;

            const back = document.createElement("div");
            back.className = "flashcard-back";
            back.innerText = flashcard.back;

            // Delete-flashcard icon
            const deleteFlash = document.createElement("img");
            deleteFlash.src = "Images/deleteIcon.png";
            deleteFlash.className = "delete-flashcard-icon";
            Object.assign(deleteFlash.style, {
              position: "absolute",
              top: "4px",
              right: "4px",
              width: "16px",
              height: "16px",
              cursor: "pointer"
            });
            deleteFlash.addEventListener("click", e => {
              e.stopPropagation();
              if (confirm("Delete this flashcard?")) {
                chrome.storage.local.get(["groups"], ({ groups = {} }) => {
                  groups[groupName].flashcards.splice(idx, 1);
                  chrome.storage.local.set({ groups }, loadGroups);
                });
              }
            });

            item.append(front, back, deleteFlash);
            fcContainer.appendChild(item);
          });
        } else {
          const none = document.createElement("div");
          none.className = "no-flashcards";
          none.innerText = "No flashcards.";
          fcContainer.appendChild(none);
        }

        card.appendChild(fcContainer);
        groupCards.appendChild(card);
      });
    });
  }

  loadGroups();

  // Save new group
  saveGroupBtn.addEventListener("click", () => {
    const name = newGroupNameInput.value.trim();
    const color = newGroupColorInput.value;
    if (!name) return alert("Please enter a valid group name.");
    chrome.storage.local.get(["groups"], ({ groups = {} }) => {
      if (groups[name]) return alert("Group already exists.");
      groups[name] = { flashcards: [], color };
      chrome.storage.local.set({ groups }, () => {
        loadGroups();
        newGroupNameInput.value = "";
        newGroupForm.style.display = "none";
      });
    });
  });
});
