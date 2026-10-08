(function(){
const track={};
"use strict";
/* ───────── ícones ───────── */
const IC={lock:'<rect x="4" y="11" width="16" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',home:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',layout:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 21V9"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',bag:'<path d="M6 7h12l1 13H5z"/><path d="M9 7a3 3 0 0 1 6 0"/>',users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',cal:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',plug:'<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0z"/><path d="M12 17v4"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',card:'<rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M2.5 10h19"/>',check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',msg:'<path d="M21 12a8 8 0 0 1-11.5 7.2L4 20.5l1.4-4.6A8 8 0 1 1 21 12z"/>',qr:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20h1"/>',chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',play:'<circle cx="12" cy="12" r="9"/><path d="M10 8.5l6 3.5-6 3.5z"/>',pix:'<path d="M12 3l4.5 4.5a2.5 2.5 0 0 1 0 3.5L12 15.5 7.5 11a2.5 2.5 0 0 1 0-3.5z"/><path d="M12 15.5L16.5 20M12 15.5L7.5 20"/>',brush:'<path d="M14 4l6 6-9 9H5v-6z"/><path d="M12 6l6 6"/>',arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>'};
const ic=(n,c)=>`<svg class="i ${c||""}" viewBox="0 0 24 24" aria-hidden="true">${IC[n]||""}</svg>`;
/* ───────── util ───────── */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const uid=()=>Math.random().toString(36).slice(2,8);
const brl=c=>(c/100).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
function toast(t){const e=document.createElement("div");e.className="toast";e.textContent=t;e.setAttribute("role","status");$("#toastHost").append(e);setTimeout(()=>e.remove(),2200)}
async function copy(text,msg){try{await navigator.clipboard.writeText(text);toast(msg)}catch{const t=document.createElement("textarea");t.value=text;document.body.append(t);t.select();try{document.execCommand("copy");toast(msg)}catch{toast("Selecione e copie manualmente")}t.remove()}}

/* ───────── imagens de exemplo (geradas) ───────── */
const PAL={
  sol:["#ffb703","#fb5607","#3a0ca3","#fff1c9"],mar:["#023e8a","#00b4d8","#caf0f8","#03045e"],
  uva:["#3c1053","#ad5389","#f6d1e8","#1b0b2b"],brasa:["#6a040f","#e85d04","#ffba08","#1d0a0a"],
  mata:["#1b4332","#52b788","#d8f3dc","#081c15"],grafite:["#22252b","#5c6370","#d9dce3","#0e0f12"],
  rosa:["#ff9ab8","#ff5d8f","#ffe0ea","#7a1f45"],areia:["#e9d8c1","#c9a37a","#fff6e8","#6b4a2b"],
  oceano:["#0a2a43","#1f7aa8","#bfe8f5","#04121f"],vinho:["#5b0f2b","#b8324f","#f5c6cf","#1e0610"],
  menta:["#2ec4b6","#9be7d8","#e8fff9","#0b4f4a"],cobre:["#c8703a","#e9a36a","#fff0e2","#4a230f"],
  lavanda:["#8b7cff","#c3b9ff","#f2efff","#2a1f6b"],neon:["#12112a","#7a5cff","#00e0c6","#05040f"],
  oliva:["#5f6b3a","#a4b06a","#f1f3dc","#232a10"],gelo:["#dbe8f3","#a9c6dd","#ffffff","#5b7891"],
  creme:["#fff4dc","#f7cf8a","#fffdf6","#b5762a"],
  coral:["#ff8a6b","#ff5d73","#ffe1d8","#7a1f2b"],ouro:["#e9c766","#a9821a","#fff3c4","#2a1e00"],magenta:["#e0179b","#7a0f8f","#ffd0f0","#2b0630"],
  royal:["#1f4fe0","#4f86ff","#dbe6ff","#0a1f6b"],terra:["#7a5238","#c79a72","#f3e2cf","#3a2415"],limao:["#c6f432","#6bbf1a","#f6ffd0","#1a3005"]};
const PAL_LABEL={sol:"Sol",mar:"Mar",uva:"Uva",brasa:"Brasa",mata:"Mata",grafite:"Grafite",rosa:"Rosa",areia:"Areia",oceano:"Oceano",vinho:"Vinho",menta:"Menta",cobre:"Cobre",lavanda:"Lavanda",neon:"Neon",oliva:"Oliva",gelo:"Gelo",creme:"Creme",coral:"Coral",ouro:"Ouro",magenta:"Magenta",royal:"Azul royal",terra:"Terra",limao:"Limão"};
const artCache=new Map();
function art(pal,seed){
  const key=pal+seed;if(artCache.has(key))return artCache.get(key);
  const c=PAL[pal]||PAL.grafite;let s=seed*9301+49297;const r=()=>{s=(s*9301+49297)%233280;return s/233280};
  let blobs="";
  for(let i=0;i<4;i++){const cx=Math.round(r()*600),cy=Math.round(r()*600),rx=120+Math.round(r()*180),ry=100+Math.round(r()*200);
    blobs+=`<ellipse cx='${cx}' cy='${cy}' rx='${rx}' ry='${ry}' fill='${c[(i+1)%4]}' opacity='.${6+Math.floor(r()*3)}' transform='rotate(${Math.round(r()*180)} ${cx} ${cy})'/>`}
  const svg=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600' preserveAspectRatio='xMidYMid slice'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${c[0]}'/><stop offset='1' stop-color='${c[3]}'/></linearGradient><filter id='b'><feGaussianBlur stdDeviation='38'/></filter><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .35 0'/></filter></defs><rect width='600' height='600' fill='url(#g)'/><g filter='url(#b)'>${blobs}</g><rect x='${Math.round(r()*200)+60}' y='${Math.round(r()*120)+330}' width='${200+Math.round(r()*160)}' height='${110+Math.round(r()*120)}' fill='${c[2]}' opacity='.18'/><rect width='600' height='600' filter='url(#n)'/></svg>`;
  const uri="data:image/svg+xml;utf8,"+encodeURIComponent(svg).replace(/['()]/g,ch=>"%"+ch.charCodeAt(0).toString(16));
  artCache.set(key,uri);return uri}
const SKIN=["#4a2c17","#6a4023","#8d5524","#c68642","#e0ac69","#f1c27d","#ffdbac"];
const HAIRC=["#141210","#2b1c14","#4a2f1c","#6b4423","#8b5a2b","#3d3a38","#8d8d8d","#d6c8a8"];
function person(pal,seed){
  const key="p"+pal+seed;if(artCache.has(key))return artCache.get(key);
  const c=PAL[pal]||PAL.grafite;let s=seed*9301+49297;const r=()=>{s=(s*9301+49297)%233280;return s/233280};
  const skin=SKIN[Math.floor(r()*SKIN.length)],hair=HAIRC[Math.floor(r()*HAIRC.length)];
  const cloth=r()>.5?c[1]:c[3];
  const cx=300,cy=252,hr=76; /* cabeça */
  const style=Math.floor(r()*4);
  const hairR=hr+8+Math.round(r()*16),hairDX=Math.round((r()-.5)*14),hairDY=-Math.round(10+r()*16);
  const eyeDX=18+Math.round(r()*4),eyeY=cy-6,mouthW=20+Math.round(r()*10);
  let extra="";
  if(style===1)extra=`<circle cx="${cx+hairDX-hairR*.7}" cy="${cy+hairDY+hairR*.35}" r="${Math.round(hairR*.42)}" fill="${hair}"/><circle cx="${cx+hairDX+hairR*.7}" cy="${cy+hairDY+hairR*.35}" r="${Math.round(hairR*.42)}" fill="${hair}"/>`;
  else if(style===2)extra=`<circle cx="${cx+hairDX}" cy="${cy+hairDY-hairR*.7}" r="20" fill="${hair}"/>`;
  else if(style===3)extra=`<path d="M${cx-hairR*.9} ${cy+hairDY+10} q-14 90-4 150 q18 8 26-4 q-10-70 6-140z" fill="${hair}"/><path d="M${cx+hairR*.9} ${cy+hairDY+10} q14 90 4 150 q-18 8-26-4 q10-70-6-140z" fill="${hair}"/>`;
  const svg=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600' preserveAspectRatio='xMidYMid slice'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${c[2]}'/><stop offset='1' stop-color='${c[0]}'/></linearGradient><filter id='b'><feGaussianBlur stdDeviation='50'/></filter></defs><rect width='600' height='600' fill='url(#g)'/><g filter='url(#b)' opacity='.6'><ellipse cx='${Math.round(r()*600)}' cy='90' rx='260' ry='190' fill='${c[1]}'/></g><path d="M120 600 Q120 430 300 430 Q480 430 480 600 Z" fill="${cloth}"/><ellipse cx="${cx}" cy="${cy+58}" rx="30" ry="26" fill="${skin}"/>${extra}<circle cx="${cx+hairDX}" cy="${cy+hairDY}" r="${hairR}" fill="${hair}"/><circle cx="${cx}" cy="${cy}" r="${hr}" fill="${skin}"/><ellipse cx="${cx-eyeDX}" cy="${eyeY}" rx="6" ry="7" fill="#1c1c1c"/><ellipse cx="${cx+eyeDX}" cy="${eyeY}" rx="6" ry="7" fill="#1c1c1c"/><path d="M${cx-mouthW/2} ${cy+30} Q${cx} ${cy+42} ${cx+mouthW/2} ${cy+30}" stroke="#1c1c1c" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`;
  const uri="data:image/svg+xml;utf8,"+encodeURIComponent(svg).replace(/['()]/g,ch=>"%"+ch.charCodeAt(0).toString(16));
  artCache.set(key,uri);return uri}
const AI_PEOPLE={
  empreendedora:["Empreendedora","https://cdn.kairogen.ai/gallery/images/6aae173bb2073da09de2fbeb/dc15086d-5e0c-4538-84f9-948cdaa4e914.jpg"],
  empreendedor:["Empreendedor",  "https://cdn.kairogen.ai/gallery/images/6aae173bb2073da09de2fbeb/33d3c6d0-8dc6-44fb-a1b3-90f3cfcc0efa.jpg"],
  musico:["Músico/artista","https://cdn.kairogen.ai/gallery/images/6aae173bb2073da09de2fbeb/4ef0cf62-bb9f-4203-836b-cd896b9532a1.jpg"],
  executiva:["Executiva","https://cdn.kairogen.ai/gallery/images/6aae173bb2073da09de2fbeb/facaaa7c-926f-4696-95e4-4f37722bf602.jpg"],
  chef:["Chef de cozinha","https://cdn.kairogen.ai/gallery/images/6aae173bb2073da09de2fbeb/b1573c9b-3419-4bb4-b293-751563e4587c.jpg"]
};
const src=v=>{if(!v)return"";if(v.startsWith("art:")){const p=v.split(":");return art(p[1],+p[2]||1)}if(v.startsWith("person:")){const p=v.split(":");return person(p[1],+p[2]||1)}if(v.startsWith("ai:")){const k=v.slice(3);return AI_PEOPLE[k]?AI_PEOPLE[k][1]:""}return v};
const bgi=v=>v?`background-image:url(${src(v)})`:"";
const darkOv=v=>{const n=+v||0;return n?`;box-shadow:inset 0 0 0 999px rgba(0,0,0,${(n/100).toFixed(2)})`:""};

/* ───────── temas ───────── */
const F={inter:"Inter,sans-serif",pjs:"'Plus Jakarta Sans',sans-serif",dm:"'DM Sans',sans-serif",man:"Manrope,sans-serif",pop:"Poppins,sans-serif",out:"Outfit,sans-serif",sora:"Sora,sans-serif",sg:"'Space Grotesk',sans-serif",pf:"'Playfair Display',serif",fr:"Fraunces,serif",cg:"'Cormorant Garamond',serif",lora:"Lora,serif",osw:"Oswald,sans-serif",anton:"Anton,sans-serif",bebas:"'Bebas Neue',sans-serif",abl:"'Archivo Black',sans-serif",gv:"'Great Vibes',cursive",allura:"Allura,cursive",pac:"Pacifico,cursive",dance:"'Dancing Script',cursive",syne:"Syne,sans-serif",unb:"Unbounded,sans-serif",cin:"Cinzel,serif",dmsd:"'DM Serif Display',serif",brc:"'Bricolage Grotesque',sans-serif",cav:"Caveat,cursive",bar:"'Barlow Condensed',sans-serif"};
const FONTS={"Inter":F.inter,"Plus Jakarta Sans":F.pjs,"DM Sans":F.dm,"Manrope":F.man,"Poppins":F.pop,"Outfit":F.out,"Sora":F.sora,"Space Grotesk":F.sg,"Playfair Display":F.pf,"Fraunces":F.fr,"Cormorant Garamond":F.cg,"Lora":F.lora,"Oswald":F.osw,"Anton (impacto)":F.anton,"Bebas Neue (impacto)":F.bebas,"Archivo Black":F.abl,"Syne":F.syne,"Unbounded":F.unb,"Bricolage Grotesque":F.brc,"Barlow Condensed":F.bar,"DM Serif Display":F.dmsd,"Cinzel":F.cin,"Great Vibes (script)":F.gv,"Allura (script)":F.allura,"Dancing Script (script)":F.dance,"Pacifico (script)":F.pac,"Caveat (manuscrita)":F.cav};
const T=(o)=>Object.assign({radius:18,shadow:"none",font:F.inter,hf:F.inter,gap:14,fs:15,btnStyle:"solid",cardStyle:"soft",pattern:"none",profile:"center",avatar:"circle",avRing:"solid",avSize:92,bgMode:"solid",bg2:"",bg3:"",bgAngle:160,bgImg:"",bgOv:55,frame:"none",frameClr:"#e9a8bd",btnAlign:"left",btnCase:"none",top:36,side:0,width:"normal"},o);
const P={
 marfim:["Marfim",T({bg:"#faf8f4",text:"#1c1b19",muted:"#77736b",primary:"#1c1b19",secondary:"#efeae1",btnBg:"#1c1b19",btnText:"#faf8f4"})],
 grafite:["Grafite",T({bg:"#0f1012",text:"#f3f3f5",muted:"#9a9ca6",primary:"#8b83ff",secondary:"#1b1c21",btnBg:"#f3f3f5",btnText:"#0f1012",cardStyle:"glass",pattern:"glow"})],
 indigo:["Índigo",T({bg:"#f4f3ff",text:"#17153b",muted:"#5f5c8a",primary:"#5b4bff",secondary:"#e6e3ff",btnBg:"#5b4bff",btnText:"#ffffff",btnStyle:"gradient",pattern:"aurora",font:F.pjs,hf:F.pjs})],
 aurora:["Aurora",T({bg:"#0b0b1e",text:"#ffffff",muted:"#b9b8dc",primary:"#a78bfa",secondary:"#1a1940",btnBg:"#ffffff",btnText:"#0b0b1e",btnStyle:"glass",cardStyle:"glass",pattern:"aurora",font:F.out,hf:F.out})],
 pessego:["Pêssego",T({bg:"#fff1e8",text:"#3a1d12",muted:"#8a5a47",primary:"#ff6b3d",secondary:"#ffe0cf",btnBg:"#ff6b3d",btnText:"#ffffff",btnStyle:"pill",radius:26,pattern:"glow",font:F.pop,hf:F.pop})],
 menta:["Menta",T({bg:"#eefaf6",text:"#0d3b33",muted:"#4c7a70",primary:"#12a58f",secondary:"#d5f2ea",btnBg:"#0d3b33",btnText:"#eefaf6",font:F.dm,hf:F.dm})],
 oceano:["Oceano",T({bg:"#0a2a43",text:"#f0f8ff",muted:"#a9c8de",primary:"#ffb84d",secondary:"#123b5c",btnBg:"#ffb84d",btnText:"#0a2a43",pattern:"glow",font:F.man,hf:F.man})],
 vinho:["Vinho",T({bg:"#2a0a17",text:"#fbeaee",muted:"#cba0ac",primary:"#e8b4bc",secondary:"#3e1424",btnBg:"#e8b4bc",btnText:"#2a0a17",btnStyle:"outline",hf:F.pf,radius:14})],
 areia:["Areia",T({bg:"#f3ebdf",text:"#3a2c1c",muted:"#8a7659",primary:"#a3622b",secondary:"#e8dcc9",btnBg:"#3a2c1c",btnText:"#f3ebdf",hf:F.fr,font:F.lora,radius:14})],
 neon:["Neon",T({bg:"#07070d",text:"#ffffff",muted:"#9aa0b5",primary:"#00e0c6",secondary:"#14142a",btnBg:"#00e0c6",btnText:"#07070d",pattern:"grid",font:F.sg,hf:F.sg,radius:12})],
 lavanda:["Lavanda",T({bg:"#f1eeff",text:"#231a52",muted:"#6c62a3",primary:"#7a5cff",secondary:"#e2dcff",btnBg:"#231a52",btnText:"#f1eeff",btnStyle:"pill",font:F.sora,hf:F.sora})],
 oliva:["Oliva",T({bg:"#f2f3e6",text:"#2a3014",muted:"#6d7450",primary:"#5f6b3a",secondary:"#e4e7cc",btnBg:"#2a3014",btnText:"#f2f3e6",btnStyle:"soft",hf:F.fr,font:F.dm,radius:22})],
 ouro:["Preto e ouro",T({bg:"#0b0b0b",text:"#f4ecd6",muted:"#b9ab80",primary:"#d4af37",secondary:"#1a1810",btnBg:"#d4af37",btnText:"#1a1400",btnStyle:"gold",avRing:"gold",hf:F.cin,font:F.dm,radius:6,pattern:"hex"})],
 royal:["Azul royal",T({bg:"#1c46d6",text:"#ffffff",muted:"#cfdcff",primary:"#ffd23f",secondary:"#2f5bea",btnBg:"#ffffff",btnText:"#1c46d6",btnStyle:"pill",radius:30,hf:F.dmsd,font:F.brc})],
 terra:["Terra",T({bg:"#5b3f2c",text:"#f6ecdf",muted:"#d2b9a1",primary:"#e8cfae",secondary:"#7a5640",btnBg:"#ecd9c0",btnText:"#3a2415",btnStyle:"pill",radius:26,hf:F.cg,font:F.dm,pattern:"blobs"})],
 magenta:["Magenta pop",T({bg:"#b312a8",text:"#ffffff",muted:"#f6c8f2",primary:"#c6f432",secondary:"#d13bc6",btnBg:"#c6f432",btnText:"#2b0630",btnStyle:"block",radius:0,hf:F.anton,font:F.brc,gap:2})],
 rose:["Rosé",T({bg:"#f6e4e8",text:"#4a2430",muted:"#946874",primary:"#c27a8c",secondary:"#efd0d8",btnBg:"#4a2430",btnText:"#f6e4e8",btnStyle:"minimal",radius:4,hf:F.cg,font:F.dm,pattern:"chevron"})],
 sunset:["Pôr do sol",T({bg:"#ffd78a",text:"#4a1d2b",muted:"#8b4a52",primary:"#ff6a88",secondary:"#ffe6b0",btnBg:"#ffffff",btnText:"#4a1d2b",btnStyle:"glass",radius:12,hf:F.pf,font:F.dm,pattern:"mesh",bg2:"#ff8fa3",bg3:"#ffb36b",avatar:"arch"})],
 sage:["Sálvia",T({bg:"#dfe6da",text:"#26301f",muted:"#66735c",primary:"#7b8f6a",secondary:"#cbd6c3",btnBg:"#26301f",btnText:"#eef2ea",btnStyle:"arrow",radius:24,hf:F.fr,font:F.dm,pattern:"waves"})]
};
const tk=k=>structuredClone(P[k][1]);

/* ───────── blocos ───────── */
const FX=[["none","Nenhuma"],["type","Digitando"],["words","Palavras alternadas"],["rise","Subida por letra"],["marquee","Letreiro"],["mark","Marca-texto"]];
const BTN_STYLES=[["","Padrão da página"],["solid","Sólido"],["soft","Suave"],["outline","Contorno"],["glass","Vidro"],["pill","Pílula"],["gradient","Degradê"],["lift","Elevado"],["line","Linha"],["neu","Relevo"],["brutal","Contorno grosso"],["gold","Dourado"],["arrow","Seta"],["bar","Faixa"],["block","Bloco"],["tile","Ícone quadrado"],["minimal","Fino"],["neon","Neon"]];
const ANIMS=[["none","Nenhuma"],["pulse","Pulsar"],["shine","Brilho"],["shake","Balançar"]];
const it=(o)=>Object.assign({id:uid()},o);
const META={
HeadlineBlock:{label:"Título grande",d:{text:"SEU NOME",sub:"",align:"center",size:"l",font:"",upper:false,tight:false,color:"",fx:"none",fxSpeed:"normal"}},
LabelRow:{label:"Linha de detalhes",d:{left:"CRIADOR DE CONTEÚDO",center:"",right:"PARA MARCAS",size:"s",upper:true}},
IconGrid:{label:"Grade de ícones",d:{cols:3,dir:"grid",shape:"circle",fill:"outline",size:"m",labels:true,hint:"Toque nos ícones",items:[it({icon:"chat",label:"Mensagem",url:"5500000000000",bg:"",fg:""}),it({icon:"call",label:"Chamada",url:"5500000000000",bg:"",fg:""}),it({icon:"mail",label:"E-mail",url:"contato@exemplo.com",bg:"",fg:""}),it({icon:"instagram",label:"Instagram",url:"https://instagram.com",bg:"",fg:""}),it({icon:"globe",label:"Site",url:"https://exemplo.com",bg:"",fg:""}),it({icon:"pin",label:"Localização",url:"https://maps.google.com",bg:"",fg:""})]}},
TileGrid:{label:"Blocos com imagem",d:{mode:"grid",cols:2,space:8,round:"m",color:"",items:[it({title:"Loja",img:"art:rosa:201",url:"https://exemplo.com",span:"1x1",color:"",fg:""}),it({title:"Novidades",img:"art:lavanda:202",url:"https://exemplo.com",span:"1x1",color:"",fg:""}),it({title:"Promoção",img:"art:coral:203",url:"https://exemplo.com",span:"1x1",color:"",fg:""}),it({title:"Galeria",img:"art:creme:204",url:"https://exemplo.com",span:"1x1",color:"",fg:""})]}},
StripBlock:{label:"Faixas de fotos",d:{upper:true,thumb:"m",items:[it({title:"Portfólio",more:"ver mais",url:"https://exemplo.com",count:5,pal:"areia",shape:"sq",photos:[]}),it({title:"Site",more:"ver mais",url:"https://exemplo.com",count:5,pal:"cobre",shape:"sq",photos:[]}),it({title:"Contato",more:"ver mais",url:"https://exemplo.com",count:5,pal:"creme",shape:"round",photos:[]})]}},
DockBlock:{label:"Barra de ícones",d:{style:"neu",play:false,items:[it({icon:"mail",label:"E-mail",url:"contato@exemplo.com"}),it({icon:"call",label:"Ligar",url:"5500000000000"}),it({icon:"globe",label:"Site",url:"https://exemplo.com"}),it({icon:"pin",label:"Local",url:"https://maps.google.com"})]}},
CoverBlock:{label:"Capa",d:{media:"image",img:"art:sol:1",video:"",shape:"card",align:"left",height:"m",overlay:55,headline:"Seu título com *destaque*",fx:"mark",fxSpeed:"normal",sub:"Uma linha de apoio sobre o que você faz.",badge:"Aberto hoje",dark:0}},
StoryBlock:{label:"Stories",d:{shape:"portrait",items:[it({title:"Novidades",img:"art:mar:2",caption:"O que há de novo esta semana.",cta:"",url:""}),it({title:"Bastidores",img:"art:brasa:3",caption:"Um pouco do nosso dia a dia.",cta:"",url:""}),it({title:"Promoção",img:"art:uva:4",caption:"Condição especial até domingo.",cta:"Aproveitar",url:"https://exemplo.com"})]}},
ProfileBlock:{label:"Perfil",d:{lift:0,avatar:"person:grafite:3",name:"Nome da Marca",handle:"@usuario",verified:true,headline:"Categoria | Especialidade",bio:"Uma frase curta explicando o que você oferece.",location:"Cidade, UF"}},
TextBlock:{label:"Texto",d:{align:"left",title:"Sobre",fx:"none",fxSpeed:"normal",text:"Escreva aqui um texto de apresentação."}},
ButtonBlock:{label:"Botões",d:{cols:1,join:false,items:[it({title:"Agendar horário",sub:"Resposta em minutos",url:"https://exemplo.com",img:"",icon:"",badge:"novo",style:"",size:"m",anim:"none",bg:"",fg:""}),it({title:"Ver catálogo",sub:"",url:"https://exemplo.com/catalogo",img:"",icon:"",badge:"",style:"",size:"m",anim:"none",bg:"",fg:""})]}},
CardsBlock:{label:"Cartões",d:{title:"Destaques",cols:2,items:[it({img:"art:sol:5",title:"Título do card",text:"Texto curto de apoio.",url:"https://exemplo.com",cta:"Ver mais",span:"2x1",tone:"dark",pos:"bottom",badge:"",color:""}),it({img:"art:mar:6",title:"Outro card",text:"",url:"https://exemplo.com",cta:"Abrir",span:"1x1",tone:"dark",pos:"bottom",badge:"novo",color:""}),it({img:"art:brasa:7",title:"Mais um",text:"",url:"https://exemplo.com",cta:"Abrir",span:"1x1",tone:"dark",pos:"bottom",badge:"",color:""})]}},
SocialBlock:{label:"Redes sociais",d:{mode:"pill",items:[it({net:"Instagram",url:"https://instagram.com/usuario",label:""}),it({net:"TikTok",url:"https://tiktok.com/@usuario",label:""}),it({net:"YouTube",url:"https://youtube.com/@usuario",label:""}),it({net:"LinkedIn",url:"https://linkedin.com/in/usuario",label:""})]}},
WhatsAppBlock:{label:"WhatsApp",d:{phone:"5500000000000",label:"Fale comigo no WhatsApp",message:"Olá! Vim pelo seu site e gostaria de saber mais."}},
CatalogBlock:{label:"Catálogo",d:{title:"Catálogo",layout:"grid",items:[it({img:"art:sol:8",name:"Produto exemplo A",desc:"Descrição curta do produto.",badge:"Mais vendido",price:14990,promo:0,btn:"Comprar"}),it({img:"art:mata:9",name:"Produto exemplo B",desc:"",badge:"Novidade",price:8900,promo:6900,btn:"Comprar"})]}},
MenuBlock:{label:"Cardápio WhatsApp",d:{title:"Cardápio",phone:"5500000000000",brand:"Minha Loja",fee:0,delivery:true,pickup:true,pix:true,items:[it({cat:"Mais pedidos",img:"art:brasa:80",name:"Item de exemplo A",desc:"Descrição curta do item.",price:2990,badge:"popular"}),it({cat:"Mais pedidos",img:"art:sol:81",name:"Item de exemplo B",desc:"",price:1890,badge:""}),it({cat:"Bebidas",img:"",name:"Refrigerante lata",desc:"350 ml",price:600,badge:""})]}},
ServiceBlock:{label:"Serviços",d:{title:"Serviços",items:[it({img:"",name:"Consulta inicial",price:12000,promo:0,btn:"Agendar"}),it({img:"",name:"Sessão completa",price:25000,promo:0,btn:"Agendar"})]}},
BookingBlock:{label:"Agendamento",d:{title:"Agende seu horário",service:"Consulta clínica",duration:50}},
PixBlock:{label:"PIX",d:{key:"chave-exemplo@email.com",receiver:"Nome do Recebedor",city:"Cidade",label:"Pagar com PIX"}},
PaymentButtonsBlock:{label:"Botões de pagamento",d:{title:"Formas de pagamento",items:[it({method:"pix",label:"Pagar com PIX",url:""}),it({method:"picpay",label:"Pagar com PicPay",url:""}),it({method:"mercadopago",label:"Pagar com Mercado Pago",url:""})]}},
MapBlock:{label:"Mapa",d:{title:"",btn:"Como chegar",address:"Rua Exemplo, 123, Centro, Cidade"}},
GalleryBlock:{label:"Galeria",d:{count:6,pal:"sol",photos:[]}},
VideoBlock:{label:"Vídeo",d:{title:"Vídeo de apresentação",file:"",poster:"art:uva:10",url:""}},
LeadFormBlock:{label:"Formulário",d:{title:"Peça um orçamento",button:"Enviar",namePh:"Nome",contactPh:"WhatsApp ou e-mail",consent:"Concordo com o uso dos meus dados (LGPD)",note:""}},
FaqBlock:{label:"Perguntas frequentes",d:{title:"Perguntas frequentes",items:[it({q:"Como funciona?",a:"Explique aqui em poucas palavras."}),it({q:"Qual o prazo?",a:"Responda de forma direta."})]}},
HoursBlock:{label:"Horário de funcionamento",d:{title:"Horário de funcionamento",items:[it({day:"Segunda a sexta",time:"09:00 – 18:00"}),it({day:"Sábado",time:"09:00 – 13:00"}),it({day:"Domingo",time:"Fechado"})],note:""}},
StatsBlock:{label:"Números de destaque",d:{title:"",items:[it({n:"+500",l:"clientes"}),it({n:"10",l:"anos"}),it({n:"4,9★",l:"avaliação"})]}},
CountdownBlock:{label:"Contagem regressiva",d:{title:"Termina em",date:"",endText:"Oferta encerrada",btn:"",url:""}},
CouponBlock:{label:"Cupom de desconto",d:{title:"Cupom exclusivo",code:"BEMVINDO10",desc:"10% de desconto na primeira compra",btn:"Copiar cupom"}},
PricingBlock:{label:"Planos e preços",d:{title:"Planos",items:[it({name:"Básico",price:"R$ 49",per:"/mês",feats:"Item incluso 1\nItem incluso 2",btn:"Quero este",url:"",hot:false}),it({name:"Completo",price:"R$ 99",per:"/mês",feats:"Tudo do Básico\nItem extra\nSuporte",btn:"Quero este",url:"",hot:true})]}},
WifiBlock:{label:"Wi-Fi",d:{title:"Wi-Fi",ssid:"Rede-Exemplo",password:"senha1234"}},
Tour360Block:{label:"Tour 360°",d:{title:"Tour 360°",btn:"Abrir tour",source:"https://exemplo.com/tour"}},
QRCodeBlock:{label:"QR Code",d:{title:"Compartilhe esta página",url:"",caption:"Aponte a câmera do celular",fg:"#000000",bg:"#ffffff",size:"m"}},
DividerBlock:{label:"Divisor",d:{style:"line",space:"m",label:""}},
FooterBlock:{label:"Rodapé",d:{text:"Feito com carinho ✨",items:[it({emoji:"📷",label:"Instagram",url:"https://instagram.com/usuario"}),it({emoji:"📱",label:"WhatsApp",url:""}),it({emoji:"📍",label:"Localização",url:""})]}},
CarouselBlock:{label:"Carrossel",d:{count:4,pal:"mar",photos:[]}},
TestimonialsBlock:{label:"Depoimentos",d:{title:"Depoimentos",items:[it({name:"Cliente Exemplo",role:"",stars:5,text:"Atendimento rápido e resultado acima do esperado."}),it({name:"Outra Cliente",role:"",stars:5,text:"Recomendo, foi simples do início ao fim."})]}},
FreeBlock:{label:"Camada livre (fotos, texto, emoji)",d:{height:360,items:[it({kind:"emoji",text:"✨",img:"",x:22,y:24,w:100,rot:-12,z:2,color:"",anim:"float"}),it({kind:"text",text:"Seu texto aqui",img:"",x:62,y:72,w:100,rot:0,z:3,color:"",anim:"none"})]}},
CodeBlock:{label:"Código personalizado",d:{html:"<!-- cole aqui seu HTML -->"}}
};
/* esquemas do inspetor: [chave, rótulo, tipo, opções] */
const FIELDS={
HeadlineBlock:[["text","Texto (Enter quebra linha, *destaque*)","area"],["sub","Subtítulo","area"],["align","Alinhamento","seg",[["left","Esq."],["center","Centro"],["right","Dir."]]],["size","Tamanho","seg",[["s","P"],["m","M"],["l","G"],["xl","XG"],["xxl","XXG"]]],["font","Fonte","sel",[["","Fonte dos títulos"],...Object.keys(FONTS).map(f=>[f,f])]],["upper","Maiúsculas","bool"],["tight","Linhas coladas","bool"],["color","Cor do texto","clr"],["fx","Animação","sel",FX],["fxSpeed","Velocidade da animação","seg",[["slow","Lenta"],["normal","Normal"],["fast","Rápida"]]]],
LabelRow:[["left","Esquerda","text"],["center","Centro","text"],["right","Direita","text"],["size","Tamanho","seg",[["s","P"],["m","M"]]],["upper","Maiúsculas","bool"]],
IconGrid:[["dir","Direção","seg",[["grid","Grade"],["row","Linha (lado a lado)"],["col","Coluna (empilhado)"]]],["cols","Colunas (só na Grade)","seg",[[2,"2"],[3,"3"],[4,"4"],[5,"5"]]],["shape","Formato","seg",[["circle","Círculo"],["round","Arredondado"],["square","Quadrado"],["none","Só ícone"]]],["fill","Estilo","seg",[["outline","Contorno"],["solid","Sólido"],["soft","Suave"],["neu","Relevo"],["gold","Dourado"],["glass","Vidro"]]],["size","Tamanho","seg",[["s","P"],["m","M"],["l","G"]]],["labels","Mostrar nomes","bool"],["hint","Texto de dica (vazio oculta)","text"]],
TileGrid:[["mode","Layout","seg",[["grid","Grade"],["list","Lista"],["mosaic","Mosaico"]]],["cols","Colunas (grade e mosaico)","seg",[[2,"2"],[3,"3"]]],["space","Espaço entre blocos","range",[0,20]],["round","Cantos","seg",[["n","Retos"],["m","Médios"],["l","Grandes"]]],["color","Cor padrão da faixa","clr"]],
StripBlock:[["upper","Títulos em maiúsculas","bool"],["thumb","Tamanho das miniaturas","seg",[["s","P"],["m","M"],["l","G"]]]],
DockBlock:[["style","Estilo","seg",[["neu","Relevo"],["glass","Vidro"],["solid","Sólido"],["outline","Contorno"]]],["play","Botão de play","bool"]],
ButtonBlock:[["cols","Colunas","seg",[[1,"1"],[2,"2"]]],["join","Colar botões (sem espaço)","bool"]],
CoverBlock:[["media","Fundo","seg",[["image","Foto"],["video","Vídeo"],["none","Cor"]]],["img","Foto de capa","img"],["video","Vídeo de capa","vid"],["shape","Formato","seg",[["card","Cartão"],["edge","Tela cheia"],["arch","Arco"],["wave","Onda"],["diag","Diagonal"],["blob","Orgânico"]]],["align","Texto","seg",[["left","Esquerda"],["center","Centro"]]],["height","Altura","seg",[["xs","Faixa"],["s","Baixa"],["m","Média"],["l","Alta"],["full","Cheia"]]],["overlay","Escurecer fundo","range",[0,85]],["headline","Título (use *asteriscos* para destacar)","text"],["fx","Animação do texto","sel",FX],["fxSpeed","Velocidade da animação","seg",[["slow","Lenta"],["normal","Normal"],["fast","Rápida"]]],["sub","Subtítulo","area"],["badge","Selo","text"]],
StoryBlock:[["shape","Formato","seg",[["portrait","Retrato"],["circle","Círculo"]]]],
ProfileBlock:[["avatar","Foto","img"],["lift","Sobrepor à capa (px)","range",[0,90]],["name","Nome","text"],["handle","Usuário","text"],["verified","Selo de verificação","bool"],["headline","Chamada","text"],["bio","Descrição","area"],["location","Localização","text"]],
TextBlock:[["align","Alinhamento","seg",[["left","Esquerda"],["center","Centro"]]],["title","Título","text"],["fx","Animação do título","sel",FX],["fxSpeed","Velocidade da animação","seg",[["slow","Lenta"],["normal","Normal"],["fast","Rápida"]]],["text","Texto","area"]],
SocialBlock:[["mode","Aparência","seg",[["pill","Rótulo"],["icons","Só ícones"],["text","Só texto"]]]],
QRCodeBlock:[["title","Título","text"],["url","Endereço que o QR abre (vazio = esta página)","text"],["caption","Legenda","text"],["fg","Cor do QR","clr"],["bg","Cor do fundo","clr"],["size","Tamanho","seg",[["s","P"],["m","M"],["l","G"]]]],
DividerBlock:[["style","Estilo","seg",[["line","Linha"],["dots","Pontos"],["wave","Onda"],["orn","Ornamento"],["space","Espaço"]]],["space","Altura","seg",[["s","P"],["m","M"],["l","G"]]],["label","Texto no centro (opcional)","text"]],
TestimonialsBlock:[["title","Título","text"]],
WhatsAppBlock:[["phone","Número com DDI e DDD","text"],["label","Texto do botão","text"],["message","Mensagem padrão","area"]],
CatalogBlock:[["title","Título da seção","text"],["phone","WhatsApp para os botões (DDI+DDD)","text"],["layout","Layout","seg",[["grid","Grade"],["list","Lista"],["single","Destaque (1 item, bloco inteiro)"]]]],ServiceBlock:[["title","Título da seção","text"],["phone","WhatsApp para os botões (DDI+DDD)","text"],["layout","Layout","seg",[["grid","Grade"],["list","Lista"],["single","Destaque (1 item, bloco inteiro)"]]]],
MenuBlock:[["title","Título","text"],["brand","Nome no pedido","text"],["phone","WhatsApp que recebe (DDI+DDD)","text"],["delivery","Aceitar entrega","bool"],["pickup","Aceitar retirada","bool"],["fee","Taxa de entrega","money"],["pix","Oferecer PIX no pagamento","bool"]],
CardsBlock:[["title","Título da seção","text"],["cols","Colunas","seg",[[2,"2"],[3,"3"]]]],
BookingBlock:[["title","Título","text"],["service","Serviço","text"],["duration","Duração (min)","num"]],
PixBlock:[["key","Chave PIX","text"],["receiver","Recebedor","text"],["city","Cidade","text"],["label","Texto do botão","text"]],
PaymentButtonsBlock:[["title","Título","text"]],
MapBlock:[["title","Título (opcional)","text"],["address","Endereço","area"],["btn","Texto do botão","text"]],GalleryBlock:[["photos","Fotos (vazio usa exemplos)","imgs"],["count","Quantidade de exemplos","num"],["pal","Paleta de exemplo","sel",Object.entries(PAL_LABEL)],["dark","Escurecer fotos","range",[0,80]],["cols","Colunas","seg",[[2,"2"],[3,"3"],[4,"4"]]]],CarouselBlock:[["photos","Fotos (vazio usa exemplos)","imgs"],["count","Quantidade de exemplos","num"],["pal","Paleta de exemplo","sel",Object.entries(PAL_LABEL)],["dark","Escurecer fotos","range",[0,80]]],
VideoBlock:[["title","Título","text"],["file","Enviar vídeo","vid"],["poster","Imagem de capa","img"],["url","Ou link do vídeo","text"]],
LeadFormBlock:[["title","Título","text"],["namePh","Texto do campo nome","text"],["contactPh","Texto do campo contato","text"],["consent","Texto de consentimento (LGPD)","text"],["button","Texto do botão","text"],["note","Observação abaixo (opcional)","text"]],
FaqBlock:[["title","Título","text"]],HoursBlock:[["title","Título","text"],["note","Observação (ex: feriados)","text"]],StatsBlock:[["title","Título (opcional)","text"]],CountdownBlock:[["title","Título","text"],["date","Data e hora final","datetime"],["endText","Texto ao terminar","text"],["btn","Texto do botão (opcional)","text"],["url","Link do botão","text"]],CouponBlock:[["title","Título","text"],["code","Código do cupom","text"],["desc","Descrição","text"],["btn","Texto do botão","text"]],PricingBlock:[["title","Título","text"]],
WifiBlock:[["title","Título","text"],["ssid","Nome da rede","text"],["password","Senha","text"]],Tour360Block:[["title","Título","text"],["source","Link do tour","text"],["btn","Texto do botão","text"]],
FreeBlock:[["height","Altura da camada (px)","range",[200,700]]],
CodeBlock:[["html","Código HTML","code"]],
FooterBlock:[["text","Texto do rodapé (opcional)","text"]]
};
const LISTS={
FaqBlock:[["q","Pergunta","text"],["a","Resposta","area"]],
HoursBlock:[["day","Dia(s)","text"],["time","Horário","text"]],
StatsBlock:[["n","Número","text"],["l","Legenda","text"]],
PricingBlock:[["name","Nome do plano","text"],["price","Preço","text"],["per","Período (ex: /mês)","text"],["feats","Itens incluídos (um por linha)","area"],["btn","Texto do botão","text"],["url","Link ou WhatsApp","text"],["hot","Destacar este plano","bool"]],
ButtonBlock:[["title","Título","text"],["sub","Descrição","text"],["url","Link, telefone ou e-mail","text"],["icon","Ícone","icon"],["img","Miniatura","img"],["badge","Selo / texto à direita","text"],["style","Estilo","sel",BTN_STYLES],["size","Tamanho","seg",[["s","P"],["m","M"],["l","G"],["xl","Gigante"]]],["anim","Animação","sel",ANIMS],["bg","Cor do fundo","clr"],["fg","Cor do texto","clr"]],
CardsBlock:[["img","Foto","img"],["title","Título","text"],["text","Texto","area"],["url","Link (URL)","text"],["cta","Texto do link","text"],["span","Tamanho","seg",[["1x1","1×1"],["2x1","2×1"],["1x2","1×2"],["2x2","2×2"]]],["tone","Texto","seg",[["dark","Claro"],["light","Escuro"]]],["pos","Posição","seg",[["top","Topo"],["center","Meio"],["bottom","Base"]]],["badge","Selo","text"],["color","Cor sem foto","clr"],["dark","Escurecer foto","range",[0,80]]],
StoryBlock:[["title","Título","text"],["img","Imagem","img"],["caption","Legenda","area"],["cta","Texto do botão","text"],["url","Link (URL)","text"],["dark","Escurecer foto","range",[0,80]]],
CatalogBlock:[["img","Foto","img"],["name","Nome","text"],["desc","Descrição curta","text"],["badge","Selo (ex: Mais vendido)","text"],["price","Preço (R$)","money"],["promo","Promoção (R$)","money"],["btn","Texto do botão","text"],["action","Ação do botão","sel",[["whatsapp","Abrir WhatsApp"],["link","Abrir link"],["call","Ligar"],["email","Enviar e-mail"]]],["url","Link / telefone / e-mail (conforme a ação)","text"],["dark","Escurecer foto","range",[0,80]]],
MenuBlock:[["name","Nome do item","text"],["desc","Descrição","area"],["price","Preço (R$)","money"],["cat","Categoria","text"],["img","Foto","img"],["badge","Selo (ex: popular)","text"]],
ServiceBlock:[["img","Foto","img"],["name","Nome","text"],["desc","Descrição curta","text"],["badge","Selo (ex: Mais vendido)","text"],["price","Preço (R$)","money"],["promo","Promoção (R$)","money"],["btn","Texto do botão","text"],["action","Ação do botão","sel",[["whatsapp","Abrir WhatsApp"],["link","Abrir link"],["call","Ligar"],["email","Enviar e-mail"]]],["url","Link / telefone / e-mail (conforme a ação)","text"],["dark","Escurecer foto","range",[0,80]]],
TestimonialsBlock:[["name","Nome","text"],["role","Cargo ou cidade","text"],["stars","Estrelas","seg",[[5,"5"],[4,"4"],[0,"Sem"]]],["text","Depoimento","area"]],
SocialBlock:[["net","Rede","sel",["Instagram","TikTok","YouTube","LinkedIn","Facebook","WhatsApp","Telegram","X","Pinterest","Behance","Spotify","Vimeo","Site","E-mail","Outro"].map(n=>[n,n])],["url","Link, @ ou telefone","text"],["label","Texto exibido (opcional)","text"]],
IconGrid:[["icon","Ícone","icon"],["label","Nome","text"],["url","Link, telefone ou e-mail","text"],["bg","Cor do fundo do ícone","clr"],["fg","Cor do desenho","clr"]],
TileGrid:[["title","Título","text"],["img","Imagem","img"],["url","Link (URL)","text"],["span","Tamanho (mosaico)","seg",[["1x1","1×1"],["2x1","2×1"],["1x2","1×2"],["2x2","2×2"]]],["color","Cor da faixa","clr"],["fg","Cor do texto","clr"],["dark","Escurecer foto","range",[0,80]]],
StripBlock:[["title","Título","text"],["more","Texto do link","text"],["url","Link (URL)","text"],["shape","Formato","seg",[["sq","Quadrado"],["round","Redondo"],["tall","Retrato"]]],["photos","Fotos (vazio usa exemplos)","imgs"],["count","Quantidade de exemplos","num"],["pal","Paleta de exemplo","sel",Object.entries(PAL_LABEL)],["dark","Escurecer fotos","range",[0,80]]],
DockBlock:[["icon","Ícone","icon"],["label","Nome (acessibilidade)","text"],["url","Link, telefone ou e-mail","text"]],
FooterBlock:[["emoji","Emoji","text"],["label","Texto (opcional)","text"],["url","Link, telefone ou e-mail","text"]],
PaymentButtonsBlock:[["method","Meio de pagamento","sel",[["pix","PIX"],["picpay","PicPay"],["mercadopago","Mercado Pago"],["infinitepay","InfinitePay"],["asaas","Asaas"],["outro","Outro"]]],["label","Texto do botão","text"],["url","Link de pagamento (checkout, cobrança ou chave)","text"]],
FreeBlock:[["kind","Tipo de camada","seg",[["img","Foto"],["text","Texto"],["emoji","Emoji"]]],["img","Foto (aceita PNG transparente)","img"],["text","Texto ou emoji","text"],["x","Posição horizontal (%)","range",[-20,120]],["y","Posição vertical (%)","range",[-20,120]],["w","Tamanho (%)","range",[20,220]],["rot","Rotação (°)","range",[-180,180]],["z","Camada (ordem)","range",[1,20]],["color","Cor do texto","clr"],["anim","Movimento","sel",[["none","Parado"],["float","Flutuar"],["pulse","Pulsar"],["spin","Girar"],["bounce","Balançar"]]]]
};
const mk=(type,extra)=>({id:type+"-"+uid(),type,visible:true,anim:"fade",props:Object.assign(structuredClone(META[type].d),extra||{})});

/* ───────── estado ───────── */
const state={view:"dashboard",device:"mobile",mode:"edit",period:14,pages:[],pageIdx:0,tokens:tk("marfim"),sel:null,siteIdx:0,dirty:false,loading:false,seoTitle:"",seoDesc:"",metaPixel:"",gaId:"",bgMusic:"",bgMusicOn:false,
  orders:[
    {d:"hoje 12:41",who:"Rafael Dias",items:"2x Combo X-Burger, 1x Refri",type:"Entrega",total:8280,st:"Novo"},
    {d:"hoje 12:18",who:"Aline Souza",items:"1x Pizza Calabresa G",type:"Retirada",total:5490,st:"Em preparo"},
    {d:"ontem 20:03",who:"Marcos Vieira",items:"3x Pastel de carne",type:"Entrega",total:4500,st:"Entregue"}],
  leads:[
    {d:"hoje 08:12",n:"Paula Menezes",c:"(11) 98800-1201",o:"Instagram",dev:"iPhone",b:"Agendar consulta"},
    {d:"hoje 07:40",n:"Sérgio Lima",c:"sergio.lima@email.com",o:"Google",dev:"Android",b:"Solicitar orçamento"},
    {d:"ontem 21:05",n:"Beatriz Tavares",c:"(11) 97700-4410",o:"WhatsApp",dev:"Android",b:"Agendar consulta"},
    {d:"ontem 18:22",n:"Otávio Ramos",c:"otavio.r@email.com",o:"TikTok",dev:"iPhone",b:"Solicitar orçamento"},
    {d:"24/09 10:31",n:"Helena Batista",c:"(11) 96600-8820",o:"Instagram",dev:"Desktop",b:"Agendar consulta"}],
  bookings:[
    {date:"2026-09-28",time:"09:00",svc:"Consulta clínica",who:"Paula Menezes",st:"Confirmado"},
    {date:"2026-09-28",time:"10:30",svc:"Check-up cardiológico",who:"Sérgio Lima",st:"Confirmado"},
    {date:"2026-09-28",time:"14:00",svc:"Consulta clínica",who:"Beatriz Tavares",st:"Confirmado"},
    {date:"2026-09-29",time:"09:00",svc:"Retorno",who:"Otávio Ramos",st:"Pendente"},
    {date:"2026-09-30",time:"11:00",svc:"Consulta clínica",who:"Helena Batista",st:"Confirmado"}]};
Object.defineProperty(state,"blocks",{get(){return this.pages[this.pageIdx].blocks},set(v){this.pages[this.pageIdx].blocks=v},enumerable:true});
const findBlock=id=>{for(const p of state.pages){const b=p.blocks.find(x=>x.id===id);if(b)return b}return null};

/* ───────── PIX + slots ───────── */
function tlv(i,v){return i+String(v.length).padStart(2,"0")+v}
function crc16(s){let c=0xffff;for(let i=0;i<s.length;i++){c^=s.charCodeAt(i)<<8;for(let j=0;j<8;j++)c=c&0x8000?((c<<1)^0x1021)&0xffff:(c<<1)&0xffff}return c.toString(16).toUpperCase().padStart(4,"0")}
const strip=(s,n)=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^A-Za-z0-9 ]/g,"").slice(0,n).toUpperCase();
function pix(p){const b=[tlv("00","01"),tlv("26",tlv("00","br.gov.bcb.pix")+tlv("01",p.key||"")),tlv("52","0000"),tlv("53","986"),tlv("58","BR"),tlv("59",strip(p.receiver||"",25)||"RECEBEDOR"),tlv("60",strip(p.city||"",15)||"SAO PAULO"),tlv("62",tlv("05","***"))].join("")+"6304";return b+crc16(b)}
const SERVICES={"Consulta clínica":50,"Check-up cardiológico":90,"Retorno":30};
function slotsFor(date,dur){
  if(!date)return[];const [y,m,d]=date.split("-").map(Number);const wd=new Date(y,m-1,d).getDay();
  if(wd===0||wd===6)return[];
  const busy=state.bookings.filter(b=>b.date===date&&b.st!=="Cancelado").map(b=>{const[h,mi]=b.time.split(":").map(Number);const s=h*60+mi;return[s,s+(SERVICES[b.svc]||60)]});
  takenFor(date).forEach(hm=>{const[h,mi]=hm.split(":").map(Number);const st=h*60+mi;busy.push([st,st+(dur||50)])});
  const out=[];const now=new Date();
  for(let t=8*60;t+dur<=18*60;t+=dur<=30?15:30){
    const at=new Date(y,m-1,d,Math.floor(t/60),t%60);if(at<=now)continue;
    if(busy.some(([s,e])=>t<e&&t+dur>s))continue;
    out.push(String(Math.floor(t/60)).padStart(2,"0")+":"+String(t%60).padStart(2,"0"))}
  return out}


function qrHtml(seed){let h=0;for(const c of seed)h=(h*31+c.charCodeAt(0))>>>0;let s="";
  const fin=(x,y)=>{const f=(a,b)=>{const dx=Math.abs(x-a),dy=Math.abs(y-b);const m=Math.max(dx,dy);return m<=3&&(m===3||m<=1||m===0)&&m!==2};return f(3,3)||f(17,3)||f(3,17)};
  for(let y=0;y<21;y++)for(let x=0;x<21;x++){const inF=(x<7&&y<7)||(x>13&&y<7)||(x<7&&y>13);let on;if(inF)on=fin(x,y);else{h=(h*1103515245+12345)>>>0;on=(h>>16)&1}s+=`<i class="${on?"":"w"}"></i>`}
  return `<div class="qr" aria-label="QR Code de exemplo">${s}</div>`}

/* ───────── texto animado ───────── */
const timers=[];
const clearTimers=()=>{timers.splice(0).forEach(t=>{clearInterval(t);clearTimeout(t)})};
const noMotion=()=>matchMedia("(prefers-reduced-motion:reduce)").matches;
const plain=s=>String(s??"").replace(/\*/g,"");
const FX_MS={slow:1,normal:1,fast:1};
const spdMul=s=>s==="slow"?1.7:s==="fast"?0.55:1;
function fx(text,mode,speed){
  text=String(text??"");const sp=spdMul(speed);
  if(noMotion()&&mode!=="mark"&&mode!=="marquee")mode="none";
  switch(mode){
    case"type":return `<span data-fx="type" data-t="${esc(plain(text))}" data-sp="${sp}">${esc(plain(text))}</span><i class="caret"></i>`;
    case"words":{const w=plain(text).split("|").map(s=>s.trim()).filter(Boolean);return `<span data-fx="words" data-t="${esc(w.join("|"))}" data-sp="${sp}"><span class="fx-w">${esc(w[0]||"")}</span></span>`}
    case"rise":{let n=0;return `<span class="rise" aria-label="${esc(plain(text))}">${plain(text).split(" ").map(w=>`<span style="white-space:nowrap">${[...w].map(c=>`<i aria-hidden="true" style="animation-delay:${(n++)*35*sp}ms">${esc(c)}</i>`).join("")}</span>`).join(" ")}</span>`}
    case"marquee":{const t=esc(plain(text));return `<span class="mq"><span style="animation-duration:${(14*sp).toFixed(1)}s">${(t+" &nbsp;•&nbsp; ").repeat(4)}</span></span>`}
    case"mark":return esc(text).replace(/\*([^*]+)\*/g,'<mark class="mk">$1</mark>');
    default:return esc(plain(text));
  }}
function runFx(root){
  root.querySelectorAll('.cd[data-cd]').forEach(el=>{const tick=()=>{el.innerHTML=cdHtml(el.dataset.cd,el.dataset.end)};timers.push(setInterval(tick,1000))});
  root.querySelectorAll('[data-fx="type"]').forEach(el=>{
    const full=el.dataset.t;const sp=+el.dataset.sp||1;let i=0,dir=1,hold=0;el.textContent="";
    timers.push(setInterval(()=>{if(hold>0){hold--;return}i+=dir;el.textContent=full.slice(0,i);if(i>=full.length){dir=-1;hold=18}else if(i<=0){dir=1;hold=4}},Math.round(90*sp)))});
  root.querySelectorAll('[data-fx="words"]').forEach(el=>{
    const w=el.dataset.t.split("|");if(w.length<2)return;const sp=+el.dataset.sp||1;let i=0;
    timers.push(setInterval(()=>{i=(i+1)%w.length;el.innerHTML=`<span class="fx-w">${esc(w[i])}</span>`},Math.round(2000*sp)))});
}

/* ───────── blocos públicos ───────── */
function btn(i){
  const v=i.style||state.tokens.btnStyle||"solid";
  const st=[i.bg?`background:${i.bg};--ibg:${i.bg}`:"",i.fg?`color:${i.fg};--ifg:${i.fg}`:""].filter(Boolean).join(";");
  const arrow=pic(v==="line"||v==="arrow"?"arrowR":"arrowUR");
  return `<a class="pbtn v-${v} sz-${i.size||"m"} an-${i.anim||"none"}" href="${esc(href(i.url))}" target="_blank" rel="noopener" data-act="link" data-label="${esc(i.title)}" style="${st}">${i.icon?`<span class="bi">${pic(i.icon)}</span>`:""}${i.img?`<span class="bt" style="${bgi(i.img)}"></span>`:""}<span class="tx">${esc(i.title)}${i.sub?`<small>${esc(i.sub)}</small>`:""}</span>${i.badge?`<span class="bdg">${esc(i.badge)}</span>`:""}<span class="ar">${arrow}</span></a>`}
const waUrl=(ph,msg)=>`https://wa.me/${String(ph||"").replace(/\D/g,"")}?text=${encodeURIComponent(msg)}`;
function menuTotals(b){const p=b.props,cart=b.cart||{},f=b.form||{};let n=0,sub=0;const lines=[];p.items.forEach(i=>{const q=cart[i.id]||0;if(q){n+=q;sub+=q*i.price;lines.push([q,i])}});const fee=(f.type==="entrega"&&p.fee)?p.fee:0;return{n,sub,fee,total:sub+fee,lines}}
function menuMsg(b){const p=b.props,f=b.form,t=menuTotals(b);const pay={pix:"PIX",cartao:"Cartão na entrega",dinheiro:"Dinheiro"}[f.pay]||f.pay;
  return [`*Novo pedido — ${p.brand||"Cardápio"}*`,"",...t.lines.map(([q,i])=>`${q}x ${i.name} — ${brl(q*i.price)}`),"",`Subtotal: ${brl(t.sub)}`,...(t.fee?[`Taxa de entrega: ${brl(t.fee)}`]:[]),`*Total: ${brl(t.total)}*`,"",`*Cliente:* ${f.name}`,`*Tipo:* ${f.type==="entrega"?"Entrega — "+(f.addr||"endereço não informado"):"Retirada no local"}`,`*Pagamento:* ${pay}`,...(f.note?[`*Obs.:* ${f.note}`]:[])].join("\n")}
function menuHtml(b){
  const p=b.props;b.cart=b.cart||{};
  if(!b.form)b.form={type:p.delivery?"entrega":"retirada",pay:p.pix?"pix":"dinheiro",name:"",addr:"",note:""};
  if(b.form.type==="entrega"&&!p.delivery)b.form.type="retirada";if(b.form.type==="retirada"&&!p.pickup&&p.delivery)b.form.type="entrega";
  const cats=[...new Set(p.items.map(i=>i.cat||"Itens"))];if(!b.cat||!cats.includes(b.cat))b.cat=cats[0];
  const t=menuTotals(b),f=b.form;
  const list=p.items.filter(i=>(i.cat||"Itens")===b.cat).map(i=>{const q=b.cart[i.id]||0;
    return `<div class="mn-it ${i.img?"has-img":""}">${i.img?`<div class="pimg" style="${bgi(i.img)}${darkOv(i.dark)}"></div>`:""}<div><b>${esc(i.name)}${i.badge?`<span class="bg2">${esc(i.badge)}</span>`:""}</b>${i.desc?`<div class="ds">${esc(i.desc)}</div>`:""}<div class="pr">${brl(i.price)}</div></div><div class="mn-act">${q?`<div class="mn-step"><button type="button" class="mn-dec" data-id="${i.id}" aria-label="Menos">−</button><span>${q}</span><button type="button" class="mn-inc" data-id="${i.id}" aria-label="Mais">+</button></div>`:`<button type="button" class="mn-add" data-id="${i.id}" aria-label="Adicionar ${esc(i.name)}">+</button>`}</div></div>`}).join("");
  const seg=(cls,arr,cur)=>`<div class="segm">${arr.map(([v,l])=>`<button type="button" class="${cls}" data-v="${v}" aria-pressed="${cur===v}">${l}</button>`).join("")}</div>`;
  const types=[p.delivery&&["entrega","Entrega"],p.pickup&&["retirada","Retirada"]].filter(Boolean);
  const pays=[p.pix&&["pix","PIX"],["cartao","Cartão"],["dinheiro","Dinheiro"]].filter(Boolean);
  const cart=b.open&&t.n?`<div class="mn-cart"><h5>Seu pedido</h5>${t.lines.map(([q,i])=>`<div class="ln"><span>${q}x ${esc(i.name)}</span><span>${brl(q*i.price)}</span></div>`).join("")}${t.fee?`<div class="ln"><span>Taxa de entrega</span><span>${brl(t.fee)}</span></div>`:""}<div class="tot"><span>Total</span><span>${brl(t.total)}</span></div>${types.length>1?seg("mn-type",types,f.type):""}<input class="pfield mn-f" data-f="name" placeholder="Seu nome" aria-label="Seu nome" value="${esc(f.name)}">${f.type==="entrega"?`<input class="pfield mn-f" data-f="addr" placeholder="Endereço completo" aria-label="Endereço" value="${esc(f.addr)}">`:""}${seg("mn-pay",pays,f.pay)}<input class="pfield mn-f" data-f="note" placeholder="Observações (opcional)" aria-label="Observações" value="${esc(f.note)}"><a class="send mn-send" href="#" role="button">Enviar pedido no WhatsApp</a><div class="fine">O pedido abre no WhatsApp da loja com tudo preenchido.</div></div>`:"";
  return `<div class="pcard"><div class="ptitle">${esc(p.title)}</div>${cats.length>1?`<div class="mn-cats">${cats.map(c=>`<button type="button" class="mn-cat" data-c="${esc(c)}" aria-pressed="${c===b.cat}">${esc(c)}</button>`).join("")}</div>`:""}${list||'<p class="phead">Adicione itens no painel ao lado.</p>'}${t.n?`<button type="button" class="mn-bar mn-open"><span>${b.open?"Ocultar pedido":"Ver pedido"} <small>${t.n} ${t.n>1?"itens":"item"}</small></span><span>${brl(t.total)}</span></button>`:""}${cart}</div>`}
const sect=t=>t?`<div class="sect mn">${esc(t)}</div>`:"";
function renderBlock(b){
  const p=b.props;let h="",cls="",sty="";
  switch(b.type){
  case"CoverBlock":{
    cls=`cov h-${p.height} ${p.shape||"card"} al-${p.align||"left"}`;sty=`--ov:${p.overlay}`;
    const bg=p.media==="video"&&p.video?`<video src="${esc(p.video)}" autoplay muted loop playsinline></video>`
      :p.media==="none"?`<div class="bgm" style="background:var(--primary)"></div>`
      :`<div class="bgm ${p.media==="video"?"kb":""}" style="${bgi(p.img)}"></div>`;
    h=`${bg}${p.media==="video"&&!p.video?'<span class="vtag">vídeo de exemplo</span>':""}<div class="ct">${p.badge?`<span class="bd">${esc(p.badge)}</span>`:""}${p.headline?`<h2>${fx(p.headline,p.fx,p.fxSpeed)}</h2>`:""}${p.sub?`<p>${esc(p.sub)}</p>`:""}</div>`;break}
  case"StoryBlock":h=`<div class="stories">${p.items.map((s,i)=>`<button type="button" class="st ${p.shape==="circle"?"circle":""}" data-act="story" data-i="${i}"><span class="sr" style="${bgi(s.img)}${darkOv(s.dark)}"></span><span class="sl">${esc(s.title)}</span></button>`).join("")}</div>`;break;
  case"ProfileBlock":if(+p.lift)sty=`margin-top:-${+p.lift}px;z-index:2`;h=`<div class="pfl"><div class="av" style="${bgi(p.avatar)}">${p.avatar?"":esc((p.name||"?").trim().charAt(0).toUpperCase())}</div><h2 class="pname">${esc(p.name)}${p.verified?'<svg class="vf" viewBox="0 0 24 24" aria-label="Verificado"><circle cx="12" cy="12" r="11" fill="var(--primary)"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="var(--bg)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>':""}</h2><div class="hnd">${esc(p.handle)}</div><div class="phead">${esc(p.headline)}</div>${p.bio?`<p class="pbio">${esc(p.bio)}</p>`:""}${p.location?`<div class="loc"><svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>${esc(p.location)}</div>`:""}</div>`;break;
  case"TextBlock":h=`<div class="pcard" style="text-align:${p.align==="center"?"center":"left"}">${p.title?`<div class="ptitle">${fx(p.title,p.fx,p.fxSpeed)}</div>`:""}<div>${esc(p.text)}</div></div>`;break;
  case"ButtonBlock":h=`<div class="pbtns ${+p.cols===2?"c2":""} ${p.join?"join":""}">${p.items.map(btn).join("")}</div>`;break;
  case"CardsBlock":h=`${sect(p.title)}<div class="bento" style="--cols:${p.cols}">${p.items.map(c=>`<a class="bc s-${c.span} tone-${c.tone==="light"?"light":"dark"} pos-${c.pos}" href="${esc(c.url||"#")}" target="_blank" rel="noopener" data-act="link" data-label="${esc(c.title)}" style="${c.img?bgi(c.img)+darkOv(c.dark):`background:${c.color||"var(--primary)"}`}">${c.badge?`<span class="bdg">${esc(c.badge)}</span>`:""}<span class="arw">↗</span><h4>${esc(c.title)}</h4>${c.text?`<p>${esc(c.text)}</p>`:""}${c.cta?`<span class="cta">${esc(c.cta)}</span>`:""}</a>`).join("")}</div>`;break;
  case"SocialBlock":{const m=p.mode||"pill";h=`<div class="soc m-${m}">${p.items.map(n=>{if(typeof n==="string")n={net:n,url:"#",label:""};const nm=n.label||n.net;return `<a href="${esc(href(n.url))}" target="_blank" rel="noopener" data-act="link" data-label="${esc(nm)}" aria-label="${esc(nm)}" title="${esc(nm)}">${m==="text"?"":pic(socIc(n.net))}${m==="icons"?"":esc(nm)}</a>`}).join("")}</div>`;break}
  case"HeadlineBlock":{const f=p.font?FONTS[p.font]:"";const stl=[f?`font-family:${f}`:"",p.color?`color:${p.color}`:""].filter(Boolean).join(";");
    const txt=p.fx&&p.fx!=="none"?fx(p.text,p.fx,p.fxSpeed):esc(p.text).replace(/\*([^*]+)\*/g,'<mark class="mk">$1</mark>').replace(/\n/g,"<br>");
    h=`<div class="hl al-${p.align} sz-${p.size} ${p.upper?"up":""} ${p.tight?"tight":""}"><h2 style="${stl}">${txt}</h2>${p.sub?`<p>${esc(p.sub).replace(/\n/g,"<br>")}</p>`:""}</div>`;break}
  case"LabelRow":h=`<div class="lrow sz-${p.size} ${p.upper?"up":""}"><span>${esc(p.left)}</span><span>${esc(p.center)}</span><span>${esc(p.right)}</span></div>`;break;
  case"IconGrid":h=`<div class="ig ig-dir-${p.dir||"grid"} ${p.dir==="grid"||!p.dir?"c"+p.cols:""} ig-${p.shape} ig-${p.fill} ig-${p.size}">${p.items.map(i=>`<a class="igi" href="${esc(href(i.url))}" target="_blank" rel="noopener" data-act="link" data-label="${esc(i.label)}" aria-label="${esc(i.label)}" style="${[i.bg?`--ib:${i.bg}`:"",i.fg?`--if:${i.fg}`:""].filter(Boolean).join(";")}"><span class="igc">${pic(i.icon)}</span>${p.labels&&i.label?`<span class="igl">${esc(i.label)}</span>`:""}</a>`).join("")}</div>${p.hint?`<div class="ighint">${pic("hand")}<span>${esc(p.hint)}</span></div>`:""}`;break;
  case"TileGrid":h=`<div class="tg tg-${p.mode} rd-${p.round}" style="--cols:${p.cols};--sp:${p.space}px;${p.color?`--tile:${p.color}`:""}">${p.items.map(i=>`<a class="tgi s-${i.span||"1x1"}" href="${esc(href(i.url))}" target="_blank" rel="noopener" data-act="link" data-label="${esc(i.title)}" style="${i.color?`--tile:${i.color};`:""}${i.fg?`--tf:${i.fg}`:""}"><span class="tgp" style="${bgi(i.img)}${darkOv(i.dark)}"></span><span class="tgl">${esc(i.title)}</span></a>`).join("")}</div>`;break;
  case"StripBlock":h=p.items.map(x=>{const ph=(x.photos||[]).filter(Boolean);const list=ph.length?ph:Array.from({length:Math.min(10,+x.count||0)},(_,k)=>`art:${x.pal||"areia"}:${k+31}`);
    return `<div class="stp ${p.upper?"up":""}"><div class="sthd"><b>${esc(x.title)}</b>${x.more?`<a href="${esc(href(x.url))}" target="_blank" rel="noopener" data-act="link" data-label="${esc(x.title)}">${esc(x.more)}</a>`:""}</div><div class="stth th-${p.thumb} sh-${x.shape||"sq"}">${list.map(u=>`<i style="${bgi(u)}${darkOv(x.dark)}"></i>`).join("")}</div></div>`}).join("");break;
  case"DockBlock":cls="dockb";h=`<div class="dock dk-${p.style}">${p.play?`<span class="dkp">${pic("play")}</span>`:""}${p.items.map(i=>`<a class="dki" href="${esc(href(i.url))}" target="_blank" rel="noopener" data-act="link" data-label="${esc(i.label||i.icon)}" aria-label="${esc(i.label||i.icon)}">${pic(i.icon)}</a>`).join("")}</div>`;break;
  case"WhatsAppBlock":h=btn({title:p.label,sub:"",badge:"WhatsApp",icon:"whatsapp",url:`https://wa.me/${p.phone.replace(/\D/g,"")}?text=${encodeURIComponent(p.message)}`,size:"m",anim:"none"});break;
  case"MenuBlock":h=menuHtml(b);break;
  case"CatalogBlock":case"ServiceBlock":{
    const actUrl=i=>{const act=i.action||(i.url?"link":"whatsapp");
      if(act==="call")return"tel:"+(i.url||"").replace(/[^\d+]/g,"");
      if(act==="email")return"mailto:"+(i.url||"");
      if(act==="whatsapp")return p.phone?waUrl(p.phone,"Olá! Tenho interesse em: "+i.name):(i.url?href(i.url):"#");
      return i.url?href(i.url):"#"};
    const actIcon=i=>({call:"call",email:"mail",link:"globe"}[i.action]||"whatsapp");
    if(p.layout==="single"){
      const i=p.items[0]||{};
      h=`<a class="pghero" href="${esc(actUrl(i))}" target="_blank" rel="noopener" data-act="link" data-label="${esc(i.name)}"><div class="pgheroimg" style="${bgi(i.img)}${darkOv(i.dark)}">${i.badge?`<span class="pgbadge">${esc(i.badge)}</span>`:""}</div><div class="pgherobody">${p.title?`<div class="pgherotag">${esc(p.title)}</div>`:""}<div class="pgname lg">${esc(i.name)}</div>${i.desc?`<div class="pgdesc">${esc(i.desc)}</div>`:""}${(i.promo||i.price)?`<div class="pgprice">${i.promo?`<span class="old">${brl(i.price)}</span> ${brl(i.promo)}`:brl(i.price)}</div>`:""}<span class="pblk pghbtn">${pic(actIcon(i))}${esc(i.btn||"Saiba mais")}</span></div></a>`;
    }else if(p.layout==="list"){
      h=`<div class="pcard"><div class="ptitle">${esc(p.title)}</div>${p.items.map(i=>`<div class="pprod"><div class="pimg" style="${bgi(i.img)}"></div><div><div style="font-weight:700">${esc(i.name)}</div><div>${i.promo?`<span class="old">${brl(i.price)}</span> ${brl(i.promo)}`:(i.price?brl(i.price):"Sem custo")}</div></div><a class="pmini" href="${esc(actUrl(i))}" target="_blank" rel="noopener" data-act="link" data-label="${esc(i.name)}">${esc(i.btn)}</a></div>`).join("")}</div>`;
    }else{
      h=`<div class="pcard"><div class="ptitle">${esc(p.title)}</div><div class="pgrid">${p.items.map(i=>`<a class="pgcard" href="${esc(actUrl(i))}" target="_blank" rel="noopener" data-act="link" data-label="${esc(i.name)}"><div class="pgimg" style="${bgi(i.img)}${darkOv(i.dark)}">${i.badge?`<span class="pgbadge">${esc(i.badge)}</span>`:""}<span class="pgbtn" aria-hidden="true">${pic(actIcon(i))}</span></div><div class="pgbody"><div class="pgname">${esc(i.name)}</div>${i.desc?`<div class="pgdesc">${esc(i.desc)}</div>`:""}<div class="pgprice">${i.promo?`<span class="old">${brl(i.price)}</span> ${brl(i.promo)}`:(i.price?brl(i.price):"Sem custo")}</div></div></a>`).join("")}</div></div>`;
    }
    break}
  case"BookingBlock":h=`<div class="pcard"><div class="ptitle">${esc(p.title)}</div><div style="margin-bottom:8px">${esc(p.service)} · ${p.duration} min</div><input class="pfield bkd" type="date" aria-label="Data" value="${b.date||""}"><div class="slots">${slotsFor(b.date,+p.duration||50).slice(0,9).map(s=>`<button type="button" class="bks" aria-pressed="${b.pick===s}" data-t="${s}">${s}</button>`).join("")||`<span class="phead">${b.date?"Sem horários neste dia.":"Escolha uma data."}</span>`}</div>${b.pick?`<button type="button" class="pblk bkc" style="margin-top:10px">Confirmar ${esc(b.pick)}</button>`:""}</div>`;break;
  case"PixBlock":h=`<div class="pcard"><div class="ptitle">${esc(p.label)}</div><div class="phead" style="margin-bottom:8px">${esc(p.receiver)}</div><div style="display:flex;gap:8px"><button type="button" class="pblk pxc" style="flex:1">Copiar PIX</button><button type="button" class="pblk pxq" style="flex:1">${b.showQr?"Ocultar QR":"Mostrar QR"}</button></div>${b.showQr?`<div class="qrw q-m" style="margin:10px auto 0">${QR.svg(pix(p),"#000000","#ffffff","QR Code PIX")}</div>`:""}</div>`;break;
  case"MapBlock":h=`<div class="pcard">${p.title?`<div class="ptitle">${esc(p.title)}</div>`:""}${(p.address||"").trim()?`<div class="mapfr"><iframe title="Mapa: ${esc(p.address)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen src="https://www.google.com/maps?q=${encodeURIComponent(p.address)}&output=embed&hl=pt-BR"></iframe></div>`:`<div class="ph">Informe o endereço para ver o mapa</div>`}<div style="margin:8px 0">${esc(p.address)}</div><a class="pblk" target="_blank" rel="noopener" data-act="link" data-label="Mapa" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.address)}">${esc(p.btn||"Como chegar")}</a></div>`;break;
  case"PaymentButtonsBlock":{const PAY_LABEL={pix:"PIX",picpay:"PicPay",mercadopago:"Mercado Pago",infinitepay:"InfinitePay",asaas:"Asaas",outro:"Pagamento"};const PAY_COLOR={pix:"#0d9488",picpay:"#21c25e",mercadopago:"#00b1ea",infinitepay:"#7c3aed",asaas:"#0ea5e9",outro:"var(--primary)"};
    h=`<div class="pcard">${p.title?`<div class="ptitle">${esc(p.title)}</div>`:""}<div class="paybtns">${p.items.map(i=>`<a class="paybtn" style="--pc:${PAY_COLOR[i.method]||PAY_COLOR.outro}" href="${esc(href(i.url))}" target="_blank" rel="noopener" data-act="link" data-label="${esc(i.label||PAY_LABEL[i.method])}">${pic("wallet")}<span>${esc(i.label||PAY_LABEL[i.method])}</span></a>`).join("")}</div></div>`;break}
  case"GalleryBlock":{const ph=(p.photos||[]).filter(Boolean);const l=ph.length?ph:Array.from({length:Math.min(12,+p.count||0)},(_,i)=>`art:${p.pal}:${i+11}`);h=`<div class="gal" style="--gcols:${+p.cols||3}">${l.map(u=>`<div style="${bgi(u)}${darkOv(p.dark)}"></div>`).join("")}</div>`;break}
  case"CarouselBlock":{const ph=(p.photos||[]).filter(Boolean);const l=ph.length?ph:Array.from({length:+p.count||0},(_,i)=>`art:${p.pal}:${i+21}`);h=`<div style="display:flex;gap:8px;overflow:auto">${l.map(u=>`<div class="pimg" style="flex:0 0 150px;height:150px;${bgi(u)}${darkOv(p.dark)}"></div>`).join("")}</div>`;break}
  case"VideoBlock":h=`<div class="pcard"><div class="ptitle">${esc(p.title)}</div>${p.file?`<div class="vid"><video src="${esc(p.file)}" controls playsinline poster="${esc(src(p.poster))}"></video></div>`:`<a class="vid" data-act="link" ${p.url?`href="${esc(p.url)}" target="_blank" rel="noopener"`:'href="#"'} style="${bgi(p.poster)}"><span class="pl">▶</span></a>`}</div>`;break;
  case"LeadFormBlock":h=`<form class="pcard lf"><div class="ptitle">${esc(p.title)}</div><input class="pfield" name="n" required placeholder="${esc(p.namePh||"Nome")}" aria-label="${esc(p.namePh||"Nome")}"><input class="pfield" name="c" required placeholder="${esc(p.contactPh||"WhatsApp ou e-mail")}" aria-label="${esc(p.contactPh||"Contato")}"><label class="phead" style="display:flex;gap:6px;margin-bottom:8px"><input type="checkbox" required> ${esc(p.consent||"Concordo com o uso dos meus dados (LGPD)")}</label><button class="pblk" style="cursor:pointer">${esc(p.button)}</button>${p.note?`<div class="phead" style="margin-top:8px;font-size:12px">${esc(p.note)}</div>`:""}</form>`;break;
  case"FaqBlock":h=`<div class="pcard">${p.title?`<div class="ptitle">${esc(p.title)}</div>`:""}${p.items.map(i=>`<details class="faq-i"><summary>${esc(i.q)}</summary><p>${esc(i.a).replace(/\n/g,"<br>")}</p></details>`).join("")}</div>`;break;
  case"HoursBlock":{const wd=new Date().getDay();h=`<div class="pcard">${p.title?`<div class="ptitle">${esc(p.title)}</div>`:""}${p.items.map(i=>`<div class="hrs"><span>${esc(i.day)}</span><b>${esc(i.time)}</b></div>`).join("")}${p.note?`<div class="phead" style="margin-top:8px;font-size:12px">${esc(p.note)}</div>`:""}</div>`;break}
  case"StatsBlock":h=`<div class="pcard">${p.title?`<div class="ptitle">${esc(p.title)}</div>`:""}<div class="stats">${p.items.map(i=>`<div><b>${esc(i.n)}</b><span>${esc(i.l)}</span></div>`).join("")}</div></div>`;break;
  case"CountdownBlock":h=`<div class="pcard cdw" style="text-align:center">${p.title?`<div class="ptitle">${esc(p.title)}</div>`:""}<div class="cd" data-cd="${esc(p.date||"")}" data-end="${esc(p.endText||"")}">${cdHtml(p.date,p.endText)}</div>${p.btn?`<a class="pblk" style="margin-top:12px" target="_blank" rel="noopener" data-act="link" data-label="Contagem" href="${esc(linkOf(p.url))}">${esc(p.btn)}</a>`:""}</div>`;break;
  case"CouponBlock":h=`<div class="pcard cpn" style="text-align:center">${p.title?`<div class="ptitle">${esc(p.title)}</div>`:""}<div class="cpcode">${esc(p.code)}</div>${p.desc?`<div class="phead" style="margin:6px 0 10px">${esc(p.desc)}</div>`:""}<button type="button" class="pblk cpc">${esc(p.btn||"Copiar cupom")}</button></div>`;break;
  case"PricingBlock":h=`<div class="pcard">${p.title?`<div class="ptitle">${esc(p.title)}</div>`:""}<div class="prc">${p.items.map(i=>`<div class="pln${i.hot?" hot":""}"><b>${esc(i.name)}</b><div class="pp">${esc(i.price)}<small>${esc(i.per||"")}</small></div><ul>${String(i.feats||"").split("\n").filter(x=>x.trim()).map(f=>`<li>${esc(f)}</li>`).join("")}</ul>${i.btn?`<a class="pblk" target="_blank" rel="noopener" data-act="link" data-label="Plano ${esc(i.name)}" href="${esc(linkOf(i.url))}">${esc(i.btn)}</a>`:""}</div>`).join("")}</div></div>`;break;
  case"WifiBlock":{const wifiQr=`WIFI:T:WPA;S:${(p.ssid||"").replace(/([\\;,:"])/g,"\\$1")};P:${(p.password||"").replace(/([\\;,:"])/g,"\\$1")};;`;h=`<div class="pcard"><div class="ptitle">${esc(p.title||"Wi-Fi")}</div><div>Rede: <b>${esc(p.ssid)}</b></div><div style="display:flex;gap:8px;margin-top:8px"><button type="button" class="pblk wfc" style="flex:1">Copiar senha</button><button type="button" class="pblk wfq" style="flex:1">${b.showQr?"Ocultar QR":"Conectar por QR"}</button></div>${b.showQr?`<div class="qrw q-m" style="margin:10px auto 0">${QR.svg(wifiQr,"#000000","#ffffff","QR Code para conectar no Wi-Fi")}</div><div class="phead" style="text-align:center">Aponte a câmera do celular pra entrar na rede automaticamente.</div>`:""}</div>`;break}
  case"Tour360Block":h=`<div class="pcard"><div class="ptitle">${esc(p.title||"Tour 360°")}</div><div class="ph">Prévia do tour</div><a class="pblk" style="margin-top:8px" target="_blank" rel="noopener" data-act="link" data-label="Tour 360" href="${esc(href(p.source))}">${esc(p.btn||"Abrir tour")}</a></div>`;break;
  case"QRCodeBlock":{const u=(p.url||"").trim()?href(p.url):"https://"+PUB_HOST+"/"+(state.handle||"site");h=`<div class="pcard qrc">${p.title?`<div class="ptitle">${esc(p.title)}</div>`:""}<div class="qrw q-${p.size||"m"}">${QR.svg(u,p.fg||"#000000",p.bg||"#ffffff","QR Code para "+u)}</div>${p.caption?`<div class="phead">${esc(p.caption)}</div>`:""}<div class="phead qru">${esc(u.replace(/^https?:\/\//,""))}</div></div>`;break}
  case"DividerBlock":h=`<div class="dv dv-${p.style||"line"} sp-${p.space||"m"}">${p.label?`<span>${esc(p.label)}</span>`:""}</div>`;break;
  case"FooterBlock":cls="footb";h=`<div class="pfoot">${p.items.length?`<div class="pfoot-items">${p.items.map(i=>`<a class="pfoot-i" ${i.url?`href="${esc(href(i.url))}" target="_blank" rel="noopener"`:'href="#"'} data-act="link" data-label="${esc(i.label||i.emoji)}"><span class="pfoot-emoji">${esc(i.emoji)}</span>${i.label?`<span>${esc(i.label)}</span>`:""}</a>`).join("")}</div>`:""}${p.text?`<div class="pfoot-text">${esc(p.text)}</div>`:""}</div>`;break;
  case"TestimonialsBlock":h=`<div class="pcard">${(p.title??"Depoimentos")?`<div class="ptitle">${esc(p.title??"Depoimentos")}</div>`:""}${p.items.map(i=>`<blockquote style="margin:0 0 12px">${+i.stars?`<div class="stars" aria-label="${i.stars} estrelas">${"★".repeat(+i.stars)}</div>`:""}<div>“${esc(i.text)}”</div><div class="phead mn" style="font-size:11px;margin-top:2px">${esc(i.name)}${i.role?" · "+esc(i.role):""}</div></blockquote>`).join("")}</div>`;break;
  case"FreeBlock":{cls="freeb";sty=`height:${+p.height||360}px`;
    h=`<div class="flcanvas">${(p.items||[]).map((fi,ix)=>{
      const w=(+fi.w||100)/100,kcls=fi.kind==="img"?"fl-img":fi.kind==="emoji"?"fl-emoji":"fl-text";
      const inner=fi.kind==="img"?`<img src="${esc(src(fi.img)||art("areia",ix+7))}" alt="" draggable="false">`:esc(fi.text||(fi.kind==="emoji"?"✨":"Texto"));
      return `<div class="flit" data-fl="${ix}" style="left:${fi.x}%;top:${fi.y}%;z-index:${fi.z||1}"><div class="flin ${kcls} fl-a-${fi.anim||"none"}" style="--sc:${w};transform:rotate(${fi.rot||0}deg) scale(${w});${fi.color?`color:${fi.color}`:""}">${inner}</div></div>`;
    }).join("")}</div>`;break}
  case"CodeBlock":h=`<div class="codeb">${p.html||""}</div>`;break;
  }
  const mv=state.moveMode&&state.mode==="edit"&&state.view==="editor";
  const idx=mv?state.blocks.findIndex(x=>x.id===b.id):0;
  const bar=mv?`<div class="mvbar"><button type="button" data-mvblk="-1" ${idx<=0?"disabled":""} aria-label="Mover para cima" title="Mover para cima">↑</button><button type="button" data-mvblk="1" ${idx>=state.blocks.length-1?"disabled":""} aria-label="Mover para baixo" title="Mover para baixo">↓</button></div>`:"";
  const bs=b.sty||{};
  if(bs.bg)sty+=`;background:${bs.bg}`;if(bs.fg)sty+=`;color:${bs.fg};--text:${bs.fg}`;if(+bs.pad)sty+=`;padding:${+bs.pad}px`;if(+bs.rd)sty+=`;border-radius:${+bs.rd}px;overflow:hidden`;if(bs.wide)cls+=" wide";if(+bs.rot)sty+=`;transform:rotate(${+bs.rot}deg)`;if(bs.bleed)cls+=" bleed";
  return `<div class="blk a-${b.anim} ${cls} ${mv?"mv":""} ${state.mode==="edit"&&state.sel===b.id?"sel":""}" data-id="${b.id}" style="${sty}">${bar}${h}</div>`}

/* ───────── página e prévia ───────── */
const lum=h=>{const m=/^#?([0-9a-f]{6})$/i.exec(h||"");if(!m)return .5;const n=parseInt(m[1],16);return(.299*(n>>16)+.587*((n>>8)&255)+.114*(n&255))/255};
function topPad(t){const fb=((state.pages||[])[state.pageIdx]?.blocks||[]).find(b=>b.visible);return fb&&fb.type==="CoverBlock"&&!t.topAlways?12:(t.top??36)}
function tokenStyle(t){const dk=lum(t.bg)<.5;return `--bg:${t.bg};--text:${t.text};--muted:${t.muted};--primary:${t.primary};--secondary:${t.secondary};--btn-bg:${t.btnBg};--btn-text:${t.btnText};--radius:${t.radius}px;--shadow:${t.shadow};--gap:${t.gap}px;--top:${topPad(t)}px;--side:${t.side??0}px;--mw:${({narrow:"420px",normal:"520px",wide:"720px"})[t.width||"normal"]};--fs:${t.fs}px;--hf:${t.hf||t.font};--av:${t.avSize||92}px;--frameClr:${t.frameClr||t.primary};--shd-d:${dk?"rgba(0,0,0,.55)":"color-mix(in srgb,"+t.text+" 22%,transparent)"};--shd-l:${dk?"rgba(255,255,255,.07)":"rgba(255,255,255,.85)"};font-family:${t.font}`}
const bioClass=t=>`bio pf-${t.profile} cs-${t.cardStyle} av-${t.avatar||"circle"} rg-${t.avRing||"solid"} ba-${t.btnAlign||"left"} bcs-${t.btnCase||"none"} fr-${t.frame||"none"}`;
function spotifyEmbedUrl(url){
  const m=url.match(/open\.spotify\.com\/(track|album|playlist|artist|episode|show)\/([a-zA-Z0-9]+)/);
  return m?`https://open.spotify.com/embed/${m[1]}/${m[2]}`:""}
function deezerEmbedUrl(url){
  const m=url.match(/deezer\.com\/(?:[a-z]{2}\/)?(track|album|playlist|artist)\/(\d+)/);
  return m?`https://widget.deezer.com/widget/dark/${m[1]}/${m[2]}`:""}
function cdParts(date){const t=date?new Date(date).getTime():NaN;if(isNaN(t))return null;let s=Math.max(0,Math.floor((t-Date.now())/1000));return{s,d:Math.floor(s/86400),h:Math.floor(s%86400/3600),m:Math.floor(s%3600/60),sc:s%60}}
function cdHtml(date,end){const p=cdParts(date);if(!p)return `<span class="phead">Defina a data final no editor.</span>`;if(p.s<=0)return `<b>${esc(end||"Encerrado")}</b>`;return [[p.d,"dias"],[p.h,"horas"],[p.m,"min"],[p.sc,"seg"]].map(([v,l])=>`<div class="cdu"><b>${String(v).padStart(2,"0")}</b><span>${l}</span></div>`).join("")}
function linkOf(u){u=String(u||"").trim();if(!u)return "#";if(/^(https?:|mailto:|tel:)/i.test(u))return u;if(/^\d{10,15}$/.test(u.replace(/\D/g,""))&&!/[a-z@.]/i.test(u))return "https://wa.me/"+u.replace(/\D/g,"");if(/@/.test(u))return "mailto:"+u;return "https://"+u}
function pageWrap(t,inner){
  let bg=`background:${t.bg}`;
  if(t.bgMode==="gradient")bg=`background:linear-gradient(${t.bgAngle??160}deg,${t.bg},${t.bg2||t.primary}${t.bg3?","+t.bg3:""})`;
  const img=t.bgMode==="image"&&t.bgImg?`<div class="pgbg" style="${bgi(t.bgImg)};--ov:${t.bgOv??55}"></div>`:"";
  const foot=state.mode==="view"?`<footer class="sitefoot"><span>© ${new Date().getFullYear()} ${esc(state.brand||"")}</span>${plan().feat?"":`<span class="sfcredit">Feito com <a href="https://manifesti.com.br" target="_blank" rel="noopener">ManifesTI</a></span>`}</footer>`:"";
  const isSpotifyHost=state.bgMusic&&/spotify\.com|spotify\.link/.test(state.bgMusic);
  const isDeezerHost=state.bgMusic&&/deezer\.(com|page\.link)|link\.deezer\.com/.test(state.bgMusic);
  const spotify=isSpotifyHost?spotifyEmbedUrl(state.bgMusic):"";
  const deezer=!spotify&&isDeezerHost?deezerEmbedUrl(state.bgMusic):"";
  const shortLink=state.bgMusic&&!spotify&&!deezer&&(isSpotifyHost||isDeezerHost);
  const music=spotify?`<div class="bgmSpotify"><iframe src="${esc(spotify)}" width="100%" height="152" frameborder="0" allow="autoplay; encrypted-media" loading="lazy"></iframe><a class="bgmFallback" href="${esc(state.bgMusic)}" target="_blank" rel="noopener">${pic("music")}<span>Abrir no Spotify</span></a></div>`
    :deezer?`<div class="bgmSpotify"><iframe src="${esc(deezer)}" width="100%" height="152" frameborder="0" allow="autoplay; encrypted-media; clipboard-write" loading="lazy"></iframe><a class="bgmFallback" href="${esc(state.bgMusic)}" target="_blank" rel="noopener">${pic("music")}<span>Abrir no Deezer</span></a></div>`
    :shortLink?(state.mode==="edit"?`<div class="bgmWarn">Link curto de ${isSpotifyHost?"Spotify":"Deezer"} — abra esse link no navegador, copie o endereço completo da barra (com /track/, /album/ ou /playlist/) e cole aqui.</div>`:"")
    :state.bgMusic?`<audio id="bgmAud" src="${esc(state.bgMusic)}" loop ${state.bgMusicOn?"autoplay":""}></audio><button type="button" class="bgmBtn" id="bgmBtn" data-bgmtoggle aria-pressed="${state.bgMusicOn}" aria-label="${state.bgMusicOn?"Pausar música":"Tocar música"}">${pic("music")}</button>`:"";
  return `<div class="page pt-${t.pattern} fr-${t.frame||"none"}" style="${bg};--g1:${t.bg2||t.primary};--g2:${t.bg3||t.secondary}">${img}${inner}${foot}${music}</div>`}
function pageHtml(pages,idx,sel){
  const pg=pages[idx];
  const tabs=pages.length>1?`<nav class="ptabs" aria-label="Páginas do site">${pages.map((p,i)=>`<button type="button" data-page="${i}" ${i===idx?'aria-current="page"':""}>${esc(p.name)}</button>`).join("")}</nav>`:"";
  return tabs+(pg.blocks.filter(b=>b.visible).map(renderBlock).join("")||`<p class="phead" style="padding:24px">Página vazia. Adicione um bloco.</p>`)}
function normTokens(){const t=state.tokens;if(!t)return;if(t.top===undefined)t.top=36;if(t.side===undefined)t.side=0;if(!t.width)t.width="normal"}
function fitDevice(){fitNow();requestAnimationFrame(fitNow)}
function fitNow(){const d=$("#device"),ed=$("#v-editor");if(!d||!ed||ed.hidden||document.body.classList.contains("pub"))return;
  if(innerWidth<=900){d.style.height="";return}
  const avail=Math.floor(innerHeight-d.getBoundingClientRect().top-30);
  d.style.height=Math.max(460,Math.min(880,avail))+"px"}
addEventListener("resize",()=>fitDevice());
function renderPreview(){try{buildNav()}catch(e){}
  normTokens();
  if(!state.loading&&state.dirty===false){state.dirty=true;setSave()}
  clearTimers();
  const bio=$("#bio"),t=state.tokens,sy=bio.scrollTop;
  bio.setAttribute("style",tokenStyle(t));
  bio.className=bioClass(t)+" mode-"+state.mode;
  bio.innerHTML=pageWrap(t,pageHtml(state.pages,state.pageIdx));
  bio.scrollTop=sy;
  runFx(bio);
  $("#device").className="device"+(state.device==="desktop"?" desktop":"");
  fitDevice();
  if(state.mode==="view")document.title=state.seoTitle||state.brand||"manifesti";
}
function openFullPreview(){
  const ov=$("#fsPrev"),stage=$("#fsStage"),bio=$("#bio"),sv=$("#sv");
  if(!ov||!stage||!bio)return;
  stage.appendChild(bio);
  if(sv)stage.appendChild(sv);
  ov.hidden=false;
  document.body.style.overflow="hidden";
}
function closeFullPreview(){
  const ov=$("#fsPrev"),device=$("#device"),bio=$("#bio"),sv=$("#sv");
  if(!ov||!device||!bio)return;
  device.insertBefore(bio,device.firstChild);
  if(sv)device.appendChild(sv);
  ov.hidden=true;
  document.body.style.overflow="";
  state.mode="edit";
  $$("[data-mode]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.mode===state.mode));
  renderPreview();
}

/* ───────── stories ───────── */
const sv={b:null,i:0,t:null};
function openStory(bid,i){const b=findBlock(bid);if(!b)return;sv.b=b;sv.i=i;drawStory()}
function closeStory(){clearTimeout(sv.t);sv.b=null;const el=$("#sv");el.hidden=true;el.innerHTML=""}
function drawStory(){
  const items=sv.b.props.items,s=items[sv.i],el=$("#sv");
  el.hidden=false;el.setAttribute("style",tokenStyle(state.tokens));
  el.innerHTML=`<div class="si kb" style="${bgi(s.img)}"></div><div class="sb">${items.map((_,k)=>`<i class="${k<sv.i?"done":k===sv.i?"on":""}"><b></b></i>`).join("")}</div><div class="sh"><span>${esc(state.brand||"")}</span><button type="button" data-act="sclose" aria-label="Fechar">×</button></div><button type="button" class="zl" data-act="sprev" aria-label="Anterior"></button><button type="button" class="zr" data-act="snext" aria-label="Próximo"></button><div class="sc"><h3>${esc(s.title)}</h3>${s.caption?`<p>${esc(s.caption)}</p>`:""}${s.cta&&s.url?`<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.cta)}</a>`:""}</div>`;
  clearTimeout(sv.t);sv.t=setTimeout(()=>storyStep(1),5000)}
function storyStep(d){const n=sv.i+d;if(n<0){drawStory();return}if(n>=sv.b.props.items.length){closeStory();return}sv.i=n;drawStory()}

/* ───────── painéis do editor ───────── */
const META_ORDER=["CoverBlock","StoryBlock","ProfileBlock","HeadlineBlock","LabelRow","ButtonBlock","IconGrid","TileGrid","StripBlock","CardsBlock","MenuBlock","TextBlock","VideoBlock","GalleryBlock","CatalogBlock","ServiceBlock","TestimonialsBlock","WhatsAppBlock","BookingBlock","LeadFormBlock","PixBlock","PaymentButtonsBlock","MapBlock","SocialBlock","Tour360Block","CarouselBlock","FaqBlock","HoursBlock","StatsBlock","CountdownBlock","CouponBlock","PricingBlock","WifiBlock","QRCodeBlock","DividerBlock","DockBlock","FreeBlock","CodeBlock","FooterBlock"];
const FREE_BLOCKS=["CoverBlock","ProfileBlock","HeadlineBlock","LabelRow","ButtonBlock","IconGrid","TextBlock","GalleryBlock","WhatsAppBlock","MapBlock","SocialBlock","DividerBlock","FooterBlock","FaqBlock","HoursBlock","StatsBlock"];
const PLANS={
 gratis:{n:"Grátis",sites:1,pages:1,tier:1,blocks:FREE_BLOCKS,feat:false,desc:"1 site, 1 página, blocos básicos e marca d'água no rodapé"},
 pro:{n:"Pro",sites:1,pages:1,tier:3,blocks:null,feat:true,desc:"1 site com 1 página, todos os blocos e sem marca d'água"},
 premium:{n:"Premium",sites:10,pages:3,tier:3,blocks:null,feat:true,desc:"Até 10 sites, com 3 páginas em cada um"},
 master:{n:"Master",sites:999,pages:3,tier:3,blocks:null,feat:true,desc:"Conta master: sem limites"}};
const plan=()=>PLANS[state.plan||"gratis"];
const canBlock=t=>!plan().blocks||plan().blocks.includes(t);
const maxPages=()=>plan().pages;
function renderPalette(){$("#palette").innerHTML=META_ORDER.map(t=>canBlock(t)?`<button type="button" data-add="${t}">+ ${META[t].label}</button>`:`<button type="button" class="lock" data-locked="${t}" title="Disponível a partir do plano Pro (R$ 9,90/mês)">${ic("lock")} ${META[t].label}</button>`).join("")}
function renderPages(){
  $("#pgCount").textContent=`(${state.pages.length}/${maxPages()})`;
  $("#pages").innerHTML=state.pages.map((p,i)=>`<div class="pg" ${i===state.pageIdx?'aria-current="true"':""}>${i===state.pageIdx?`<input class="pgname" value="${esc(p.name)}" aria-label="Nome da página" style="border:0;background:transparent;font-weight:700;width:100%;padding:3px 2px">`:`<button type="button" class="nm" data-page="${i}">${esc(p.name)}</button>`}${state.pages.length>1?`<button type="button" class="btn sm" data-pgdel="${i}" aria-label="Remover página ${esc(p.name)}">×</button>`:"<span></span>"}</div>`).join("");
  $("#addPage").disabled=state.pages.length>=maxPages();
  $("#addPage").title=state.pages.length>=maxPages()?(maxPages()===1?"Seu plano tem 1 página por site. Faça upgrade para o Premium (3 páginas por site).":"Limite de 3 páginas por site"):""}
function renderLayers(){
  $("#layers").innerHTML=state.blocks.map((b,i)=>`<li class="layer ${b.visible?"":"off"}" draggable="true" data-i="${i}" aria-selected="${state.sel===b.id}"><button type="button" class="nm" data-sel="${b.id}">${esc(META[b.type].label)}</button><button type="button" class="ic" title="Subir" aria-label="Subir" data-up="${i}">↑</button><button type="button" class="ic" title="Descer" aria-label="Descer" data-dn="${i}">↓</button><button type="button" class="ic" title="Mostrar ou ocultar" aria-label="Mostrar ou ocultar" data-vis="${b.id}">${b.visible?"◉":"○"}</button><button type="button" class="ic" title="Duplicar" aria-label="Duplicar" data-dup="${b.id}">⧉</button><button type="button" class="ic" title="Remover" aria-label="Remover" data-del="${b.id}">×</button></li>`).join("")}

let fid=0;
const hx=v=>/^#[0-9a-f]{6}$/i.test(v||"")?v:"#888888";
function imgField(label,val,path){
  const id="fu"+(++fid);
  return `<div class="fld"><span class="lb">${label}</span><div class="imgf"><div class="th" style="${bgi(val)}"></div><div class="ac"><label class="btn sm" for="${id}">Enviar</label><input type="file" id="${id}" accept="image/*" data-upload="${path}" data-kind="img"><select data-art="${path}" aria-label="Imagem de exemplo"><option value="">Exemplo</option><optgroup label="Pessoa (foto IA)">${Object.entries(AI_PEOPLE).map(([k,[l]])=>`<option value="ai-${k}">${l}</option>`).join("")}</optgroup><optgroup label="Cenário">${Object.entries(PAL_LABEL).map(([k,l])=>`<option value="${k}">${l}</option>`).join("")}</optgroup><optgroup label="Pessoa (ilustração)">${Object.entries(PAL_LABEL).map(([k,l])=>`<option value="p-${k}">${l}</option>`).join("")}</optgroup></select><button type="button" class="btn sm" data-imgclear="${path}">Remover</button></div></div></div>`}
function imgsField(label,val,path){
  const arr=val||[];
  const id="fu"+(++fid);
  const thumbs=arr.map((u,ix)=>`<div class="imgsth" style="${bgi(u)}"><button type="button" class="rm" data-imgsrm="${path}" data-ix="${ix}" aria-label="Remover foto">×</button></div>`).join("");
  return `<div class="fld"><span class="lb">${label}</span><div class="imgsgrid">${thumbs}<label class="imgsadd btn sm" for="${id}">+ Enviar fotos</label></div><input type="file" id="${id}" accept="image/*" multiple data-uploadmulti="${path}" style="display:none"><textarea rows="2" placeholder="ou cole links de imagens, um por linha" data-path="${path}" data-k="lines">${esc(arr.join("\n"))}</textarea></div>`}
function vidField(label,val,path){
  const id="fu"+(++fid);
  return `<div class="fld"><span class="lb">${label}</span><div class="ac" style="display:flex;gap:6px;align-items:center;flex-wrap:wrap"><label class="btn sm" for="${id}">Enviar vídeo</label><input type="file" id="${id}" accept="video/*" data-upload="${path}" data-kind="vid" style="display:none"><span class="note">${val?"Vídeo carregado":"Nenhum vídeo enviado"}</span>${val?`<button type="button" class="btn sm" data-imgclear="${path}">Remover</button>`:""}</div></div>`}
function audField(label,val,path){
  const id="fu"+(++fid);
  const isBlob=val&&val.startsWith("blob:");
  const isSpotifyHost=val&&/spotify\.com|spotify\.link/.test(val);
  const isDeezerHost=val&&/deezer\.(com|page\.link)|link\.deezer\.com/.test(val);
  const isShort=val&&(isSpotifyHost||isDeezerHost)&&!spotifyEmbedUrl(val)&&!deezerEmbedUrl(val);
  const status=isBlob?"Arquivo enviado":isShort?`Link curto do ${isSpotifyHost?"Spotify":"Deezer"} — use o link completo`:isSpotifyHost?"Link do Spotify":isDeezerHost?"Link do Deezer":val?"Link definido":"Nenhuma música";
  return `<div class="fld"><span class="lb">${label}</span><div class="ac" style="display:flex;gap:6px;align-items:center;flex-wrap:wrap"><label class="btn sm" for="${id}">Enviar arquivo</label><input type="file" id="${id}" accept="audio/*" data-upload="${path}" data-kind="aud" style="display:none"><span class="note" style="${isShort?"color:var(--warn)":""}">${status}</span>${val?`<button type="button" class="btn sm" data-imgclear="${path}">Remover</button>`:""}</div><input type="text" placeholder="ou cole um link (Spotify, Deezer, SoundCloud, link direto de MP3...)" data-path="${path}" value="${isBlob?"":esc(val)}"><p class="note">Link do Spotify ou Deezer mostra o player oficial deles (com prévia da música, como qualquer link incorporado dessas plataformas). Use o link completo da página da música (com /track/, /album/ ou /playlist/) — links curtos de compartilhamento (link.deezer.com, spotify.link) não funcionam direto, é preciso abrir e copiar o endereço completo. Pra tocar a música inteira em loop, use "Enviar arquivo" ou um link direto de MP3.</p></div>`}
function fld(label,val,kind,opts,path){
  const id="f"+(++fid);
  switch(kind){
    case"bool":return `<div class="fld row"><input type="checkbox" id="${id}" data-path="${path}" data-k="bool" ${val?"checked":""}><label for="${id}">${label}</label></div>`;
    case"datetime":return `<div class="fld"><label for="${id}">${label}</label><input id="${id}" type="datetime-local" data-path="${path}" value="${esc(val)}"></div>`;
    case"area":return `<div class="fld"><label for="${id}">${label}</label><textarea id="${id}" rows="3" data-path="${path}">${esc(val)}</textarea></div>`;
    case"lines":return `<div class="fld"><label for="${id}">${label}</label><textarea id="${id}" rows="4" data-path="${path}" data-k="lines">${esc((val||[]).join("\n"))}</textarea></div>`;
    case"num":return `<div class="fld"><label for="${id}">${label}</label><input id="${id}" type="number" data-path="${path}" data-k="num" value="${esc(val)}"></div>`;
    case"money":return `<div class="fld"><label for="${id}">${label}</label><input id="${id}" type="text" inputmode="decimal" data-path="${path}" data-k="money" value="${val?(val/100).toFixed(2).replace(".",","):""}" placeholder="0,00"></div>`;
    case"sel":return `<div class="fld"><label for="${id}">${label}</label><select id="${id}" data-path="${path}">${opts.map(([v,l])=>`<option value="${esc(v)}" ${String(val)===String(v)?"selected":""}>${esc(l)}</option>`).join("")}</select></div>`;
    case"seg":return `<div class="fld"><span class="lb">${label}</span><div class="seg2">${opts.map(([v,l])=>`<button type="button" data-seg="${path}" data-val="${esc(v)}" aria-pressed="${String(val)===String(v)}">${esc(l)}</button>`).join("")}</div></div>`;
    case"range":return `<div class="fld"><label for="${id}">${label} (${val})</label><input id="${id}" type="range" min="${opts[0]}" max="${opts[1]}" data-path="${path}" data-k="num" data-lbl="${esc(label)}" value="${val}"></div>`;
    case"clr":return `<div class="fld"><label for="${id}">${label} ${val?"":"(padrão)"}</label><div style="display:flex;gap:6px"><input id="${id}" type="color" data-path="${path}" value="${hx(val)}" style="flex:1">${val&&!path.startsWith("tok.")?`<button type="button" class="btn sm" data-clr="${path}">Limpar</button>`:""}</div></div>`;
    case"icon":return `<div class="fld"><span class="lb">${label}</span><details class="ipick"><summary>${val?pic(val):"<span class='none'>—</span>"}<span>${esc((PI_LIST.find(x=>x[0]===val)||["","Sem ícone"])[1])}</span></summary><div class="igp"><button type="button" data-seticon="${path}" data-val="" aria-label="Sem ícone">∅</button>${PI_LIST.map(([k,l])=>`<button type="button" data-seticon="${path}" data-val="${k}" title="${l}" aria-label="${l}" aria-pressed="${k===val}">${pic(k)}</button>`).join("")}</div></details></div>`;
    case"img":return imgField(label,val,path);
    case"imgs":return imgsField(label,val,path);
    case"vid":return vidField(label,val,path);
    case"aud":return audField(label,val,path);
    case"code":return `<div class="fld"><label for="${id}">${label}</label><textarea id="${id}" rows="8" style="font-family:monospace;font-size:12.5px" data-path="${path}">${esc(val)}</textarea></div>`;
    default:return `<div class="fld"><label for="${id}">${label}</label><input id="${id}" type="text" data-path="${path}" value="${esc(val)}"></div>`}}
const getPath=(o,path)=>path.split(".").reduce((c,k)=>c?.[k],o);
function setPath(o,path,v){const ks=path.split(".");let c=o;for(let i=0;i<ks.length-1;i++)c=c[ks[i]];c[ks[ks.length-1]]=v}

const od=(k,def)=>`data-k="${k}" ${(state.optOpen&&k in state.optOpen?state.optOpen[k]:def)?"open":""}`;
function styleGroup(){
  const t=state.tokens;
  const col=(k,l)=>fld(l,t[k],"clr",null,"tok."+k);
  const seg=(k,l,o)=>`<div class="fld"><span class="lb">${l}</span><div class="seg2">${o.map(([v,n])=>`<button type="button" data-opt="${k}" data-val="${v}" aria-pressed="${t[k]===v}">${n}</button>`).join("")}</div></div>`;
  const rng=(k,l,min,max,u)=>`<div class="fld"><label for="r_${k}">${l} (${t[k]}${u})</label><input type="range" id="r_${k}" min="${min}" max="${max}" data-tok="${k}" data-lbl="${l}" data-u="${u}" value="${t[k]}"></div>`;
  const fontSel=(k,l,blank)=>{const cur=Object.keys(FONTS).find(f=>FONTS[f]===t[k])||"";return `<div class="fld"><label for="ft_${k}">${l}</label><select id="ft_${k}" data-font="${k}">${blank?'<option value="">Igual ao texto</option>':""}${Object.keys(FONTS).map(f=>`<option ${cur===f?"selected":""}>${f}</option>`).join("")}</select></div>`};
  return `<details class="opt" ${od("Estilo do site",!state.sel)}><summary>Estilo do site</summary><div>
  <div class="presets">${Object.entries(P).map(([k,[n,v]])=>`<button type="button" data-preset="${k}" aria-pressed="${state.preset===k}"><i><b style="background:${v.bg}"></b><b style="background:${v.primary}"></b><b style="background:${v.text}"></b></i><span>${n}</span></button>`).join("")}</div>
  <details class="opt" ${od("Título e SEO",false)}><summary>Título e SEO</summary><div>${fld("Título da página (aba do navegador)",state.seoTitle,"text",null,"$seoTitle")}${fld("Descrição para compartilhamento",state.seoDesc,"area",null,"$seoDesc")}<p class="note">Aparece na aba do navegador e ao compartilhar o link em redes sociais.</p></div></details>
  <details class="opt" ${od("Rastreamento",false)}><summary>Rastreamento</summary><div>${plan().feat?"":`<p class="note lockn">${ic("lock")} Meta Pixel e Google Analytics estão disponíveis no plano Pro.</p>`}${plan().feat?fld("Meta Pixel (ID)",state.metaPixel,"text",null,"$metaPixel")+fld("Google Analytics (ID de medição)",state.gaId,"text",null,"$gaId"):""}<p class="note">Usados para medir visitas e cliques do seu bio site nas campanhas do Facebook/Instagram Ads e no Google Analytics, quando o site estiver publicado.</p></div></details>
  <details class="opt" ${od("Música de fundo",false)}><summary>Música de fundo</summary><div>${plan().feat?"":`<p class="note lockn">${ic("lock")} Música de fundo está disponível no plano Pro.</p>`}${plan().feat?audField("Trilha do bio site",state.bgMusic,"$bgMusic")+fld("Tocar automaticamente (com botão para mutar)",state.bgMusicOn,"bool",null,"$bgMusicOn"):""}<p class="note">Com arquivo enviado ou link direto de MP3, aparece um botão flutuante de tocar/mutar — os navegadores exigem esse botão porque não deixam áudio tocar sozinho sem interação. Com link do Spotify ou Deezer, aparece o player oficial deles no rodapé da página.</p></div></details>
  <details class="opt" ${od("Cores",true)}><summary>Cores</summary><div><div class="cgrid">${col("primary","Destaque")}${col("btnBg","Botões")}${col("btnText","Texto botão")}${col("text","Texto")}${col("secondary","Cards")}${col("bg","Fundo")}</div></div></details>
  <details class="opt" ${od("Tipografia",false)}><summary>Tipografia</summary><div>${fontSel("font","Fonte do texto")}${fontSel("hf","Fonte dos títulos",1)}${rng("fs","Tamanho do texto",12,19,"px")}</div></details>
  <details class="opt" ${od("Botões",false)}><summary>Botões</summary><div>${seg("btnStyle","Estilo padrão",BTN_STYLES.slice(1))}${seg("btnAlign","Texto do botão",[["left","À esquerda"],["center","Centralizado"]])}${seg("btnCase","Letras",[["none","Normal"],["upper","MAIÚSCULAS"]])}${rng("radius","Arredondamento",0,40,"px")}
  <div class="fld"><label for="sh">Sombra</label><select id="sh" data-tok="shadow">${[["none","Nenhuma"],["0 2px 6px rgba(0,0,0,.18)","Leve"],["0 8px 24px rgba(0,0,0,.28)","Média"],["0 14px 34px rgba(0,0,0,.42)","Forte"]].map(([v,n])=>`<option value="${v}" ${t.shadow===v?"selected":""}>${n}</option>`).join("")}</select></div></div></details>
  <details class="opt" ${od("Cards, margens e espaçamento",false)}><summary>Cards, margens e espaçamento</summary><div>${seg("cardStyle","Estilo do card",[["soft","Suave"],["outline","Contorno"],["glass","Vidro"],["lift","Elevado"],["flat","Sem fundo"]])}${rng("gap","Espaçamento entre blocos",6,32,"px")}${rng("top","Margem no topo da página",0,90,"px")}${rng("side","Margem nas laterais",0,40,"px")}${seg("width","Largura no computador",[["narrow","Estreita"],["normal","Normal"],["wide","Larga"]])}</div></details>
  <details class="opt" ${od("Perfil",false)}><summary>Perfil</summary><div>${seg("profile","Disposição",[["center","Centro"],["left","Esquerda"],["row","Lado a lado"],["card","Em cartão"]])}${seg("avatar","Formato da foto",[["circle","Círculo"],["squircle","Arredondada"],["square","Quadrada"],["arch","Arco"],["hex","Hexágono"]])}${seg("avRing","Borda da foto",[["none","Sem"],["solid","Simples"],["double","Dupla"],["gold","Dourada"],["glow","Brilho"]])}${rng("avSize","Tamanho da foto",56,170,"px")}</div></details>
  <details class="opt" ${od("Fundo da página",false)}><summary>Fundo da página</summary><div>${seg("bgMode","Tipo de fundo",[["solid","Cor"],["gradient","Degradê"],["image","Foto"]])}${t.bgMode==="gradient"||t.pattern==="mesh"?`<div class="cgrid">${col("bg2","Cor 2")}${col("bg3","Cor 3")}</div>`:""}${t.bgMode==="gradient"?rng("bgAngle","Ângulo do degradê",0,360,"°"):""}${t.bgMode==="image"?imgField("Foto de fundo",t.bgImg,"tok.bgImg")+rng("bgOv","Camada de cor sobre a foto",0,95,"%"):""}${seg("pattern","Textura",[["none","Liso"],["glow","Brilho"],["aurora","Aurora"],["mesh","Malha de cores"],["dots","Pontos"],["grid","Grade"],["stripes","Listras"],["grain","Grão"],["waves","Ondas"],["blobs","Manchas"],["rings","Anéis"],["geo","Geométrico"],["hex","Hexágonos"],["chevron","Zigue-zague"],["diag","Diagonais"]])}${seg("frame","Moldura",[["none","Sem"],["card","Cartão sobre cor"],["line","Linha interna"]])}${t.frame!=="none"?col("frameClr","Cor da moldura"):""}</div></details>`}

const ITEM_NAME={SocialBlock:["Redes","rede"],TestimonialsBlock:["Depoimentos","depoimento"],CatalogBlock:["Produtos","produto"],ServiceBlock:["Serviços","serviço"],MenuBlock:["Itens do cardápio","item"],ButtonBlock:["Botões","botão"],CardsBlock:["Cartões","cartão"],StoryBlock:["Stories","story"],IconGrid:["Ícones","ícone"],TileGrid:["Blocos","bloco"],StripBlock:["Faixas","faixa"],DockBlock:["Ícones da barra","ícone"],FreeBlock:["Camadas","camada"],FooterBlock:["Itens","item"],PaymentButtonsBlock:["Botões","botão"],FaqBlock:["Perguntas","pergunta"],HoursBlock:["Horários","horário"],StatsBlock:["Números","número"],PricingBlock:["Planos","plano"]};
function itemSummary(type,item){return item.title||item.name||item.label||item.net||"Item"}
function renderInspector(){
  normTokens();
  let h="";
  const b=state.blocks.find(x=>x.id===state.sel);
  if(!b){h+=`<p class="note">Clique em um bloco na prévia para editar.</p>`}
  else{
    h+=`<h3>${esc(META[b.type].label)}</h3>`;
    h+=fld("Animação de entrada",b.anim,"sel",[["none","Nenhuma"],["fade","Fade"],["slide","Subir"],["scale","Escala"]],"$anim");
    if(b.type==="StoryBlock")h+=`<button type="button" class="btn sm" data-storyview="1">▶ Ver stories</button>`;
    (FIELDS[b.type]||[]).forEach(([k,l,kind,o])=>{h+=fld(l,b.props[k],kind,o,k)});
    if(LISTS[b.type]){
      const items=b.props.items;
      const IN=ITEM_NAME[b.type]||["Itens","item"];h+=`<h3>${IN[0]} (${items.length})</h3>`;
      h+=items.map((item,ix)=>`<details class="item" ${state.openItem===ix?"open":""} data-ix="${ix}"><summary><span class="tt">${esc(itemSummary(b.type,item))}</span></summary><div><div class="acts"><button type="button" class="btn sm" data-mvitem="-1" data-ix="${ix}" aria-label="Subir">↑</button><button type="button" class="btn sm" data-mvitem="1" data-ix="${ix}" aria-label="Descer">↓</button><button type="button" class="btn sm" data-rmitem="${ix}">Remover</button></div>${LISTS[b.type].map(([k,l,kind,o])=>fld(l,item[k],kind,o,`items.${ix}.${k}`)).join("")}</div></details>`).join("");
      h+=`<button type="button" class="btn sm" data-additem="1">+ Adicionar ${IN[1]}</button>`}
    if(b.type==="PixBlock")h+=`<p class="note">O código copia e cola segue o padrão do Banco Central. O sistema só exibe os dados e não intermedia o pagamento.</p>`}
  if(b){const bs=b.sty||{};h+=`<details class="opt" ${od("Aparência do bloco",false)}><summary>Aparência deste bloco</summary><div>${fld("Cor do fundo do bloco",bs.bg||"","clr",null,"$sty.bg")}${fld("Cor do texto do bloco",bs.fg||"","clr",null,"$sty.fg")}${fld("Espaço interno (0 = padrão)",+bs.pad||0,"range",[0,48],"$sty.pad")}${fld("Arredondamento (0 = padrão)",+bs.rd||0,"range",[0,60],"$sty.rd")}${fld("Largura total da tela",!!bs.wide,"bool",null,"$sty.wide")}${fld("Rotação do bloco (°)",+bs.rot||0,"range",[-15,15],"$sty.rot")}${fld("Efeito de profundidade (foto ultrapassa a borda)",!!bs.bleed,"bool",null,"$sty.bleed")}</div></details>`}
  h+=styleGroup();
  $("#inspector").innerHTML=`<button type="button" class="btn sm mob-only" data-tab="stage">← Voltar à prévia</button>`+h}
function rerender(keepInspector){renderPreview();renderLayers();renderPages();if(!keepInspector)renderInspector();if(typeof syncFab==="function")syncFab()}

/* ───────── eventos ───────── */
const curBlock=()=>state.blocks.find(x=>x.id===state.sel);
function resolve(path){
  if(path.startsWith("tok."))return[state.tokens,path.slice(4)];
  if(path==="$anim")return[curBlock(),"anim"];
  if(path.startsWith("$sty.")){const b=curBlock();b.sty=b.sty||{};return[b.sty,path.slice(5)]}
  if(path==="$seoTitle")return[state,"seoTitle"];
  if(path==="$seoDesc")return[state,"seoDesc"];
  if(path==="$metaPixel")return[state,"metaPixel"];
  if(path==="$gaId")return[state,"gaId"];
  if(path==="$bgMusic")return[state,"bgMusic"];
  if(path==="$bgMusicOn")return[state,"bgMusicOn"];
  return[curBlock().props,path]}
function applyValue(path,v){const[o,p]=resolve(path);setPath(o,p,v)}
function switchPage(i){state.pageIdx=i;state.sel=state.blocks[0]?.id||null;state.openItem=-1;closeStory();rerender()}

document.addEventListener("click",e=>{
  const t=e.target.closest("[data-act],[data-sideclose],[data-tpl],button,a,.blk");if(!t)return;
  const d=t.dataset;
  /* stories */
  if(d.act==="sclose"){closeStory();return}
  if(d.act==="snext"){storyStep(1);return}
  if(d.act==="sprev"){storyStep(-1);return}
  if(d.storyview){openStory(state.sel,0);return}
  if(d.sideclose){setSide(false);return}
  if(d.tab){setTab(d.tab);return}
  if(d.movetoggle){state.moveMode=!state.moveMode;t.setAttribute("aria-pressed",state.moveMode);renderPreview();return}
  if(d.mvblk){e.preventDefault();const id=t.closest(".blk").dataset.id,i=state.blocks.findIndex(x=>x.id===id),j=i+ +d.mvblk;
    if(j>=0&&j<state.blocks.length){const y=$("#bio").scrollTop;[state.blocks[i],state.blocks[j]]=[state.blocks[j],state.blocks[i]];rerender(true);$("#bio").scrollTop=y}return}
  /* painel esquerdo */
  if(d.plan){if(AUTH.apiKey&&d.plan!=="gratis"){go("billing");return}setPlan(d.plan);go("editor");return}
  if(d.moreplan){toast(`Plano ${d.moreplan}: fale com a gente pelo Instagram pra saber mais e ser avisado do lançamento.`);return}
  if(d.upsell){toast("Este template é do plano Pro. Escolha um plano para liberar todos.");return}
  if(d.locked){toast(`${META[d.locked].label} está disponível a partir do plano Pro.`);return}
  if(d.add){const b=mk(d.add);state.blocks.push(b);state.sel=b.id;state.openItem=-1;if(mob())setTab("stage");rerender();$("#bio").scrollTo({top:1e5,behavior:"smooth"});return}
  if(d.sel){state.sel=d.sel;state.openItem=-1;rerender();if(mob())setTab("inspector");return}
  if(d.up!==undefined){const i=+d.up;if(i>0){[state.blocks[i-1],state.blocks[i]]=[state.blocks[i],state.blocks[i-1]];rerender(true)}return}
  if(d.dn!==undefined){const i=+d.dn;if(i<state.blocks.length-1){[state.blocks[i+1],state.blocks[i]]=[state.blocks[i],state.blocks[i+1]];rerender(true)}return}
  if(d.vis){const b=state.blocks.find(x=>x.id===d.vis);b.visible=!b.visible;rerender(true);return}
  if(d.dup){const i=state.blocks.findIndex(x=>x.id===d.dup);const c=structuredClone(state.blocks[i]);c.id=c.type+"-"+uid();(c.props.items||[]).forEach(x=>x.id=uid());state.blocks.splice(i+1,0,c);state.sel=c.id;rerender();return}
  if(d.del){state.blocks=state.blocks.filter(x=>x.id!==d.del);if(state.sel===d.del)state.sel=null;rerender();return}
  /* páginas */
  if(d.page!==undefined){switchPage(+d.page);return}
  if(d.pgdel!==undefined){state.pages.splice(+d.pgdel,1);state.pageIdx=Math.min(state.pageIdx,state.pages.length-1);state.sel=state.blocks[0]?.id||null;rerender();toast("Página removida");return}
  if(t.id==="addPage"){if(state.pages.length>=maxPages()){toast("O plano Grátis inclui 1 página. Faça upgrade para ter até 3.");return}if(state.pages.length<3){state.pages.push({id:uid(),name:"Nova página",blocks:[mk("TextBlock",{title:"Nova página",text:"Escreva aqui o conteúdo desta página."})]});switchPage(state.pages.length-1)}return}
  /* estilo do site */
  if(d.preset){state.preset=d.preset;state.tokens=tk(d.preset);rerender();return}
  if(d.opt){state.tokens[d.opt]=d.val;rerender();return}
  if(d.dev){state.device=d.dev;$$("[data-dev]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.dev===state.device));renderPreview();return}
  if(d.mode){state.mode=d.mode;$$("[data-mode]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.mode===state.mode));renderPreview();if(d.mode==="view")openFullPreview();return}
  if(t.id==="fsBack"){closeFullPreview();return}
  /* campos do inspetor */
  if(d.seg){const cur=getPath(resolve(d.seg)[0],resolve(d.seg)[1]);applyValue(d.seg,typeof cur==="number"?Number(d.val):d.val);renderPreview();renderInspector();return}
  if(d.seticon!==undefined){applyValue(d.seticon,d.val);renderPreview();renderInspector();return}
  if(d.clr){applyValue(d.clr,"");renderPreview();renderInspector();return}
  if(d.imgclear){applyValue(d.imgclear,"");renderPreview();renderInspector();return}
  if(d.setplan){
    if(AUTH.apiKey&&(d.setplan==="pro"||d.setplan==="premium")){startCheckout(d.setplan);return}
    setPlan(d.setplan);renderBilling();return}
  if(e.target.closest("[data-bgmtoggle]")){state.bgMusicOn=!state.bgMusicOn;const aud=$("#bgmAud");if(aud){if(state.bgMusicOn)aud.play().catch(()=>{});else aud.pause()}const btn=$("#bgmBtn");if(btn)btn.setAttribute("aria-pressed",String(state.bgMusicOn));return}
  if(d.imgsrm!==undefined){const[o,p]=resolve(d.imgsrm);const arr=(o[p]||[]).slice();arr.splice(+d.ix,1);setPath(o,p,arr);rerender();return}
  if(d.additem){const b=curBlock();const base=structuredClone(b.props.items[b.props.items.length-1]||{});const reset={title:"Novo item",name:"Novo item",label:"Novo",text:"",sub:"",caption:"",url:"https://exemplo.com"};Object.keys(reset).forEach(k=>{if(k in base)base[k]=reset[k]});if("photos" in base)base.photos=[];base.id=uid();b.props.items.push(base);state.openItem=b.props.items.length-1;rerender();return}
  if(d.rmitem!==undefined){const b=curBlock();b.props.items.splice(+d.rmitem,1);state.openItem=-1;rerender();return}
  if(d.mvitem!==undefined){const b=curBlock(),i=+d.ix,j=i+ +d.mvitem,a=b.props.items;if(j>=0&&j<a.length){[a[i],a[j]]=[a[j],a[i]];state.openItem=j;rerender()}return}
  /* navegação */
  if(d.tf!==undefined){state.tplFilter=d.tf;renderTemplates();return}
  if(d.scroll){const el=document.getElementById(d.scroll);if(el)el.scrollIntoView({behavior:"smooth",block:"start"});return}
  if(d.nav){go(d.nav);return}
  if(d.tpl){applyTemplate(+d.tpl);return}
  if(d.period){state.period=+d.period;$$("[data-period]").forEach(x=>x.setAttribute("aria-pressed",x===t));renderDashboard();return}
  /* dentro da prévia */
  const blk=e.target.closest(".blk");
  if(!blk||!$("#bio").contains(blk))return;
  const b=findBlock(blk.dataset.id);if(!b)return;
  if(t.classList.contains("mn-add")||t.classList.contains("mn-inc")){b.cart=b.cart||{};b.cart[t.dataset.id]=(b.cart[t.dataset.id]||0)+1;renderPreview();return}
  if(t.classList.contains("mn-dec")){const q=(b.cart[t.dataset.id]||0)-1;if(q<=0)delete b.cart[t.dataset.id];else b.cart[t.dataset.id]=q;if(!menuTotals(b).n)b.open=false;renderPreview();return}
  if(t.classList.contains("mn-cat")){b.cat=t.dataset.c;renderPreview();return}
  if(t.classList.contains("mn-open")){b.open=!b.open;renderPreview();return}
  if(t.classList.contains("mn-type")){b.form.type=t.dataset.v;renderPreview();return}
  if(t.classList.contains("mn-pay")){b.form.pay=t.dataset.v;renderPreview();return}
  if(t.classList.contains("mn-send")){e.preventDefault();
    if(!b.form.name.trim()){toast("Informe seu nome para enviar o pedido");return}
    if(b.form.type==="entrega"&&!b.form.addr.trim()){toast("Informe o endereço de entrega");return}
    const tt=menuTotals(b),msg=menuMsg(b),url=waUrl(b.props.phone,msg);
    if(state.remoteSiteId)apiSendOrder(state.handle,{customer_name:b.form.name,items:tt.lines.map(([q,i])=>q+"x "+i.name),type:b.form.type,total_cents:Math.round(tt.total*100)}).catch(()=>{});
    else state.orders.unshift({d:"agora",who:b.form.name,items:tt.lines.map(([q,i])=>q+"x "+i.name).join(", "),type:b.form.type==="entrega"?"Entrega":"Retirada",total:tt.total,st:"Novo"});
    const w=window.open(url,"_blank","noopener");if(!w){copy(msg,"Pedido copiado. Cole no WhatsApp da loja.")}else toast("Abrindo o WhatsApp da loja");
    b.cart={};b.open=false;renderPreview();return}
  if(t.classList.contains("bks")){b.pick=t.dataset.t;renderPreview();return}
  if(t.classList.contains("bkc")){
    if(state.remoteSiteId){const pk=b.pick,dt=b.date;apiSendBooking(state.handle,{service:b.props.service,date:dt,time:pk,client_name:"Cliente do site"}).then(()=>toast("Agendamento confirmado")).catch(err=>toast(err.message)).finally(()=>{clearTaken(dt);renderPreview()})}
    else{state.bookings.push({date:b.date,time:b.pick,svc:b.props.service,who:"Cliente do site",st:"Confirmado"});toast("Agendamento confirmado")}
    b.pick=null;renderPreview();return}
  if(t.classList.contains("pxc")){copy(pix(b.props),"PIX copiado");return}
  if(t.classList.contains("pxq")){b.showQr=!b.showQr;renderPreview();return}
  if(t.classList.contains("cpc")){copy(b.props.code,"Cupom copiado");return}
  if(t.classList.contains("wfc")){copy(b.props.password,"Senha copiada");return}
  if(t.classList.contains("wfq")){b.showQr=!b.showQr;renderPreview();return}
  if(d.act==="story"){if(state.mode==="edit"&&state.sel!==b.id){state.sel=b.id;rerender(true);renderInspector()}openStory(b.id,+d.i);return}
  if(d.act==="link"){
    if(state.mode==="edit"){e.preventDefault();toast("Link: "+(t.getAttribute("href")||"sem link"))}
    else if(t.getAttribute("href")==="#")e.preventDefault();
    else{const k=d.label;if(k)track[k]=(track[k]||0)+1}}
  if(state.mode==="edit"&&state.sel!==b.id){state.sel=b.id;state.openItem=-1;rerender()}
});
document.addEventListener("input",e=>{
  const el=e.target;
  if(el.classList.contains("mn-f")){const b=findBlock(el.closest(".blk").dataset.id);b.form[el.dataset.f]=el.value;return}
  if(el.classList.contains("pgname")){state.pages[state.pageIdx].name=el.value;renderPreview();return}
  if(el.dataset.font){state.tokens[el.dataset.font]=el.value?FONTS[el.value]:"";renderPreview();return}
  if(el.dataset.tok){const k=el.dataset.tok;state.tokens[k]=el.type==="range"?+el.value:el.value;renderPreview();if(el.type==="range"){const l=el.previousElementSibling;if(l)l.textContent=`${el.dataset.lbl} (${el.value}${el.dataset.u})`}return}
  if(el.dataset.art!==undefined){if(el.value){
    if(el.value.startsWith("ai-")){applyValue(el.dataset.art,`ai:${el.value.slice(3)}`);renderPreview();renderInspector();return}
    const pp=el.value.startsWith("p-");applyValue(el.dataset.art,`${pp?"person":"art"}:${el.value.replace(/^p-/,"")}:${1+Math.floor(Math.random()*90)}`);renderPreview();renderInspector()}return}
  if(el.dataset.path){
    let v=el.value;
    if(el.dataset.k==="bool")v=el.checked;else if(el.dataset.k==="num")v=Number(v)||0;else if(el.dataset.k==="money")v=Math.round((parseFloat(String(v).replace(/\./g,"").replace(",","."))||0)*100);else if(el.dataset.k==="lines")v=v.split("\n").map(s=>s.trim()).filter(Boolean);
    applyValue(el.dataset.path,v);
    if(el.type==="range"){const l=el.previousElementSibling;if(l)l.textContent=`${el.dataset.lbl} (${el.value})`}
    renderPreview();renderLayers();
    if(el.tagName==="SELECT"||el.type==="color"&&false)renderInspector();
    return}
  if(el.classList.contains("bkd")){const b=findBlock(el.closest(".blk").dataset.id);b.date=el.value;b.pick=null;renderPreview()}
});
document.addEventListener("change",async e=>{
  const el=e.target;
  if(el.dataset.upload&&el.files&&el.files[0]){
    const f=el.files[0];
    if(el.dataset.kind==="img"&&!f.type.startsWith("image/")){toast("Escolha um arquivo de imagem");return}
    if(el.dataset.kind==="vid"&&!f.type.startsWith("video/")){toast("Escolha um arquivo de vídeo");return}
    if(el.dataset.kind==="aud"&&!f.type.startsWith("audio/")){toast("Escolha um arquivo de áudio");return}
    toast("Enviando...");
    const url=await fileToUrl(f);if(!url)return;
    applyValue(el.dataset.upload,url);renderPreview();renderInspector();toast(el.dataset.kind==="vid"?"Vídeo carregado":el.dataset.kind==="aud"?"Música carregada":"Foto carregada")}
  if(el.dataset.uploadmulti&&el.files&&el.files.length){
    const[o,p]=resolve(el.dataset.uploadmulti);
    const cur=(o[p]||[]).slice();
    let n=0;toast("Enviando...");
    for(const f of Array.from(el.files)){if(f.type.startsWith("image/")){const u=await fileToUrl(f);if(u){cur.push(u);n++}}}
    if(n){setPath(o,p,cur);renderPreview();renderInspector();toast(n>1?`${n} fotos carregadas`:"Foto carregada")}}
});
document.addEventListener("submit",e=>{
  const f=e.target.closest(".lf");if(!f)return;e.preventDefault();
  const fd=new FormData(f);
  if(state.remoteSiteId)apiSendLead(state.handle,{name:fd.get("n"),contact:fd.get("c"),source:"Site",device:mob()?"Celular":"Desktop",button:"Formulário"}).catch(()=>{});
  else state.leads.unshift({d:"agora",n:fd.get("n"),c:fd.get("c"),o:"Site",dev:"Desktop",b:"Formulário"});
  f.reset();toast("Lead recebido")});
/* arrastar para reordenar */
let dragI=null;
document.addEventListener("dragstart",e=>{const l=e.target.closest(".layer");if(l){dragI=+l.dataset.i;e.dataTransfer.effectAllowed="move";try{e.dataTransfer.setData("text/plain",String(dragI))}catch{}}});
document.addEventListener("dragover",e=>{const l=e.target.closest(".layer");if(l&&dragI!==null){e.preventDefault();$$(".layer").forEach(x=>x.classList.toggle("dragover",x===l))}});
document.addEventListener("drop",e=>{const l=e.target.closest(".layer");if(l&&dragI!==null){e.preventDefault();const to=+l.dataset.i;const[m]=state.blocks.splice(dragI,1);state.blocks.splice(to,0,m);dragI=null;rerender(true)}});
document.addEventListener("dragend",()=>{dragI=null;$$(".layer").forEach(x=>x.classList.remove("dragover"))});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&sv.b)closeStory()});
document.addEventListener("toggle",e=>{
  const d=e.target;if(!d||!d.matches)return;
  if(d.matches("details.item")){const i=+d.dataset.ix;if(d.open)state.openItem=i;else if(state.openItem===i)state.openItem=-1}
  else if(d.matches("details.opt")&&d.dataset.k){state.optOpen=state.optOpen||{};state.optOpen[d.dataset.k]=d.open}
},true);

/* ───────── dashboard ───────── */

function rnd(seed){let s=seed;return()=>{s=(s*16807)%2147483647;return s/2147483647}}
function renderDashboard(){
  const N=state.period||14,real=state.remoteSiteId>0;
  let views,clicks,sources,devices,topbtn;
  if(real){
    const s=state.stats&&state.stats.N===N&&state.stats.site===state.remoteSiteId?state.stats:null;
    if((!s||s.stale)&&!state.statsBusy)fetchStats(N);
    views=s?s.views:Array(N).fill(0);clicks=s?s.clicks:Array(N).fill(0);
    sources=s?s.sources:[];devices=s?s.devices:[];topbtn=s?s.buttons:[]}
  else{
    const r=rnd(42);views=Array.from({length:N},(_,i)=>Math.round(120+i*(126/N)+r()*70));clicks=views.map(v=>Math.round(v*(.28+r()*.1)));
    sources=[["Instagram",412],["WhatsApp",268],["Google",190],["TikTok",143],["Direto",96],["YouTube",41]];
    devices=[["Android",520],["iPhone",430],["Desktop",180],["Tablet",20]];
    topbtn=[["WhatsApp",100],["Instagram",45],["Catálogo",73],["Agendamento",32],["PIX",19]].sort((a,b)=>b[1]-a[1])}
  const V=views.reduce((a,b)=>a+b,0),C=clicks.reduce((a,b)=>a+b,0),cv=V?(C/V*100).toFixed(1)+"%":"0%";
  $("#kpis").innerHTML=[["Visualizações hoje",views[N-1],"+12%"],["Visualizações no período",V,"+8%"],["Cliques",C,"+15%"],["Leads",state.leads.length,"+3"],["Agendamentos",state.bookings.length,"+2"],["Conversão",cv,"+1,2 pt"]].map(([l,v,d])=>`<div class="card kpi"><span>${l}</span><b>${v}</b>${real?"":`<em>${d}</em>`}</div>`).join("");
  const W=640,H=220,pl=36,pb=24,pt=10,pr=10,mx=Math.max(...views,...clicks),max=real?Math.max(5,Math.ceil(mx/5)*5):Math.ceil(Math.max(...views)/100)*100;
  const x=i=>pl+i*(W-pl-pr)/(N-1),y=v=>H-pb-(v/max)*(H-pb-pt);
  const line=a=>a.map((v,i)=>(i?"L":"M")+x(i).toFixed(1)+" "+y(v).toFixed(1)).join(" ");
  const grid=[0,.25,.5,.75,1].map(f=>{const v=Math.round(max*f);return `<line x1="${pl}" x2="${W-pr}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)"/><text x="${pl-6}" y="${y(v)+4}" text-anchor="end" font-size="11" fill="var(--muted)">${v}</text>`}).join("");
  const days=[0,Math.round((N-1)/3),Math.round(2*(N-1)/3),N-1].map(i=>`<text x="${x(i)}" y="${H-6}" text-anchor="middle" font-size="11" fill="var(--muted)">-${N-1-i}d</text>`).join("");
  $("#chart").innerHTML=`<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Visitas e cliques por dia">${grid}${days}<path d="${line(views)} L${x(N-1)} ${y(0)} L${x(0)} ${y(0)}Z" fill="var(--accent)" opacity=".12"/><path d="${line(views)}" fill="none" stroke="var(--accent)" stroke-width="2.5"/><path d="${line(clicks)}" fill="none" stroke="var(--warn)" stroke-width="2.5" stroke-dasharray="5 4"/><circle cx="${x(N-1)}" cy="${y(views[N-1])}" r="4" fill="var(--accent)"/><circle cx="${x(N-1)}" cy="${y(clicks[N-1])}" r="4" fill="var(--warn)"/></svg><div class="note" style="display:flex;gap:16px"><span style="color:var(--accent)">━ Visitas</span><span style="color:var(--warn)">╍ Cliques</span></div>`;
  const bars=(id,rows)=>{if(!rows.length){$(id).innerHTML=`<p class="note">Sem dados ainda. Aparece quando o site receber visitas.</p>`;return}const m=Math.max(...rows.map(r=>r[1]));$(id).innerHTML=rows.map(([n,v])=>`<div class="bar"><span>${esc(n)}</span><div><i style="width:${v/m*100}%"></i></div><span>${v}</span></div>`).join("")};
  bars("#sources",sources);bars("#devices",devices);bars("#topbtn",topbtn);
  $("#conv").innerHTML=`<p style="margin:0 0 6px"><b style="font:800 32px "Plus Jakarta Sans",sans-serif">${cv}</b></p><p class="note" style="margin:0">${V} visitantes, ${C} cliques em algum botão.${real?"":" Em breve: escolher quais ações contam como conversão."}</p>`}
const emptyRow=(n,t)=>`<tr><td colspan="${n}" class="note" style="padding:18px">${t}</td></tr>`;
function renderLeads(){$("#leadRows").innerHTML=!state.leads.length&&state.remoteSiteId>0?emptyRow(6,"Nenhum lead ainda. Quando alguém preencher um formulário do seu site, aparece aqui."):state.leads.map(l=>`<tr><td>${esc(l.d)}</td><td>${esc(l.n)}</td><td>${esc(l.c)}</td><td><span class="tag">${esc(l.o)}</span></td><td>${esc(l.dev)}</td><td>${esc(l.b)}</td></tr>`).join("")}
function renderBookings(){
  const s=[...state.bookings].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  $("#bkRows").innerHTML=!s.length&&state.remoteSiteId>0?emptyRow(5,"Nenhum agendamento ainda."):s.map(b=>`<tr><td>${b.date.split("-").reverse().join("/")}</td><td>${b.time}</td><td>${esc(b.svc)}</td><td>${esc(b.who)}</td><td><span class="pill ${b.st==="Pendente"?"warn":""}">${b.st}</span></td></tr>`).join("");
  const svc=$("#bkSvc").value||Object.keys(SERVICES)[0];const sl=slotsFor($("#bkDate").value,SERVICES[svc]);
  $("#bkSlots").innerHTML=sl.map(t=>`<button type="button" class="btn sm">${t}</button>`).join("")||`<span class="note">${$("#bkDate").value?"Sem horários neste dia.":"Escolha uma data."}</span>`}


