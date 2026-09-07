<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Merchant Distribuidora • Ponto</title>

<style>
*{
  box-sizing:border-box;
}

body{
  margin:0;
  font-family:Arial, sans-serif;
  background:linear-gradient(135deg,#eef2f7,#dfe6ee);
  min-height:100vh;
  padding:18px;
  color:#18212b;
}

.wrap{
  max-width:520px;
  margin:auto;
}

.brand{
  background:#111827;
  color:white;
  border-radius:22px 22px 0 0;
  padding:25px 22px;
}

.brand h1{
  margin:0;
  font-size:25px;
}

.brand p{
  margin:6px 0 0;
  color:#cbd5e1;
}

.card{
  background:white;
  padding:20px;
  border-radius:0 0 22px 22px;
  box-shadow:0 18px 50px #0002;
}

label{
  display:block;
  font-weight:bold;
  margin-bottom:7px;
}

.field{
  width:100%;
  padding:14px;
  border:1px solid #d7dde5;
  border-radius:12px;
  font-size:16px;
  margin-bottom:14px;
}

button{
  width:100%;
  padding:15px;
  border:0;
  border-radius:12px;
  color:white;
  font-size:16px;
  font-weight:bold;
  margin:6px 0;
  cursor:pointer;
}

.in{
  background:#198754;
}

.out{
  background:#dc3545;
}

.history{
  background:#2563eb;
}

.clear{
  background:#6b7280;
}

.status{
  margin-top:16px;
  padding:15px;
  background:#f6f8fa;
  border-radius:12px;
  white-space:pre-wrap;
  font-size:14px;
  line-height:1.5;
}

.summary{
  margin-top:16px;
  padding:18px;
  background:#eef6ff;
  border-radius:14px;
}

.summary h2{
  margin:0 0 10px;
  font-size:18px;
}

.total{
  font-size:25px;
  font-weight:bold;
}

.history-box{
  margin-top:16px;
}

.day{
  background:#f8fafc;
  border:1px solid #e2e8f0;
  border-radius:12px;
  padding:14px;
  margin-bottom:10px;
}

.day strong{
  display:block;
  margin-bottom:5px;
}

.note{
  font-size:12px;
  color:#687386;
  text-align:center;
  margin-top:15px;
  line-height:1.4;
}
</style>
</head>

<body>

<div class="wrap">

  <div class="brand">
    <h1>Merchant Distribuidora</h1>
    <p>Controle de entrada e saída</p>
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

    <button class="out" onclick="registrar('saida')">
      ✓ Registrar saída
    </button>

    <div id="status" class="status">
      Pronto para registrar.
    </div>

    <div class="summary">

      <h2>Total trabalhado no mês</h2>

      <div id="totalMes" class="total">
        00h00min
      </div>

    </div>

    <button class="history" onclick="mostrarHistorico()">
      📅 Ver histórico
    </button>

    <button class="clear" onclick="limparHistorico()">
      🗑️ Limpar histórico
    </button>

    <div id="historico" class="history-box"></div>

    <div class="note">
      A localização será solicitada pelo navegador somente no momento do registro.
      <br>
      Os registros ficam salvos neste aparelho/navegador.
    </div>

  </div>

</div>

<script>

const DESTINO = "5588997104036";

const STORAGE_KEY = "merchant_ponto_registros";


/* =========================
   BANCO LOCAL
========================= */

function obterRegistros(){

  try{

    return JSON.parse(
      localStorage.getItem(STORAGE_KEY)
    ) || [];

  }catch(e){

    return [];

  }

}


function salvarRegistros(registros){

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(registros)
  );

}


/* =========================
   DATA
========================= */

function dataHoje(){

  const d = new Date();

  return d.toISOString().split("T")[0];

}


