/* ───────── cliente da API real (backend PHP) ───────── */
const API_BASE=(typeof window!=="undefined"&&window.MF_API_BASE)||"/api";
/* endereço público dos sites: no servidor real usa o próprio domínio (ex.: minisite.manifesti.com.br) */
const PUB_HOST=/(^|\.)manifesti\.com\.br$/.test(location.hostname)?location.host:"manifesti.com.br";
/* no servidor real (manifesti.com.br) é obrigatório criar conta/entrar para usar o app, inclusive no plano grátis */
const REQUIRE_AUTH=/(^|\.)manifesti\.com\.br$/.test(location.hostname)||(typeof window!=="undefined"&&window.MF_REQUIRE_AUTH===true);
let AUTH={apiKey:null,user:null};
try{const saved=JSON.parse(localStorage.getItem("mf_auth")||"null");if(saved&&saved.apiKey)AUTH=saved}catch{}
function saveAuth(){try{localStorage.setItem("mf_auth",JSON.stringify(AUTH))}catch{}}
function clearAuth(){AUTH={apiKey:null,user:null};try{localStorage.removeItem("mf_auth")}catch{}}
async function apiCall(path,opts){
  opts=opts||{};
  const headers=Object.assign({"Content-Type":"application/json"},opts.headers||{});
  if(AUTH.apiKey)headers["Authorization"]="Bearer "+AUTH.apiKey;
  let res;
  try{res=await fetch(API_BASE+path,Object.assign({},opts,{headers}))}
  catch(e){const err=new Error("Não foi possível falar com o servidor. Confira sua internet.");err.network=true;throw err}
  let data=null;
  try{data=await res.json()}catch{}
  if(!res.ok){const err=new Error((data&&data.error)||("Erro "+res.status));err.status=res.status;throw err}
  return data}
async function apiRegister(name,email,password){
  const d=await apiCall("/auth.php?action=register",{method:"POST",body:JSON.stringify({name,email,password})});
  AUTH={apiKey:d.api_key,user:d.user};saveAuth();return d}
async function apiLogin(email,password){
  const d=await apiCall("/auth.php?action=login",{method:"POST",body:JSON.stringify({email,password})});
  AUTH={apiKey:d.api_key,user:d.user};saveAuth();return d}
async function apiListSites(){return (await apiCall("/sites.php")).sites}
async function apiCreateSite(slug,brand){return await apiCall("/sites.php",{method:"POST",body:JSON.stringify({slug,brand})})}
async function apiGetSite(id){return await apiCall("/sites.php?id="+id)}
async function apiSaveSite(id,payload){return await apiCall("/sites.php?id="+id,{method:"PUT",body:JSON.stringify(payload)})}
async function apiPublishSite(id){return await apiCall("/sites.php?id="+id+"&action=publish",{method:"POST"})}
async function apiCheckout(plan,cpfCnpj,phone){return await apiCall("/billing.php?action=checkout",{method:"POST",body:JSON.stringify({plan,cpf_cnpj:cpfCnpj,phone})})}
/* ───────── formulários públicos e listas do painel ───────── */
async function apiSendLead(slug,p){return await apiCall("/leads.php",{method:"POST",body:JSON.stringify(Object.assign({slug},p))})}
async function apiSendOrder(slug,p){return await apiCall("/orders.php",{method:"POST",body:JSON.stringify(Object.assign({slug},p))})}
async function apiSendBooking(slug,p){return await apiCall("/bookings.php",{method:"POST",body:JSON.stringify(Object.assign({slug},p))})}
async function apiTakenSlots(slug,date){return (await apiCall("/bookings.php?slug="+encodeURIComponent(slug)+"&date="+date)).taken||[]}
/* horários já ocupados DESTE site (cada site tem a sua agenda), em cache por data */
const takenCache={},takenPending={};
function takenFor(date){
  const slug=state.handle;if(!(state.remoteSiteId&&slug))return[];
  const k=slug+"|"+date;
  if(takenCache[k])return takenCache[k];
  if(!takenPending[k]){takenPending[k]=1;apiTakenSlots(slug,date).then(t=>{takenCache[k]=t;delete takenPending[k];if(state.view==="editor"||document.body.classList.contains("pub"))renderPreview()}).catch(()=>{delete takenPending[k];takenCache[k]=[]})}
  return[]}
