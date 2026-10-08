const withTok=(tok,fn)=>{const o=state.tokens;state.tokens=tok;try{return fn()}finally{state.tokens=o}};
const tplIdx=n=>TPL.findIndex(t=>t.name===n);
function tplThumb(t){
  const tok=t.tokens,pages=t.pages();const html=withTok(tok,()=>pageHtml(pages,0));
  return `<div class="thumb" aria-hidden="true"><div class="${bioClass(tok)} mode-view" style="${tokenStyle(tok)}">${pageWrap(tok,html)}</div></div>`}
function phoneShot(i,cls){
  const t=TPL[i],tok=t.tokens,pages=t.pages();
  return `<div class="phone ${cls||""}" aria-hidden="true"><div class="${bioClass(tok)} mode-view" style="${tokenStyle(tok)}">${pageWrap(tok,withTok(tok,()=>pageHtml(pages,0)))}</div></div>`}
state.tplFilter="Todos";
const FEATURED=["Estelle Duarte","Marina Costa","Studio Noir","Renata Prado"];
function renderTemplates(){
  const cats=[...new Set(TPL.map(t=>t.cat))];
  const fl=["Todos",...TIERS.slice(1),...cats];
  $("#tplFilters").innerHTML=fl.map(f=>`<button type="button" data-tf="${esc(f)}" aria-pressed="${state.tplFilter===f}">${esc(f)}</button>`).join("");
  const ok=t=>state.tplFilter==="Todos"||state.tplFilter===TIERS[t.tier]||state.tplFilter===t.cat;
  const order=TPL.map((t,i)=>i).filter(i=>ok(TPL[i])).sort((a,b)=>{
    const fa=FEATURED.includes(TPL[a].brand)?1:0,fb=FEATURED.includes(TPL[b].brand)?1:0;
    if(state.tplFilter==="Todos"&&fa!==fb)return fb-fa;
    if(state.tplFilter==="Todos"&&TPL[a].tier!==TPL[b].tier)return TPL[b].tier-TPL[a].tier;
    return a-b});
  $("#tplGrid").innerHTML=order.map(i=>{const t=TPL[i];return `<div class="card tplcard${FEATURED.includes(t.brand)?" feat":""}">${FEATURED.includes(t.brand)?'<span class="featbdg">'+ic("spark")+" Em destaque no Pro</span>":""}${tplThumb(t)}<div class="tplinfo"><h4>${esc(t.name)}<span class="tag t${t.tier}">${TIERS[t.tier]}</span></h4><p>${esc(t.desc)}</p></div><div class="row"><span class="tag">${t.pages().length} ${t.pages().length>1?"páginas":"página"}</span><span class="tag">${esc(t.cat)}</span></div>${t.tier>plan().tier?`<button type="button" class="btn sm" data-upsell="1" style="align-self:flex-start">${ic("lock")} Plano Pro</button>`:`<button type="button" class="btn primary sm" data-tpl="${i}" style="align-self:flex-start">Usar este template</button>`}</div></div>`;}).join("");
  fitTemplateThumbs()}
const tplMQ=matchMedia("(max-width:640px)");
function fitTemplateThumbs(){
  const thumbs=$$("#tplGrid .thumb");
  if(!tplMQ.matches){thumbs.forEach(th=>{const bio=th.firstElementChild;if(bio)bio.style.zoom=""});return}
  const bios=thumbs.map(th=>th.firstElementChild).filter(Boolean);
  bios.forEach(bio=>bio.style.zoom="1"); /* full scale: width = container width (100%), height = natural content height */
  const heights=bios.map(bio=>bio.scrollHeight);
  bios.forEach((bio,i)=>{
    const th=bio.parentElement,bh=heights[i];
    if(!bh){bio.style.zoom="";return}
    const z=th.clientHeight/bh;
    bio.style.zoom=Math.max(.14,Math.min(.4,z)).toFixed(3)})}
let tplFitT=null;
addEventListener("resize",()=>{clearTimeout(tplFitT);tplFitT=setTimeout(()=>{if($("#tplGrid")&&$("#tplGrid").innerHTML)fitTemplateThumbs()},150)});
tplMQ.addEventListener("change",()=>{if($("#tplGrid")&&$("#tplGrid").innerHTML)renderTemplates()});
/* troca o nome/endereço do template (ex.: "Lanchonete do Zé", @lanchonetedoze) pelos do site real */
function rebrandPages(pages,fromBrand,fromHandle,toBrand,toSlug){
  const esc2=s=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  const hre=fromHandle?new RegExp("([@/])"+esc2(fromHandle)+"(?![a-z0-9-])","gi"):null;
  const walk=v=>{
    if(typeof v==="string"){
      let s=v;
      if(fromBrand&&toBrand&&fromBrand!==toBrand){s=s.split(fromBrand).join(toBrand);const fu=fromBrand.toUpperCase();if(fu!==fromBrand)s=s.split(fu).join(toBrand.toUpperCase())}
      if(hre&&toSlug)s=s.replace(hre,"$1"+toSlug);
      return s}
    if(Array.isArray(v))return v.map(walk);
    if(v&&typeof v==="object"){for(const k of Object.keys(v))v[k]=walk(v[k]);return v}
    return v};
  walk(pages)}
function applyTemplate(i){
  if(TPL[i].tier>plan().tier){toast("Este template é do plano Pro. No Grátis você usa os modelos básicos.");return}
  const real=state.remoteSiteId>0,keep=real?{brand:state.brand,handle:state.handle,seoTitle:state.seoTitle,seoDesc:state.seoDesc,id:state.remoteSiteId}:null;
  loadSite(i);
  if(real){
    /* o site continua sendo o seu: só o visual e os blocos vêm do template, o nome e o endereço são os do site */
    rebrandPages(state.pages,TPL[i].brand,TPL[i].handle,keep.brand,keep.handle);
    state.brand=keep.brand;state.handle=keep.handle;state.remoteSiteId=keep.id;state.seoTitle=keep.seoTitle||keep.brand;state.seoDesc=keep.seoDesc||"";
    state.dirty=true;setSave();
    const sel=$("#siteSel");if(sel&&[...sel.options].some(o=>o.value===String(keep.id)))sel.value=String(keep.id);
    $("#hiSub").textContent="Veja como está o desempenho de "+keep.brand+".";updateLink()}
  if(plan().blocks||maxPages()<3){state.pages=state.pages.slice(0,maxPages());state.pages.forEach(p=>{p.blocks=p.blocks.filter(b=>canBlock(b.type))});state.pageIdx=0;state.sel=state.blocks[0]?state.blocks[0].id:null}
  go("editor");toast(`Template ${TPL[i].name} aplicado. Tudo é editável.`)}
const INV_ST={pending:["Em aberto","warn"],paid:["Pago","ok"],overdue:["Vencida","bad"],canceled:["Cancelada",""],refunded:["Estornada",""]};
async function loadInvoices(){
  const card=$("#invCard");if(!card)return;
  if(!AUTH.apiKey){card.hidden=true;return}
  try{const d=await apiCall("/billing.php?action=invoices");
    card.hidden=!d.invoices.length;
    $("#invRows").innerHTML=d.invoices.map(i=>{const s=INV_ST[i.status]||INV_ST.pending,dt=String(i.due_date||"").split("-").reverse().join("/");
      return `<tr><td>${esc(dt)}</td><td>${esc(PLAN_NAMES[i.plan]||i.plan)}</td><td><b>${brl(i.value_cents)}</b></td><td><span class="pill ${s[1]}">${s[0]}</span></td><td>${i.url?`<a class="btn sm${i.status==="paid"?"":" primary"}" target="_blank" rel="noopener" href="${esc(i.url)}">${i.status==="paid"?"Ver":"Pagar"}</a>`:""}</td></tr>`}).join("")}
  catch{card.hidden=true}}