function dataFormatada(data){

  const partes = data.split("-");

  return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


function horaAtual(){

  return new Date().toLocaleTimeString(
    "pt-BR",
    {
      hour:"2-digit",
      minute:"2-digit"
    }
  );

}


/* =========================
   CONVERTER HORA
========================= */

function horaParaMinutos(hora){

  const partes = hora.split(":");

  return (
    parseInt(partes[0]) * 60 +
    parseInt(partes[1])
  );

}


function minutosParaTexto(minutos){

  if(!minutos || minutos < 0){
    return "00h00min";
  }

  const horas = Math.floor(minutos / 60);

  const mins = minutos % 60;

  return `${String(horas).padStart(2,"0")}h${String(mins).padStart(2,"0")}min`;

}


/* =========================
   REGISTRAR PONTO
========================= */

function registrar(tipo){

  const nome =
    document.getElementById("nome")
    .value
    .trim();

  if(!nome){

    alert("Digite seu nome antes de registrar.");

    return;
  }


  if(!navigator.geolocation){

    document.getElementById("status").textContent =
      "Localização não disponível neste navegador.";

    return;
  }


  const hoje = dataHoje();

  const registros = obterRegistros();

  let registroHoje =
    registros.find(r =>
      r.data === hoje &&
      r.nome.toLowerCase() === nome.toLowerCase()
    );


  /* =========================
     VERIFICAÇÕES
  ========================= */

  if(tipo === "entrada" && registroHoje){

    alert(
      "A entrada de hoje já foi registrada."
    );

    return;
  }


  if(tipo === "saida" && !registroHoje){

    alert(
      "Registre a entrada antes de registrar a saída."
    );

    return;
  }


  if(
    tipo === "saida" &&
    registroHoje.saida
  ){

    alert(
      "A saída de hoje já foi registrada."
    );

    return;
  }


  document.getElementById("status").textContent =
    "Obtendo localização...";


  navigator.geolocation.getCurrentPosition(

    function(position){

      const agora = new Date();

      const hora =
        agora.toLocaleTimeString(
          "pt-BR",
          {
            hour:"2-digit",
            minute:"2-digit"
          }
        );


      const lat =
        position.coords.latitude
        .toFixed(6);

      const lon =
        position.coords.longitude
        .toFixed(6);


      const mapa =
        `https://www.google.com/maps?q=${lat},${lon}`;


      /* =========================
         ENTRADA
      ========================= */

      if(tipo === "entrada"){

        const novoRegistro = {

          id: Date.now(),

          nome: nome,

          data: hoje,

          entrada: hora,

          saida: "",

          totalMinutos: 0,

          latitudeEntrada: lat,

          longitudeEntrada: lon,

          mapaEntrada: mapa

        };


        registros.push(novoRegistro);

        salvarRegistros(registros);


        const msg =
`🏢 MERCHANT DISTRIBUIDORA
📋 REGISTRO DE ENTRADA

👤 Nome: ${nome}
📅 Data: ${dataFormatada(hoje)}
🕐 Entrada: ${hora}

📍 Localização:
${lat}, ${lon}

🗺️ Mapa:
${mapa}`;


        document.getElementById("status")
          .textContent = msg;


        atualizarTotalMes();


        abrirWhatsApp(msg);

      }


      /* =========================
         SAÍDA
      ========================= */

      else{

        registroHoje.saida = hora;

        registroHoje.latitudeSaida = lat;

        registroHoje.longitudeSaida = lon;

        registroHoje.mapaSaida = mapa;


        const entradaMinutos =
          horaParaMinutos(
            registroHoje.entrada
          );

        const saidaMinutos =
          horaParaMinutos(hora);


        let total =
          saidaMinutos - entradaMinutos;


        /*
          Caso a saída seja depois da meia-noite,
          considera a saída como dia seguinte.
        */

        if(total < 0){

          total += 24 * 60;

        }


        registroHoje.totalMinutos = total;


        salvarRegistros(registros);


        const totalTexto =
          minutosParaTexto(total);


        const msg =
`🏢 MERCHANT DISTRIBUIDORA
📋 REGISTRO DE SAÍDA

👤 Nome: ${nome}
📅 Data: ${dataFormatada(hoje)}

🕐 Entrada:
${registroHoje.entrada}

🕐 Saída:
${hora}

⏱️ Total trabalhado:
${totalTexto}

📍 Localização da saída:
${lat}, ${lon}

🗺️ Mapa:
${mapa}`;


        document.getElementById("status")
          .textContent = msg;


        atualizarTotalMes();


        mostrarHistorico();


        abrirWhatsApp(msg);

      }

    },

    function(){

      document.getElementById("status")
        .textContent =
        "Não foi possível obter a localização. Autorize a localização e tente novamente.";

    },

    {
      enableHighAccuracy:true,

      timeout:15000,

      maximumAge:0

    }

  );

}


/* =========================
   WHATSAPP
========================= */

function abrirWhatsApp(msg){

  const url =
    `https://wa.me/${DESTINO}?text=${encodeURIComponent(msg)}`;

  window.location.href = url;

}


/* =========================
   TOTAL DO MÊS
========================= */

function atualizarTotalMes(){

  const registros =
    obterRegistros();

  const hoje =
    new Date();

  const mes =
    hoje.getMonth();

  const ano =
    hoje.getFullYear();


  let total = 0;


  registros.forEach(r => {

    const partes =
      r.data.split("-");

    const anoRegistro =
      parseInt(partes[0]);

    const mesRegistro =
      parseInt(partes[1]) - 1;


    if(
      anoRegistro === ano &&
      mesRegistro === mes
    ){

      total +=
        Number(r.totalMinutos || 0);

    }

  });


  document.getElementById("totalMes")
    .textContent =
    minutosParaTexto(total);

}


/* =========================
   HISTÓRICO
========================= */

function mostrarHistorico(){

  const registros =
    obterRegistros();


  const area =
    document.getElementById("historico");


  if(registros.length === 0){

    area.innerHTML =
      "<p>Nenhum registro encontrado.</p>";

    return;
  }


  const ordenados =
    [...registros].sort(
      (a,b) =>
        b.data.localeCompare(a.data)
    );


  let html =
    "<h2>📅 Histórico</h2>";


  ordenados.forEach(r => {

    html += `

      <div class="day">

        <strong>
          ${dataFormatada(r.data)}
        </strong>

        👤 ${r.nome}<br>

        🕐 Entrada:
        ${r.entrada || "--:--"}<br>

        🕐 Saída:
        ${r.saida || "--:--"}<br>

        ⏱️ Total:
        ${r.saida
          ? minutosParaTexto(r.totalMinutos)
          : "Em aberto"
        }

      </div>

    `;

  });


  area.innerHTML = html;

}


/* =========================
   LIMPAR HISTÓRICO
========================= */

function limparHistorico(){

  const registros =
    obterRegistros();


  if(registros.length === 0){

    alert("Não há registros para apagar.");

    return;
  }


  const confirmar =
    confirm(
      "Tem certeza que deseja apagar todos os registros deste aparelho?"
    );


  if(!confirmar){

    return;

  }


  localStorage.removeItem(
    STORAGE_KEY
  );


  document.getElementById("historico")
    .innerHTML = "";


  document.getElementById("totalMes")
    .textContent = "00h00min";


  document.getElementById("status")
    .textContent =
      "Histórico apagado.";

}


/* =========================
   INICIALIZAÇÃO
========================= */

document.addEventListener(
  "DOMContentLoaded",
  function(){

    atualizarTotalMes();

    mostrarHistorico();

  }
);

</script>

</body>
</html>
