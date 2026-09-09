<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#111827">
<title>Merchant Distribuidora • Ponto</title>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<style>
*{box-sizing:border-box}

body{
  margin:0;
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;
  background:#f3f4f6;
  color:#111827;
}

header{
  background:#111827;
  color:white;
  padding:22px 18px;
  text-align:center;
}

header h1{
  margin:0;
  font-size:24px;
}

header p{
  margin:6px 0 0;
  opacity:.8;
}

.container{
  max-width:520px;
  margin:auto;
  padding:18px;
}

.card{
  background:white;
  border-radius:18px;
  padding:20px;
  margin-bottom:16px;
  box-shadow:0 4px 18px rgba(0,0,0,.08);
}

h2{
  margin-top:0;
}

input,button,select{
  width:100%;
  padding:14px;
  border-radius:12px;
  border:1px solid #d1d5db;
  font-size:16px;
  margin-top:10px;
}

button{
  border:0;
  background:#111827;
  color:white;
  font-weight:700;
  cursor:pointer;
}

button:disabled{
  opacity:.5;
}

.btn-green{
  background:#15803d;
}

.btn-red{
  background:#b91c1c;
}

.btn-blue{
  background:#2563eb;
}

.info{
  background:#f9fafb;
  padding:14px;
  border-radius:12px;
  margin-top:12px;
}

.big{
  font-size:28px;
  font-weight:800;
  text-align:center;
  margin:10px 0;
}

.status{
  text-align:center;
  font-weight:700;
  padding:10px;
  border-radius:10px;
  margin-top:12px;
}

.hidden{
  display:none;
}

small{
  color:#6b7280;
}

table{
  width:100%;
  border-collapse:collapse;
  margin-top:12px;
}

td,th{
  padding:9px 5px;
  border-bottom:1px solid #e5e7eb;
  text-align:left;
  font-size:13px;
}
</style>
</head>

<body>

<header>
  <h1>Merchant Distribuidora</h1>
  <p>Sistema de Controle de Ponto</p>
</header>

<div class="container">

<div class="card" id="loginCard">
  <h2>Entrar</h2>

  <input id="nome" type="text" placeholder="Nome do funcionário">

  <button class="btn-blue" onclick="entrar()">
    Entrar no sistema
  </button>

  <div id="loginMsg"></div>
</div>

<div class="card hidden" id="pontoCard">

  <h2 id="saudacao">Olá!</h2>

  <div class="info">
    <strong>Data:</strong>
    <span id="dataAtual"></span>
  </div>

  <div class="info">
    <strong>Horário atual:</strong>
    <div class="big" id="relogio">--:--:--</div>
  </div>

  <div class="info">
    <strong>Horas trabalhadas hoje</strong>
    <div class="big" id="horasHoje">00:00:00</div>
  </div>

  <div id="status" class="status">
    Aguardando registro
  </div>

  <button id="entradaBtn" class="btn-green" onclick="registrarEntrada()">
    Registrar Entrada
  </button>

  <button id="saidaBtn" class="btn-red" onclick="registrarSaida()" disabled>
    Registrar Saída
  </button>

  <button class="btn-blue" onclick="carregarRegistros()">
    Atualizar registros
  </button>

  <button onclick="sair()">
    Sair
  </button>

</div>

<div class="card hidden" id="adminCard">

  <h2>Área Administrativa</h2>

  <button class="btn-blue" onclick="carregarTodos()">
    Ver registros
  </button>

  <div id="adminResultado"></div>

</div>

</div>

<script>

/* =====================================================
   CONFIGURAÇÃO SUPABASE
   ===================================================== */

/*
   URL do seu projeto Supabase.
   NÃO altere se esta for a URL do seu projeto.
*/
const SUPABASE_URL =
"https://paegduddojnlxyqssert.supabase.co";

/*
   Gleisson1993
   Não coloque service_role ou outra chave secreta.
*/
const SUPABASE_KEY =
Gleisson1993

let supabaseClient = null;

if(
  SUPABASE_URL &&
  SUPABASE_KEY &&
  SUPABASE_KEY !== Gleisson1993
){
  supabaseClient =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );
}

/* =====================================================
   ESTADO
   ===================================================== */

let funcionario = "";
let entradaAtual = null;
let registrosHoje = [];

/* =====================================================
   DATA / HORA
   ===================================================== */

function agora(){
  return new Date();
}

function formatarData(data){
  return data.toLocaleDateString("pt-BR");
}

function formatarHora(data){
  return data.toLocaleTimeString("pt-BR");
}

function segundosParaHora(segundos){

  segundos = Math.max(0,Math.floor(segundos));

  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  const s = segundos % 60;

  return String(h).padStart(2,"0")+":"+
         String(m).padStart(2,"0")+":"+
         String(s).padStart(2,"0");
}

