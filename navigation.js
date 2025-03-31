document.addEventListener("DOMContentLoaded", function() {
  const currentUrl = window.location.href;

  // In popup.html (main flashcards page)
  if (currentUrl.includes("popup.html")) {
    const settingsIcon = document.getElementById("settingsIcon");
    if (settingsIcon) {
      settingsIcon.addEventListener("click", function() {
        window.location.href = "settings.html";
      });
    }
    const addGroupIcon = document.getElementById("addGroupIcon");
    if (addGroupIcon) {
      addGroupIcon.addEventListener("click", function() {
        window.location.href = "groups.html";
      });
    }
  }
  // In groups.html
  if (currentUrl.includes("groups.html")) {
    const homeLogo = document.getElementById("homeLogo");
    if (homeLogo) {
      homeLogo.addEventListener("click", function() {
        window.location.href = "popup.html";
      });
    }
  }
  // In settings.html
  if (currentUrl.includes("settings.html")) {
    const homeIcon = document.getElementById("homeIcon");
    if (homeIcon) {
      homeIcon.addEventListener("click", function() {
        window.location.href = "popup.html";
      });
    }
  }
});