function renderBilling(){loadInvoices();
  const cur=state.plan||"gratis";
  const cards=cur==="master"?[{k:"master",n:"Master",desc:"Conta master da plataforma.",price:"R$0",badge:"Acesso total",feats:["Sites ilimitados","3 páginas em cada site","Todos os blocos e templates","Sem marca d'água"]}]:[
    {k:"gratis",n:"Gratuito",desc:"Seu primeiro bio site no ar em minutos, sem cartão de crédito.",price:"R$0",badge:"Pra testar sem compromisso",feats:["1 bio site com 1 página","Link manifesti.com.br/seunome","Blocos básicos (botões, textos, WhatsApp, mapa, redes sociais)","Recursos Pro visíveis, mas bloqueados","Marca d'água no rodapé","Suporte pelo WhatsApp"]},
    {k:"pro",n:"Pro",desc:"Tudo que seu negócio precisa pra vender mais, num site só.",price:"R$12,90",sub:"/mês",tag:"RECOMENDADO",badge:"O bio site completo pro seu negócio",feats:["1 bio site com 1 página","Todos os blocos: Pix, Cardápio, Agendamento, Catálogo e mais","Botões de pagamento (Pix, PicPay, Mercado Pago, InfinitePay, Asaas)","Meta Pixel e Google Analytics","Música de fundo e figurinhas","Sem marca d'água no rodapé","Todos os templates","Cancele quando quiser"]},
    {k:"premium",n:"Premium",desc:"Pra quem cuida de vários negócios ou clientes.",price:"R$34,90",sub:"/mês",badge:"Até 10 sites num painel só",feats:["Até 10 bio sites","3 páginas em cada site","Domínio próprio (seunegocio.com.br)","Todos os recursos do Pro","Sem marca d'água","Suporte prioritário","Cancele quando quiser"]}
  ];
  $("#planCards").innerHTML=cards.map(c=>`<div class="plancard ${c.k===cur?"cur":""} ${c.tag?"hi":""}">${c.tag?`<span class="pctag">${c.tag}</span>`:""}<h3>${c.n}</h3><p class="note">${c.desc}</p><div class="pcprice">${c.price}${c.sub?`<small>${c.sub}</small>`:""}</div><span class="pcbadge">${c.badge}</span><ul>${c.feats.map(f=>`<li>${ic("check")}<span>${f}</span></li>`).join("")}</ul><button type="button" class="btn ${c.k==="pro"?"primary":""}" data-setplan="${c.k}" ${c.k===cur||c.k==="master"?"disabled":""}>${c.k===cur?"Plano atual":c.k==="gratis"?"Começar grátis":"Assinar o "+c.n}</button></div>`).join("")}
function setPlan(k){
  state.plan=k;setTimeout(()=>{try{buildNav()}catch(e){}});const p=PLANS[k];
  if(state.pages&&state.pages.length>p.pages){state.pages=state.pages.slice(0,p.pages);state.pageIdx=0}
  $("#useCnt").textContent=k==="master"?"ilimitado":"1 de "+p.sites;$("#useBar").style.width=k==="master"?"100%":Math.round(1/p.sites*100)+"%";
  $("#useTxt").textContent=k==="gratis"?"Plano Grátis · sem cobrança":`Plano ${p.n} · renova em 12/10`;
  renderPalette();renderTemplates();if(state.view==="editor")rerender();
  toast(`Plano ${p.n}: ${p.desc}.`)}

