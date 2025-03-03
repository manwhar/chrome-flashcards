document.getElementById("saveButton").addEventListener("click", function () {
    var question = document.getElementById("questionInput").value;
    var answer = document.getElementById("answerInput").value;

    if (!question || !answer) {
        alert("Please enter both a question and an answer.");
        return;
    }

    // Get existing flashcards
    chrome.storage.local.get(["flashcards"], function (result) {
        let flashcards = result.flashcards || {};
        let newKey = Object.keys(flashcards).length + 1;

        flashcards[newKey] = { front: question, back: answer };

        chrome.storage.local.set({ flashcards }, function () {
            document.getElementById("questionInput").value = "";
            document.getElementById("answerInput").value = "";
        });
    });
});

// Show saved flashcards
document.getElementById("showButton").addEventListener("click", function () {
    chrome.storage.local.get(["flashcards"], function (result) {
        let flashcards = result.flashcards || {};
        let list = document.getElementById("flashcardList");
        list.innerHTML = ""; // Clear existing list

        Object.keys(flashcards).forEach(key => {
            let li = document.createElement("li");
            li.textContent = `Q: ${flashcards[key].front} | A: ${flashcards[key].back} `;

            // Create delete button
            let deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.style.marginLeft = "10px";
            deleteButton.addEventListener("click", function () {
                deleteFlashcard(key);
            });

            li.appendChild(deleteButton);
            list.appendChild(li);
        });

        // Show Clear All button if there are flashcards
        let clearButton = document.getElementById("clearAllButton");
        if (Object.keys(flashcards).length > 0) {
            clearButton.style.display = "block";
        } else {
            clearButton.style.display = "none";
        }
        
    });
});

// Function to delete a flashcard
function deleteFlashcard(key) {
    chrome.storage.local.get(["flashcards"], function (result) {
        let flashcards = result.flashcards || {};

        if (flashcards[key]) {
            delete flashcards[key]; // Remove the flashcard

            chrome.storage.local.set({ flashcards }, function () {
                document.getElementById("showButton").click(); // Refresh the list
            });
        }
    });
}

// Function to clear all flashcards
document.getElementById("clearAllButton").addEventListener("click", function () {
    if (confirm("Are you sure you want to delete all flashcards?")) {
        chrome.storage.local.remove("flashcards", function () {
            document.getElementById("flashcardList").innerHTML = ""; // Clear UI
            document.getElementById("clearAllButton").style.display = "none"; // Hide button
        });
    }
});

