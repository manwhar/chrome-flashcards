document.addEventListener("DOMContentLoaded", function () {
    const minTimer = document.getElementById("minTimer");
    const maxTimer = document.getElementById("maxTimer");
    const minValue = document.getElementById("minValue");
    const maxValue = document.getElementById("maxValue");
    const saveBtn = document.getElementById("saveBtn");
    
    // Manual input elements
    const minMinutes = document.getElementById("minMinutes");
    const minSeconds = document.getElementById("minSeconds");
    const maxMinutes = document.getElementById("maxMinutes");
    const maxSeconds = document.getElementById("maxSeconds");

    // Convert minutes and seconds to total seconds
    function toSeconds(minutes, seconds) {
        return parseInt(minutes) * 60 + parseInt(seconds);
    }

    // Convert total seconds to minutes and seconds
    function toMinutesSeconds(totalSeconds) {
        return {
            minutes: Math.floor(totalSeconds / 60),
            seconds: totalSeconds % 60
        };
    }

    // Update manual inputs when slider changes
    function updateManualInputsFromSlider(slider, minutesInput, secondsInput) {
        const totalSeconds = parseInt(slider.value);
        const { minutes, seconds } = toMinutesSeconds(totalSeconds);
        minutesInput.value = minutes;
        secondsInput.value = seconds;
    }

    // Update slider when manual inputs change
    function updateSliderFromManualInputs(minutesInput, secondsInput, slider, valueDisplay) {
        const totalSeconds = toSeconds(minutesInput.value, secondsInput.value);
        slider.value = totalSeconds;
        valueDisplay.textContent = totalSeconds;
    }

    // Load stored values
    chrome.storage.local.get(["minInterval", "maxInterval"], function (data) {
        if (data.minInterval !== undefined) {
            const { minutes, seconds } = toMinutesSeconds(data.minInterval);
            minMinutes.value = minutes;
            minSeconds.value = seconds;
            minTimer.value = data.minInterval;
            minValue.textContent = data.minInterval;
        }
        if (data.maxInterval !== undefined) {
            const { minutes, seconds } = toMinutesSeconds(data.maxInterval);
            maxMinutes.value = minutes;
            maxSeconds.value = seconds;
            maxTimer.value = data.maxInterval;
            maxValue.textContent = data.maxInterval;
        }
    });

    // Event listeners for sliders
    minTimer.addEventListener("input", () => {
        minValue.textContent = minTimer.value;
        updateManualInputsFromSlider(minTimer, minMinutes, minSeconds);
        
        if (parseInt(minTimer.value) > parseInt(maxTimer.value)) {
            maxTimer.value = minTimer.value;
            maxValue.textContent = minTimer.value;
            updateManualInputsFromSlider(maxTimer, maxMinutes, maxSeconds);
        }
    });

    maxTimer.addEventListener("input", () => {
        maxValue.textContent = maxTimer.value;
        updateManualInputsFromSlider(maxTimer, maxMinutes, maxSeconds);
        
        if (parseInt(maxTimer.value) < parseInt(minTimer.value)) {
            minTimer.value = maxTimer.value;
            minValue.textContent = maxTimer.value;
            updateManualInputsFromSlider(minTimer, minMinutes, minSeconds);
        }
    });

    // Event listeners for manual inputs
    [minMinutes, minSeconds].forEach(input => {
        input.addEventListener("input", () => {
            updateSliderFromManualInputs(minMinutes, minSeconds, minTimer, minValue);
            
            if (parseInt(minTimer.value) > parseInt(maxTimer.value)) {
                maxTimer.value = minTimer.value;
                maxValue.textContent = minTimer.value;
                updateManualInputsFromSlider(maxTimer, maxMinutes, maxSeconds);
            }
        });
    });

    [maxMinutes, maxSeconds].forEach(input => {
        input.addEventListener("input", () => {
            updateSliderFromManualInputs(maxMinutes, maxSeconds, maxTimer, maxValue);
            
            if (parseInt(maxTimer.value) < parseInt(minTimer.value)) {
                minTimer.value = maxTimer.value;
                minValue.textContent = maxTimer.value;
                updateManualInputsFromSlider(minTimer, minMinutes, minSeconds);
            }
        });
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