/* ───────── página de vendas ───────── */
function renderLanding(){
  const hot=["Pizzaria","Clínica premium","Criadora de conteúdo"].map(tplIdx);
  const car=["Editorial dourado","Retrato dourado","Boutique noturna","Mentoria autoral","Lanchonete","Barbearia","Salão de beleza","Restaurante autoral","Imobiliária de luxo","Cafeteria especial","Estúdio de tatuagem","Personal trainer"].map(tplIdx);
  const chk=t=>`<li>${ic("check")}<span>${t}</span></li>`;
  const feats=[
   ["w4","layout","Editor visual ao vivo","Arraste blocos, troque cores e fontes e veja o resultado no celular na hora. Sem código e sem designer.",`<div class="mini"><span>Capa com vídeo <em>ligado</em></span><span>Botões personalizados <em>17 estilos</em></span><span>Páginas do site <em>até 3</em></span></div>`,["brush","layout","grid"]],
   ["","grid",TPL.length+" templates","Do básico ao sofisticado, para cada tipo de negócio. Comece pelo que mais se parece com você.",""],
   ["w3 dark","msg","Cardápio com pedido no WhatsApp","O cliente escolhe os itens, informa entrega ou retirada e o pedido chega pronto na sua conversa. Sem comissão e sem app.",`<div class="wa"><b>Novo pedido — Pizzaria</b><br>2x Margherita — R$ 104,00<br>1x Guaraná 2 L — R$ 12,00<br><b>Total: R$ 124,00</b> (com entrega)<br>Cliente: Marina · Pagamento: PIX</div>`,["msg","pix","check"]],
   ["w3","cal","Agendamento online","Horários livres calculados automaticamente, sem conflito entre clientes e com intervalo entre atendimentos.",`<div class="mini"><span>09:00 <em>livre</em></span><span>09:50 <em>livre</em></span><span>10:40 <em>ocupado</em></span></div>`,["cal","check","users"]],
   ["","pix","PIX copia e cola","Chave, QR Code e código no padrão do Banco Central. O dinheiro vai direto para você.",""],
   ["","play","Stories e capa em vídeo","Destaque novidades em stories e abra sua página com foto ou vídeo em tela cheia.",""],
   ["","chart","Cliques e conversões","Veja visitas, origem, dispositivo e quais botões mais vendem.",""],
   ["","qr","QR Code e NFC","Imprima na fachada, no cartão ou no balcão e leve o cliente direto para a sua página.",""],
   ["","globe","Seu endereço","Use o link da Manifesti ou, no plano Premium, conecte seu domínio próprio (seunegocio.com.br).",""],
   ["","users","Leads organizados","Formulários com consentimento LGPD e lista pronta para exportar.",""]];
  const plans=[
   {n:"Grátis",tag:"Para começar",d:"Seu primeiro bio site no ar em minutos, sem cartão de crédito.",pr:"0",sub:"1 site · grátis para sempre",l:["1 bio site com 1 página","Link no endereço da Manifesti","Blocos básicos de conteúdo","Recursos Pro visíveis, mas bloqueados","Marca d'água no rodapé","Suporte pelo WhatsApp"],cta:"Criar grátis",go:1},
   {n:"Pro",tag:"Recomendado",d:"Tudo que seu negócio precisa pra vender mais, sem pagar por recursos de agência que você não vai usar.",pr:"12,90",sub:"1 site · cancele quando quiser",l:["1 bio site com 1 página","Todos os blocos: Pix, Cardápio, Agendamento e mais","Botões de pagamento (Pix, PicPay, Mercado Pago e mais)","Leads e agenda no painel","Meta Pixel e Google Analytics","Figurinhas e música no bio site","Sem marca d'água no rodapé"],cta:"Assinar o Pro",hot:1,go:1},
   {n:"Premium",tag:"Pra agências",d:"Vários negócios ou clientes? Gerencie até 10 sites num painel só.",pr:"34,90",sub:"Até 10 sites · cancele quando quiser",l:["Até 10 bio sites num painel único","3 páginas em cada site","Domínio próprio (seunegocio.com.br)","Todos os recursos do plano Pro","Sem marca d'água","Suporte prioritário"],cta:"Assinar o Premium",go:1},
   {n:"Scale",tag:"Escala sem limite",d:"Agência que gerencia carteira grande, e cresce sem trocar de plano.",pr:"",sub:"Carteira grande · fale com a gente",l:["Mini-sites sem limite prático","Onboarding dedicado","Todos os recursos do plano Premium","Suporte prioritário"],cta:"Saiba mais",more:1},
   {n:"Whitelabel",tag:"Em breve",d:"Sua marca no lugar da nossa, com a plataforma inteira liberada, do seu jeito.",pr:"",sub:"Ainda não disponível para contratação",l:["Domínio próprio (seudominio.com.br)","Sua marca no lugar da Manifesti (100% whitelabel)","Todos os recursos da plataforma liberados","Onboarding dedicado e suporte prioritário"],cta:"Saiba mais",more:1}];
  const faq=[["Posso usar meu endereço em manifesti.com.br/meusite?","Sim. Cada site fica em manifesti.com.br/nome-do-seu-site, sem configurar nada. No plano Premium você conecta seu próprio domínio, como seunegocio.com.br."],["Como o cliente faz o pedido?","No bloco de cardápio ele escolhe os itens, informa nome, entrega ou retirada e forma de pagamento. Ao tocar em enviar, o WhatsApp abre com o pedido completo para a sua loja."],["Preciso saber programar?","Não. Você edita textos, fotos, cores e botões visualmente e publica com um clique."],["Posso cancelar quando quiser?","Sim. Os planos pagos são mensais, sem fidelidade. Se cancelar, seu site volta para o plano Grátis."]];
  $("#v-landing").innerHTML=`
  <header class="lnav"><div class="wrap"><div class="brand"><span class="logo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19V6.5a1.5 1.5 0 0 1 2.6-1L12 10l4.4-4.5A1.5 1.5 0 0 1 19 6.5V19"/></svg></span>manifesti</div>
   <nav><a data-scroll="lf">Recursos</a><a data-scroll="lt">Templates</a><a data-scroll="lp">Planos</a><a data-scroll="lq">Dúvidas</a></nav><span class="sp"></span>
   <button type="button" class="btn" data-authgo="1">Entrar</button><button type="button" class="btn primary" data-tpl="0">Criar meu site</button></div></header>
  <section class="hero"><div class="wrap"><div>
    <span class="eyebrow"><b>Novo</b>Cardápio com pedido no WhatsApp</span>
    <h1>Seu negócio em um <em>link que vende</em>.</h1>
    <p class="lead">Crie em minutos um mini site bonito, com cardápio, agenda, PIX e WhatsApp. Escolha entre ${TPL.length} templates e personalize cada detalhe.</p>
    <div class="cta"><button type="button" class="btn primary lg" data-tpl="0">Criar meu site grátis</button><button type="button" class="btn lg" data-nav="templates">Ver os ${TPL.length} templates</button></div>
    <div class="proof"><span>${ic("check")}Sem cartão de crédito</span><span>${ic("check")}Sem comissão nas vendas</span><span>${ic("check")}Publique em minutos</span></div></div>
    <div class="stagehero"><div class="pfloat" data-pz=".05">${phoneShot(hot[0],"p1")}</div><div class="pfloat" data-pz="-.08">${phoneShot(hot[1],"p2")}</div><div class="pfloat" data-pz=".1">${phoneShot(hot[2],"p3")}</div>
     <div class="float f1 reveal r2"><i>${ic("msg")}</i><span>Pedido recebido<small>2 itens · R$ 124,00</small></span></div>
     <div class="float f2 reveal r4"><i>${ic("chart")}</i><span>+248 cliques hoje<small>WhatsApp é o mais clicado</small></span></div>
     <div class="float f3 reveal r3"><i>${ic("pix")}</i><span>PIX recebido<small>R$ 89,00 agora</small></span></div>
     <div class="float f4 reveal r5"><i>${ic("cal")}</i><span>Novo agendamento<small>Sáb · 15h</small></span></div>
     <div class="float f5 reveal r6"><i>${ic("spark")}</i><span>Site publicado<small>manifesti.com.br/seunome</small></span></div></div></div></section>
  <div class="wrap"><div class="strip">${[`<b>${TPL.length}</b><span>templates prontos</span>`,"<b>3</b><span>páginas por site</span>","<b>0%</b><span>de comissão</span>","<b>1 min</b><span>para publicar</span>"].map((h,i)=>`<div class="reveal r${i+1}">${h}</div>`).join("")}</div></div>
  <section class="lsec" id="lf"><div class="wrap"><div class="hd"><small>Recursos</small><h2>Tudo que seu negócio precisa em uma página</h2><p>Menos aplicativos, mais clientes chegando ao mesmo lugar.</p></div>
   <div class="fgrid">${feats.map(([c,i,t,p,v,badges],ix)=>`<div class="feat ${c} ${v?"split":""} reveal r${(ix%3)+1}"><div class="ftxt"><span class="ic">${ic(i)}</span><h3>${t}</h3><p>${p}</p></div>${v?`<div class="viz"><div class="pmock"><div class="pmph"><div class="scr">${v}</div></div>${(badges||[]).map((bi,bx)=>`<span class="pmb pb${bx+1}">${ic(bi)}</span>`).join("")}</div></div>`:""}</div>`).join("")}</div></div></section>
  <section class="lsec" id="lt"><div class="hd"><small>Templates</small><h2>Um ponto de partida para cada negócio</h2><p>Lanchonete, pizzaria, salão, clínica, loja, estúdio. Escolha e personalize.</p></div>
   <div class="tcar" id="tcar">${car.concat(car).map((i,ix)=>`<div class="it reveal r${(ix%4)+1}" aria-hidden="${ix>=car.length}">${phoneShot(i)}<b>${esc(TPL[i].name)}</b><span>${TIERS[TPL[i].tier]} · ${esc(TPL[i].cat)}</span></div>`).join("")}</div>
   <div style="text-align:center"><button type="button" class="btn lg" data-nav="templates">Ver todos os ${TPL.length} templates</button></div></section>
  <section class="lsec"><div class="wrap"><div class="hd"><small>Como funciona</small><h2>Do zero ao ar em três passos</h2></div>
   <div class="steps"><div class="reveal r1"><h3>Escolha um template</h3><p>Comece do zero ou de um modelo pronto para o seu tipo de negócio.</p></div><div class="reveal r2"><h3>Personalize</h3><p>Troque textos, fotos, cores, fontes e botões. Adicione cardápio, agenda e PIX.</p></div><div class="reveal r3"><h3>Publique e divulgue</h3><p>Compartilhe o link, o QR Code ou coloque na bio do Instagram.</p></div></div></div></section>
  <section class="lsec" id="lp"><div class="wrap"><div class="hd"><small>Planos</small><h2>Simples de começar, fácil de crescer</h2><p>Comece grátis e evolua quando precisar. ${REQUIRE_AUTH?"Cancele quando quiser.":"Valores de exemplo desta demonstração."}</p></div>
   <div class="plans3">${plans.slice(0,3).map((p,ix)=>`<div class="plan3 reveal r${ix+1}${p.hot?" hot":""}">${p.hot?`<span class="ribbon">${p.tag}</span>`:`<span class="ptag">${p.tag}</span>`}<h3>${p.n}</h3><p class="pd">${p.d}</p><div class="pr">${p.pr==="0"?"Grátis":"R$ "+p.pr}${p.pr==="0"?"":"<small>/mês</small>"}</div><small class="ps">${p.sub}</small><ul>${p.l.map(chk).join("")}</ul><button type="button" class="btn pcta" data-plan="${p.n.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")}">${p.cta}</button></div>`).join("")}</div>
   <details class="cmp"><summary>Comparar os planos em detalhe</summary><div class="cmpw"><table><thead><tr><th></th><th>Grátis</th><th>Pro</th><th>Premium</th></tr></thead><tbody>
    ${[["Bio sites","1","1","Até 10"],["Páginas por site","1","1","3"],["Blocos de conteúdo","Básicos","Todos","Todos"],["Botões de pagamento (Pix, PicPay, Mercado Pago…)","—","✓","✓"],["Leads e agenda no painel","—","✓","✓"],["Meta Pixel e Google Analytics","—","✓","✓"],["Música de fundo","—","✓","✓"],["Sem marca d'água","—","✓","✓"],["Domínio próprio","—","—","✓"],["Suporte","WhatsApp","WhatsApp","Prioritário no WhatsApp"]].map(r=>`<tr>${r.map((c,k)=>k?`<td>${c}</td>`:`<th scope="row">${c}</th>`).join("")}</tr>`).join("")}
   </tbody></table></div></details>
   <div class="plansmore"><div><b>Precisa de mais?</b><span>Scale para carteiras grandes de clientes e Whitelabel com a sua marca (em breve).</span></div><button type="button" class="btn" data-moreplan="Scale">Fale com a gente</button></div></div></section>
  <section class="lsec" id="lq"><div class="wrap"><div class="hd"><small>Dúvidas</small><h2>Perguntas frequentes</h2></div><div class="faq">${faq.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>
   <div class="ctaend"><h2>Seu link, pronto para vender</h2><p>Crie o seu em minutos e comece a receber pedidos e contatos hoje.</p><button type="button" class="btn lg" data-tpl="0">Criar meu site grátis</button></div>
   <footer class="lfoot"><span>© 2026 Manifesti.${REQUIRE_AUTH?"":" Demonstração com dados de exemplo."}</span><span>manifesti.com.br</span></footer></div></section>`}

/* ───────── site público (manifesti.com.br/seunome) ───────── */
/* slug do site público: vem de ?site=nome ou do caminho /nome (o Apache reescreve /nome para o index.html sem mudar o endereço) */
const PUB_SLUG=(()=>{
  const q=new URLSearchParams(location.search).get("site");
  if(q&&/^[a-z0-9-]+$/.test(q))return q;
  const m=location.pathname.match(/^\/([a-z0-9-]+)\/?$/);
  return m&&!["index","api","uploads"].includes(m[1])?m[1]:null})();
function addScript(src,inline){const el=document.createElement("script");if(src){el.src=src;el.async=true}else el.textContent=inline;document.head.appendChild(el)}
async function runPublic(slug){
  document.body.classList.add("pub");
  $$(".view,.land").forEach(x=>x.hidden=x.id!=="v-editor");
  try{
    const r=await fetch(API_BASE+"/sites.php?slug="+encodeURIComponent(slug));
    if(!r.ok)throw 0;
    const d=await r.json(),u=unpackTokens(d.tokens);
    if(!u.tokens||!Array.isArray(d.pages)||!d.pages.length)throw 0;
    state.loading=true;state.plan=PLANS[d.plan]?d.plan:"gratis";state.mode="view";state.device="mobile";
    state.tokens=u.tokens;state.pages=d.pages;state.pageIdx=0;state.brand=d.brand;state.handle=d.slug;state.remoteSiteId=-1;
    state.metaPixel=u.x.metaPixel||"";state.gaId=u.x.gaId||"";state.bgMusic=u.x.bgMusic||"";state.bgMusicOn=!!u.x.bgMusicOn;
    state.seoTitle=d.seo_title||d.brand;state.seoDesc=d.seo_desc||"";
    document.body.style.background=u.tokens.bg||"#000";
    renderPreview();state.loading=false;
    if(d.seo_desc){const m=document.createElement("meta");m.name="description";m.content=d.seo_desc;document.head.appendChild(m)}
    if(PLANS[state.plan].feat){
      if(/^[0-9]{5,20}$/.test(state.metaPixel))addScript(null,`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${state.metaPixel}');fbq('track','PageView');`);
      if(/^G-[A-Z0-9]{4,15}$/.test(state.gaId)){addScript("https://www.googletagmanager.com/gtag/js?id="+state.gaId);addScript(null,`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${state.gaId}');`)}}
    const dev=matchMedia("(max-width:900px)").matches?"Celular":"Desktop";
    fetch(API_BASE+"/events.php",{method:"POST",body:JSON.stringify({slug,type:"view",device:dev,ref:(()=>{try{const u=new URLSearchParams(location.search).get("utm_source");if(u)return u.toLowerCase().slice(0,60);return new URL(document.referrer).hostname}catch{return""}})()})}).catch(()=>{});
    document.addEventListener("click",e=>{const a=e.target.closest("a[href]");if(!a)return;fetch(API_BASE+"/events.php",{method:"POST",keepalive:true,body:JSON.stringify({slug,type:"click",button:(a.textContent||"").trim().slice(0,100),device:dev})}).catch(()=>{})})}
  catch{
    document.body.classList.add("pub-404");
    document.body.insertAdjacentHTML("beforeend",`<div class="pub404"><h1>Site não encontrado</h1><p>Este endereço não existe ou ainda não foi publicado.</p><a href="/">Criar o meu bio site</a></div>`)}}
