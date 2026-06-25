const passwordInput = document.getElementById("password");
const copyBtn = document.getElementById("copyBtn");
const toggleBtn = document.getElementById("toggleBtn");
const generateBtn = document.getElementById("generateBtn");

const lengthSlider = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");

const uppercaseCheck = document.getElementById("uppercase");
const lowercaseCheck = document.getElementById("lowercase");
const numbersCheck = document.getElementById("numbers");
const symbolsCheck = document.getElementById("symbols");
const avoidAmbiguousCheck = document.getElementById("avoidAmbiguous");
const passphraseCheck = document.getElementById("passphrase");

const strengthText = document.getElementById("strengthText");
const strengthFill = document.getElementById("strengthFill");
const entropyText = document.getElementById("entropyText");
const warningText = document.getElementById("warningText");

const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

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
    passwordInput.value = "Select at least one option";
    return;
  }

  const length = Number(lengthSlider.value);
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }

  passwordInput.value = password;
  updateSecurity(password, characters.length);
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

  passwordInput.value = passphrase;
  updateSecurity(passphrase, words.length);
  addToHistory(passphrase);
}

function calculateEntropy(length, characterPoolSize) {
  if (characterPoolSize <= 1) return 0;
  return Math.round(length * Math.log2(characterPoolSize));
}

function updateSecurity(password, characterPoolSize) {
  const entropy = calculateEntropy(password.length, characterPoolSize);
  entropyText.textContent = `${entropy} bits`;

  const lowerPassword = password.toLowerCase();
  const isWeakCommon = weakPasswords.includes(lowerPassword);

  if (isWeakCommon) {
    strengthText.textContent = "Very Weak";
    strengthFill.style.width = "15%";
    strengthFill.style.background = "#ef4444";
    warningText.textContent = "Warning: This is a common weak password.";
    return;
  }

  warningText.textContent = "";

  if (entropy < 40) {
    strengthText.textContent = "Weak";
    strengthFill.style.width = "30%";
    strengthFill.style.background = "#ef4444";
  } else if (entropy < 70) {
    strengthText.textContent = "Medium";
    strengthFill.style.width = "60%";
    strengthFill.style.background = "#f59e0b";
  } else if (entropy < 100) {
    strengthText.textContent = "Strong";
    strengthFill.style.width = "85%";
    strengthFill.style.background = "#22c55e";
  } else {
    strengthText.textContent = "Epic";
    strengthFill.style.width = "100%";
    strengthFill.style.background = "#00eaff";
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

copyBtn.addEventListener("click", () => {
  if (passwordInput.value === "") return;
  navigator.clipboard.writeText(passwordInput.value);
  copyBtn.textContent = "Copied!";
  setTimeout(() => { copyBtn.textContent = "Copy"; }, 1500);
});

toggleBtn.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleBtn.textContent = "Hide";
  } else {
    passwordInput.type = "password";
    toggleBtn.textContent = "Show";
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

generatePassword();