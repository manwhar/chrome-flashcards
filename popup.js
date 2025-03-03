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
        
    // refresh of flashcards to show new updared one
    document.getElementById("showButton").click();
    });
});

// Show saved flashcards
document.getElementById("showButton").addEventListener("click", function () {
    chrome.storage.local.get(["flashcards"], function (result) {
        let flashcards = result.flashcards || {};
        let list = document.getElementById("flashcardList");
        list.innerHTML = ""; // Clear existing list

        Object.keys(flashcards).forEach(key => { // runs in a forEach loop
            let li = document.createElement("li"); // create list of flashcards for display
            li.textContent = `Q: ${flashcards[key].front} | A: ${flashcards[key].back} `;
            
            // create mini flashcards with q/a inside pop-up
            let rect = document.createElement("div");
            Object.assign(rect, {
                id: "rectangle",
                innerText: flashcards[key].front,
            });
            
            Object.assign(rect.style, {
                width: "50px",
                height: "25px",
                backgroundColor: "blue",
            });

            // Create delete button
            let deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.style.marginLeft = "10px";
            deleteButton.addEventListener("click", function () {
                deleteFlashcard(key);
            });

            li.appendChild(deleteButton);
            list.appendChild(li);
            list.appendChild(rect);
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