/* ───────── domínio próprio (Premium) ───────── */
const DOM_ST={pending:["Aguardando apontamento","warn"],dns_ok:["Apontamento certo, ativando no servidor","warn"],active:["No ar","ok"]};
async function renderDomains(){
  const box=$("#domBox"),id=state.remoteSiteId;
  if(!(id>0)){box.innerHTML=`<div class="card"><p class="note">Entre na sua conta e abra um site para conectar um domínio.</p></div>`;return}
  box.innerHTML=`<div class="card"><p class="note">Carregando…</p></div>`;
  let d;try{d=await apiCall("/domains.php?site_id="+id)}catch(err){box.innerHTML=`<div class="card"><p class="note">${esc(err.message)}</p></div>`;return}
  state.customDomain=d.domain&&d.domain.status==="active"?d.domain.domain:"";updateLink();
  if(!d.allowed){box.innerHTML=`<div class="card"><h3>Domínio próprio é do plano Premium</h3><p class="note">Seu site fica em ${esc(PUB_HOST)}/${esc(state.handle||"")}. Com o Premium você usa o seu endereço, como seunegocio.com.br.</p><button type="button" class="btn primary" data-nav="billing">Ver planos</button></div>`;return}
  if(!d.domain){box.innerHTML=`<div class="card"><h3>Conecte o seu domínio</h3><p class="note">Primeiro compre o domínio (por exemplo no Registro.br). Depois digite aqui como ele ficou.</p>
    <div class="lkrow" style="margin-top:12px"><input type="text" id="domIn" placeholder="meunegocio.com.br" aria-label="Seu domínio" autocapitalize="off" spellcheck="false"><button type="button" class="btn primary" data-dom="save">Conectar</button></div></div>`;return}
  const r=d.domain,ins=d.instructions||{},st=DOM_ST[r.status]||DOM_ST.pending;
  const row=(t,n,v)=>`<tr><td>${t}</td><td><code>${esc(n)}</code></td><td><code>${esc(v)}</code></td><td><button type="button" class="btn sm" data-dom="copy" data-v="${esc(v)}">Copiar valor</button></td></tr>`;
  box.innerHTML=`<div class="card"><div class="domhead"><div><h3>${esc(r.domain)}</h3><span class="pill ${st[1]}">${st[0]}</span></div>${r.status==="active"?`<a class="btn primary" target="_blank" rel="noopener" href="https://${esc(r.domain)}">Abrir meu site</a>`:""}</div>
    <h4 class="domstep"><b>1</b> No site onde você comprou o domínio, abra a área de DNS e crie:</h4>
    <div class="scroll"><table class="domtbl"><thead><tr><th>Tipo</th><th>Nome (host)</th><th>Valor</th><th></th></tr></thead><tbody>${row("A",ins.record_name||"@",ins.record_value||d.server_ip)}${ins.is_subdomain?"":row("A","www",ins.record_value||d.server_ip)}</tbody></table></div>
    <p class="note">No Registro.br, o nome "@" é o campo em branco. Se já existir outro registro A com o mesmo nome, troque o valor dele.</p>
    <h4 class="domstep"><b>2</b> Confirme o apontamento</h4>
    <div class="row" style="gap:8px;flex-wrap:wrap"><button type="button" class="btn primary" data-dom="verify">Verificar agora</button><button type="button" class="btn" data-dom="remove">Remover este domínio</button></div>
    <p class="note" id="domMsg">${r.status==="active"?"Seu domínio está no ar.":r.status==="dns_ok"?"O apontamento está certo. Nossa equipe ativa o domínio no servidor; costuma levar até algumas horas.":"O DNS pode levar de alguns minutos a algumas horas para valer."}</p></div>`}
document.addEventListener("click",async e=>{
  const bt=e.target.closest("[data-dom]");if(!bt)return;
  const act=bt.dataset.dom,id=state.remoteSiteId;
  if(act==="copy"){copy(bt.dataset.v,"Copiado");return}
  try{
    if(act==="save"){const v=$("#domIn").value.trim();if(!v){toast("Digite o domínio.");return}bt.disabled=true;await apiCall("/domains.php",{method:"POST",body:JSON.stringify({site_id:id,domain:v})});await renderDomains();return}
    if(act==="verify"){bt.disabled=true;const r=await apiCall("/domains.php?action=verify",{method:"POST",body:JSON.stringify({site_id:id})});toast(r.message);await renderDomains();return}
    if(act==="remove"){if(!confirm("Remover o domínio deste site? O link da Manifesti continua funcionando."))return;await apiCall("/domains.php?action=remove",{method:"POST",body:JSON.stringify({site_id:id})});state.customDomain="";updateLink();await renderDomains();return}
  }catch(err){toast(err.message);bt.disabled=false}});
async function drawUserDomains(){
  const box=$("#usDomRows");if(!box)return;
  try{const d=await apiCall("/domains.php?action=list");
    box.innerHTML=d.domains.length?d.domains.map(x=>{const st=DOM_ST[x.status]||DOM_ST.pending;
      return `<tr><td><b>${esc(x.domain)}</b></td><td>${esc(x.name)}<br><small>${esc(x.email)}</small></td><td>${esc(x.slug)}</td><td><span class="pill ${st[1]}">${st[0]}</span></td><td>${x.status==="active"?`<button type="button" class="btn sm" data-domact="pending" data-sid="${x.site_id}">Desativar</button>`:`<button type="button" class="btn sm primary" data-domact="active" data-sid="${x.site_id}">Marcar como ativo</button>`}</td></tr>`}).join(""):emptyRow(5,"Nenhum domínio conectado ainda.")}
  catch(err){box.innerHTML=emptyRow(5,esc(err.message))}}
document.addEventListener("click",async e=>{
  const tm=e.target.closest("#usTestMail");if(!tm)return;
  tm.disabled=true;try{const r=await apiCall("/admin.php?action=test_mail",{method:"POST"});toast(r.message)}catch(err){toast(err.message)}tm.disabled=false});
document.addEventListener("click",async e=>{
  const bt=e.target.closest("[data-domact]");if(!bt)return;
  try{await apiCall("/domains.php?action=set_status",{method:"POST",body:JSON.stringify({site_id:+bt.dataset.sid,status:bt.dataset.domact})});toast("Domínio atualizado.");drawUserDomains()}catch(err){toast(err.message)}});
