const generatedPasswordInput = document.getElementById("generatedPassword");
const copyGeneratedBtn = document.getElementById("copyGeneratedBtn");
const showGeneratedBtn = document.getElementById("showGeneratedBtn");
const generateBtn = document.getElementById("generateBtn");

const lengthSlider = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");

const uppercaseCheck = document.getElementById("uppercase");
const lowercaseCheck = document.getElementById("lowercase");
const numbersCheck = document.getElementById("numbers");
const symbolsCheck = document.getElementById("symbols");
const avoidAmbiguousCheck = document.getElementById("avoidAmbiguous");
const passphraseCheck = document.getElementById("passphrase");

const generatorStrengthText = document.getElementById("generatorStrengthText");
const generatorStrengthFill = document.getElementById("generatorStrengthFill");
const entropyText = document.getElementById("entropyText");
const warningText = document.getElementById("warningText");

const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const checkPasswordInput = document.getElementById("checkPassword");
const checkerStrengthFill = document.getElementById("checkerStrengthFill");
const strengthLabel = document.getElementById("strengthLabel");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const crackTime = document.getElementById("crackTime");

const charLen = document.getElementById("charLen");
const hasUpper = document.getElementById("hasUpper");
const hasLower = document.getElementById("hasLower");
const hasNum = document.getElementById("hasNum");
const hasSpec = document.getElementById("hasSpec");

let uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let lowercase = "abcdefghijklmnopqrstuvwxyz";
let numbers = "0123456789";
let symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const ambiguousCharacters = "0OolI1";

const words = [
  "river", "cloud", "mountain", "orange", "tiger",
  "coffee", "planet", "window", "forest", "rocket",
  "school", "dragon", "pencil", "sunset", "guitar",
  "cyber", "matrix", "shadow", "neon", "galaxy"
];

const weakPasswords = [
  "password", "123456", "12345678", "qwerty", "admin",
  "letmein", "welcome", "iloveyou", "abc123", "password123"
];

let history = [];

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggleBtn.textContent = "☀️";
}

themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeToggleBtn.textContent = isDark ? "☀️" : "🌙";
});

function removeAmbiguous(text) {
  return text.split("").filter(char => !ambiguousCharacters.includes(char)).join("");
}

function getCharacterSet() {
  let finalUppercase = uppercase;
  let finalLowercase = lowercase;
  let finalNumbers = numbers;
  let finalSymbols = symbols;

  if (avoidAmbiguousCheck.checked) {
    finalUppercase = removeAmbiguous(finalUppercase);
    finalLowercase = removeAmbiguous(finalLowercase);
    finalNumbers = removeAmbiguous(finalNumbers);
    finalSymbols = removeAmbiguous(finalSymbols);
  }

  let characters = "";
  if (uppercaseCheck.checked) characters += finalUppercase;
  if (lowercaseCheck.checked) characters += finalLowercase;
  if (numbersCheck.checked) characters += finalNumbers;
  if (symbolsCheck.checked) characters += finalSymbols;

  return characters;
}

function generatePassword() {
  if (passphraseCheck.checked) {
    generatePassphrase();
    return;
  }

  const characters = getCharacterSet();
  if (characters === "") {
    generatedPasswordInput.value = "Select at least one option";
    return;
  }

  const length = Number(lengthSlider.value);
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }

  generatedPasswordInput.value = password;
  updateGeneratorSecurity(password, characters.length);
  addToHistory(password);
}

function generatePassphrase() {
  const length = Number(lengthSlider.value);
  const wordCount = Math.max(3, Math.ceil(length / 5));
  let passphrase = "";

  for (let i = 0; i < wordCount; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    passphrase += words[randomIndex];
    if (i < wordCount - 1) passphrase += "-";
  }

  generatedPasswordInput.value = passphrase;
  updateGeneratorSecurity(passphrase, words.length);
  addToHistory(passphrase);
}

function calculateEntropy(length, characterPoolSize) {
  if (characterPoolSize <= 1) return 0;
  return Math.round(length * Math.log2(characterPoolSize));
}

