document.addEventListener("DOMContentLoaded", function() {
    // select all elements with the class "logo"
    const logoElements = document.querySelectorAll(".logo");
    logoElements.forEach(logo => {
      logo.addEventListener("click", function() {
        // redirect to home (popup.html)
        window.location.href = "popup.html";
      });
    });
  });
  