/* ───────── navegação e início ───────── */
const VIEWS={dashboard:["Painel","home"],editor:["Editor","layout"],templates:["Templates","grid"],orders:["Pedidos","bag"],leads:["Leads","users"],bookings:["Agendamentos","cal"],billing:["Assinatura","card"],domains:["Domínios","globe"],users:["Usuários","user"],landing:["Manifesti",""],auth:["Entrar",""]};
function renderOrders(){$("#orderRows").innerHTML=!state.orders.length&&state.remoteSiteId>0?emptyRow(6,"Nenhum pedido ainda."):state.orders.map(o=>`<tr><td>${esc(o.d)}</td><td>${esc(o.who)}</td><td>${esc(o.items)}</td><td><span class="tag">${o.type}</span></td><td><b>${brl(o.total)}</b></td><td><span class="pill ${o.st==="Novo"?"warn":o.st==="Entregue"?"ok":""}">${o.st}</span></td></tr>`).join("")}
function go(v){
  if(v==="users"&&!isMaster())v="dashboard";
  if(v==="domains"&&!navKeys().includes(v)){toast("Domínio próprio está disponível no plano Premium.");v="billing"}
  if(["leads","bookings","orders"].includes(v)&&!navKeys().includes(v)){toast(v==="leads"?"Leads estão disponíveis a partir do plano Pro.":"Este recurso aparece quando seu plano e seu site o incluem.");v="dashboard"}
  if(REQUIRE_AUTH&&!AUTH.apiKey&&v!=="landing"&&v!=="auth"){state.authTab=state.authTab||"register";v="auth"}
  state.loading=true;state.view=v;document.body.classList.remove("side-open");buildNav();setTimeout(()=>fitDevice());
  $$(".view,.land").forEach(s=>s.hidden=s.id!=="v-"+v);$("#title").textContent=VIEWS[v][0];
  document.body.classList.toggle("on-land",v==="landing"||v==="auth");
  $$("#nav button").forEach(b=>{if(b.dataset.nav===v)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current")});
  if(v==="auth")renderAuth();
  if(v==="users")renderUsers();
  if(v==="domains")renderDomains();
  if(v==="dashboard"){if(state.stats)state.stats.stale=true;renderDashboard();renderFeed();renderSiteList();if(state.remoteSiteId>0)apiListSites().then(l=>{state.remoteSites=l;renderSiteList();refreshSiteSel(state.remoteSiteId)}).catch(()=>{})}
  if(state.remoteSiteId&&(v==="leads"||v==="orders"||v==="bookings"||v==="dashboard"))loadRemoteLists().then(()=>{if(state.view===v){if(v==="leads")renderLeads();if(v==="orders")renderOrders();if(v==="bookings")renderBookings();if(v==="dashboard"){renderDashboard();renderFeed()}}});
  if(v==="leads")renderLeads();
  if(v==="orders")renderOrders();
  if(v==="bookings")renderBookings();
  if(v==="editor")rerender();
  if(v==="templates")fitTemplateThumbs();
  if(v==="billing")renderBilling();
  state.loading=false}
function loadSite(i){
  const t=TPL[i];state.siteIdx=i;state.preset="";state.tokens=structuredClone(t.tokens);state.pages=t.pages();state.pageIdx=0;
  state.sel=state.blocks[0]?state.blocks[0].id:null;state.brand=t.brand;state.handle=t.handle;state.openItem=-1;state.seoTitle=t.brand;state.seoDesc="";closeStory();
  $("#slug").textContent=PUB_HOST+"/"+t.handle;updateLink();$("#hiSub").textContent="Veja como está o desempenho de "+t.brand+".";
  $("#siteSel").value=String(i);state.dirty=false;setSave()}
function setSave(){const e=$("#saveSt");e.textContent=state.dirty?"Alterações não publicadas":(state.pubAt?"Publicado às "+state.pubAt:"Publicado");e.style.color=state.dirty?"var(--warn)":"var(--muted)"}
function renderFeed(){
  const rows=state.remoteSiteId?[...state.leads.slice(0,2).map(l=>["LD","Novo lead: "+l.n,l.d]),...state.orders.slice(0,2).map(o=>["PD","Novo pedido: "+o.who,o.d])]:[["LD","Novo lead: "+state.leads[0].n,state.leads[0].d],["PD","Novo pedido: "+state.orders[0].who,state.orders[0].d],["AG","Agendamento confirmado: Sérgio Lima","hoje 07:52"],["ST","Stories vistos 212 vezes","hoje"],["PX","PIX copiado 3 vezes","ontem"]];
  $("#feed").innerHTML=!rows.length?`<li><span>Sem atividade ainda.</span></li>`:rows.map(([i,t,w])=>`<li><span class="fi">${i}</span><span>${esc(t)}</span><small>${esc(w)}</small></li>`).join("")}
const isMaster=()=>!!(AUTH.apiKey&&AUTH.user&&AUTH.user.plan==="master");
const hasBlock=ts=>(state.pages||[]).some(pg=>(pg.blocks||[]).some(b=>ts.includes(b.type)));
function navKeys(){
  const paid=["pro","premium","master"].includes(state.plan||"gratis");
  return Object.keys(VIEWS).filter(k=>{
    if(k==="landing"||(REQUIRE_AUTH&&k==="auth"))return false;
    if(k==="users")return isMaster();
    if(k==="domains")return ["premium","master"].includes(state.plan||"gratis");
    if(k==="leads")return paid;
    if(k==="bookings")return paid&&hasBlock(["BookingBlock"]);
    if(k==="orders")return paid&&hasBlock(["CatalogBlock"]);
    return true})}
let navSig="";
function buildNav(){
  const keys=navKeys(),sig=keys.join()+"|"+isMaster();
  if(sig!==navSig){navSig=sig;
    $("#nav").innerHTML=keys.map(k=>`<button type="button" data-nav="${k}">${ic(VIEWS[k][1])}${VIEWS[k][0]}</button>`).join("");
    $("#soonNav").innerHTML=[...(keys.includes("domains")?[]:[["Domínios","globe","premium"]]),["Integrações","plug","pró"],...(isMaster()?[]:[["Usuários","user","pró"]])].map(([l,i,t])=>`<button class="soon" disabled>${ic(i)}${l}<small>${t}</small></button>`).join("")}
  const cur=$(`#nav [data-nav="${state.view}"]`);$$("#nav button").forEach(x=>x.removeAttribute("aria-current"));if(cur)cur.setAttribute("aria-current","page")}
buildNav();
$("#publish").addEventListener("click",()=>{const d=new Date();state.pubAt=d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});state.dirty=false;setSave();toast("Publicado. O site já está atualizado.")});
$("#themeBtn").addEventListener("click",()=>{const r=document.documentElement;const dark=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme:dark)").matches;r.dataset.theme=dark?"light":"dark"});
$("#bkSvc").innerHTML=Object.keys(SERVICES).map(s=>`<option>${s}</option>`).join("");
const nd=new Date();nd.setDate(nd.getDate()+((8-nd.getDay())%7||7));$("#bkDate").value=nd.getFullYear()+"-"+String(nd.getMonth()+1).padStart(2,"0")+"-"+String(nd.getDate()).padStart(2,"0");
$("#bkSvc").addEventListener("change",renderBookings);$("#bkDate").addEventListener("input",renderBookings);
$("#siteSel").innerHTML=TPL.map((t,i)=>`<option value="${i}">${esc(t.brand)}</option>`).join("");
$("#siteSel").addEventListener("change",e=>{if(state.remoteSites){switchRemoteSite(e.target.value);return}loadSite(+e.target.value);go(state.view)});

/* ───────── conta real (backend) ───────── */
state.remoteSiteId=null;
function setAuthTab(tab){
  $$("[data-authtab]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.authtab===tab)));
  $("[data-authfield='name']").hidden=tab!=="register";
  $("#authName").required=tab==="register";
  $("#authSubmit").textContent=tab==="register"?"Criar conta":"Entrar";
  $("#authForm").dataset.tab=tab}
function renderAuth(){setAuthTab(state.authTab||"login");state.authTab=null;$("#authErr").textContent="";$("#authEmail").value="";$("#authPass").value=""}
$$("[data-authtab]").forEach(b=>b.addEventListener("click",()=>setAuthTab(b.dataset.authtab)));
$("#authSkip").addEventListener("click",()=>go("dashboard"));
if(REQUIRE_AUTH){
  const sk=$("#authSkipP");if(sk)sk.hidden=true;
  const pl=$("#planSel");if(pl){pl.hidden=true;const lb=$(".planlab");if(lb)lb.hidden=true}
  /* visitante sem conta: qualquer botão da página de vendas que abriria o editor/templates/planos leva ao cadastro */
  document.addEventListener("click",e=>{
    if(AUTH.apiKey||state.view!=="landing")return;
    const b=e.target.closest("[data-tpl],[data-plan],[data-nav]:not([data-nav=landing])");if(!b)return;
    e.preventDefault();e.stopImmediatePropagation();state.authTab="register";go("auth")},true)}
document.addEventListener("click",e=>{if(e.target.closest("[data-authgo]")){if(AUTH.apiKey)enterRealMode();else{state.authTab="login";go("auth")}}});
$("#authForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const tab=e.target.dataset.tab,email=$("#authEmail").value.trim(),pass=$("#authPass").value,name=$("#authName").value.trim();
  $("#authErr").textContent="";$("#authSubmit").disabled=true;
  try{
    if(tab==="register")await apiRegister(name||email.split("@")[0],email,pass);
    else await apiLogin(email,pass);
    await enterRealMode()}
  catch(err){$("#authErr").textContent=err.message||"Não foi possível continuar."}
  finally{$("#authSubmit").disabled=false}});
function setGreeting(){
  const h=new Date().getHours(),hi=h<12?"Bom dia":h<18?"Boa tarde":"Boa noite";
  const nm=AUTH.apiKey&&AUTH.user?String(AUTH.user.name||AUTH.user.email||"").trim().split(/[\s@]/)[0]:"Camila";
  const el=$("#hi");if(el)el.textContent=hi+(nm?", "+nm:"")}
/* o perfil que vem do template em branco ("Seu nome", "@seunome") passa a usar o nome e o endereço reais do site */
function personalizeProfile(brand,slug){
  let changed=false;
  (state.pages||[]).forEach(pg=>(pg.blocks||[]).forEach(b=>{
    if(b.type!=="ProfileBlock"||!b.props)return;
    if(b.props.name==="Seu nome"){b.props.name=brand;changed=true}
    if(b.props.handle==="@seunome"){b.props.handle="@"+slug;changed=true}}));
  return changed}
function loadRemoteSite(site){
  if(!state.demo)state.demo={leads:state.leads,orders:state.orders,bookings:state.bookings};
  state.leads=[];state.orders=[];state.bookings=[];state.stats=null;
  const u=unpackTokens(site.tokens);
  const pg=Array.isArray(site.pages)&&site.pages.length?site.pages:TPL[0].pages();
  state.remoteSiteId=site.id;state.preset="";state.tokens=structuredClone(u.tokens||TPL[0].tokens);state.pages=pg;state.pageIdx=0;
  state.metaPixel=u.x.metaPixel||"";state.gaId=u.x.gaId||"";state.bgMusic=u.x.bgMusic||"";state.bgMusicOn=!!u.x.bgMusicOn;
  state.sel=state.blocks[0]?state.blocks[0].id:null;state.brand=site.brand||site.slug;state.handle=site.slug;state.openItem=-1;
  state.seoTitle=site.seo_title||state.brand;state.seoDesc=site.seo_desc||"";closeStory();
  $("#slug").textContent=PUB_HOST+"/"+site.slug;$("#hiSub").textContent="Veja como está o desempenho de "+state.brand+".";setGreeting();state.customDomain="";updateLink();refreshCustomDomain();
  state.dirty=personalizeProfile(state.brand,site.slug);setSave()}
const slugify=t=>(t||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
function seedSitePayload(brand,slug){
  const up=PLANS[AUTH.user.plan]||PLANS.gratis,pages=TPL[0].pages().slice(0,1);
  pages.forEach(pg=>pg.blocks.forEach(b=>{if(b.type==="ProfileBlock"){b.props.name=brand||b.props.name;b.props.handle="@"+(slug||"meusite")}}));
  pages.forEach(pg=>{pg.blocks=pg.blocks.filter(b=>!up.blocks||up.blocks.includes(b.type))});
  return{tokens:{v:2,t:TPL[0].tokens,x:{}},pages}}
async function createRemoteSite(brand){
  const base=slugify(brand)||"meu-site";
  let created=null,lastErr=null;
  for(let i=0;i<4&&!created;i++){
    try{created=await apiCreateSite(i?base+"-"+Math.random().toString(36).slice(2,6):base,brand)}
    catch(err){lastErr=err;if(err.status!==409&&err.status!==422)throw err}}
  if(!created)throw lastErr;
  await apiSaveSite(created.id,seedSitePayload(brand,created.slug||base));
  return created}
function refreshSiteSel(activeId){
  const sites=state.remoteSites||[];
  const fs=state.foreignSite&&!sites.some(x=>x.id===state.foreignSite.id)?state.foreignSite:null;
  $("#siteSel").innerHTML=sites.map(x=>`<option value="${x.id}">${esc(x.brand||x.slug)}</option>`).join("")+(fs?`<option value="${fs.id}">${esc(fs.label)} (de outro usuário)</option>`:"")+`<option value="__new">+ Novo site</option>`;
  $("#siteSel").value=String(activeId);
  const p=PLANS[state.plan]||PLANS.gratis;
  $("#useCnt").textContent=state.plan==="master"?sites.length+" (ilimitado)":sites.length+" de "+p.sites;
  $("#useBar").style.width=state.plan==="master"?"100%":Math.min(100,Math.round(sites.length/p.sites*100))+"%"}
async function saveDraftIfDirty(){
  if(state.remoteSiteId>0&&state.dirty){
    try{await apiSaveSite(state.remoteSiteId,{tokens:packSite(),pages:state.pages,seo_title:state.seoTitle,seo_desc:state.seoDesc})}
    catch(err){toast(err.message||"Não foi possível salvar o rascunho.");return false}}
  return true}
async function switchRemoteSite(val){
  const prev=String(state.remoteSiteId);
  if(val==="__new"){
    $("#siteSel").value=prev;
    const p=PLANS[state.plan]||PLANS.gratis;
    if((state.remoteSites||[]).length>=p.sites){toast(state.plan==="premium"||state.plan==="master"?"Você atingiu o limite de sites do seu plano.":"Seu plano permite "+p.sites+" site. Faça upgrade para o Premium (até 10 sites).");go("billing");return}
    const name=(prompt("Nome do novo site (ex.: Studio Ana):")||"").trim();if(!name)return;
    if(!await saveDraftIfDirty())return;
    try{
      const c=await createRemoteSite(name);
      state.remoteSites=await apiListSites();
      loadRemoteSite(await apiGetSite(c.id));refreshSiteSel(c.id);go(state.view==="landing"?"dashboard":state.view);toast("Site criado: "+PUB_HOST+"/"+c.slug)}
    catch(err){toast(err.message||"Não foi possível criar o site.")}
    return}
  if(!await saveDraftIfDirty()){$("#siteSel").value=prev;return}
  try{loadRemoteSite(await apiGetSite(+val));go(state.view)}
  catch(err){$("#siteSel").value=prev;toast(err.message||"Não foi possível abrir o site.")}}
function leaveRealMode(){
  clearAuth();state.remoteSiteId=null;state.remoteSites=null;
  $("#siteSel").innerHTML=TPL.map((t,i)=>`<option value="${i}">${esc(t.brand)}</option>`).join("");
  const me=$(".me");if(me)me.innerHTML=`<span class="mav">CD</span><span><b>Camila Duarte</b><small>Agência Pulso</small></span>`;
  state.metaPixel="";state.gaId="";state.bgMusic="";state.bgMusicOn=false;
  if(state.demo){state.leads=state.demo.leads;state.orders=state.demo.orders;state.bookings=state.demo.bookings;state.demo=null}state.stats=null;state.users=null;setPlan("gratis");loadSite(tplIdx("Lanchonete"));setGreeting();buildNav();toast("Você saiu da conta.");go("landing")}
async function enterRealMode(){
  try{
    let sites=await apiListSites();
    if(!sites.length){await createRemoteSite(AUTH.user.name||"Meu site");sites=await apiListSites()}
    state.remoteSites=sites;
    setPlan(PLANS[AUTH.user.plan]?AUTH.user.plan:"gratis");
    loadRemoteSite(await apiGetSite(sites[0].id));
    refreshSiteSel(sites[0].id);
    const me=$(".me");if(me)me.innerHTML=`<span class="mav">${esc((AUTH.user.name||"?").slice(0,2).toUpperCase())}</span><span><b>${esc(AUTH.user.name||AUTH.user.email)}</b><small>${esc(AUTH.user.email||"")}</small></span><button type="button" class="btn ib sm" id="logoutBtn" title="Sair" style="margin-left:auto">⏻</button>`;
    const lo=$("#logoutBtn");if(lo)lo.addEventListener("click",leaveRealMode);
    buildNav();go("dashboard");toast("Bem-vindo, "+(AUTH.user.name||AUTH.user.email)+"!")}
  catch(err){if(err.status===401)clearAuth();toast(err.message||"Erro ao carregar seus sites.");go("auth")}}
if(AUTH.apiKey&&!PUB_SLUG)enterRealMode().catch(()=>{});
const realPublish=$("#publish").cloneNode(true);
$("#publish").replaceWith(realPublish);
realPublish.addEventListener("click",async()=>{
  if(state.remoteSiteId){
    realPublish.disabled=true;
    try{
      await apiSaveSite(state.remoteSiteId,{tokens:packSite(),pages:state.pages,seo_title:state.seoTitle,seo_desc:state.seoDesc});
      await apiPublishSite(state.remoteSiteId);
      const d=new Date();state.pubAt=d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});state.dirty=false;setSave();
      updateLink();toast("Publicado! Seu link: "+siteUrl()+" — use o botão Copiar link.")}
    catch(err){toast(err.message||"Não foi possível publicar agora.")}
    finally{realPublish.disabled=false}
  }else{
    const d=new Date();state.pubAt=d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});state.dirty=false;setSave();
    toast("Publicado. O site já está atualizado. (demonstração — crie uma conta para publicar de verdade)")}});