function clearTaken(date){delete takenCache[state.handle+"|"+date]}
function fmtWhen(s){try{const d=new Date(String(s).replace(" ","T"));return d.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"})+" "+d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}catch{return s||""}}
async function loadRemoteLists(){
  const id=state.remoteSiteId;if(!id)return;
  try{
    const [l,o,b]=await Promise.all([apiCall("/leads.php?site_id="+id),apiCall("/orders.php?site_id="+id),apiCall("/bookings.php?site_id="+id)]);
    state.leads=l.leads.map(x=>({d:fmtWhen(x.created_at),n:x.name,c:x.contact,o:x.source||"Site",dev:x.device||"—",b:x.button||"Formulário"}));
    state.orders=o.orders.map(x=>{let it=[];try{it=JSON.parse(x.items||"[]")}catch{}return{d:fmtWhen(x.created_at),who:x.customer_name,items:Array.isArray(it)?it.join(", "):"",type:x.type==="entrega"?"Entrega":"Retirada",total:(x.total_cents||0)/100,st:x.status==="novo"?"Novo":x.status}});
    state.bookings=b.bookings.map(x=>({date:x.booking_date,time:String(x.booking_time).slice(0,5),svc:x.service,who:x.client_name||"Cliente do site",st:x.status==="cancelado"?"Cancelado":"Confirmado"}))}
  catch(err){toast(err.message||"Não foi possível carregar os dados.")}}

async function startCheckout(plan){
  const doc=prompt("Para gerar a cobrança, informe seu CPF ou CNPJ (somente números):");
  if(!doc)return;
  toast("Gerando link de pagamento...");
  try{
    const r=await apiCheckout(plan||"pro",doc,null);
    const w=window.open(r.invoice_url,"_blank","noopener");
    if(!w)copy(r.invoice_url,"Link de pagamento copiado. Cole no navegador.");
    else toast("Abrimos a página de pagamento (cartão de crédito). O plano é ativado assim que o pagamento for confirmado.")}
  catch(err){toast(err.message||"Não foi possível gerar a cobrança agora.")}}

/* tokens no servidor: {v:2, t:<tema>, x:<extras: pixel, GA, música>} */
function packSite(){return{v:2,t:state.tokens,x:{metaPixel:state.metaPixel,gaId:state.gaId,bgMusic:state.bgMusic&&!state.bgMusic.startsWith("blob:")?state.bgMusic:"",bgMusicOn:state.bgMusicOn}}}
function unpackTokens(tok){
  if(tok&&tok.v===2)return{tokens:tok.t,x:tok.x||{}};
  return{tokens:tok||null,x:{}}}

/* upload real: envia o arquivo ao servidor e devolve a URL pública. Sem conta (demonstração) usa só o arquivo local. */
async function fileToUrl(f){
  if(!(AUTH.apiKey&&state.remoteSiteId>0))return URL.createObjectURL(f);
  const fd=new FormData();fd.append("file",f);
  let res;
  try{res=await fetch(API_BASE+"/upload.php",{method:"POST",headers:{Authorization:"Bearer "+AUTH.apiKey},body:fd})}
  catch{toast("Não foi possível enviar o arquivo. Confira sua internet.");return null}
  let d=null;try{d=await res.json()}catch{}
  if(!res.ok||!d||!d.url){toast((d&&d.error)||"Falha no envio do arquivo.");return null}
  return d.url}

/* estatísticas reais do site (visitas, cliques, aparelhos, origem) vindas do servidor */
async function fetchStats(N){
  const id=state.remoteSiteId;state.statsBusy=true;
  const blank=()=>({N,site:id,views:Array(N).fill(0),clicks:Array(N).fill(0),sources:[],devices:[],buttons:[]});
  try{
    const d=await apiCall("/events.php?site_id="+id+"&days="+N);
    const st=blank(),ref=new Date((d.today||new Date().toISOString().slice(0,10))+"T00:00:00");
    (d.rows||[]).forEach(r=>{
      const idx=N-1-Math.round((ref-new Date(String(r.d).slice(0,10)+"T00:00:00"))/864e5);
      if(idx>=0&&idx<N){if(r.type==="view")st.views[idx]+=+r.c;else if(r.type==="click")st.clicks[idx]+=+r.c}});
    st.sources=d.sources||[];st.devices=d.devices||[];st.buttons=d.buttons||[];state.stats=st}
  catch{state.stats=blank()}
  finally{state.statsBusy=false}
  if(state.view==="dashboard"&&state.remoteSiteId===id)renderDashboard()}
/* link público do site e caixa para copiar */
function siteUrl(){return state.customDomain?"https://"+state.customDomain:"https://"+PUB_HOST+"/"+(state.handle||"")}
function updateLink(){
  const u=siteUrl(),i=$("#lkInput"),o=$("#lkOpen");
  if(i)i.value=u;if(o)o.href=u;const sl=$("#slug");if(sl)sl.textContent=state.customDomain||(PUB_HOST+"/"+(state.handle||""))}

/* domínio próprio (Premium) */
async function refreshCustomDomain(){
  state.customDomain="";
  if(!(state.remoteSiteId>0)||!["premium","master"].includes(state.plan)){updateLink();return}
  try{const d=await apiCall("/domains.php?site_id="+state.remoteSiteId);if(d.domain&&d.domain.status==="active")state.customDomain=d.domain.domain}catch{}
  updateLink()}
