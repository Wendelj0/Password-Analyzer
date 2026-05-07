const passwordInput = document.getElementById("password");
const strengthFill = document.getElementById("strengthFill");
const strengthLabel = document.getElementById("strengthLabel");
const toggleBtn = document.getElementById("toggleTheme");

// Theme Logic
const currentTheme = localStorage.getItem("theme");
if (currentTheme === "dark") {
  document.body.classList.add("dark");
  toggleBtn.textContent = "☀️";
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  
  localStorage.setItem("theme", isDark ? "dark" : "light");
  toggleBtn.textContent = isDark ? "☀️" : "🌙";
});

// Password Logic
passwordInput.addEventListener("input", () => {
  const val = passwordInput.value;
  let score = 0;

  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[a-z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  const pct = (score / 5) * 100;
  strengthFill.style.width = `${pct}%`;
  
  // Reset classes
  strengthFill.className = "strength-fill";

  if (val.length === 0) {
    strengthLabel.textContent = "Ready to Scan";
  } else if (score <= 2) {
    strengthFill.classList.add("weak");
    strengthLabel.textContent = "⚠️ Critical Vulnerability";
  } else if (score <= 4) {
    strengthFill.classList.add("moderate");
    strengthLabel.textContent = "⚖️ Moderate Security";
  } else {
    strengthFill.classList.add("strong");
    strengthLabel.textContent = "🛡️ Encrypted / Secure";
  }
});