/* ───────── gerenciar sites: editar, tirar do ar, publicar, excluir ───────── */
function renderSiteList(){
  const card=$("#sitesCard"),box=$("#siteList");if(!card||!box)return;
  const sites=state.remoteSites;
  if(!(state.remoteSiteId>0)||!sites){card.hidden=true;return}
  card.hidden=false;
  box.innerHTML=sites.map(x=>{
    const live=!!x.published_at,url=PUB_HOST+"/"+x.slug;
    return `<div class="srow${x.id===state.remoteSiteId?" cur":""}"><div class="sinfo"><b>${esc(x.brand||x.slug)}</b><small>${live?`<a href="https://${esc(url)}" target="_blank" rel="noopener">${esc(url)}</a>`:esc(url)}</small></div><span class="pill ${live?"ok":""}">${live?"No ar":"Fora do ar"}</span><div class="sact"><button type="button" class="btn sm" data-sact="edit" data-id="${x.id}">Editar</button>${live?`<button type="button" class="btn sm" data-sact="copy" data-id="${x.id}">Copiar link</button><button type="button" class="btn sm" data-sact="off" data-id="${x.id}">Tirar do ar</button>`:`<button type="button" class="btn sm primary" data-sact="on" data-id="${x.id}">Publicar</button>`}<button type="button" class="btn sm danger" data-sact="del" data-id="${x.id}">Excluir</button></div></div>`}).join("")}
