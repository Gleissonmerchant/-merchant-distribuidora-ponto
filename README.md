<!doctype html>

<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#111827">
<title>Merchant Distribuidora • Ponto</title>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<style>
*{box-sizing:border-box}
body{
  margin:0;
  font-family:Arial,Helvetica,sans-serif;
  background:linear-gradient(135deg,#eef2f7,#dfe6ee);
  min-height:100vh;
  padding:18px;
  color:#18212b
}
.wrap{max-width:520px;margin:auto}
.brand{
  background:#111827;
  color:#fff;
  border-radius:22px 22px 0 0;
  padding:25px 24px
}
.brand h1{margin:0;font-size:25px}
.brand p{margin:7px 0 0;color:#cbd5e1}
.card{
  background:#fff;
  padding:24px;
  border-radius:0 0 22px 22px;
  box-shadow:0 18px 50px #0002
}
label{display:block;font-weight:700;margin:0 0 7px}
.field{
  width:100%;
  padding:14px;
  border:1px solid #d7dde5;
  border-radius:12px;
  font-size:16px;
  margin-bottom:15px;
  outline:none
}
.field:focus{border-color:#111827}
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
button:disabled{opacity:.6;cursor:not-allowed}
.in{background:#198754}
.out{background:#dc3545}
.admin{background:#111827}
.status{
  margin-top:18px;
  padding:15px;
  background:#f6f8fa;
  border-radius:12px;
  white-space:pre-wrap;
  font-size:14px;
  line-height:1.5
}
.ok{background:#e9f8ef;color:#146c43}
.error{background:#fff0f0;color:#a61b1b}
.note{
  font-size:12px;
  color:#687386;
  text-align:center;
  margin-top:16px
}
.hidden{display:none!important}
.divider{
  border:0;
  border-top:1px solid #e5e7eb;
  margin:24px 0
}
.admin-box{
  background:#f8fafc;
  padding:18px;
  border-radius:15px;
  margin-top:15px
}
.row{
  display:flex;
  gap:8px
}
.row button{flex:1}
.employee{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:10px;
  background:#fff;
  border:1px solid #e5e7eb;
  padding:12px;
  border-radius:10px;
  margin-top:8px
}
.employee button{
  width:auto;
  padding:9px 12px;
  margin:0;
  font-size:13px
}
.small{
  font-size:12px;
  color:#64748b
}
table{
  width:100%;
  border-collapse:collapse;
  margin-top:12px;
  font-size:13px
}
th,td{
  padding:9px 5px;
  border-bottom:1px solid #e5e7eb;
  text-align:left
}
.logout{
  background:#6b7280;
  margin-top:12px
}
</style>
</head>
<body>
<div class="wrap">
  <div class="brand">
    <h1>Merchant Distribuidora</h1>
    <p>Sistema de registro de ponto</p>
  </div>
  <div class="card">
<!-- ÁREA DO FUNCIONÁRIO -->
<section id="funcionarioArea">
  <label for="nome">Nome do funcionário</label>
  <input
    id="nome"
    class="field"
    placeholder="Digite seu nome"
    autocomplete="name"
    maxlength="120"
  >
  <button id="entradaBtn" class="in" onclick="registrar('ENTRADA')">
    ✓ Registrar entrada
  </button>
  <button id="saidaBtn" class="out" onclick="registrar('SAIDA')">
    ✓ Registrar saída
  </button>
  <div id="status" class="status">
    Pronto para registrar.
  </div>
  <button class="admin" onclick="abrirLoginAdmin()">
    🔐 Área do administrador
  </button>
  <div class="note">
    A localização será solicitada pelo navegador somente no momento do registro.
  </div>
</section>
<!-- LOGIN ADMINISTRADOR -->
<section id="loginArea" class="hidden">
  <h2>Área administrativa</h2>
  <label for="adminEmail">E-mail</label>
  <input
    id="adminEmail"
    class="field"
    type="email"
    placeholder="E-mail do administrador"
    autocomplete="email"
  >
  <label for="adminSenha">Senha</label>
  <input
    id="adminSenha"
    class="field"
    type="password"
    placeholder="Senha do Supabase"
    autocomplete="current-password"
  >
  <button class="admin" onclick="loginAdmin()">
    Entrar
  </button>
  <button class="logout" onclick="fecharLoginAdmin()">
    Voltar
  </button>
  <div id="loginStatus" class="status">
    Faça login para acessar a administração.
  </div>
</section>
<!-- PAINEL ADMIN -->
<section id="adminArea" class="hidden">
  <h2>Administrador</h2>
  <div class="admin-box">
    <strong>Funcionários</strong>
    <input
      id="novoFuncionario"
      class="field"
      placeholder="Nome do novo funcionário"
      maxlength="120"
      style="margin-top:12px"
    >
    <button class="in" onclick="adicionarFuncionario()">
      + Cadastrar funcionário
    </button>
    <div id="listaFuncionarios">
      Carregando funcionários...
    </div>
  </div>
  <div class="admin-box">
    <strong>Registros de ponto</strong>
    <label style="margin-top:15px">Data</label>
    <input id="dataConsulta" class="field" type="date">
    <label>Funcionário</label>
    <select id="funcionarioConsulta" class="field">
      <option value="">Todos os funcionários</option>
    </select>
    <button class="admin" onclick="consultarRegistros()">
      🔎 Consultar
    </button>
    <div id="resultadoConsulta" class="status">
      Selecione a data e consulte os registros.
    </div>
  </div>
  <button class="logout" onclick="logoutAdmin()">
    Sair da administração
  </button>
</section>
  </div>
</div>
<script>
/* =========================================================
   CONFIGURAÇÃO SUPABASE
   ========================================================= */
const SUPABASE_URL =
  "https://paegduddojnlxyqssert.supabase.co";
const SUPABASE_KEY =
  "sb_publishable_e70A8BQcnZ0o6XB-aXSbzg_p3pDeenk";
const { createClient } =
  supabase;
const db =
  createClient(SUPABASE_URL, SUPABASE_KEY);
/* =========================================================
   CONFIGURAÇÃO WHATSAPP
   ========================================================= */
const DESTINO_WHATSAPP = "5588997104036";
/* =========================================================
   ELEMENTOS
   ========================================================= */
const statusEl =
  document.getElementById("status");
const loginStatusEl =
  document.getElementById("loginStatus");
const entradaBtn =
  document.getElementById("entradaBtn");
const saidaBtn =
  document.getElementById("saidaBtn");
/* =========================================================
   UTILIDADES
   ========================================================= */
function mensagemStatus(texto, tipo="normal"){
  statusEl.textContent = texto;
  statusEl.className = "status";
  if(tipo === "ok")
    statusEl.classList.add("ok");
  if(tipo === "error")
    statusEl.classList.add("error");
}
function formatarDataHora(data){
  return new Date(data).toLocaleString(
    "pt-BR",
    {
      dateStyle:"short",
      timeStyle:"medium"
    }
  );
}
function formatarDuracao(segundos){
  segundos = Math.max(0, Math.floor(segundos));
  const horas =
    Math.floor(segundos / 3600);
  const minutos =
    Math.floor((segundos % 3600) / 60);
  return String(horas).padStart(2,"0")
    + ":" +
    String(minutos).padStart(2,"0");
}
function bloquearBotoes(valor){
  entradaBtn.disabled = valor;
  saidaBtn.disabled = valor;
}
/* =========================================================
   REGISTRAR PONTO
   ========================================================= */
async function registrar(tipo){
  const nome =
    document.getElementById("nome")
      .value
      .trim();
  if(!nome){
    alert("Digite seu nome antes de registrar.");
    return;
  }
  bloquearBotoes(true);
  mensagemStatus(
    "Obtendo sua localização..."
  );
  if(!navigator.geolocation){
    mensagemStatus(
      "Seu navegador não disponibilizou a localização.",
      "error"
    );
    bloquearBotoes(false);
    return;
  }
  navigator.geolocation.getCurrentPosition(
    async position => {
      try{
        const latitude =
          position.coords.latitude;
        const longitude =
          position.coords.longitude;
        const precisao =
          position.coords.accuracy;
        mensagemStatus(
          "Registrando ponto no sistema..."
        );
        const { data, error } =
          await db.rpc(
            "registrar_ponto",
            {
              p_nome: nome,
              p_tipo: tipo,
              p_latitude: latitude,
              p_longitude: longitude,
              p_precisao_metros: precisao
            }
          );
        if(error)
          throw error;
        const registro =
          Array.isArray(data)
            ? data[0]
            : data;
        if(!registro)
          throw new Error(
            "O sistema não retornou o registro."
          );
        const dataHora =
          formatarDataHora(
            registro.registrado_em
          );
        const mapa =
          `https://www.google.com/maps?q=${latitude},${longitude}`;
        const msg =
`🏢 MERCHANT DISTRIBUIDORA
📋 REGISTRO DE ${tipo}
👤 Funcionário: ${registro.nome}
📅 Data e horário: ${dataHora}
📍 Latitude: ${latitude.toFixed(6)}
📍 Longitude: ${longitude.toFixed(6)}
🎯 Precisão: ${Math.round(precisao)} metros
🗺️ Mapa: ${mapa}`;
        mensagemStatus(
          "✓ Ponto registrado com sucesso!\n\n" +
          msg,
          "ok"
        );
        /*
          Abre o WhatsApp somente depois
          de o registro ter sido salvo.
        */
        setTimeout(() => {
          const whatsapp =
            `https://wa.me/${DESTINO_WHATSAPP}?text=` +
            encodeURIComponent(msg);
          window.location.href =
            whatsapp;
        },500);
      }catch(error){
        console.error(error);
        let texto =
          error?.message ||
          "Não foi possível registrar o ponto.";
        if(
          texto.includes(
            "Funcionário não encontrado"
          )
        ){
          texto =
            "Funcionário não encontrado ou inativo.\n" +
            "Procure o administrador para cadastrar seu nome.";
        }
        mensagemStatus(
          "❌ " + texto,
          "error"
        );
      }finally{
        bloquearBotoes(false);
      }
    },
    error => {
      console.error(error);
      let mensagem =
        "Não foi possível obter sua localização.";
      if(error.code === 1)
        mensagem =
          "Permissão de localização negada. " +
          "Ative a localização do navegador e tente novamente.";
      if(error.code === 2)
        mensagem =
          "Sua localização não está disponível no momento.";
      if(error.code === 3)
        mensagem =
          "O tempo para obter sua localização terminou. Tente novamente.";
      mensagemStatus(
        mensagem,
        "error"
      );
      bloquearBotoes(false);
    },
    {
      enableHighAccuracy:true,
      timeout:15000,
      maximumAge:0
    }
  );
}
/* =========================================================
   LOGIN ADMIN
   ========================================================= */
function abrirLoginAdmin(){
  document
    .getElementById("funcionarioArea")
    .classList.add("hidden");
  document
    .getElementById("loginArea")
    .classList.remove("hidden");
  document
    .getElementById("adminEmail")
    .value =
      "gleissonferreirapereira@hotmail.com";
}
function fecharLoginAdmin(){
  document
    .getElementById("loginArea")
    .classList.add("hidden");
  document
    .getElementById("funcionarioArea")
    .classList.remove("hidden");
}
async function loginAdmin(){
  const email =
    document
      .getElementById("adminEmail")
      .value
      .trim();
  const senha =
    document
      .getElementById("adminSenha")
      .value;
  if(!email || !senha){
    loginStatusEl.textContent =
      "Informe o e-mail e a senha.";
    return;
  }
  loginStatusEl.textContent =
    "Entrando...";
  const { error } =
    await db.auth.signInWithPassword({
      email,
      password:senha
    });
  if(error){
    loginStatusEl.textContent =
      "❌ E-mail ou senha incorretos.";
    return;
  }
  const { data: perfil } =
    await db
      .from("perfis_usuario")
      .select("papel")
      .eq("id",(await db.auth.getUser()).data.user.id)
      .single();
  if(
    !perfil ||
    perfil.papel !== "admin"
  ){
    await db.auth.signOut();
    loginStatusEl.textContent =
      "❌ Este usuário não possui permissão de administrador.";
    return;
  }
  abrirPainelAdmin();
}
/* =========================================================
   PAINEL ADMIN
   ========================================================= */
async function abrirPainelAdmin(){
  document
    .getElementById("loginArea")
    .classList.add("hidden");
  document
    .getElementById("funcionarioArea")
    .classList.add("hidden");
  document
    .getElementById("adminArea")
    .classList.remove("hidden");
  document
    .getElementById("dataConsulta")
    .value =
      new Date()
        .toISOString()
        .slice(0,10);
  await carregarFuncionarios();
}
/* =========================================================
   FUNCIONÁRIOS
   ========================================================= */
async function carregarFuncionarios(){
  const lista =
    document.getElementById(
      "listaFuncionarios"
    );
  const select =
    document.getElementById(
      "funcionarioConsulta"
    );
  lista.textContent =
    "Carregando...";
  const { data, error } =
    await db
      .from("funcionarios")
      .select("id,nome,ativo")
      .order("nome");
  if(error){
    lista.textContent =
      "Erro ao carregar funcionários.";
    console.error(error);
    return;
  }
  lista.innerHTML = "";
  select.innerHTML =
    '<option value="">Todos os funcionários</option>';
  if(!data.length){
    lista.innerHTML =
      '<div class="small">Nenhum funcionário cadastrado.</div>';
    return;
  }
  data.forEach(funcionario => {
    const item =
      document.createElement("div");
    item.className =
      "employee";
    const info =
      document.createElement("div");
    info.innerHTML =
      `<strong>${escapeHtml(funcionario.nome)}</strong>
       <div class="small">
       ${funcionario.ativo ? "Ativo" : "Inativo"}
       </div>`;
    const botao =
      document.createElement("button");
    botao.className =
      funcionario.ativo
        ? "out"
        : "in";
    botao.textContent =
      funcionario.ativo
        ? "Desativar"
        : "Ativar";
    botao.onclick =
      () =>
        alterarStatusFuncionario(
          funcionario.id,
          !funcionario.ativo
        );
    item.appendChild(info);
    item.appendChild(botao);
    lista.appendChild(item);
    if(funcionario.ativo){
      const option =
        document.createElement("option");
      option.value =
        funcionario.id;
      option.textContent =
        funcionario.nome;
      select.appendChild(option);
    }
  });
}
async function adicionarFuncionario(){
  const campo =
    document.getElementById(
      "novoFuncionario"
    );
  const nome =
    campo.value.trim();
  if(!nome){
    alert(
      "Digite o nome do funcionário."
    );
    return;
  }
  const { error } =
    await db
      .from("funcionarios")
      .insert({
        nome,
        ativo:true
      });
  if(error){
    if(error.code === "23505"){
      alert(
        "Já existe um funcionário com esse nome."
      );
    }else{
      alert(
        "Não foi possível cadastrar o funcionário."
      );
      console.error(error);
    }
    return;
  }
  campo.value = "";
  await carregarFuncionarios();
  alert(
    "Funcionário cadastrado com sucesso."
  );
}
async function alterarStatusFuncionario(
  id,
  ativo
){
  const { error } =
    await db
      .from("funcionarios")
      .update({ativo})
      .eq("id",id);
  if(error){
    alert(
      "Não foi possível alterar o funcionário."
    );
    console.error(error);
    return;
  }
  await carregarFuncionarios();
}
/* =========================================================
   CONSULTAR REGISTROS
   ========================================================= */
async function consultarRegistros(){
  const data =
    document
      .getElementById("dataConsulta")
      .value;
  const funcionarioId =
    document
      .getElementById("funcionarioConsulta")
      .value;
  const resultado =
    document
      .getElementById("resultadoConsulta");
  if(!data){
    resultado.textContent =
      "Selecione uma data.";
    return;
  }
  resultado.textContent =
    "Consultando registros...";
  const inicio =
    `${data}T00:00:00`;
  const fimDate =
    new Date(`${data}T00:00:00`);
  fimDate.setDate(
    fimDate.getDate()+1
  );
  const fim =
    fimDate
      .toISOString();
  let query =
    db
      .from("registros_ponto")
      .select(`
        id,
        tipo,
        registrado_em,
        latitude,
        longitude,
        precisao_metros,
        funcionario_id,
        funcionarios (
          nome
        )
      `)
      .gte("registrado_em",inicio)
      .lt("registrado_em",fim)
      .order("registrado_em");
  if(funcionarioId){
    query =
      query.eq(
        "funcionario_id",
        funcionarioId
      );
  }
  const { data: registros, error } =
    await query;
  if(error){
    resultado.textContent =
      "Erro ao consultar os registros.";
    console.error(error);
    return;
  }
  if(!registros.length){
    resultado.textContent =
      "Nenhum registro encontrado para esta data.";
    return;
  }
  let html =
    `<strong>${registros.length} registro(s)</strong>`;
  html += `
    <table>
      <thead>
        <tr>
          <th>Funcionário</th>
          <th>Tipo</th>
          <th>Horário</th>
        </tr>
      </thead>
      <tbody>
  `;
  registros.forEach(r => {
    const nome =
      r.funcionarios?.nome ||
      "Funcionário";
    html += `
      <tr>
        <td>${escapeHtml(nome)}</td>
        <td>${r.tipo}</td>
        <td>${formatarDataHora(r.registrado_em)}</td>
      </tr>
    `;
  });
  html += `
      </tbody>
    </table>
  `;
  /*
    Calcula horas quando um funcionário
    específico foi selecionado.
  */
  if(funcionarioId){
    const { data: intervalo,
      error: erroHoras } =
      await db.rpc(
        "calcular_horas_trabalhadas",
        {
          p_funcionario_id:
            funcionarioId,
          p_data:
            data
        }
      );
    if(!erroHoras && intervalo){
      html += `
        <div style="margin-top:15px">
          <strong>⏱ Horas trabalhadas:</strong>
          ${formatarIntervalo(intervalo)}
        </div>
      `;
    }
  }
  resultado.innerHTML =
    html;
}
/* =========================================================
   FORMATAR INTERVALO POSTGRES
   ========================================================= */
function formatarIntervalo(valor){
  if(typeof valor !== "string")
    return valor;
  const match =
    valor.match(
      /(?:(\d+)\s+days?\s*)?(\d{1,2}):(\d{2}):(\d{2})/
    );
  if(!match)
    return valor;
  const dias =
    Number(match[1] || 0);
  const horas =
    Number(match[2] || 0);
  const minutos =
    Number(match[3] || 0);
  const totalHoras =
    dias * 24 + horas;
  return (
    String(totalHoras).padStart(2,"0")
    + ":" +
    String(minutos).padStart(2,"0")
  );
}
/* =========================================================
   SEGURANÇA DE TEXTO HTML
   ========================================================= */
function escapeHtml(text){
  return String(text)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}
/* =========================================================
   VERIFICAR SESSÃO AO ABRIR
   ========================================================= */
async function verificarSessao(){
  const { data } =
    await db.auth.getSession();
  if(data.session){
    const { data: perfil } =
      await db
        .from("perfis_usuario")
        .select("papel")
        .eq(
          "id",
          data.session.user.id
        )
        .single();
    if(
      perfil &&
      perfil.papel === "admin"
    ){
      abrirPainelAdmin();
    }
  }
}
verificarSessao();
/* =========================================================
   OBSERVAR LOGIN/LOGOUT
   ========================================================= */
db.auth.onAuthStateChange(
  async (event) => {
    if(event === "SIGNED_OUT"){
      document
        .getElementById("adminArea")
        .classList.add("hidden");
      document
        .getElementById("loginArea")
        .classList.add("hidden");
      document
        .getElementById("funcionarioArea")
        .classList.remove("hidden");
    }
  }
);
/* =========================================================
   LOGOUT
   ========================================================= */
async function logoutAdmin(){
  await db.auth.signOut();
}
/* =========================================================
   EXPORTAR/ATUALIZAR FUTURAMENTE
   ========================================================= */
async function atualizarPainel(){
  await carregarFuncionarios();
}
/* =========================================================
   FIM
   ========================================================= */
</script>
</body>
</html>
