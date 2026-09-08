<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1, viewport-fit=cover"
>

<meta name="theme-color" content="#111827">

<meta
  name="description"
  content="Sistema de registro de ponto da Merchant Distribuidora"
>

<title>Merchant Distribuidora • Ponto</title>

<style>
*{
  box-sizing:border-box;
  -webkit-tap-highlight-color:transparent;
}

html{
  min-height:100%;
}

body{
  margin:0;
  min-height:100vh;
  min-height:100dvh;
  padding:18px;
  padding-top:max(18px, env(safe-area-inset-top));
  padding-bottom:max(18px, env(safe-area-inset-bottom));
  font-family:Arial,Helvetica,sans-serif;
  background:linear-gradient(135deg,#eef2f7,#dfe6ee);
  color:#18212b;
}

.wrap{
  width:100%;
  max-width:500px;
  margin:0 auto;
}

.brand{
  background:#111827;
  color:#fff;
  border-radius:22px 22px 0 0;
  padding:24px 22px;
}

.brand h1{
  margin:0;
  font-size:25px;
  line-height:1.2;
}

.brand p{
  margin:8px 0 0;
  color:#cbd5e1;
  font-size:14px;
}

.card{
  background:#fff;
  padding:22px;
  border-radius:0 0 22px 22px;
  box-shadow:0 18px 50px rgba(0,0,0,.12);
}

label{
  display:block;
  font-weight:700;
  margin-bottom:8px;
}

.field{
  width:100%;
  padding:15px;
  border:1px solid #d7dde5;
  border-radius:12px;
  font-size:16px;
  margin-bottom:14px;
  outline:none;
  background:#fff;
  color:#18212b;
}

.field:focus{
  border-color:#111827;
  box-shadow:0 0 0 3px rgba(17,24,39,.08);
}

button{
  width:100%;
  min-height:52px;
  padding:14px;
  border:0;
  border-radius:12px;
  color:#fff;
  font-size:16px;
  font-weight:800;
  margin:6px 0;
  cursor:pointer;
  touch-action:manipulation;
}

button:active{
  transform:scale(.99);
}

button:disabled{
  opacity:.6;
  cursor:not-allowed;
}

.in{
  background:#198754;
}

.out{
  background:#dc3545;
}

.admin{
  background:#111827;
}

.clear{
  background:#6b7280;
}

.status{
  margin-top:18px;
  padding:15px;
  background:#f6f8fa;
  border-radius:12px;
  white-space:pre-wrap;
  font-size:14px;
  line-height:1.5;
  overflow-wrap:anywhere;
}

.hours{
  margin-top:18px;
  padding:20px 15px;
  background:#111827;
  color:white;
  border-radius:15px;
  text-align:center;
}

.hours small{
  display:block;
  color:#cbd5e1;
  margin-bottom:7px;
  font-weight:700;
}

.hours strong{
  font-size:30px;
  letter-spacing:.5px;
}

.dayinfo{
  margin-top:10px;
  text-align:center;
  color:#64748b;
  font-size:13px;
  line-height:1.6;
}

.adminbox{
  display:none;
  margin-top:18px;
  padding:18px;
  background:#f3f4f6;
  border-radius:15px;
}

.adminbox h3{
  margin-top:0;
  margin-bottom:12px;
}

.adminstatus{
  white-space:pre-wrap;
  line-height:1.6;
  font-size:14px;
  overflow-wrap:anywhere;
}

.note{
  font-size:12px;
  color:#687386;
  text-align:center;
  margin-top:16px;
  line-height:1.6;
}

.ok{
  color:#198754;
  font-weight:700;
}

.warning{
  color:#dc3545;
  font-weight:700;
}

.clock{
  text-align:center;
  margin-top:12px;
  font-size:13px;
  color:#64748b;
}

hr{
  border:0;
  border-top:1px solid #e5e7eb;
  margin:18px 0;
}

@media(max-width:380px){
  body{
    padding:12px;
  }

  .card{
    padding:18px;
  }

  .brand h1{
    font-size:22px;
  }

  .hours strong{
    font-size:26px;
  }
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

    <label for="nome">
      Nome do funcionário
    </label>

    <input
      id="nome"
      class="field"
      type="text"
      placeholder="Digite seu nome"
      autocomplete="name"
      maxlength="100"
    >

    <button
      id="btnEntrada"
      class="in"
      type="button"
      onclick="registrarEntrada()"
    >
      ✓ Registrar entrada
    </button>

    <button
      id="btnSaida"
      class="out"
      type="button"
      onclick="registrarSaida()"
    >
      ✓ Registrar saída
    </button>

    <div class="hours">
      <small>⏱️ HORAS TRABALHADAS NO DIA</small>
      <strong id="horas">0h 00min</strong>
    </div>

    <div
      id="dayinfo"
      class="dayinfo"
    >
      Nenhum expediente registrado hoje.
    </div>

    <div
      id="clock"
      class="clock"
    >
      Horário atual: --:--:--
    </div>

    <div
      id="status"
      class="status"
    >
      Pronto para registrar.
    </div>

    <button
      class="admin"
      type="button"
      onclick="abrirAdmin()"
    >
      🔐 Área do administrador
    </button>

    <div
      id="adminbox"
      class="adminbox"
    >

      <h3>🔐 Administração</h3>

      <div
        id="adminstatus"
        class="adminstatus"
      >
        Área administrativa protegida.
      </div>

      <hr>

      <button
        class="admin"
        type="button"
        onclick="verStatusAdmin()"
      >
        📊 Ver situação do ponto
      </button>

      <button
        class="clear"
        type="button"
        onclick="limparDadosAdmin()"
      >
        🗑️ Limpar registros deste aparelho
      </button>

    </div>

    <div class="note">
      📍 A localização será solicitada pelo navegador no momento do registro.
      <br>
      🔒 Os registros deste protótipo ficam armazenados neste aparelho.
      <br>
      📲 Os registros são enviados ao WhatsApp do administrador.
    </div>

  </div>

</div>

<script>

/* =========================================================
   CONFIGURAÇÕES
   ========================================================= */

const DESTINO = "5588997104036";

const PIN_ADMIN = "03101993";

const CHAVE_DADOS = "merchant_ponto_dados_v4";


/* =========================================================
   ESTADO
   ========================================================= */

let dados = carregarDados();


/* =========================================================
   DATA E HORA
   ========================================================= */

function dataHoje(){

  const d = new Date();

  return d.toLocaleDateString(
    "pt-BR"
  );

}


function horarioAtual(){

  const d = new Date();

  return d.toLocaleTimeString(
    "pt-BR",
    {
      hour:"2-digit",
      minute:"2-digit",
      second:"2-digit"
    }
  );

}


function atualizarRelogio(){

  const elemento =
    document.getElementById("clock");

  if(elemento){

    elemento.textContent =
      "Horário atual: " +
      horarioAtual();

  }

}


/* =========================================================
   ESTRUTURA DOS DADOS
   ========================================================= */

function criarDadosVazios(){

  return {
    data:dataHoje(),
    registros:[]
  };

}


/* =========================================================
   CARREGAR DADOS
   ========================================================= */

function carregarDados(){

  try{

    const salvo =
      localStorage.getItem(
        CHAVE_DADOS
      );

    if(!salvo){

      return criarDadosVazios();

    }

    const obj =
      JSON.parse(salvo);

    if(
      !obj ||
      obj.data !== dataHoje() ||
      !Array.isArray(obj.registros)
    ){

      return criarDadosVazios();

    }

    return obj;

  }catch(e){

    console.error(
      "Erro ao carregar dados:",
      e
    );

    return criarDadosVazios();

  }

}


/* =========================================================
   SALVAR DADOS
   ========================================================= */

function salvarDados(){

  try{

    localStorage.setItem(
      CHAVE_DADOS,
      JSON.stringify(dados)
    );

  }catch(e){

    console.error(
      "Erro ao salvar dados:",
      e
    );

    alert(
      "Não foi possível salvar o registro neste aparelho."
    );

  }

}


/* =========================================================
   NORMALIZAR NOME
   ========================================================= */

function normalizarNome(nome){

  return nome
    .trim()
    .replace(/\s+/g," ")
    .toLowerCase();

}


/* =========================================================
   OBTER NOME
   ========================================================= */

function obterNome(){

  const campo =
    document.getElementById("nome");

  const nome =
    campo.value.trim();

  if(!nome){

    alert(
      "Digite o nome do funcionário antes de registrar."
    );

    campo.focus();

    return null;

  }

  if(nome.length < 2){

    alert(
      "Digite um nome válido."
    );

    campo.focus();

    return null;

  }

  return nome;

}


/* =========================================================
   PROCURAR REGISTRO DO FUNCIONÁRIO
   ========================================================= */

function encontrarRegistro(nome){

  const nomeNormalizado =
    normalizarNome(nome);

  return dados.registros.find(
    registro =>
      normalizarNome(registro.nome) ===
      nomeNormalizado
  );

}


/* =========================================================
   FORMATAR TEMPO
   ========================================================= */

function formatarTempo(minutos){

  minutos =
    Math.max(
      0,
      Math.floor(minutos || 0)
    );

  const horas =
    Math.floor(minutos / 60);

  const mins =
    minutos % 60;

  return (
    horas +
    "h " +
    String(mins).padStart(2,"0") +
    "min"
  );

}


/* =========================================================
   CALCULAR MINUTOS
   ========================================================= */

function minutosDoRegistro(registro){

  if(
    !registro ||
    !registro.entrada
  ){

    return 0;

  }

  const inicio =
    new Date(
      registro.entrada
    );

  if(
    isNaN(
      inicio.getTime()
    )
  ){

    return 0;

  }

  const fim =
    registro.saida
      ? new Date(registro.saida)
      : new Date();

  if(
    isNaN(
      fim.getTime()
    )
  ){

    return 0;

  }

  let minutos =
    Math.floor(
      (fim - inicio) / 60000
    );

  if(minutos < 0){

    minutos = 0;

  }

  return minutos;

}


/* =========================================================
   TOTAL DO DIA
   ========================================================= */

function totalDoDia(){

  let total = 0;

  dados.registros.forEach(
    registro => {

      total +=
        minutosDoRegistro(
          registro
        );

    }
  );

  return total;

}


/* =========================================================
   FORMATAR HORA
   ========================================================= */

function formatarHora(dataISO){

  if(!dataISO){

    return "--:--";

  }

  const data =
    new Date(dataISO);

  if(
    isNaN(
      data.getTime()
    )
  ){

    return "--:--";

  }

  return data.toLocaleTimeString(
    "pt-BR",
    {
      hour:"2-digit",
      minute:"2-digit"
    }
  );

}


/* =========================================================
   ATUALIZAR TELA
   ========================================================= */

function atualizarTela(){

  if(
    dados.data !== dataHoje()
  ){

    dados =
      criarDadosVazios();

    salvarDados();

  }

  const nomeCampo =
    document.getElementById(
      "nome"
    ).value.trim();

  let registroAtual = null;

  if(nomeCampo){

    registroAtual =
      encontrarRegistro(
        nomeCampo
      );

  }

  const horas =
    document.getElementById(
      "horas"
    );

  const info =
    document.getElementById(
      "dayinfo"
    );

  const btnEntrada =
    document.getElementById(
      "btnEntrada"
    );

  const btnSaida =
    document.getElementById(
      "btnSaida"
    );


  /*
   * Se houver nome digitado,
   * mostra as horas daquele funcionário.
   */

  if(registroAtual){

    const total =
      minutosDoRegistro(
        registroAtual
      );

    horas.textContent =
      formatarTempo(total);


    if(
      registroAtual.entrada &&
      !registroAtual.saida
    ){

      info.innerHTML =
        "🟢 Entrada: " +
        formatarHora(
          registroAtual.entrada
        ) +
        "<br>⏳ Expediente em andamento";


      btnEntrada.disabled = true;

      btnSaida.disabled = false;

    }

    else if(
      registroAtual.entrada &&
      registroAtual.saida
    ){

      info.innerHTML =
        "🟢 Entrada: " +
        formatarHora(
          registroAtual.entrada
        ) +
        "<br>🔴 Saída: " +
        formatarHora(
          registroAtual.saida
        );


      btnEntrada.disabled = false;

      btnSaida.disabled = true;

    }

  }

  else{

    horas.textContent =
      "0h 00min";

    info.textContent =
      "Nenhum expediente registrado hoje.";

    btnEntrada.disabled = false;

    btnSaida.disabled = false;

  }

  atualizarRelogio();

}


/* =========================================================
   REGISTRAR ENTRADA
   ========================================================= */

function registrarEntrada(){

  const nome =
    obterNome();

  if(!nome){

    return;

  }

  let registro =
    encontrarRegistro(
      nome
    );


  if(
    registro &&
    registro.entrada &&
    !registro.saida
  ){

    alert(
      "Este funcionário já possui uma entrada registrada hoje."
    );

    atualizarTela();

    return;

  }


  if(
    registro &&
    registro.entrada &&
    registro.saida
  ){

    alert(
      "A entrada e a saída deste funcionário já foram registradas hoje."
    );

    atualizarTela();

    return;

  }


  registro = {

    nome:nome,

    entrada:
      new Date().toISOString(),

    saida:null

  };


  dados.registros.push(
    registro
  );

  salvarDados();

  atualizarTela();

  registrarLocalizacao(
    "ENTRADA",
    registro
  );

}


/* =========================================================
   REGISTRAR SAÍDA
   ========================================================= */

function registrarSaida(){

  const nome =
    obterNome();

  if(!nome){

    return;

  }

  const registro =
    encontrarRegistro(
      nome
    );


  if(!registro){

    alert(
      "Não existe entrada registrada hoje para este funcionário."
    );

    return;

  }


  if(!registro.entrada){

    alert(
      "Não existe entrada registrada hoje."
    );

    return;

  }


  if(registro.saida){

    alert(
      "A saída de hoje já foi registrada para este funcionário."
    );

    atualizarTela();

    return;

  }


  registro.saida =
    new Date().toISOString();


  salvarDados();

  atualizarTela();

  registrarLocalizacao(
    "SAÍDA",
    registro
  );

}


/* =========================================================
   LOCALIZAÇÃO
   ========================================================= */

function registrarLocalizacao(
  tipo,
  registro
){

  const status =
    document.getElementById(
      "status"
    );

  status.textContent =
    "📍 Obtendo localização...";


  if(
    !navigator.geolocation
  ){

    status.textContent =
      "⚠️ Este navegador não disponibilizou a localização.";

    enviarWhatsAppSemLocalizacao(
      tipo,
      registro
    );

    return;

  }


  navigator.geolocation.getCurrentPosition(

    function(position){

      const latitude =
        position.coords.latitude
          .toFixed(6);

      const longitude =
        position.coords.longitude
          .toFixed(6);

      const precisao =
        position.coords.accuracy
          ? Math.round(
              position.coords.accuracy
            )
          : null;


      const mapa =
        "https://www.google.com/maps?q=" +
        latitude +
        "," +
        longitude;


      enviarRegistroWhatsApp(
        tipo,
        registro,
        latitude,
        longitude,
        mapa,
        precisao
      );

    },

    function(error){

      let mensagem =
        "Não foi possível obter a localização.";


      if(error.code === 1){

        mensagem =
          "Localização negada. Autorize a localização para registrar o ponto.";

      }


      if(error.code === 2){

        mensagem =
          "Não foi possível determinar sua localização.";

      }


      if(error.code === 3){

        mensagem =
          "A localização demorou demais para responder.";

      }


      status.textContent =
        "⚠️ " +
        mensagem;


      enviarWhatsAppSemLocalizacao(
        tipo,
        registro
      );

    },

    {
      enableHighAccuracy:true,
      timeout:20000,
      maximumAge:0
    }

  );

}


/* =========================================================
   WHATSAPP COM LOCALIZAÇÃO
   ========================================================= */

function enviarRegistroWhatsApp(
  tipo,
  registro,
  latitude,
  longitude,
  mapa,
  precisao
){

  const data =
    dataHoje();

  const hora =
    horarioAtual();


  let textoHoras = "";


  if(tipo === "SAÍDA"){

    textoHoras =
      "⏱️ Horas trabalhadas: " +
      formatarTempo(
        minutosDoRegistro(
          registro
        )
      );

  }else{

    textoHoras =
      "⏱️ Expediente iniciado";

  }


  const textoPrecisao =
    precisao
      ? "📡 Precisão aproximada: " +
        precisao +
        " metros"
      : "";


  const mensagem =
`🏢 MERCHANT DISTRIBUIDORA
📋 REGISTRO DE ${tipo}

👤 Funcionário: ${registro.nome}
📅 Data: ${data}
🕐 Horário: ${hora}

${textoHoras}

📍 Localização:
${latitude}, ${longitude}

${textoPrecisao}

🗺️ Mapa:
${mapa}`;


  document.getElementById(
    "status"
  ).textContent =
    mensagem;


  abrirWhatsApp(
    mensagem
  );

}


/* =========================================================
   WHATSAPP SEM LOCALIZAÇÃO
   ========================================================= */

function enviarWhatsAppSemLocalizacao(
  tipo,
  registro
){

  const hora =
    horarioAtual();


  const textoHoras =
    tipo === "SAÍDA"

      ? "⏱️ Horas trabalhadas: " +
        formatarTempo(
          minutosDoRegistro(
            registro
          )
        )

      : "⏱️ Expediente iniciado";


  const mensagem =
`🏢 MERCHANT DISTRIBUIDORA
📋 REGISTRO DE ${tipo}

👤 Funcionário: ${registro.nome}
📅 Data: ${dataHoje()}
🕐 Horário: ${hora}

${textoHoras}

⚠️ Localização não disponível.`;


  document.getElementById(
    "status"
  ).textContent =
    mensagem;


  abrirWhatsApp(
    mensagem
  );

}


/* =========================================================
   ABRIR WHATSAPP
   ========================================================= */

function abrirWhatsApp(
  mensagem
){

  const url =
    "https://wa.me/" +
    DESTINO +
    "?text=" +
    encodeURIComponent(
      mensagem
    );


  /*
   * location.href funciona melhor
   * no iPhone e Android para abrir
   * o WhatsApp ou WhatsApp Web.
   */

  window.location.href =
    url;

}


/* =========================================================
   ÁREA ADMINISTRATIVA
   ========================================================= */

function abrirAdmin(){

  const pin =
    prompt(
      "Digite o PIN do administrador:"
    );


  if(pin === null){

    return;

  }


  if(pin === PIN_ADMIN){

    document.getElementById(
      "adminbox"
    ).style.display =
      "block";


    document.getElementById(
      "adminstatus"
    ).textContent =
      "✅ Acesso autorizado.\nAdministrador conectado.";


    verStatusAdmin();

  }

  else{

    alert(
      "❌ PIN incorreto."
    );

  }

}


/* =========================================================
   STATUS ADMIN
   ========================================================= */

function verStatusAdmin(){

  const area =
    document.getElementById(
      "adminstatus"
    );


  if(
    !dados.registros.length
  ){

    area.textContent =
      "ℹ️ Nenhum registro encontrado hoje.";

    return;

  }


  let texto =
    "📊 SITUAÇÃO DO PONTO\n\n";


  dados.registros.forEach(
    function(registro,index){

      const total =
        minutosDoRegistro(
          registro
        );


      texto +=
`👤 Funcionário: ${registro.nome}
🟢 Entrada: ${formatarHora(registro.entrada)}
`;


      if(registro.saida){

        texto +=
`🔴 Saída: ${formatarHora(registro.saida)}
⏱️ Total: ${formatarTempo(total)}
`;

      }

      else{

        texto +=
`⏳ Expediente em andamento
⏱️ Tempo atual: ${formatarTempo(total)}
`;

      }


      if(
        index <
        dados.registros.length - 1
      ){

        texto +=
          "\n--------------------\n\n";

      }

    }
  );


  texto +=
    "\n====================\n" +
    "⏱️ TOTAL DO APARELHO: " +
    formatarTempo(
      totalDoDia()
    );


  area.textContent =
    texto;

}


/* =========================================================
   LIMPAR DADOS
   ========================================================= */

function limparDadosAdmin(){

  const confirmar =
    confirm(
      "Tem certeza que deseja apagar TODOS os registros deste aparelho?"
    );


  if(!confirmar){

    return;

  }


  try{

    localStorage.removeItem(
      CHAVE_DADOS
    );

  }catch(e){

    console.error(e);

  }


  dados =
    criarDadosVazios();


  document.getElementById(
    "nome"
  ).value =
    "";


  document.getElementById(
    "status"
  ).textContent =
    "Registro deste aparelho apagado.";


  atualizarTela();

  verStatusAdmin();

}


/* =========================================================
   EVENTO AO DIGITAR O NOME
   ========================================================= */

document
  .getElementById("nome")
  .addEventListener(
    "input",
    function(){

      atualizarTela();

    }
  );


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

atualizarTela();


/*
 * Atualiza relógio e horas trabalhadas
 * a cada 10 segundos.
 */

setInterval(
  function(){

    atualizarTela();

  },
  10000
);


/*
 * Garante que, se o usuário voltar
 * para a página, os dados sejam
 * atualizados imediatamente.
 */

document.addEventListener(
  "visibilitychange",
  function(){

    if(
      document.visibilityState ===
      "visible"
    ){

      dados =
        carregarDados();

      atualizarTela();

    }

  }
);

</script>

</body>
</html>
