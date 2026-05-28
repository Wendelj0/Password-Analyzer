const saveBtn =
document.getElementById("saveBtn");

const vaultList =
document.getElementById("vaultList");

const search =
document.getElementById("search");

let vault =
JSON.parse(
localStorage.getItem("vault")
) || [];


function saveVault(){

localStorage.setItem(
"vault",
JSON.stringify(vault)
);

}



function renderVault(filter=""){

vaultList.innerHTML="";


vault
.filter(item =>
item.site
.toLowerCase()
.includes(
filter.toLowerCase()
))

.forEach((item,index)=>{

vaultList.innerHTML += `

<div class="vault-item">

<h3>${item.site}</h3>

<p>
User:
${item.username}
</p>

<p>

Password:

<span id="pass${index}">
********
</span>

</p>


<div class="actions">

<button onclick="showPassword(${index})">

Show

</button>


<button onclick="copyPassword(${index})">

Copy

</button>


<button onclick="deleteEntry(${index})">

Delete

</button>

</div>

</div>

`;

});

}



saveBtn.onclick=()=>{

const site =
document.getElementById("site").value;

const username =
document.getElementById("username").value;

const password =
document.getElementById("vaultPassword").value;


vault.push({

site,
username,
password

});


saveVault();

renderVault();


};


function showPassword(index){

document.getElementById(
`pass${index}`
).innerText =
vault[index].password;

}


function copyPassword(index){

navigator.clipboard.writeText(

vault[index].password

);

alert("Copied");

}



function deleteEntry(index){

vault.splice(index,1);

saveVault();

renderVault();

}



search.addEventListener(

"input",

e=>{

renderVault(

e.target.value

);

}

);


renderVault();