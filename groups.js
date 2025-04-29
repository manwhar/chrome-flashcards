// groups.js

document.addEventListener("DOMContentLoaded", () => {
  const groupCards = document.getElementById("groupCards");
  const addGroupIcon = document.getElementById("addGroupIcon");
  const newGroupForm = document.getElementById("newGroupForm");
  const saveGroupBtn = document.getElementById("saveGroupBtn");
  const newGroupNameInput = document.getElementById("newGroupName");
  const newGroupColorInput = document.getElementById("newGroupColor");

  addGroupIcon.addEventListener("click", () => {
    newGroupForm.style.display =
      newGroupForm.style.display === "block" ? "none" : "block";
    if (newGroupForm.style.display === "block") newGroupNameInput.focus();
  });

  function updateGroupEnabled(name, enabled, card, color) {
    chrome.storage.local.get(["groups"], ({ groups = {} }) => {
      groups[name].enabled = enabled;
      chrome.storage.local.set({ groups }, () => {
        card.style.background = enabled ? color : "#f9f9f9";
      });
    });
  }

  function loadGroups() {
    chrome.storage.local.get(["groups"], ({ groups = {} }) => {
      groupCards.innerHTML = "";

      if (!Object.keys(groups).length) {
        groupCards.innerHTML =
          "<p style='text-align:center; color:#333;'>No groups created.</p>";
        return;
      }

      Object.entries(groups).forEach(([groupName, data]) => {
        const { color, flashcards = [], enabled = false } = data;

        const card = document.createElement("div");
        card.className = "group-card";
        card.style.position = "relative";
        card.style.background = enabled ? color : "#f9f9f9";

        const iconGroup = document.createElement("div");
        iconGroup.className = "icon-group";

        const editName = document.createElement("img");
        editName.src = "Images/editIcon.png";
        editName.title = "Edit name";
        editName.addEventListener("click", e => {
          e.stopPropagation();
          const nameInput = document.createElement("input");
          nameInput.type = "text";
          nameInput.value = groupName;
          nameInput.className = "edit-name-input";
          title.replaceWith(nameInput);
          nameInput.focus();

          const finishEdit = () => {
            const newName = nameInput.value.trim();
            if (newName && newName !== groupName) {
              chrome.storage.local.get(["groups"], ({ groups = {} }) => {
                const saved = groups[groupName];
                delete groups[groupName];
                groups[newName] = { ...saved };
                chrome.storage.local.set({ groups }, loadGroups);
              });
            } else {
              nameInput.replaceWith(title);
            }
          };
          nameInput.addEventListener("blur", finishEdit);
          nameInput.addEventListener("keydown", ev => {
            if (ev.key === "Enter") nameInput.blur();
            if (ev.key === "Escape") nameInput.replaceWith(title);
          });
        });
        iconGroup.append(editName);

        const editColor = document.createElement("img");
        editColor.src = "Images/editColorIcon.png";
        editColor.title = "Change color";
        editColor.addEventListener("click", e => {
          e.stopPropagation();
          const picker = document.createElement("input");
          picker.type = "color";
          picker.value = color;
          picker.style.position = "fixed";
          picker.style.top = "150px";
          picker.style.left = "50%";
          picker.style.transform = "translateX(-50%)";
          picker.style.opacity = "0"; // Hide the actual picker element
          picker.style.pointerEvents = "none";

          document.body.appendChild(picker);

          picker.addEventListener("input", ev => {
            card.style.background = ev.target.value;
          });

          picker.addEventListener("change", ev => {
            const newColor = ev.target.value;
            chrome.storage.local.get(["groups"], ({ groups = {} }) => {
              groups[groupName].color = newColor;
              chrome.storage.local.set({ groups }, loadGroups);
            });
            document.body.removeChild(picker);
          });

          picker.click();
        });
        iconGroup.append(editColor);

        const del = document.createElement("img");
        del.src = "Images/deleteIcon.png";
        del.title = "Delete group";
        del.addEventListener("click", e => {
          e.stopPropagation();
          if (confirm(`Delete group “${groupName}” and all its cards?`)) {
            chrome.storage.local.get(["groups"], ({ groups = {} }) => {
              delete groups[groupName];
              chrome.storage.local.set({ groups }, loadGroups);
            });
          }
        });
        iconGroup.append(del);

        card.append(iconGroup);

        const title = document.createElement("div");
        title.className = "group-title";
        title.innerText = groupName;
        card.append(title);

        const toggle = document.createElement("label");
        toggle.className = "toggle-switch";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = enabled;
        const slider = document.createElement("span");
        slider.className = "slider";
        toggle.append(checkbox, slider);

        toggle.addEventListener("click", e => e.stopPropagation());
        checkbox.addEventListener("change", e => {
          e.stopPropagation();
          updateGroupEnabled(groupName, checkbox.checked, card, color);
        });
        card.append(toggle);

        card.addEventListener("click", () => {
          const next = !checkbox.checked;
          checkbox.checked = next;
          updateGroupEnabled(groupName, next, card, color);
        });

        const fcC = document.createElement("div");
        fcC.className = "flashcards-container";

        if (flashcards.length) {
          flashcards.forEach((fc, i) => {
            const item = document.createElement("div");
            item.className = "flashcard-item";
            item.style.position = "relative";

            const f = document.createElement("div");
            f.className = "flashcard-front";
            f.innerText = fc.front;

            const b = document.createElement("div");
            b.className = "flashcard-back";
            b.innerText = fc.back;

            const delF = document.createElement("img");
            delF.src = "Images/deleteIcon.png";
            delF.className = "delete-flashcard-icon";
            delF.addEventListener("click", e => {
              e.stopPropagation();
              if (confirm("Delete this flashcard?")) {
                chrome.storage.local.get(["groups"], ({ groups = {} }) => {
                  groups[groupName].flashcards.splice(i, 1);
                  chrome.storage.local.set({ groups }, loadGroups);
                });
              }
            });

            item.append(f, b, delF);
            fcC.append(item);
          });
        } else {
          const none = document.createElement("div");
          none.className = "no-flashcards";
          none.innerText = "No flashcards.";
          fcC.append(none);
        }

        card.append(fcC);
        groupCards.append(card);
      });
    });
  }

  loadGroups();

  saveGroupBtn.addEventListener("click", () => {
    const name = newGroupNameInput.value.trim();
    const col = newGroupColorInput.value;
    if (!name) return alert("Please enter a valid group name.");
    chrome.storage.local.get(["groups"], ({ groups = {} }) => {
      if (groups[name]) return alert("Group already exists.");
      groups[name] = { flashcards: [], color: col, enabled: false };
      chrome.storage.local.set({ groups }, () => {
        loadGroups();
        newGroupNameInput.value = "";
        newGroupForm.style.display = "none";
      });
    });
  });
});
