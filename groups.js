// explicitly defined flashcards
// once this structure is moved to localstorage, pull from there
const flashcards = {
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
}

const groupList = document.getElementById("groupList");
Object.keys(flashcards).forEach(key => {
    let group = document.createElement("button");
    group.innerHTML = "whee";
    groupList.appendChild(group);
})