const withTok=(tok,fn)=>{const o=state.tokens;state.tokens=tok;try{return fn()}finally{state.tokens=o}};
const tplIdx=n=>TPL.findIndex(t=>t.name===n);
function tplThumb(t){
  const tok=t.tokens,pages=t.pages();const html=withTok(tok,()=>pageHtml(pages,0));
  return `<div class="thumb" aria-hidden="true"><div class="${bioClass(tok)} mode-view" style="${tokenStyle(tok)}">${pageWrap(tok,html)}</div></div>`}
function phoneShot(i,cls){
  const t=TPL[i],tok=t.tokens,pages=t.pages();
  return `<div class="phone ${cls||""}" aria-hidden="true"><div class="${bioClass(tok)} mode-view" style="${tokenStyle(tok)}">${pageWrap(tok,withTok(tok,()=>pageHtml(pages,0)))}</div></div>`}
state.tplFilter="Todos";
function renderTemplates(){
  const cats=[...new Set(TPL.map(t=>t.cat))];
  const fl=["Todos",...TIERS.slice(1),...cats];
  $("#tplFilters").innerHTML=fl.map(f=>`<button type="button" data-tf="${esc(f)}" aria-pressed="${state.tplFilter===f}">${esc(f)}</button>`).join("");
  const ok=t=>state.tplFilter==="Todos"||state.tplFilter===TIERS[t.tier]||state.tplFilter===t.cat;
  $("#tplGrid").innerHTML=TPL.map((t,i)=>ok(t)?`<div class="card tplcard">${tplThumb(t)}<div><h4>${esc(t.name)}<span class="tag t${t.tier}">${TIERS[t.tier]}</span></h4><p>${esc(t.desc)}</p></div><div class="row"><span class="tag">${t.pages().length} ${t.pages().length>1?"páginas":"página"}</span><span class="tag">${esc(t.cat)}</span></div>${t.tier>plan().tier?`<button type="button" class="btn sm" data-upsell="1" style="align-self:flex-start">${ic("lock")} Plano Pro</button>`:`<button type="button" class="btn primary sm" data-tpl="${i}" style="align-self:flex-start">Usar este template</button>`}</div>`:"").join("")}
function applyTemplate(i){
  if(TPL[i].tier>plan().tier){toast("Este template é do plano Pro. No Grátis você usa os modelos básicos.");return}
  loadSite(i);
  if(plan().blocks||maxPages()<3){state.pages=state.pages.slice(0,maxPages());state.pages.forEach(p=>{p.blocks=p.blocks.filter(b=>canBlock(b.type))});state.pageIdx=0;state.sel=state.blocks[0]?state.blocks[0].id:null}
  go("editor");toast(`Template ${TPL[i].name} aplicado. Tudo é editável.`)}
function setPlan(k){
  state.plan=k;const p=PLANS[k];
  if(state.pages&&state.pages.length>p.pages){state.pages=state.pages.slice(0,p.pages);state.pageIdx=0}
  $("#useCnt").textContent=(k==="gratis"||k==="pro"?"1":"5")+" de "+p.sites;$("#useBar").style.width=Math.round((k==="gratis"||k==="pro"?1:5)/p.sites*100)+"%";
  $("#useTxt").textContent=k==="gratis"?"Plano Grátis · sem cobrança":"Plano "+p.n+" · renova em 12/10";
  renderPalette();renderTemplates();if(state.view==="editor")rerender();
  toast(k==="gratis"?"Plano Grátis: 1 site, 1 página, só links e redes sociais e templates básicos.":"Plano "+p.n+": "+p.desc+".")}

