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
            //alert("Flashcard Saved!");
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
    });
});

// Function to delete a flashcard
function deleteFlashcard(key) {
    chrome.storage.local.get(["flashcards"], function (result) {
        let flashcards = result.flashcards || {};

        if (flashcards[key]) {
            delete flashcards[key]; // Remove the flashcard

            chrome.storage.local.set({ flashcards }, function () {
                //alert("Flashcard Deleted!");
                document.getElementById("showButton").click(); // Refresh the list
            });
        }
    });
}
