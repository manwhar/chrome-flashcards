document.addEventListener("DOMContentLoaded", function () {
    const minTimer = document.getElementById("minTimer");
    const maxTimer = document.getElementById("maxTimer");
    const minValue = document.getElementById("minValue");
    const maxValue = document.getElementById("maxValue");
    const saveBtn = document.getElementById("saveBtn");

    // Load stored values
    chrome.storage.local.get(["minInterval", "maxInterval"], function (data) {
        if (data.minInterval !== undefined) {
            minTimer.value = data.minInterval;
            minValue.textContent = data.minInterval;
        }
        if (data.maxInterval !== undefined) {
            maxTimer.value = data.maxInterval;
            maxValue.textContent = data.maxInterval;
        }
    });

    // Update displayed values as sliders change
    minTimer.addEventListener("input", () => {
        minValue.textContent = minTimer.value;
        if (parseInt(minTimer.value) > parseInt(maxTimer.value)) {
            maxTimer.value = minTimer.value;
            maxValue.textContent = minTimer.value;
        }
    });

    maxTimer.addEventListener("input", () => {
        maxValue.textContent = maxTimer.value;
        if (parseInt(maxTimer.value) < parseInt(minTimer.value)) {
            minTimer.value = maxTimer.value;
            minValue.textContent = maxTimer.value;
        }
    });

    // Save timer range when button is clicked
    saveBtn.addEventListener("click", () => {
        chrome.storage.local.set({
            minInterval: parseInt(minTimer.value),
            maxInterval: parseInt(maxTimer.value)
        }, () => {
            // Change button text and color
            saveBtn.textContent = "Saved!";
            saveBtn.style.backgroundColor = "#cd1fff"; 

            // Revert button after 3 seconds
            setTimeout(() => {
                saveBtn.textContent = "Save Timer Range";
                saveBtn.style.backgroundColor = ""; // Revert to default
            }, 1750);
        });
    });
});
