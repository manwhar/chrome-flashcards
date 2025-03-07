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

// toggle flashcards event listener (show/ hide button)
document.getElementById("showButton").addEventListener("click", function () {
    const flashcardList = document.getElementById("flashcardList");
    const clearButton = document.getElementById("clearAllButton");
    const showButton = document.getElementById("showButton");
    
    // check if flashcards are already displayed (assuming they're hidden if innerHTML is empty or display is 'none')
    if (flashcardList.style.display === "block") {
        // hide the flashcards and update button text
        flashcardList.style.display = "none";
        clearButton.style.display = "none";
        showButton.textContent = "Show Flashcards";
    } else {
        // retrieve and display flashcards
        chrome.storage.local.get(["flashcards"], function (result) {
            let flashcards = result.flashcards || {};
            flashcardList.innerHTML = ""; // clear existing list
            
            // loop through and display each flashcard
            Object.keys(flashcards).forEach(key => {
                let li = document.createElement("li");
                li.textContent = `Q: ${flashcards[key].front} | A: ${flashcards[key].back}`;
                
                // create delete button for each individual flashcard
                let deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.style.marginLeft = "10px";
                deleteButton.addEventListener("click", function () {
                    deleteFlashcard(key);
                });
                
                li.appendChild(deleteButton);
                flashcardList.appendChild(li);
            });
            
            // display flashcards and update button text to current state
            flashcardList.style.display = "block";
            if (Object.keys(flashcards).length > 0) {
                clearButton.style.display = "block";
            } else {
                clearButton.style.display = "none";
            }
            showButton.textContent = "Hide Flashcards";
        });
    }
});