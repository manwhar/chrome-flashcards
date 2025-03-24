// explicitly defined flashcards
// once this structure is moved to localstorage, pull from there
const flashcards = {
<<<<<<< Updated upstream
    "MATH": [
        {"back": "y=mx+b", "front": "point-slope form"},
        {"back": "9+10", "front": "21"},
        {"back": "x^2 + y^2 = z^2", "front": "pythagorean theorem"},
        {"back": "circumference of a circle", "front": "2(pi)r"},
        {"back": "area of a circle", "front": "pi(r)^2"}
    ],
    "SCIENCE": [
        {"back": "the powerhouse of the cell", "front": "mitochondria"},
        {"back": "formula for angular velocity", "front": "(1/2)mv^2"},
        {"back": "what should we always ignore", "front": "air resistance"}
    ],
    "HISTORY": [
        {"who was the first president": "george washington"},
        {"who wasn't the first president": "katie kubota"},
        {"idk more history but what is the meaning of life": "42"},
    ]
=======
    "MATH": {
        "flashcards": [
            { "back": "y=mx+b", "front": "point-slope form" },
            { "back": "9+10", "front": "21" },
            { "back": "x^2 + y^2 = z^2", "front": "pythagorean theorem" },
            { "back": "circumference of a circle", "front": "2(pi)r" },
            { "back": "area of a circle", "front": "pi(r)^2" }
        ],
        "color": "#de665d"
    },

    "SCIENCE": {
        "flashcards": [
            { "back": "the powerhouse of the cell", "front": "mitochondria" },
            { "back": "formula for angular velocity", "front": "(1/2)mv^2" },
            { "back": "what should we always ignore", "front": "air resistance" }
        ],
        "color": "#5dde7f"
    },

    "HISTORY": {
        "flashcards": [
            { "back": "who was the first president", "front": "george washington" },
            { "back": "who wasn't the first president", "front": "katie kubota" },
            { "back": "idk more history but what is the meaning of life", "front": "42" },
        ],
        "color": "#de57d5"
    }
>>>>>>> Stashed changes
}

function adjustOpacity(hex, opacity) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// if u want to have something selected by default add it in the list here
let selectedGroups = []; 

Object.keys(flashcards).forEach((key, index) => {
    let group = document.createElement("button");
    group.classList.add("group-item");

    let title = document.createElement("div");
    title.classList.add("group-title");
    title.innerText = key;

    let content = document.createElement("div");
    content.classList.add("group-content");

    // create inner text displaying flashcards
    
    content.innerText = flashcards[key]["flashcards"][0]['back'];

    const customClass = `group-item-${index}`;
    group.classList.add(customClass);

    const vibrantColor = flashcards[key].color;
    const fadedColor = adjustOpacity(vibrantColor, 0.4); // Light version

    // Inject styles for hover and selected
    const style = document.createElement('style');
    style.innerHTML = `
      .${customClass}:hover:not(.selected) {
        background-color: ${fadedColor} !important;
      }
      .${customClass}.selected {
        background-color: ${vibrantColor} !important;
      }
    `;
    document.head.appendChild(style);

    // Click handler → toggle selected
    group.addEventListener('click', () => {
        const isSelected = group.classList.contains('selected');
        group.classList.toggle('selected');

        if (isSelected) {
            // Remove from selected list
            selectedGroups = selectedGroups.filter(g => g !== key);
        } else {
            // Add to selected list
            selectedGroups.push(key);
        }

        console.log('Selected groups:', selectedGroups);
    });

    group.appendChild(title);
    group.appendChild(content);
    groupList.appendChild(group);
});
