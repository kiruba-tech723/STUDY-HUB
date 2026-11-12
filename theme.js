// ===== theme.js : light/dark toggle + hamburger drawer =====

const themeBtn = document.getElementById("themeToggle");
const root = document.documentElement;

// 1. Apply the saved theme as soon as the page loads
function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  if (themeBtn) {
    themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
  }
}

let savedTheme = "light";
try {
  savedTheme = window.localStorage.getItem("studyhub-theme") || "light";
} catch (e) {
  // localStorage can be blocked; fall back to light theme
}
applyTheme(savedTheme);

// 2. Toggle on click and remember the choice
if (themeBtn) {
  themeBtn.addEventListener("click", function () {
    const current = root.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      window.localStorage.setItem("studyhub-theme", next);
    } catch (e) {}
  });
}

// 3. Hamburger button opens/closes every element marked data-drawer
const burger = document.getElementById("hamburger");
if (burger) {
  burger.addEventListener("click", function () {
    document.querySelectorAll("[data-drawer]").forEach(function (el) {
      el.classList.toggle("open");
    });
  });
}
