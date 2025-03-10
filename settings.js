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
    saveBtn.addEventListener("click", function () {
        const newInterval = parseInt(slider.value, 10) * 1000; // Convert seconds to ms
        chrome.storage.sync.set({ timerInterval: newInterval }, function () {
            alert("Timer updated to " + slider.value + " seconds!");
            chrome.runtime.sendMessage({ action: "updateTimer" }); // Notify background.js
        });
    });
});
