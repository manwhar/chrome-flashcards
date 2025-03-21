document.addEventListener("DOMContentLoaded", function () {
    const slider = document.getElementById("timerSlider");
    const sliderValue = document.getElementById("sliderValue");
    const saveBtn = document.getElementById("saveBtn");

    // Load saved value from chrome.storage.sync
    chrome.storage.sync.get("timerInterval", function (data) {
        if (data.timerInterval !== undefined) {
            slider.value = data.timerInterval / 1000; // Convert ms to seconds
            sliderValue.textContent = slider.value;
        }
    });

    // Update displayed value when slider is moved
    slider.addEventListener("input", function () {
        sliderValue.textContent = slider.value;
    });

    // Save value when button is clicked
    saveBtn.addEventListener("click", () => {
        const timerInterval = slider.value * 1000; // Convert seconds to milliseconds

        // Save new value to chrome.storage.sync
        chrome.storage.sync.set({ timerInterval: timerInterval }, function () {
            console.log("Timer interval saved:", timerInterval);

            // Provide feedback to the user
            saveBtn.textContent = "Saved!";
            saveBtn.style.backgroundColor = "#cd1fff"; // Change to a darker shade
            saveBtn.disabled = true; // Prevent multiple clicks

            setTimeout(() => {
                saveBtn.textContent = "Save Timer";
                saveBtn.style.backgroundColor = "#ff98e2"; // Reset color
                saveBtn.disabled = false;
            }, 2000); // Reset after 2 seconds
        });
    });
});
