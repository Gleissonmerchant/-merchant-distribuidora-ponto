<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#18395f">

<title>Merchant Distribuidora • Ponto</title>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<style>
*{box-sizing:border-box}

body{
  margin:0;
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;
  background:#f4f7fb;
  color:#102744;
}

.header{
  background:#18395f;
  padding:22px 18px 28px;
  text-align:center;
  color:white;
}

.logo{
  width:130px;
  height:130px;
  object-fit:contain;
  display:block;
  margin:0 auto 8px;
  border-radius:18px;
}

.brand{
  font-size:29px;
  font-weight:800;
  color:#ffb41f;
}

.subtitle{
  margin-top:5px;
  font-size:14px;
  opacity:.9;
}

.wrap{
  max-width:720px;
  margin:-12px auto 30px;
  padding:0 14px;
}

.card{
  background:white;
  border-radius:18px;
  padding:20px;
  margin-top:14px;
  box-shadow:0 7px 24px rgba(16,39,68,.09);
}

h2{
  margin:0 0 14px;
  font-size:20px;
}

label{
  display:block;
  font-weight:700;
  margin-bottom:7px;
}

input{
  width:100%;
  padding:15px;
  border:1px solid #d5dfeb;
  border-radius:12px;
  font-size:16px;
  outline:none;
}

input:focus{
  border-color:#18395f;
}

.buttons{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:10px;
  margin-top:13px;
}

button{
  border:0;
  border-radius:12px;
  padding:16px 10px;
  color:white;
  font-size:16px;
  font-weight:800;
  cursor:pointer;
}

.entry{
  background:#11945a;
}

.exit{
  background:#e52b36;
}

button:disabled{
  opacity:.55;
}

.hours{
  background:#18395f;
  color:white;
  text-align:center;
  padding:22px;
  border-radius:16px;
}

.hours .title{
  font-size:15px;
  font-weight:700;
}

.hours .big{
  font-size:40px;
  font-weight:900;
  margin:7px 0;
}

.hours small{
  opacity:.9;
}

.info{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:10px;
  margin-top:12px;
}

.info div{
  background:#f2f6fa;
  border-radius:12px;
  padding:13px;
}

.k{
  font-size:12px;
  color:#63758a;
}

.v{
  font-weight:800;
  margin-top:4px;
}

.status{
  margin-top:12px;
  padding:12px;
  border-radius:10px;
  display:none;
  font-size:14px;
}

.ok{
  background:#eaf8f1;
  color:#116b43;
}

.err{
  background:#fff0f1;
  color:#a51d28;
}

.notice{
  font-size:13px;
  line-height:1.5;
  color:#52667d;
  margin-top:12px;
}

.footer{
  text-align:center;
  color:#718399;
  font-size:12px;
  padding:15px;
}

@media(max-width:520px){
  .buttons{
    grid-template-columns:1fr;
  }
}
</style>
</head>

<body>

<header class="header">

  <!-- LOGOMARCA MERCHANT -->
  <img
    class="logo"
    src="IMG_1882.png"
    alt="Merchant"
  >

  <div class="brand">
    Merchant
  </div>

  <div class="subtitle">
    Ponto eletrônico • Registro de entrada e saída
  </div>

</header>


<main class="wrap">

<section class="card">

  <h2>Registrar ponto</h2>

  <label for="nome">
    Nome do funcionário
  </label>

  <input
    id="nome"
    autocomplete="name"
    placeholder="Digite seu nome"
  >

  <div class="buttons">

    <button
      id="entrada"
      class="entry"
      onclick="registrar('ENTRADA')"
    >
      ➜ Registrar entrada
    </button>

    <button
      id="saida"
      class="exit"
      onclick="registrar('SAIDA')"
    >
      ➜ Registrar saída
    </button>

  </div>

  <div id="status" class="status"></div>

  <div class="notice">
    📍 A localização será solicitada no momento do registro.
    O horário e o ponto ficam armazenados no banco centralizado.
  </div>

</section>


<section class="card">

  <div class="hours">

    <div class="title">
      ⏱️ HORAS TRABALHADAS HOJE
    </div>

    <div id="horas" class="big">
      0h 00min
    </div>

    <small id="data">
      —
    </small>

  </div>


  <div class="info">

    <div>
      <div class="k">
        Funcionário
      </div>

      <div id="func" class="v">
        —
      </div>
    </div>


    <div>
      <div class="k">
        Situação
      </div>

      <div id="situacao" class="v">
        Aguardando
      </div>
    </div>

  </div>

</section>


<section class="card">

  <h2>
    📋 Como funciona
  </h2>

  <div class="notice">

    <b>Entrada:</b>
    inicia o expediente.

    <br><br>

    <b>Saída:</b>
    encerra o período e calcula as horas trabalhadas.

    <br><br>

    📍 A localização é registrada junto ao ponto.

    <br>

    ☁️ Os registros ficam armazenados de forma centralizada.

    <br>

    🇧🇷 O sistema utiliza o horário de São Paulo.

  </div>

</section>

</main>


<div class="footer">
  Merchant Distribuidora • Ponto eletrônico
</div>


<script>

const SUPABASE_URL =
"https://paegduddojnlxyqssert.supabase.co";

const SUPABASE_KEY =
"sb_publishable_e70A8BQcnZ0o6XB-aXSbzg_p3pDeenk";

const sb =
window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


