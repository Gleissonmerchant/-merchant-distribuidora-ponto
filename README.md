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
padding:25px 24px;
text-align:center
}
.logo{
font-size:14px;
font-weight:900;
letter-spacing:2px;
text-transform:uppercase;
opacity:.85
}
.brand h1{margin:5px 0 0;font-size:25px}
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
.status{
margin-top:18px;
padding:15px;
background:#f6f8fa;
border-radius:12px;
white-space:pre-wrap;
font-size:14px
}
.total{
margin-top:12px;
padding:18px;
background:#111827;
color:#fff;
border-radius:14px;
text-align:center
}
.total small{
display:block;
color:#cbd5e1;
margin-bottom:5px
}
.total strong{font-size:25px}
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
<div class="logo">Merchant</div>
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

<div class="total">
<small>Total de horas trabalhadas</small>
<strong id="totalHoras">0h 00min</strong>
</div>

<div id="status" class="status">
Pronto para registrar.
</div>

<div class="note">
A localização será solicitada pelo navegador somente no momento do registro.
</div>

</div>
</div>

<script>

const DESTINO="5588997104036";
const CHAVE="merchant_ponto_registros";

function carregar(){

try{

const registros=
JSON.parse(localStorage.getItem(CHAVE)||'[]');

let total=0;

registros.forEach(r=>{

if(r.entrada && r.saida){

total +=
new Date(r.saida)-new Date(r.entrada);

}

});

document.getElementById("totalHoras")
.textContent=formatar(total);

}catch(e){}

}

function formatar(ms){

if(ms<0 || !isFinite(ms))
return "0h 00min";

const minutos=
Math.floor(ms/60000);

return Math.floor(minutos/60)
+"h "
+String(minutos%60).padStart(2,"0")
+"min";

}

function registrar(tipo){

const nome=
document.getElementById("nome")
.value.trim();

if(!nome){

alert("Digite seu nome antes de registrar.");

return;

}

if(!navigator.geolocation){

document.getElementById("status")
.textContent=
"Localização não disponível neste navegador.";

return;

}

document.getElementById("status")
.textContent=
"Obtendo localização...";

navigator.geolocation.getCurrentPosition(

p=>{

const d=new Date();

const data=
d.toLocaleDateString("pt-BR");

const hora=
d.toLocaleTimeString("pt-BR");

const lat=
p.coords.latitude.toFixed(6);

const lon=
p.coords.longitude.toFixed(6);

const mapa=
`https://www.google.com/maps?q=${lat},${lon}`;

let registros=
JSON.parse(
localStorage.getItem(CHAVE)||"[]"
);

if(tipo==="entrada"){

registros.push({

nome:nome,

entrada:d.toISOString(),

saida:null

});

}else{

for(
let i=registros.length-1;
i>=0;
i--
){

if(
registros[i].nome===nome &&
!registros[i].saida
){

registros[i].saida=
d.toISOString();

break;

}

}

}

localStorage.setItem(
CHAVE,
JSON.stringify(registros)
);

carregar();

const total=
registros.reduce(
(s,r)=>
s+
(
r.entrada &&
r.saida
?
new Date(r.saida)-
new Date(r.entrada)
:
0
),
0
);

const msg=
`🏢 MERCHANT DISTRIBUIDORA
📋 REGISTRO DE ${tipo.toUpperCase()}
👤 Nome: ${nome}
📅 Data: ${data}
🕐 Horário: ${hora}
⏱️ Total de horas trabalhadas: ${formatar(total)}
📍 Localização: ${lat}, ${lon}
🗺️ Mapa: ${mapa}`;

document.getElementById("status")
.textContent=msg;

location.href=
`https://wa.me/${DESTINO}?text=${encodeURIComponent(msg)}`;

},

()=>{

document.getElementById("status")
.textContent=
"Não foi possível obter a localização. Autorize a localização e tente novamente.";

},

{
enableHighAccuracy:true,
timeout:15000,
maximumAge:0
}

);

}

carregar();

</script>

</body>
</html>
