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

            // Show Clear All button if there are flashcards
            let clearButton = document.getElementById("clearAllButton");
            if (Object.keys(flashcards).length > 0) {
                clearButton.style.display = "block";
            } else {
                clearButton.style.display = "none";
            }
            
        });
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
    let clearButton = document.getElementById("clearAllButton");

    if (clearButton.dataset.confirm === "true") {
        // Second click: Proceed with clearing
        chrome.storage.local.remove("flashcards", function () {
            document.getElementById("flashcardList").innerHTML = ""; // Clear UI
            clearButton.style.display = "none"; // Hide button
            clearButton.textContent = "Clear All"; // Reset text
            clearButton.dataset.confirm = "false"; // Reset state
        });
    } else {
        // First click: Change text to confirmation message
        clearButton.textContent = "Confirm Clear All";
        clearButton.dataset.confirm = "true";

        // Reset back to original text if not clicked again within 3 seconds
        setTimeout(() => {
            if (clearButton.dataset.confirm === "true") {
                clearButton.textContent = "Clear All";
                clearButton.dataset.confirm = "false";
            }
        }, 3000);
    }
});


