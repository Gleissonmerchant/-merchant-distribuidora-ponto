<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Merchant Distribuidora • Ponto</title>

<style>
*{box-sizing:border-box}

body{
margin:0;
font-family:Arial,sans-serif;
background:linear-gradient(135deg,#eef2f7,#dfe6ee);
min-height:100vh;
padding:22px;
color:#18212b
}

.wrap{max-width:480px;margin:auto}

.brand{
background:#111827;
color:#fff;
border-radius:22px 22px 0 0;
padding:25px 24px
}

.brand h1{margin:0;font-size:25px}
.brand p{margin:6px 0 0;color:#cbd5e1}

.card{
background:#fff;
padding:24px;
border-radius:0 0 22px 22px;
box-shadow:0 18px 50px #0002
}

label{
display:block;
font-weight:700;
margin:0 0 7px
}

.field{
width:100%;
padding:14px;
border:1px solid #d7dde5;
border-radius:12px;
font-size:16px;
margin-bottom:18px
}

button{
width:100%;
padding:15px;
border:0;
border-radius:12px;
color:#fff;
font-size:16px;
font-weight:800;
margin:6px 0;
cursor:pointer
}

.in{background:#198754}
.out{background:#dc3545}
.admin{background:#111827}

.status{
margin-top:18px;
padding:15px;
background:#f6f8fa;
border-radius:12px;
white-space:pre-wrap;
font-size:14px
}

.hours{
margin-top:18px;
padding:18px;
background:#111827;
color:white;
border-radius:15px;
text-align:center
}

.hours small{
display:block;
color:#cbd5e1;
margin-bottom:6px
}

.hours strong{
font-size:28px
}

.adminbox{
display:none;
margin-top:18px;
padding:18px;
background:#f3f4f6;
border-radius:15px
}

.note{
font-size:12px;
color:#687386;
text-align:center;
margin-top:16px
}
</style>
</head>

<body>

<div class="wrap">

<div class="brand">
<h1>Merchant Distribuidora</h1>
<p>Registro de entrada e saída</p>
</div>

<div class="card">

<label for="nome">Nome</label>

<input
id="nome"
class="field"
placeholder="Digite seu nome"
autocomplete="name"
>

<button class="in" onclick="registrar('entrada')">
✓ Registrar entrada
</button>

<button class="out" onclick="registrar('saída')">
✓ Registrar saída
</button>

<div class="hours">
<small>⏱️ HORAS TRABALHADAS NO DIA</small>
<strong id="horas">0h 00min</strong>
</div>

<div id="status" class="status">
Pronto para registrar.
</div>

<button class="admin" onclick="abrirAdmin()">
🔐 Área do administrador
</button>

<div id="adminbox" class="adminbox">

<h3>🔐 Administração</h3>

<p id="adminstatus">
Área administrativa protegida.
</p>

<button class="admin" onclick="verStatusAdmin()">
📊 Ver situação do ponto
</button>

</div>

<div class="note">
A localização será solicitada pelo navegador somente no momento do registro.
</div>

</div>
</div>

<script>

const DESTINO="5588997104036";
const PIN_ADMIN="03101993";

const CHAVE_ENTRADA="merchant_ponto_entrada";
const CHAVE_DATA="merchant_ponto_data";

function hoje(){

const d=new Date();

return d.toLocaleDateString("pt-BR");

}

function atualizarHoras(){

const entrada=localStorage.getItem(CHAVE_ENTRADA);
const dataEntrada=localStorage.getItem(CHAVE_DATA);

if(!entrada || dataEntrada!==hoje()){

document.getElementById("horas").textContent="0h 00min";

if(dataEntrada!==hoje()){

localStorage.removeItem(CHAVE_ENTRADA);
localStorage.removeItem(CHAVE_DATA);

}

return;

}

const inicio=new Date(entrada);
const agora=new Date();

let minutos=Math.floor((agora-inicio)/60000);

if(minutos<0) minutos=0;

const horas=Math.floor(minutos/60);
const mins=minutos%60;

document.getElementById("horas").textContent=
horas+"h "+String(mins).padStart(2,"0")+"min";

}

function registrar(tipo){

const nome=document.getElementById("nome").value.trim();

if(!nome){

alert("Digite seu nome antes de registrar.");

return;

}

if(!navigator.geolocation){

document.getElementById("status").textContent=
"Localização não disponível neste navegador.";

return;

}

if(tipo==="entrada"){

localStorage.setItem(CHAVE_ENTRADA,new Date().toISOString());
localStorage.setItem(CHAVE_DATA,hoje());

atualizarHoras();

}

document.getElementById("status").textContent=
"Obtendo localização...";

navigator.geolocation.getCurrentPosition(

p=>{

const d=new Date();

const data=d.toLocaleDateString("pt-BR");
const hora=d.toLocaleTimeString("pt-BR");

const lat=p.coords.latitude.toFixed(6);
const lon=p.coords.longitude.toFixed(6);

const mapa=
`https://www.google.com/maps?q=${lat},${lon}`;

let horasTrabalhadas="";

if(tipo==="saída"){

const entrada=localStorage.getItem(CHAVE_ENTRADA);

if(entrada){

const inicio=new Date(entrada);
let minutos=Math.floor((d-inicio)/60000);

if(minutos<0) minutos=0;

const h=Math.floor(minutos/60);
const m=minutos%60;

horasTrabalhadas=
`⏱️ Horas trabalhadas: ${h}h ${String(m).padStart(2,"0")}min`;

}else{

horasTrabalhadas=
"⏱️ Horas trabalhadas: entrada não encontrada";

}

}

const msg=
`🏢 MERCHANT DISTRIBUIDORA
📋 REGISTRO DE ${tipo.toUpperCase()}
👤 Nome: ${nome}
📅 Data: ${data}
🕐 Horário: ${hora}
${horasTrabalhadas}
📍 Localização: ${lat}, ${lon}
🗺️ Mapa: ${mapa}`;

document.getElementById("status").textContent=msg;

if(tipo==="saída"){

localStorage.removeItem(CHAVE_ENTRADA);
localStorage.removeItem(CHAVE_DATA);

}

location.href=
`https://wa.me/${DESTINO}?text=${encodeURIComponent(msg)}`;

},

()=>{

document.getElementById("status").textContent=
"Não foi possível obter a localização. Autorize a localização e tente novamente.";

},

{
enableHighAccuracy:true,
timeout:15000,
maximumAge:0
}

);

}

function abrirAdmin(){

const pin=prompt("Digite o PIN do administrador:");

if(pin===null) return;

if(pin===PIN_ADMIN){

document.getElementById("adminbox").style.display="block";

document.getElementById("adminstatus").textContent=
"✅ Acesso autorizado. Administrador conectado.";

}else{

alert("❌ PIN incorreto.");

}

}

function verStatusAdmin(){

const entrada=localStorage.getItem(CHAVE_ENTRADA);
const dataEntrada=localStorage.getItem(CHAVE_DATA);

if(entrada && dataEntrada===hoje()){

const inicio=new Date(entrada);
const agora=new Date();

let minutos=Math.floor((agora-inicio)/60000);

if(minutos<0) minutos=0;

const h=Math.floor(minutos/60);
const m=minutos%60;

document.getElementById("adminstatus").textContent=
`✅ Funcionário com entrada registrada.
⏱️ Tempo atual: ${h}h ${String(m).padStart(2,"0")}min`;

}else{

document.getElementById("adminstatus").textContent=
"ℹ️ Nenhuma entrada registrada hoje.";

}

}

atualizarHoras();

setInterval(atualizarHoras,60000);

</script>

</body>
</html>
