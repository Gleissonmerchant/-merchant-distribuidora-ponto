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
.logo{
  width:82px;
  height:82px;
  object-fit:contain;
  background:white;
  border-radius:18px;
  padding:7px;
  margin-bottom:8px;
}
h1{margin:0;font-size:24px}
.subtitle{opacity:.8;margin-top:5px;font-size:14px}
.container{max-width:620px;margin:auto;padding:18px}
.card{
  background:white;
  border-radius:18px;
  padding:20px;
  margin-bottom:16px;
  box-shadow:0 4px 18px rgba(0,0,0,.07);
}
label{
  display:block;
  font-weight:600;
  margin-bottom:7px;
}
input,select,button{
  width:100%;
  padding:14px;
  border-radius:12px;
  font-size:16px;
}
input,select{
  border:1px solid #d1d5db;
  background:white;
}
button{
  border:0;
  background:#111827;
  color:white;
  font-weight:700;
  cursor:pointer;
  margin-top:10px;
}
button.secondary{background:#6b7280}
button.success{background:#15803d}
button.danger{background:#b91c1c}
button:disabled{opacity:.5}
.status{
  margin-top:14px;
  padding:12px;
  border-radius:12px;
  background:#f3f4f6;
  font-size:14px;
}
.hidden{display:none!important}
.grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:10px;
}
.record{
  border:1px solid #e5e7eb;
  border-radius:12px;
  padding:12px;
  margin-top:8px;
}
.small{font-size:13px;color:#6b7280}
.hours{
  font-size:24px;
  font-weight:800;
  text-align:center;
  padding:12px;
}
footer{
  text-align:center;
  padding:20px;
  color:#6b7280;
  font-size:12px;
}
@media(max-width:430px){
  .grid{grid-template-columns:1fr}
}
</style>
</head>
<body>
<header>
  <div>
    <img class="logo" src="logo.png" alt="Merchant Distribuidora"
         onerror="this.style.display='none'">
  </div>
  <h1>Merchant Distribuidora</h1>
  <div class="subtitle">Sistema de Controle de Ponto</div>
</header>
<main class="container">
  <!-- PONTO DO FUNCIONÁRIO -->
  <section class="card">
    <h2>Registrar ponto</h2>
<label for="nome">Funcionário</label>
<input id="nome" list="listaFuncionarios"
       placeholder="Digite seu nome"
       autocomplete="name">
<datalist id="listaFuncionarios"></datalist>
<div class="grid">
  <button class="success" id="btnEntrada">Registrar entrada</button>
  <button class="danger" id="btnSaida">Registrar saída</button>
</div>
<div id="status" class="status">
  Aguardando registro.
</div>
  </section>
  <!-- ACESSO ADMINISTRATIVO -->
  <section class="card">
    <button id="btnMostrarAdmin" class="secondary">
      Área administrativa
    </button>
  </section>
  <!-- LOGIN ADMIN -->
  <section id="loginAdmin" class="card hidden">
    <h2>Login administrativo</h2>
<label for="adminEmail">E-mail</label>
<input id="adminEmail" type="email"
       placeholder="E-mail do administrador"
       autocomplete="username">
<label for="adminSenha" style="margin-top:12px">Senha</label>
<input id="adminSenha" type="password"
       placeholder="Senha"
       autocomplete="current-password">
<button id="btnLogin">Entrar</button>
<div id="loginStatus" class="status"></div>
  </section>
  <!-- PAINEL ADMIN -->
  <section id="painelAdmin" class="hidden">
<section class="card">
  <h2>Painel administrativo</h2>
  <div id="adminInfo" class="small"></div>
  <button id="btnLogout" class="secondary">Sair</button>
</section>
<!-- FUNCIONÁRIOS -->
<section class="card">
  <h2>Funcionários</h2>
  <label for="novoFuncionario">Novo funcionário</label>
  <input id="novoFuncionario"
         placeholder="Nome completo">
  <button id="btnAdicionarFuncionario" class="success">
    Adicionar funcionário
  </button>
  <div id="listaAdminFuncionarios"></div>
</section>
<!-- CONSULTA -->
<section class="card">
  <h2>Consulta de ponto</h2>
  <label for="dataConsulta">Data</label>
  <input id="dataConsulta" type="date">
  <label for="funcionarioConsulta" style="margin-top:12px">
    Funcionário
  </label>
  <select id="funcionarioConsulta">
    <option value="">Todos os funcionários</option>
  </select>
  <button id="btnConsultar" class="success">
    Consultar
  </button>
  <div id="resultadoHoras"></div>
  <div id="resultadoRegistros"></div>
</section>
  </section>
</main>
<footer>
  Merchant Distribuidora • Controle de Ponto
</footer>
<script>
const SUPABASE_URL = "https://paegduddojnlxyqssert.supabase.co";
const SUPABASE_KEY = "sb_publishable_e70A8BQcnZ0o6XB-aXSbzg_p3pDeenk";
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);
const $ = id => document.getElementById(id);
let funcionarios = [];
function hojeFortaleza(){
  const agora = new Date();
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone:"America/Fortaleza",
    year:"numeric",
    month:"2-digit",
    day:"2-digit"
  }).formatToParts(agora);
  const obj = {};
  partes.forEach(p => obj[p.type] = p.value);
  return `${obj.year}-${obj.month}-${obj.day}`;
}
function mostrarStatus(texto, erro=false){
  $("status").textContent = texto;
  $("status").style.background = erro ? "#fee2e2" : "#f3f4f6";
}
async function carregarFuncionarios(){
  const {data,error} = await db
    .from("funcionarios")
    .select("id,nome,ativo")
    .eq("ativo",true)
    .order("nome");
  if(error){
    console.error(error);
    return;
  }
  funcionarios = data || [];
  $("listaFuncionarios").innerHTML =
    funcionarios.map(f => `<option value="${escapeHtml(f.nome)}"></option>`).join("");
  $("funcionarioConsulta").innerHTML =
    `<option value="">Todos os funcionários</option>` +
    funcionarios.map(f =>
      `<option value="${f.id}">${escapeHtml(f.nome)}</option>`
    ).join("");
}
function escapeHtml(text){
  return String(text)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}