function atualizarRelogio(){

  const d = agora();

  document.getElementById("relogio").textContent =
    formatarHora(d);

  document.getElementById("dataAtual").textContent =
    formatarData(d);

  atualizarHorasNaTela();
}

setInterval(atualizarRelogio,1000);

/* =====================================================
   LOGIN
   ===================================================== */

function entrar(){

  const nome =
    document.getElementById("nome").value.trim();

  if(!nome){
    mostrarMensagem(
      "Digite o nome do funcionário.",
      true
    );
    return;
  }

  funcionario = nome;

  localStorage.setItem(
    "merchant_funcionario",
    funcionario
  );

  document.getElementById("loginCard")
    .classList.add("hidden");

  document.getElementById("pontoCard")
    .classList.remove("hidden");

  document.getElementById("saudacao").textContent =
    "Olá, " + funcionario + "!";

  carregarRegistros();
}

/* =====================================================
   LOCALIZAÇÃO
   ===================================================== */

function obterLocalizacao(){

  return new Promise((resolve)=>{

    if(!navigator.geolocation){
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(

      position => {

        resolve({
          latitude:position.coords.latitude,
          longitude:position.coords.longitude,
          precisao:position.coords.accuracy
        });

      },

      () => resolve(null),

      {
        enableHighAccuracy:true,
        timeout:10000,
        maximumAge:0
      }

    );

  });

}

/* =====================================================
   ENTRADA
   ===================================================== */

async function registrarEntrada(){

  if(!funcionario) return;

  const botao =
    document.getElementById("entradaBtn");

  botao.disabled = true;

  mostrarMensagem(
    "Obtendo localização..."
  );

  const local = await obterLocalizacao();

  const horario = agora();

  const registro = {

    funcionario:funcionario,

    data:formatarData(horario),

    entrada:horario.toISOString(),

    saida:null,

    latitude:
      local ? local.latitude : null,

    longitude:
      local ? local.longitude : null

  };

  registrosHoje.push(registro);

  salvarLocalmente();

  if(supabaseClient){

    try{

      await supabaseClient
        .from("ponto")
        .insert(registro);

    }catch(error){

      console.error(error);

    }

  }

  entradaAtual = registro;

  document.getElementById("saidaBtn")
    .disabled = false;

  mostrarStatus(
    "Entrada registrada às " +
    formatarHora(horario)
  );

  atualizarHorasNaTela();
}

/* =====================================================
   SAÍDA
   ===================================================== */

async function registrarSaida(){

  if(!entradaAtual) return;

  const horario = agora();

  entradaAtual.saida =
    horario.toISOString();

  salvarLocalmente();

  if(supabaseClient){

    try{

      await supabaseClient
        .from("ponto")
        .update({
          saida:entradaAtual.saida
        })
        .eq("funcionario",funcionario)
        .eq("entrada",entradaAtual.entrada);

    }catch(error){

      console.error(error);

    }

  }

  mostrarStatus(
    "Saída registrada às " +
    formatarHora(horario)
  );

  document.getElementById("saidaBtn")
    .disabled = true;

  document.getElementById("entradaBtn")
    .disabled = true;

  atualizarHorasNaTela();
}

/* =====================================================
   HORAS TRABALHADAS
   ===================================================== */

function calcularSegundos(){

  let total = 0;

  registrosHoje.forEach(r => {

    if(!r.entrada) return;

    const inicio =
      new Date(r.entrada);

    const fim =
      r.saida
      ? new Date(r.saida)
      : agora();

    if(
      !isNaN(inicio.getTime()) &&
      !isNaN(fim.getTime())
    ){

      total +=
        Math.max(
          0,
          (fim-inicio)/1000
        );

    }

  });

  return total;
}

function atualizarHorasNaTela(){

  document.getElementById("horasHoje")
    .textContent =
    segundosParaHora(
      calcularSegundos()
    );
}

/* =====================================================
   REGISTROS
   ===================================================== */

async function carregarRegistros(){

  registrosHoje = [];

  const hoje =
    formatarData(agora());

  if(supabaseClient){

    try{

      const {data,error} =
        await supabaseClient
        .from("ponto")
        .select("*")
        .eq("funcionario",funcionario)
        .eq("data",hoje)
        .order("entrada",{ascending:true});

      if(!error && data){

        registrosHoje = data;

      }

    }catch(error){

      console.error(error);

    }

  }

  if(!registrosHoje.length){

    const salvo =
      localStorage.getItem(
        "merchant_registros"
      );

    if(salvo){

      try{

        const todos =
          JSON.parse(salvo);

        registrosHoje =
          todos.filter(
            r =>
              r.funcionario === funcionario &&
              r.data === hoje
          );

      }catch(e){}

    }

  }

  entradaAtual =
    registrosHoje.find(
      r => r.entrada && !r.saida
    ) || null;

  document.getElementById("saidaBtn")
    .disabled =
    !entradaAtual;

  atualizarHorasNaTela();

  if(entradaAtual){

    document.getElementById("entradaBtn")
      .disabled = true;

    mostrarStatus(
      "Você está trabalhando desde " +
      formatarHora(
        new Date(entradaAtual.entrada)
      )
    );

  }

}

/* =====================================================
   SALVAR LOCALMENTE
   ===================================================== */

function salvarLocalmente(){

  const salvo =
    localStorage.getItem(
      "merchant_registros"
    );

  let todos = [];

  if(salvo){

    try{
      todos = JSON.parse(salvo);
    }catch(e){}

  }

  const outros =
    todos.filter(
      r =>
        !(
          r.funcionario === funcionario &&
          r.data === formatarData(agora()) &&
          r.entrada ===
            (entradaAtual ? entradaAtual.entrada : "")
        )
    );

  registrosHoje.forEach(registro=>{

    const indice =
      outros.findIndex(
        r =>
          r.funcionario === registro.funcionario &&
          r.entrada === registro.entrada
      );

    if(indice >= 0)
      outros[indice] = registro;
    else
      outros.push(registro);

  });

  localStorage.setItem(
    "merchant_registros",
    JSON.stringify(outros)
  );

}

/* =====================================================
   ADMINISTRADOR
   ===================================================== */

async function carregarTodos(){

  const resultado =
    document.getElementById(
      "adminResultado"
    );

  resultado.innerHTML =
    "<p>Carregando...</p>";

  if(!supabaseClient){

    resultado.innerHTML =
      "<p>Supabase ainda não está configurado.</p>";

    return;
  }

  try{

    const {data,error} =
      await supabaseClient
      .from("ponto")
      .select("*")
      .order("entrada",{ascending:false})
      .limit(100);

    if(error) throw error;

    if(!data || !data.length){

      resultado.innerHTML =
        "<p>Nenhum registro encontrado.</p>";

      return;

    }

    let html =
      "<table>" +
      "<tr>" +
      "<th>Funcionário</th>" +
      "<th>Data</th>" +
      "<th>Entrada</th>" +
      "<th>Saída</th>" +
      "</tr>";

    data.forEach(r=>{

      html +=
        "<tr>" +
        "<td>"+escapeHtml(r.funcionario || "")+"</td>" +
        "<td>"+escapeHtml(r.data || "")+"</td>" +
        "<td>"+(
          r.entrada
          ? formatarHora(new Date(r.entrada))
          : "-"
        )+"</td>" +
        "<td>"+(
          r.saida
          ? formatarHora(new Date(r.saida))
          : "Trabalhando"
        )+"</td>" +
        "</tr>";

    });

    html += "</table>";

    resultado.innerHTML = html;

  }catch(error){

    console.error(error);

    resultado.innerHTML =
      "<p>Não foi possível carregar os registros.</p>";

  }

}

/* =====================================================
   SEGURANÇA DE TEXTO
   ===================================================== */

function escapeHtml(text){

  return String(text)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");

}

/* =====================================================
   MENSAGENS
   ===================================================== */

function mostrarMensagem(texto,erro=false){

  const el =
    document.getElementById("loginMsg");

  el.textContent = texto;

  el.style.color =
    erro ? "#b91c1c" : "#15803d";

}

function mostrarStatus(texto){

  const el =
    document.getElementById("status");

  el.textContent = texto;
}

/* =====================================================
   SAIR
   ===================================================== */

function sair(){

  funcionario = "";
  entradaAtual = null;
  registrosHoje = [];

  localStorage.removeItem(
    "merchant_funcionario"
  );

  document.getElementById("pontoCard")
    .classList.add("hidden");

  document.getElementById("adminCard")
    .classList.add("hidden");

  document.getElementById("loginCard")
    .classList.remove("hidden");

  document.getElementById("nome").value = "";

}

/* =====================================================
   INICIALIZAÇÃO
   ===================================================== */

window.addEventListener("load",()=>{

  atualizarRelogio();

  const salvo =
    localStorage.getItem(
      "merchant_funcionario"
    );

  if(salvo){

    funcionario = salvo;

    document.getElementById("loginCard")
      .classList.add("hidden");

    document.getElementById("pontoCard")
      .classList.remove("hidden");

    document.getElementById("saudacao")
      .textContent =
      "Olá, " + funcionario + "!";

    carregarRegistros();

  }

});

</script>

</body>
</html>