const DESTINO_WHATSAPP =
"5588997104036";


const nomeEl =
document.getElementById("nome");

const statusEl =
document.getElementById("status");


let ultimoResumo = null;


/* MENSAGEM */

function mostrar(msg, ok=false){

  statusEl.textContent = msg;

  statusEl.className =
    "status " + (ok ? "ok" : "err");

  statusEl.style.display =
    "block";
}


/* HORAS */

function formatar(seg){

  seg =
    Math.max(
      0,
      Math.floor(seg || 0)
    );

  const h =
    Math.floor(seg / 3600);

  const m =
    Math.floor(
      (seg % 3600) / 60
    );

  return (
    h +
    "h " +
    String(m).padStart(2,"0") +
    "min"
  );
}


/* DATA */

function atualizarData(){

  document.getElementById("data")
    .textContent =
    "Hoje • " +
    new Intl.DateTimeFormat(
      "pt-BR",
      {
        timeZone:"America/Sao_Paulo",
        dateStyle:"full"
      }
    ).format(new Date());

}


/* RESUMO DAS HORAS */

async function resumo(){

  const nome =
    nomeEl.value.trim();

  if(!nome){
    ultimoResumo = null;
    atualizarHoras();
    return;
  }


  const {data,error} =
    await sb.rpc(
      "resumo_ponto_por_nome",
      {
        p_nome:nome
      }
    );


  if(error){

    ultimoResumo = null;
    atualizarHoras();
    return;
  }


  ultimoResumo =
    data && data[0]
      ? data[0]
      : null;


  document.getElementById("func")
    .textContent =
    ultimoResumo?.funcionario_nome ||
    nome;


  atualizarHoras();

}


/* ATUALIZAR HORAS */

function atualizarHoras(){

  atualizarData();


  if(!ultimoResumo){

    document.getElementById("horas")
      .textContent =
      "0h 00min";

    document.getElementById("situacao")
      .textContent =
      "Sem registros hoje";

    return;
  }


  let total =
    Number(
      ultimoResumo
        .horas_trabalhadas_segundos ||
      0
    );


  if(
    ultimoResumo.em_andamento &&
    ultimoResumo.entrada_em_andamento
  ){

    total += Math.max(
      0,
      (
        Date.now() -
        new Date(
          ultimoResumo
            .entrada_em_andamento
        ).getTime()
      ) / 1000
    );

  }


  document.getElementById("horas")
    .textContent =
    formatar(total);


  document.getElementById("situacao")
    .textContent =
    ultimoResumo.em_andamento
      ? "🟢 Em andamento"
      : "Concluído";

}


/* LOCALIZAÇÃO */

async function localizar(){

  return new Promise(
    (resolve,reject)=>{

      if(!navigator.geolocation){

        reject(
          new Error(
            "Seu aparelho não oferece localização."
          )
        );

        return;
      }


      navigator.geolocation.getCurrentPosition(

        position =>
          resolve(
            position.coords
          ),

        () =>
          reject(
            new Error(
              "Não foi possível obter sua localização. Ative a localização e tente novamente."
            )
          ),

        {
          enableHighAccuracy:true,
          timeout:15000,
          maximumAge:0
        }

      );

    }
  );

}


/* REGISTRAR */

async function registrar(tipo){

  const nome =
    nomeEl.value.trim();


  if(nome.length < 2){

    mostrar(
      "Informe o nome do funcionário."
    );

    return;
  }


  document.getElementById("entrada")
    .disabled = true;

  document.getElementById("saida")
    .disabled = true;


  mostrar(
    "Obtendo localização e registrando...",
    true
  );


  try{

    const c =
      await localizar();


    const {data,error} =
      await sb.rpc(
        "registrar_ponto_por_nome",
        {
          p_nome:nome,
          p_tipo:tipo,
          p_latitude:c.latitude,
          p_longitude:c.longitude,
          p_precisao_metros:c.accuracy
        }
      );


    if(error)
      throw error;


    const quando =
      new Intl.DateTimeFormat(
        "pt-BR",
        {
          timeZone:"America/Sao_Paulo",
          dateStyle:"short",
          timeStyle:"medium"
        }
      ).format(
        new Date(data.registrado_em)
      );


    const mapa =
      `https://www.google.com/maps?q=${c.latitude},${c.longitude}`;


    const texto =
      `Merchant Distribuidora
${tipo} registrada
Funcionário: ${nome}
Data/hora: ${quando}
Localização: ${mapa}`;


    window.open(
      `https://wa.me/${DESTINO_WHATSAPP}?text=${encodeURIComponent(texto)}`,
      "_blank"
    );


    mostrar(
      `${tipo === "ENTRADA" ? "Entrada" : "Saída"} registrada com sucesso às ${quando}.`,
      true
    );


    await resumo();

  }
  catch(e){

    mostrar(
      e.message ||
      "Não foi possível registrar o ponto."
    );

  }
  finally{

    document.getElementById("entrada")
      .disabled = false;

    document.getElementById("saida")
      .disabled = false;

  }

}


/* ATUALIZA AUTOMATICAMENTE */

let timer;


nomeEl.addEventListener(
  "input",
  () => {

    clearTimeout(timer);

    timer =
      setTimeout(
        resumo,
        500
      );

  }
);


setInterval(
  atualizarHoras,
  1000
);


atualizarData();

</script>

</body>
</html>