function updateGeneratorSecurity(password, characterPoolSize) {
  const entropy = calculateEntropy(password.length, characterPoolSize);
  entropyText.textContent = `${entropy} bits`;

  const lowerPassword = password.toLowerCase();
  const isWeakCommon = weakPasswords.includes(lowerPassword);

  if (isWeakCommon) {
    generatorStrengthText.textContent = "Very Weak";
    generatorStrengthFill.style.width = "15%";
    generatorStrengthFill.style.background = "#ff3864";
    warningText.textContent = "Warning: This is a common weak password.";
    return;
  }

  warningText.textContent = "";

  if (entropy < 40) {
    generatorStrengthText.textContent = "Weak";
    generatorStrengthFill.style.width = "30%";
    generatorStrengthFill.style.background = "#ff3864";
  } else if (entropy < 70) {
    generatorStrengthText.textContent = "Medium";
    generatorStrengthFill.style.width = "60%";
    generatorStrengthFill.style.background = "#ffb020";
  } else if (entropy < 100) {
    generatorStrengthText.textContent = "Strong";
    generatorStrengthFill.style.width = "85%";
    generatorStrengthFill.style.background = "#00ff9d";
  } else {
    generatorStrengthText.textContent = "Epic";
    generatorStrengthFill.style.width = "100%";
    generatorStrengthFill.style.background = "#00d9ff";
  }
}

function addToHistory(password) {
  if (!password || password === "Select at least one option") return;
  history.unshift(password);
  if (history.length > 5) history.pop();
  displayHistory();
}

function displayHistory() {
  historyList.innerHTML = "";
  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    historyList.appendChild(li);
  });
}

copyGeneratedBtn.addEventListener("click", () => {
  if (generatedPasswordInput.value === "") return;
  navigator.clipboard.writeText(generatedPasswordInput.value);
  copyGeneratedBtn.textContent = "Copied!";
  setTimeout(() => { copyGeneratedBtn.textContent = "Copy"; }, 1500);
});

showGeneratedBtn.addEventListener("click", () => {
  if (generatedPasswordInput.type === "password") {
    generatedPasswordInput.type = "text";
    showGeneratedBtn.textContent = "Hide";
  } else {
    generatedPasswordInput.type = "password";
    showGeneratedBtn.textContent = "Show";
  }
});

generateBtn.addEventListener("click", generatePassword);
lengthSlider.addEventListener("input", () => {
  lengthValue.textContent = lengthSlider.value;
  generatePassword();
});

uppercaseCheck.addEventListener("change", generatePassword);
lowercaseCheck.addEventListener("change", generatePassword);
numbersCheck.addEventListener("change", generatePassword);
symbolsCheck.addEventListener("change", generatePassword);
avoidAmbiguousCheck.addEventListener("change", generatePassword);
passphraseCheck.addEventListener("change", generatePassword);

clearHistoryBtn.addEventListener("click", () => {
  history = [];
  displayHistory();
});

function estimateCrackTime(password) {
  if (password.length === 0) return "Waiting for password...";

  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/[0-9]/.test(password)) pool += 10;
  if (/[^A-Za-z0-9]/.test(password)) pool += 32;

  if (pool === 0) return "Instantly";

  const combinations = Math.pow(pool, password.length);
  const guessesPerSecond = 1000000000; // 1 Billion guesses/sec baseline
  const seconds = combinations / guessesPerSecond;

  if (seconds < 1) return "Less than 1 second";
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 31536000000) return `${Math.round(seconds / 31536000)} years`;

  return "Millions of years";
}

checkPasswordInput.addEventListener("input", () => {
  const val = checkPasswordInput.value;
  let score = 0;

  const lengthOk = val.length >= 8;
  const upperOk = /[A-Z]/.test(val);
  const lowerOk = /[a-z]/.test(val);
  const numberOk = /[0-9]/.test(val);
  const specialOk = /[^A-Za-z0-9]/.test(val);

  if (lengthOk) score++;
  if (upperOk) score++;
  if (lowerOk) score++;
  if (numberOk) score++;
  if (specialOk) score++;

  charLen.classList.toggle("valid", lengthOk);
  hasUpper.classList.toggle("valid", upperOk);
  hasLower.classList.toggle("valid", lowerOk);
  hasNum.classList.toggle("valid", numberOk);
  hasSpec.classList.toggle("valid", specialOk);

  const pct = (score / 5) * 100;
  checkerStrengthFill.style.width = `${pct}%`;
  checkerStrengthFill.className = "strength-fill";

  if (val.length === 0) {
    strengthLabel.textContent = "Ready to Scan";
  } else if (score <= 2) {
    checkerStrengthFill.classList.add("weak");
    strengthLabel.textContent = "⚠️ Critical Vulnerability";
  } else if (score <= 4) {
    checkerStrengthFill.classList.add("moderate");
    strengthLabel.textContent = "⚖️ Moderate Security";
  } else {
    checkerStrengthFill.classList.add("strong");
    strengthLabel.textContent = "🛡️ Encrypted / Secure";
  }

  crackTime.textContent = estimateCrackTime(val);
});

generatePassword();