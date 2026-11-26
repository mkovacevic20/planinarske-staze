const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
}

function loadTheme() {
  try {
    return localStorage.getItem("theme") || "light";
  } catch (e) {
    return "light";
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem("theme", theme);
  } catch (e) {
  }
}

applyTheme(loadTheme());

themeToggle.addEventListener("click", () => {
  const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
  applyTheme(newTheme);
  saveTheme(newTheme);
});