const findSite=id=>(state.remoteSites||[]).find(x=>x.id===id)||((state.users&&state.users.users)||[]).flatMap(u=>u.sites||[]).find(x=>x.id===id)||{id};
async function openSite(id){
  if(id!==state.remoteSiteId){
    if(!await saveDraftIfDirty())return;
    const site=await apiGetSite(id),own=(state.remoteSites||[]).some(x=>x.id===id);
    state.foreignSite=own?null:{id:site.id,label:site.brand||site.slug};
    loadRemoteSite(site);refreshSiteSel(id)}
  go("editor")}
async function siteAction(act,id){
  const site=findSite(id),name=site.brand||site.slug||("#"+id);
  try{
    if(act==="edit"){await openSite(id);return}
    if(act==="copy"){copy("https://"+PUB_HOST+"/"+site.slug,"Link copiado: https://"+PUB_HOST+"/"+site.slug);return}
    if(act==="off"){
      if(!confirm('Tirar "'+name+'" do ar?\n\nO endereço deixa de abrir para o público. O site continua salvo e você pode publicar de novo quando quiser.'))return;
      await apiCall("/sites.php?id="+id+"&action=unpublish",{method:"POST"});toast("Site fora do ar.")}
    else if(act==="on"){
      if(id===state.remoteSiteId&&!await saveDraftIfDirty())return;
      await apiPublishSite(id);
      if(id===state.remoteSiteId){state.pubAt=new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});state.dirty=false;setSave()}
      toast("Site no ar: https://"+PUB_HOST+"/"+site.slug)}
    else if(act==="del"){
      if(!confirm('Excluir "'+name+'" de vez?\n\nO site, os leads, pedidos, agendamentos e as estatísticas dele serão apagados. Não dá para desfazer.'))return;
      await apiCall("/sites.php?id="+id+"&action=delete",{method:"POST"});toast("Site excluído.")}
    else return;
    await afterSiteChange(act,id)}
  catch(err){toast(err.message||"Não foi possível concluir a ação.")}}
async function afterSiteChange(act,id){
  state.remoteSites=await apiListSites();
  if(act==="del"&&id===state.remoteSiteId){
    state.foreignSite=null;
    if(!state.remoteSites.length){await createRemoteSite(AUTH.user.name||"Meu site");state.remoteSites=await apiListSites();toast("Site excluído. Criamos um novo site em branco para você continuar.")}
    loadRemoteSite(await apiGetSite(state.remoteSites[0].id))}
  refreshSiteSel(state.remoteSiteId);updateLink();renderSiteList();
  if(state.view==="users"){state.users=null;renderUsers()}
  if(state.view==="editor")rerender()}
async function deleteUserAccount(id){
  const u=((state.users&&state.users.users)||[]).find(x=>x.id===id);if(!u)return;
  if(!confirm('Excluir a conta de '+u.name+' ('+u.email+')?\n\nTodos os sites, leads, pedidos e arquivos dessa pessoa serão apagados. Não dá para desfazer.'))return;
  try{await apiCall("/admin.php?action=delete_user&id="+id,{method:"POST"});toast("Conta excluída.");state.users=null;renderUsers()}
  catch(err){toast(err.message||"Não foi possível excluir a conta.")}}
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-sact]");if(b){e.preventDefault();siteAction(b.dataset.sact,+b.dataset.id);return}
  const d=e.target.closest("[data-uact]");if(d){e.preventDefault();if(d.dataset.uact==="deluser")deleteUserAccount(+d.dataset.id)}});
/* ───────── Usuários (só conta master) ───────── */
const fmtDate=s=>{try{const d=new Date(String(s).replace(" ","T"));return d.toLocaleDateString("pt-BR")+" "+d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}catch{return s||""}};
const PLAN_NAMES={gratis:"Grátis",pro:"Pro",premium:"Premium",master:"Master"};
async function renderUsers(){
  const box=$("#usRows");
  if(!state.users){box.innerHTML=emptyRow(8,"Carregando…");
    try{state.users=await apiCall("/admin.php?action=users")}
    catch(err){box.innerHTML=emptyRow(8,esc(err.message||"Não foi possível carregar os usuários."));return}}
  drawUsers();drawUserDomains()}
function usersFiltered(){
  const d=state.users;if(!d)return[];
  const q=($("#usQ").value||"").trim().toLowerCase(),f=$("#usF").value;
  return d.users.filter(u=>{
    if(f==="active"&&!u.sites_published)return false;
    if(f==="inactive"&&u.sites_published)return false;
    if(["gratis","pro","premium","master"].includes(f)&&u.plan!==f)return false;
    return !q||(u.name+" "+u.email).toLowerCase().includes(q)})}
function drawUsers(){
  const d=state.users;if(!d)return;
  const s=d.summary,bp=s.by_plan;
  $("#usKpis").innerHTML=[["Cadastrados",s.total],["Com site ativo",s.with_active_site],["Sem site publicado",s.total-s.with_active_site],["Novos em 7 dias",s.last_7_days],["Plano Grátis",bp.gratis],["Pro / Premium",bp.pro+bp.premium]].map(([l,v])=>`<div class="card kpi"><span>${l}</span><b>${v}</b></div>`).join("");
  const rows=usersFiltered();
  $("#usCount").textContent=rows.length+" de "+d.users.length;
  $("#usRows").innerHTML=rows.length?rows.map(u=>{
    const sites=u.sites.length?u.sites.map(p=>{const live=!!p.published_at;
      return `<div class="usite"><span class="pill ${live?"ok":""}">${live?"No ar":"Fora do ar"}</span><span class="usl">${live?`<a href="https://${esc(PUB_HOST)}/${esc(p.slug)}" target="_blank" rel="noopener">${esc(p.slug)}</a>`:esc(p.slug)}</span><span class="uact"><button type="button" class="btn sm" data-sact="edit" data-id="${p.id}">Editar</button>${live?`<button type="button" class="btn sm" data-sact="off" data-id="${p.id}">Tirar do ar</button>`:`<button type="button" class="btn sm" data-sact="on" data-id="${p.id}">Publicar</button>`}<button type="button" class="btn sm danger" data-sact="del" data-id="${p.id}">Excluir</button></span></div>`}).join(""):`<span class="note">Nenhum site criado</span>`;
    return `<tr><td><b>${esc(u.name)}</b></td><td>${esc(u.email)}</td><td><span class="tag">${PLAN_NAMES[u.plan]||esc(u.plan)}</span></td><td>${esc(fmtDate(u.created_at))}</td><td>${sites}</td><td>${u.views}</td><td>${u.last_activity?esc(fmtDate(u.last_activity)):"—"}</td><td>${u.plan==="master"?`<span class="note">—</span>`:`<button type="button" class="btn sm danger" data-uact="deluser" data-id="${u.id}">Excluir conta</button>`}</td></tr>`}).join(""):emptyRow(8,"Nenhum usuário encontrado com esse filtro.")}