/* ───────── página de vendas ───────── */
function renderLanding(){
  const hot=["Pizzaria","Clínica premium","Criadora de conteúdo"].map(tplIdx);
  const car=["Lanchonete","Barbearia","Salão de beleza","Restaurante autoral","Imobiliária de luxo","Cafeteria especial","Estúdio de tatuagem","Personal trainer","Loja de roupas","Estúdio de arquitetura"].map(tplIdx);
  const chk=t=>`<li>${ic("check")}<span>${t}</span></li>`;
  const feats=[
   ["w4","layout","Editor visual ao vivo","Arraste blocos, troque cores e fontes e veja o resultado no celular na hora. Sem código e sem designer.",`<div class="mini"><span>Capa com vídeo <em>ligado</em></span><span>Botões personalizados <em>17 estilos</em></span><span>Páginas do site <em>até 3</em></span></div>`],
   ["","grid","60 templates","Do básico ao sofisticado, para cada tipo de negócio. Comece pelo que mais se parece com você.",""],
   ["w3 dark","msg","Cardápio com pedido no WhatsApp","O cliente escolhe os itens, informa entrega ou retirada e o pedido chega pronto na sua conversa. Sem comissão e sem app.",`<div class="wa"><b>Novo pedido — Pizzaria</b><br>2x Margherita — R$ 104,00<br>1x Guaraná 2 L — R$ 12,00<br><b>Total: R$ 124,00</b> (com entrega)<br>Cliente: Marina · Pagamento: PIX</div>`],
   ["w3","cal","Agendamento online","Horários livres calculados automaticamente, sem conflito entre clientes e com intervalo entre atendimentos.",`<div class="mini"><span>09:00 <em>livre</em></span><span>09:50 <em>livre</em></span><span>10:40 <em>ocupado</em></span></div>`],
   ["","pix","PIX copia e cola","Chave, QR Code e código no padrão do Banco Central. O dinheiro vai direto para você.",""],
   ["","play","Stories e capa em vídeo","Destaque novidades em stories e abra sua página com foto ou vídeo em tela cheia.",""],
   ["","chart","Cliques e conversões","Veja visitas, origem, dispositivo e quais botões mais vendem.",""],
   ["","qr","QR Code e NFC","Imprima na fachada, no cartão ou no balcão e leve o cliente direto para a sua página.",""],
   ["","globe","Seu endereço","Use manifesti.com.br/seu-nome ou conecte seu domínio próprio.",""],
   ["","users","Leads organizados","Formulários com consentimento LGPD e lista pronta para exportar.",""]];
  const plans=[
   {n:"Grátis",tag:"Para começar",d:"Seu link único, sem pagar nada.",pr:"0",sub:"1 site · grátis para sempre",l:["1 site com 1 página","Links e redes sociais","Templates básicos liberados","Personalização de cores e fontes","QR Code do seu link"],cta:"Criar grátis",go:1},
   {n:"Pro",tag:"Individual",d:"Pra você, seu negócio, seu link único.",pr:"97,90",sub:"1 site · cancele quando quiser",l:["1 mini-site profissional","WhatsApp, Pix, endereço, catálogo, redes","Agendamento online com horários próprios","Pix com QR Code e copia e cola","Personalização total","Analytics em tempo real","Suporte no WhatsApp"],cta:"Assinar agora",go:1},
   {n:"Premium",tag:"Melhor pra agências",d:"Agência começando? Gerencie múltiplas marcas num painel só.",pr:"197,90",sub:"Até 30 sites · cancele quando quiser",l:["Até 30 mini-sites","Painel único pra gerenciar tudo","Subcontas ilimitadas","Analytics separado por site","Todos os recursos do plano Pro","Suporte prioritário no WhatsApp"],cta:"Assinar o Premium",hot:1,go:1},
   {n:"Scale",tag:"Escala sem limite",d:"Agência que gerencia carteira grande, e cresce sem trocar de plano.",pr:"297,90",sub:"Até 100 sites · compre mais depois",l:["Até 100 mini-sites inclusos","Compre pacotes de sites extras dentro do painel","Todos os recursos do plano Premium","Subcontas ilimitadas","Onboarding e suporte prioritário"],cta:"Assinar o Scale",go:1},
   {n:"Whitelabel",tag:"Em breve",d:"Sua marca no lugar da nossa, com a plataforma inteira liberada, do seu jeito.",pr:"",sub:"Ainda não disponível para contratação",l:["Domínio próprio (seudominio.com.br)","Sua marca no lugar da Manifesti (100% whitelabel)","Todos os recursos da plataforma liberados","Mini-sites sem limite prático","Subcontas ilimitadas","Onboarding dedicado e suporte prioritário"],cta:"Em breve",soon:1}];
  const faq=[["Posso usar meu endereço em manifesti.com.br/meusite?","Sim. Cada site fica em manifesti.com.br/nome-do-seu-site, sem configurar nada. Se preferir, conecte um domínio ou subdomínio próprio, como bio.suaempresa.com.br."],["Como o cliente faz o pedido?","No bloco de cardápio ele escolhe os itens, informa nome, entrega ou retirada e forma de pagamento. Ao tocar em enviar, o WhatsApp abre com o pedido completo para a sua loja."],["Preciso saber programar?","Não. Você edita textos, fotos, cores e botões visualmente e publica com um clique."],["Os valores acima são finais?","São valores de exemplo desta demonstração e podem mudar antes do lançamento."]];
  $("#v-landing").innerHTML=`
  <header class="lnav"><div class="wrap"><div class="brand"><span class="logo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19V6.5a1.5 1.5 0 0 1 2.6-1L12 10l4.4-4.5A1.5 1.5 0 0 1 19 6.5V19"/></svg></span>manifesti</div>
   <nav><a data-scroll="lf">Recursos</a><a data-scroll="lt">Templates</a><a data-scroll="lp">Planos</a><a data-scroll="lq">Dúvidas</a></nav><span class="sp"></span>
   <button type="button" class="btn" data-nav="dashboard">Entrar</button><button type="button" class="btn primary" data-tpl="0">Criar meu site</button></div></header>
  <section class="hero"><div class="wrap"><div>
    <span class="eyebrow"><b>Novo</b>Cardápio com pedido no WhatsApp</span>
    <h1>Seu negócio em um <em>link que vende</em>.</h1>
    <p class="lead">Crie em minutos um mini site bonito, com cardápio, agenda, PIX e WhatsApp. Escolha entre 60 templates e personalize cada detalhe.</p>
    <div class="cta"><button type="button" class="btn primary lg" data-tpl="0">Criar meu site grátis</button><button type="button" class="btn lg" data-nav="templates">Ver os 60 templates</button></div>
    <div class="proof"><span>${ic("check")}Sem cartão de crédito</span><span>${ic("check")}Sem comissão nas vendas</span><span>${ic("check")}Publique em minutos</span></div></div>
    <div class="stagehero">${phoneShot(hot[0],"p1")}${phoneShot(hot[1],"p2")}${phoneShot(hot[2],"p3")}
     <div class="float f1"><i>${ic("msg")}</i><span>Pedido recebido<small>2 itens · R$ 124,00</small></span></div>
     <div class="float f2"><i>${ic("chart")}</i><span>+248 cliques hoje<small>WhatsApp é o mais clicado</small></span></div></div></div></section>
  <div class="wrap"><div class="strip"><div><b>60</b><span>templates prontos</span></div><div><b>3</b><span>páginas por site</span></div><div><b>0%</b><span>de comissão</span></div><div><b>1 min</b><span>para publicar</span></div></div></div>
  <section class="lsec" id="lf"><div class="wrap"><div class="hd"><small>Recursos</small><h2>Tudo que seu negócio precisa em uma página</h2><p>Menos aplicativos, mais clientes chegando ao mesmo lugar.</p></div>
   <div class="fgrid">${feats.map(([c,i,t,p,v])=>`<div class="feat ${c}"><span class="ic">${ic(i)}</span><h3>${t}</h3><p>${p}</p>${v?`<div class="viz">${v}</div>`:""}</div>`).join("")}</div></div></section>
  <section class="lsec" id="lt"><div class="hd"><small>Templates</small><h2>Um ponto de partida para cada negócio</h2><p>Lanchonete, pizzaria, salão, clínica, loja, estúdio. Escolha e personalize.</p></div>
   <div class="tcar">${car.map(i=>`<button type="button" class="it" data-tpl="${i}">${phoneShot(i)}<b>${esc(TPL[i].name)}</b><span>${TIERS[TPL[i].tier]} · ${esc(TPL[i].cat)}</span></button>`).join("")}</div>
   <div style="text-align:center"><button type="button" class="btn lg" data-nav="templates">Ver todos os 60 templates</button></div></section>
  <section class="lsec"><div class="wrap"><div class="hd"><small>Como funciona</small><h2>Do zero ao ar em três passos</h2></div>
   <div class="steps"><div><h3>Escolha um template</h3><p>Comece do zero ou de um modelo pronto para o seu tipo de negócio.</p></div><div><h3>Personalize</h3><p>Troque textos, fotos, cores, fontes e botões. Adicione cardápio, agenda e PIX.</p></div><div><h3>Publique e divulgue</h3><p>Compartilhe o link, o QR Code ou coloque na bio do Instagram.</p></div></div></div></section>
  <section class="lsec" id="lp"><div class="wrap"><div class="hd"><small>Planos</small><h2>Simples de começar, fácil de crescer</h2><p>Comece grátis e evolua quando precisar. Valores de exemplo desta demonstração.</p></div>
   <div class="plans">${plans.map(p=>`<div class="plan ${p.hot?"hot":""} ${p.soon?"soon":""}">${p.hot?`<span class="ribbon">${p.tag}</span>`:`<span class="ptag">${p.tag}</span>`}<h3>Plano ${p.n}</h3><p class="pd">${p.d}</p>${p.pr?`<div class="pr">${p.pr==="0"?"Grátis":"R$ "+p.pr}${p.pr==="0"?"":"<small>/mês</small>"}</div>`:`<div class="pr">Em breve</div>`}<small class="ps">${p.sub}</small><ul>${p.l.map(chk).join("")}</ul>${p.soon?'<button type="button" class="btn" disabled>Em breve</button>':`<button type="button" class="btn pcta" data-plan="${p.n.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")}">${p.cta}</button>`}</div>`).join("")}</div></div></section>
  <section class="lsec" id="lq"><div class="wrap"><div class="hd"><small>Dúvidas</small><h2>Perguntas frequentes</h2></div><div class="faq">${faq.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>
   <div class="ctaend"><h2>Seu link, pronto para vender</h2><p>Crie o seu em minutos e comece a receber pedidos e contatos hoje.</p><button type="button" class="btn lg" data-tpl="0">Criar meu site grátis</button></div>
   <footer class="lfoot"><span>© 2026 Manifesti. Demonstração com dados de exemplo.</span><span>manifesti.com.br</span></footer></div></section>`}

