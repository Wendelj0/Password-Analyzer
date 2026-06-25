const saveBtn = document.getElementById("saveBtn");
const vaultList = document.getElementById("vaultList");
const search = document.getElementById("search");

let vault = JSON.parse(localStorage.getItem("vault")) || [];

function saveVault() {
  localStorage.setItem("vault", JSON.stringify(vault));
}

function renderVault(filter = "") {
  vaultList.innerHTML = "";

  vault
    .filter(item => item.site.toLowerCase().includes(filter.toLowerCase()))
    .forEach((item, index) => {
      vaultList.innerHTML += `
        <div class="vault-item">
          <h3>${item.site}</h3>
          <p>User: ${item.username}</p>
          <p>Password: <span id="pass${index}">********</span></p>
          <div class="actions">
            <button onclick="showPassword(${index})">Show</button>
            <button onclick="copyPassword(${index})">Copy</button>
            <button onclick="deleteEntry(${index})">Delete</button>
          </div>
        </div>
      `;
    });
}

saveBtn.onclick = () => {
  const site = document.getElementById("site").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("vaultPassword").value;

  if (!site || !password) return alert("Please fill out site and password fields!");

  vault.push({ site, username, password });
  saveVault();
  renderVault();

  // Clear inputs after saving
  document.getElementById("site").value = "";
  document.getElementById("username").value = "";
  document.getElementById("vaultPassword").value = "";
};

window.showPassword = function(index) {
  const span = document.getElementById(`pass${index}`);
  if (span.innerText === "********") {
    span.innerText = vault[index].password;
  } else {
    span.innerText = "********";
  }
};

window.copyPassword = function(index) {
  navigator.clipboard.writeText(vault[index].password);
};

window.deleteEntry = function(index) {
  vault.splice(index, 1);
  saveVault();
  renderVault();
};

search.addEventListener("input", e => {
  renderVault(e.target.value);
});

renderVault();