function exportUsersCsv(){
  const rows=usersFiltered();if(!rows.length){toast("Não há usuários para exportar.");return}
  const q=v=>'"'+String(v==null?"":v).replace(/"/g,'""')+'"';
  const head=["Nome","E-mail","Plano","Cadastro","Site ativo","Sites publicados","Sites criados","Links","Visitas","Última atividade"];
  const lines=rows.map(u=>[u.name,u.email,PLAN_NAMES[u.plan]||u.plan,u.created_at,u.sites_published?"Sim":"Não",u.sites_published,u.sites_total,u.published.map(p=>"https://"+PUB_HOST+"/"+p.slug).join(" "),u.views,u.last_activity||""].map(q).join(";"));
  const blob=new Blob(["\ufeff"+[head.map(q).join(";"),...lines].join("\r\n")],{type:"text/csv;charset=utf-8"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="usuarios-manifesti.csv";document.body.append(a);a.click();a.remove();toast("Lista exportada (CSV).")}
$("#usQ").addEventListener("input",drawUsers);$("#usF").addEventListener("change",drawUsers);
$("#usCsv").addEventListener("click",exportUsersCsv);
$("#usReload").addEventListener("click",()=>{state.users=null;renderUsers()});
/* ───────── link público: copiar / abrir ───────── */
const doCopy=()=>copy(siteUrl(),"Link copiado: "+siteUrl());
["#copyLink","#lkCopy","#slug"].forEach(q=>{const el=$(q);if(el)el.addEventListener("click",doCopy)});
{const i=$("#lkInput");if(i)i.addEventListener("focus",()=>i.select())}
updateLink();
/* ───────── responsivo: barra lateral e abas do editor ───────── */
const mob=()=>matchMedia("(max-width:900px)").matches;
function syncMenu(){const open=mob()?document.body.classList.contains("side-open"):!document.body.classList.contains("side-hidden");$("#menuBtn").setAttribute("aria-expanded",open)}
function setSide(open){if(mob())document.body.classList.toggle("side-open",open);else{document.body.classList.toggle("side-hidden",!open);try{localStorage.setItem("mf_side",open?"1":"0")}catch{}}syncMenu()}
$("#menuBtn").addEventListener("click",()=>{const open=mob()?!document.body.classList.contains("side-open"):document.body.classList.contains("side-hidden");setSide(open)});
(()=>{let v=null;try{v=localStorage.getItem("mf_side")}catch{}const hide=v!==null?v==="0":innerWidth<1280;document.body.classList.toggle("side-hidden",hide);syncMenu()})();
matchMedia("(max-width:900px)").addEventListener("change",()=>{document.body.classList.remove("side-open");syncMenu();syncFab()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&document.body.classList.contains("side-open"))setSide(false);if(e.key==="Escape"&&!$("#fsPrev").hidden)closeFullPreview()});
/* arraste de camadas livres (FreeBlock) */
let flDrag=null;
document.addEventListener("pointerdown",e=>{
  if(state.mode!=="edit")return;
  const el=e.target.closest(".flit");if(!el)return;
  const wrap=el.closest(".flcanvas"),host=el.closest(".blk");if(!wrap||!host)return;
  const b=findBlock(host.dataset.id);if(!b||!b.props.items)return;
  const ix=+el.dataset.fl;if(!b.props.items[ix])return;
  e.preventDefault();
  const rect=wrap.getBoundingClientRect();
  flDrag={b,ix,rect,el,nx:null,ny:null,moved:false};
  try{el.setPointerCapture(e.pointerId)}catch{}
});
document.addEventListener("pointermove",e=>{
  if(!flDrag)return;
  const{rect,el}=flDrag;
  let x=(e.clientX-rect.left)/rect.width*100,y=(e.clientY-rect.top)/rect.height*100;
  x=Math.max(-15,Math.min(115,x));y=Math.max(-15,Math.min(115,y));
  el.style.left=x.toFixed(1)+"%";el.style.top=y.toFixed(1)+"%";
  flDrag.nx=x;flDrag.ny=y;flDrag.moved=true;
});
document.addEventListener("pointerup",()=>{
  if(!flDrag)return;
  const{b,ix,nx,ny,moved}=flDrag;
  if(moved&&nx!=null){b.props.items[ix].x=Math.round(nx*10)/10;b.props.items[ix].y=Math.round(ny*10)/10}
  state.sel=b.id;state.openItem=ix;rerender();
  flDrag=null;
});
$("#etabs").innerHTML=[["blocks","Blocos","grid"],["stage","Prévia","play"],["inspector","Ajustes","brush"]].map(([k,l,i])=>`<button type="button" data-tab="${k}" aria-pressed="${k==="stage"}">${ic(i)}<span>${l}</span></button>`).join("");
function setTab(t){state.etab=t;$("#v-editor").dataset.tab=t;$$("#etabs button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.tab===t));syncFab();const s=$("#v-editor>section[data-t]");}
function syncFab(){const f=$("#editFab");if(f)f.hidden=!(mob()&&state.view==="editor"&&state.etab==="stage"&&state.sel&&state.mode==="edit")}
state.etab="stage";
$("#planSel").addEventListener("change",e=>setPlan(e.target.value));
renderPalette();renderTemplates();renderLanding();loadSite(tplIdx("Lanchonete"));
const CUSTOM_HOST=!REQUIRE_AUTH&&!PUB_SLUG&&/^https?:$/.test(location.protocol)&&!/^(localhost|127\.|\[)/.test(location.hostname)&&!/(^|\.)manifesti\.com\.br$/.test(location.hostname);
if(PUB_SLUG)runPublic(PUB_SLUG);
else if(CUSTOM_HOST){fetch(API_BASE+"/domains.php?resolve="+encodeURIComponent(location.hostname)).then(r=>r.ok?r.json():Promise.reject()).then(d=>runPublic(d.slug)).catch(()=>runPublic("__nao_encontrado__"))}
else go("landing");

/* ───────── animação ao rolar (reveal + parallax das imagens do hero) ───────── */
function initScrollFx(){
  if(noMotion()){$$(".reveal").forEach(el=>el.classList.add("in"));return}
  const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.15,rootMargin:"0px 0px -8% 0px"});
  $$(".reveal").forEach(el=>io.observe(el));
  const layers=$$(".pfloat"),scroller=$(".land")||window;
  if(layers.length){
    const compactHero=matchMedia("(max-width:640px)");
    let ticking=false;
    const onScroll=()=>{
      if(ticking)return;ticking=true;
      requestAnimationFrame(()=>{
        if(compactHero.matches){layers.forEach(el=>el.style.transform="");ticking=false;return}
        const y=scroller===window?scrollY:scroller.scrollTop;
        layers.forEach(el=>{const pz=+el.dataset.pz||0;el.style.transform=`translateY(${(y*pz).toFixed(1)}px)`});
        ticking=false});
    };
    scroller.addEventListener("scroll",onScroll,{passive:true});onScroll();
  }
}
initScrollFx();

/* ───────── carrossel de templates rolando sozinho ───────── */
function initTplMarquee(){
  const el=$("#tcar");if(!el||noMotion())return;
  let paused=false,raf=null;
  const half=()=>el.scrollWidth/2;
  const step=()=>{
    if(!paused){el.scrollLeft+=.6;if(el.scrollLeft>=half())el.scrollLeft-=half()}
    raf=requestAnimationFrame(step)};
  ["pointerenter","touchstart","focusin"].forEach(ev=>el.addEventListener(ev,()=>paused=true,{passive:true}));
  ["pointerleave","touchend","focusout"].forEach(ev=>el.addEventListener(ev,()=>paused=false,{passive:true}));
  document.addEventListener("visibilitychange",()=>{if(document.hidden){cancelAnimationFrame(raf)}else{raf=requestAnimationFrame(step)}});
  raf=requestAnimationFrame(step);
}
initTplMarquee();

})();