/* ───────── navegação e início ───────── */
const VIEWS={dashboard:["Painel","home"],editor:["Editor","layout"],templates:["Templates","grid"],orders:["Pedidos","bag"],leads:["Leads","users"],bookings:["Agendamentos","cal"],landing:["Manifesti",""]};
function renderOrders(){$("#orderRows").innerHTML=state.orders.map(o=>`<tr><td>${esc(o.d)}</td><td>${esc(o.who)}</td><td>${esc(o.items)}</td><td><span class="tag">${o.type}</span></td><td><b>${brl(o.total)}</b></td><td><span class="pill ${o.st==="Novo"?"warn":o.st==="Entregue"?"ok":""}">${o.st}</span></td></tr>`).join("")}
function go(v){
  state.loading=true;state.view=v;document.body.classList.remove("side-open");
  $$(".view,.land").forEach(s=>s.hidden=s.id!=="v-"+v);$("#title").textContent=VIEWS[v][0];
  document.body.classList.toggle("on-land",v==="landing");
  $$("#nav button").forEach(b=>{if(b.dataset.nav===v)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current")});
  if(v==="dashboard"){renderDashboard();renderFeed()}
  if(v==="leads")renderLeads();
  if(v==="orders")renderOrders();
  if(v==="bookings")renderBookings();
  if(v==="editor")rerender();
  state.loading=false}
function loadSite(i){
  const t=TPL[i];state.siteIdx=i;state.preset="";state.tokens=structuredClone(t.tokens);state.pages=t.pages();state.pageIdx=0;
  state.sel=state.blocks[0]?state.blocks[0].id:null;state.brand=t.brand;state.handle=t.handle;state.openItem=-1;closeStory();
  $("#slug").textContent="manifesti.com.br/"+t.handle;$("#hiSub").textContent="Veja como está o desempenho de "+t.brand+".";
  $("#siteSel").value=String(i);state.dirty=false;setSave()}
function setSave(){const e=$("#saveSt");e.textContent=state.dirty?"Alterações não publicadas":(state.pubAt?"Publicado às "+state.pubAt:"Publicado");e.style.color=state.dirty?"var(--warn)":"var(--muted)"}
function renderFeed(){
  const rows=[["LD","Novo lead: "+state.leads[0].n,state.leads[0].d],["PD","Novo pedido: "+state.orders[0].who,state.orders[0].d],["AG","Agendamento confirmado: Sérgio Lima","hoje 07:52"],["ST","Stories vistos 212 vezes","hoje"],["PX","PIX copiado 3 vezes","ontem"]];
  $("#feed").innerHTML=rows.map(([i,t,w])=>`<li><span class="fi">${i}</span><span>${esc(t)}</span><small>${esc(w)}</small></li>`).join("")}
$("#nav").innerHTML=Object.entries(VIEWS).filter(([k])=>k!=="landing").map(([k,[l,i]])=>`<button type="button" data-nav="${k}">${ic(i)}${l}</button>`).join("");
$("#soonNav").innerHTML=[["Domínios","globe"],["Integrações","plug"],["Usuários","user"],["Assinatura","card"]].map(([l,i])=>`<button class="soon" disabled>${ic(i)}${l}<small>pró</small></button>`).join("");
$("#publish").addEventListener("click",()=>{const d=new Date();state.pubAt=d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});state.dirty=false;setSave();toast("Publicado. O site já está atualizado.")});
$("#themeBtn").addEventListener("click",()=>{const r=document.documentElement;const dark=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme:dark)").matches;r.dataset.theme=dark?"light":"dark"});
$("#bkSvc").innerHTML=Object.keys(SERVICES).map(s=>`<option>${s}</option>`).join("");
const nd=new Date();nd.setDate(nd.getDate()+((8-nd.getDay())%7||7));$("#bkDate").value=nd.getFullYear()+"-"+String(nd.getMonth()+1).padStart(2,"0")+"-"+String(nd.getDate()).padStart(2,"0");
$("#bkSvc").addEventListener("change",renderBookings);$("#bkDate").addEventListener("input",renderBookings);
$("#siteSel").innerHTML=TPL.map((t,i)=>`<option value="${i}">${esc(t.brand)}</option>`).join("");
$("#siteSel").addEventListener("change",e=>{loadSite(+e.target.value);go(state.view)});
/* ───────── responsivo: barra lateral e abas do editor ───────── */
const mob=()=>matchMedia("(max-width:900px)").matches;
function syncMenu(){const open=mob()?document.body.classList.contains("side-open"):!document.body.classList.contains("side-hidden");$("#menuBtn").setAttribute("aria-expanded",open)}
function setSide(open){if(mob())document.body.classList.toggle("side-open",open);else{document.body.classList.toggle("side-hidden",!open);try{localStorage.setItem("mf_side",open?"1":"0")}catch{}}syncMenu()}
$("#menuBtn").addEventListener("click",()=>{const open=mob()?!document.body.classList.contains("side-open"):document.body.classList.contains("side-hidden");setSide(open)});
(()=>{let v=null;try{v=localStorage.getItem("mf_side")}catch{}const hide=v!==null?v==="0":innerWidth<1280;document.body.classList.toggle("side-hidden",hide);syncMenu()})();
matchMedia("(max-width:900px)").addEventListener("change",()=>{document.body.classList.remove("side-open");syncMenu();syncFab()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&document.body.classList.contains("side-open"))setSide(false)});
$("#etabs").innerHTML=[["blocks","Blocos","grid"],["stage","Prévia","play"],["inspector","Ajustes","brush"]].map(([k,l,i])=>`<button type="button" data-tab="${k}" aria-pressed="${k==="stage"}">${ic(i)}<span>${l}</span></button>`).join("");
function setTab(t){state.etab=t;$("#v-editor").dataset.tab=t;$$("#etabs button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.tab===t));syncFab();const s=$("#v-editor>section[data-t]");}
function syncFab(){const f=$("#editFab");if(f)f.hidden=!(mob()&&state.view==="editor"&&state.etab==="stage"&&state.sel&&state.mode==="edit")}
state.etab="stage";
$("#planSel").addEventListener("change",e=>setPlan(e.target.value));
renderPalette();renderTemplates();renderLanding();loadSite(tplIdx("Lanchonete"));go("landing");

})();