async function obterLocalizacao(){
  return new Promise((resolve,reject)=>{
    if(!navigator.geolocation){
      reject(new Error("Geolocalização não disponível."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({
        latitude:pos.coords.latitude,
        longitude:pos.coords.longitude,
        precisao:pos.coords.accuracy
      }),
      err => reject(new Error(
        "Não foi possível obter sua localização. Ative a localização do celular."
      )),
      {
        enableHighAccuracy:true,
        timeout:15000,
        maximumAge:0
      }
    );
  });
}
async function registrar(tipo){
  const nome = $("nome").value.trim();
  if(!nome){
    mostrarStatus("Digite seu nome antes de registrar o ponto.",true);
    return;
  }
  $("btnEntrada").disabled = true;
  $("btnSaida").disabled = true;
  try{
    mostrarStatus("Obtendo localização...");
    const local = await obterLocalizacao();
    mostrarStatus("Registrando ponto...");
    const {data,error} = await db.rpc("registrar_ponto",{
      p_nome:nome,
      p_tipo:tipo,
      p_latitude:local.latitude,
      p_longitude:local.longitude,
      p_precisao_metros:local.precisao
    });
    if(error) throw error;
    const registro = Array.isArray(data) ? data[0] : data;
    const horario = registro?.registrado_em
      ? new Date(registro.registrado_em).toLocaleString("pt-BR",{
          timeZone:"America/Fortaleza"
        })
      : new Date().toLocaleString("pt-BR",{
          timeZone:"America/Fortaleza"
        });
    mostrarStatus(
      `✓ ${tipo === "ENTRADA" ? "Entrada" : "Saída"} registrada com sucesso às ${horario}.`
    );
    enviarWhatsApp(nome,tipo,horario,local);
  }catch(error){
    console.error(error);
    let mensagem = error.message || "Não foi possível registrar o ponto.";
    if(mensagem.includes("duplicate") ||
       mensagem.includes("Já existe") ||
       mensagem.includes("já existe")){
      mensagem = "Este ponto não pode ser registrado agora. Verifique se já existe uma entrada ou saída aberta.";
    }
    mostrarStatus("Erro: " + mensagem,true);
  }finally{
    $("btnEntrada").disabled = false;
    $("btnSaida").disabled = false;
  }
}
function enviarWhatsApp(nome,tipo,horario,local){
  const numero = "5588997104036";
  const texto =
`Merchant Distribuidora
Registro de ponto
Funcionário: ${nome}
Tipo: ${tipo}
Horário: ${horario}
Localização: ${local.latitude.toFixed(6)}, ${local.longitude.toFixed(6)}
Precisão: ${Math.round(local.precisao)} metros`;
  const url =
    "https://wa.me/" + numero +
    "?text=" + encodeURIComponent(texto);
  window.open(url,"_blank");
}
$("btnEntrada").addEventListener("click",()=>registrar("ENTRADA"));
$("btnSaida").addEventListener("click",()=>registrar("SAIDA"));
$("btnMostrarAdmin").addEventListener("click",()=>{
  $("loginAdmin").classList.toggle("hidden");
});
$("btnLogin").addEventListener("click",loginAdmin);
async function loginAdmin(){
  const email = $("adminEmail").value.trim();
  const senha = $("adminSenha").value;
  if(!email || !senha){
    $("loginStatus").textContent = "Informe e-mail e senha.";
    return;
  }
  $("btnLogin").disabled = true;
  $("loginStatus").textContent = "Entrando...";
  try{
    const {data,error} = await db.auth.signInWithPassword({
      email,
      password:senha
    });
    if(error) throw error;
    const user = data.user;
    const {data:perfil,error:perfilError} = await db
      .from("perfis_usuario")
      .select("id,email,papel,funcionario_id")
      .eq("id",user.id)
      .maybeSingle();
    if(perfilError) throw perfilError;
    if(!perfil || perfil.papel !== "admin"){
      await db.auth.signOut();
      throw new Error("Este usuário não possui permissão de administrador.");
    }
    $("loginStatus").textContent = "Login realizado com sucesso.";
    $("loginAdmin").classList.add("hidden");
    $("painelAdmin").classList.remove("hidden");
    $("adminInfo").textContent = "Administrador: " + (perfil.email || user.email);
    await carregarPainelAdmin();
  }catch(error){
    console.error(error);
    $("loginStatus").textContent =
      "Erro no login: " + (error.message || "verifique os dados.");
  }finally{
    $("btnLogin").disabled = false;
  }
}
$("btnLogout").addEventListener("click",async()=>{
  await db.auth.signOut();
  $("painelAdmin").classList.add("hidden");
  $("loginAdmin").classList.remove("hidden");
  $("adminSenha").value = "";
});
async function carregarPainelAdmin(){
  await carregarTodosFuncionariosAdmin();
  $("dataConsulta").value = hojeFortaleza();
  await carregarFuncionarios();
}
async function carregarTodosFuncionariosAdmin(){
  const {data,error} = await db
    .from("funcionarios")
    .select("id,nome,ativo")
    .order("nome");
  if(error){
    $("listaAdminFuncionarios").innerHTML =
      `<div class="status">Erro: ${escapeHtml(error.message)}</div>`;
    return;
  }
  $("listaAdminFuncionarios").innerHTML =
    (data || []).map(f=>`
      <div class="record">
        <strong>${escapeHtml(f.nome)}</strong>
        <div class="small">
          ${f.ativo ? "Ativo" : "Inativo"}
        </div>
        <button
          class="${f.ativo ? "danger" : "success"}"
          onclick="alterarFuncionario('${f.id}',${!f.ativo})">
          ${f.ativo ? "Desativar" : "Ativar"}
        </button>
      </div>
    `).join("");
}
$("btnAdicionarFuncionario").addEventListener("click",async()=>{
  const nome = $("novoFuncionario").value.trim();
  if(!nome){
    alert("Digite o nome do funcionário.");
    return;
  }
  const {error} = await db
    .from("funcionarios")
    .insert({
      nome:nome,
      ativo:true
    });
  if(error){
    alert("Erro: " + error.message);
    return;
  }
  $("novoFuncionario").value = "";
  await carregarTodosFuncionariosAdmin();
  await carregarFuncionarios();
  alert("Funcionário adicionado com sucesso.");
});
async function alterarFuncionario(id,ativo){
  const {error} = await db
    .from("funcionarios")
    .update({ativo})
    .eq("id",id);
  if(error){
    alert("Erro: " + error.message);
    return;
  }
  await carregarTodosFuncionariosAdmin();
  await carregarFuncionarios();
}
window.alterarFuncionario = alterarFuncionario;
$("btnConsultar").addEventListener("click",consultarPontos);
async function consultarPontos(){
  const data = $("dataConsulta").value;
  const funcionarioId = $("funcionarioConsulta").value;
  if(!data){
    alert("Escolha uma data.");
    return;
  }
  $("resultadoHoras").innerHTML =
    `<div class="status">Consultando...</div>`;
  $("resultadoRegistros").innerHTML = "";
  let inicio = `${data}T00:00:00-03:00`;
  let fim = `${data}T23:59:59-03:00`;
  let query = db
    .from("registros_ponto")
    .select(`
      id,
      tipo,
      registrado_em,
      latitude,
      longitude,
      precisao_metros,
      funcionario_id,
      funcionarios(nome)
    `)
    .gte("registrado_em",inicio)
    .lte("registrado_em",fim)
    .order("registrado_em",{ascending:true});
  if(funcionarioId){
    query = query.eq("funcionario_id",funcionarioId);
  }
  const {data:registros,error} = await query;
  if(error){
    $("resultadoHoras").innerHTML =
      `<div class="status">Erro: ${escapeHtml(error.message)}</div>`;
    return;
  }
  let totalSegundos = 0;
  if(funcionarioId){
    try{
      const {data:horas,error:horasError} =
        await db.rpc("calcular_horas_trabalhadas",{
          p_funcionario_id:funcionarioId,
          p_data:data
        });
      if(!horasError && horas){
        const valor = Array.isArray(horas) ? horas[0] : horas;
        totalSegundos =
          Number(valor?.segundos || valor?.total_segundos || 0);
      }
    }catch(e){
      console.warn(e);
    }
  }else{
    totalSegundos = calcularHorasLocal(registros || []);
  }
  $("resultadoHoras").innerHTML =
    `<div class="hours">
      Horas trabalhadas: ${formatarHoras(totalSegundos)}
    </div>`;
  if(!registros || registros.length === 0){
    $("resultadoRegistros").innerHTML =
      `<div class="status">Nenhum registro encontrado.</div>`;
    return;
  }
  $("resultadoRegistros").innerHTML =
    registros.map(r=>{
      const nome = r.funcionarios?.nome || "Funcionário";
      const horario = new Date(r.registrado_em)
        .toLocaleString("pt-BR",{timeZone:"America/Fortaleza"});
      return `
        <div class="record">
          <strong>${escapeHtml(nome)}</strong><br>
          ${r.tipo === "ENTRADA" ? "🟢 Entrada" : "🔴 Saída"}
          <br>
          <span class="small">${horario}</span>
          <br>
          <span class="small">
            GPS: ${Number(r.latitude).toFixed(6)},
            ${Number(r.longitude).toFixed(6)}
            • ±${Math.round(r.precisao_metros || 0)}m
          </span>
        </div>
      `;
    }).join("");
}
function calcularHorasLocal(registros){
  let entrada = null;
  let total = 0;
  for(const r of registros){
    const instante = new Date(r.registrado_em);
    if(r.tipo === "ENTRADA"){
      if(!entrada) entrada = instante;
    }else if(r.tipo === "SAIDA" && entrada){
      total += Math.max(0,instante - entrada);
      entrada = null;
    }
  }
  return Math.floor(total / 1000);
}
function formatarHoras(segundos){
  segundos = Number(segundos) || 0;
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  return `${String(horas).padStart(2,"0")}:${String(minutos).padStart(2,"0")}`;
}
async function iniciar(){
  await carregarFuncionarios();
  $("dataConsulta").value = hojeFortaleza();
  const {data} = await db.auth.getSession();
  if(data?.session){
    const user = data.session.user;
    const {data:perfil} = await db
      .from("perfis_usuario")
      .select("email,papel")
      .eq("id",user.id)
      .maybeSingle();
    if(perfil?.papel === "admin"){
      $("painelAdmin").classList.remove("hidden");
      $("loginAdmin").classList.add("hidden");
      $("adminInfo").textContent =
        "Administrador: " + (perfil.email || user.email);
      await carregarPainelAdmin();
    }
  }
}
db.auth.onAuthStateChange(async(event,session)=>{
  if(event === "SIGNED_OUT"){
    $("painelAdmin").classList.add("hidden");
  }
});
iniciar();
</script>
</body>
</html>
