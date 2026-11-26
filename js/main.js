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

const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

function setNavigationOpen(isOpen) {
  navLinks.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Zatvori izbornik" : "Otvori izbornik");
  navToggle.textContent = isOpen ? "✕" : "☰";
}

navToggle.addEventListener("click", () => {
  setNavigationOpen(navToggle.getAttribute("aria-expanded") !== "true");
});

navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    setNavigationOpen(false);
  }
});

document.addEventListener("click", (event) => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  if (isOpen && !navLinks.contains(event.target) && !navToggle.contains(event.target)) {
    setNavigationOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
    setNavigationOpen(false);
    navToggle.focus();
  }
});

document.addEventListener("mouseover", (event) => {
  const badge = event.target.closest(".badge[data-tooltip]");
  if (badge) {
    badge.classList.add("tooltip-visible");
  }
});

document.addEventListener("mouseout", (event) => {
  const badge = event.target.closest(".badge[data-tooltip]");
  if (badge) {
    badge.classList.remove("tooltip-visible");
  }
});
