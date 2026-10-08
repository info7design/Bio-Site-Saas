/* ───────── modelos no estilo cartão digital / bio (inspirados em referências) ───────── */
const NC=(o)=>Object.assign({headline:"",sub:"",badge:""},o); // capa sem texto
const P2=(a)=>TPL.push(...a);
P2([
X("Clínica em ondas","Cartão digital",2,"Clínica Sorriso","clinicasorriso","Capa com onda, foto sobreposta e grade de ícones circulares com dica \"toque nos ícones\".",
 T({bg:"#a9b1e4",text:"#ffffff",muted:"#eef0ff",primary:"#5b63c9",secondary:"#c5cbf0",btnBg:"#ffffff",btnText:"#5b63c9",font:F.pop,hf:F.pop,radius:20,profile:"row",avRing:"double",avSize:96}),()=>[
 pg("Início",[CV(NC({img:"person:lavanda:301",shape:"wave",height:"m",overlay:0})),PF({lift:58,avatar:"person:mar:302",name:"Dr. Alfredo Torres",handle:"",verified:false,headline:"Ortodontia · Implantes",bio:"",location:""}),PHONE_IG({fill:"outline",shape:"circle",cols:3,size:"m"})])]),
X("Aula em destaque","Criadores",2,"Fit com Bia","fitcombia","Foto em tela cheia, título gigante e botões coloridos em pílula.",
 T({bg:"#1a0e17",text:"#ffffff",muted:"#f1d6ea",primary:"#ff5ec4",secondary:"#2a1826",btnBg:"#ff5ec4",btnText:"#ffffff",font:F.pop,hf:F.anton,radius:30,btnStyle:"pill",bgMode:"image",bgImg:"person:magenta:303",bgOv:50,btnAlign:"center",btnCase:"upper"}),()=>[
 pg("Início",[HL("HELLO\nFRIEND!",{size:"xl",upper:true,tight:true,font:"Anton (impacto)",align:"center"}),TX("","Obrigada por estar aqui. Siga os links para reservar uma aula ou aproveitar os conteúdos gratuitos."),BT(B("Reservar aula","",{size:"l",bg:"#ff5ec4",fg:"#fff"}),B("O podcast","",{size:"l",bg:"#ff7a1a",fg:"#fff"}),B("Aulas grátis","",{size:"l",bg:"#111",fg:"#fff"}),B("A loja","",{size:"l",bg:"#a33bff",fg:"#fff"}))])]),
X("Corretora elegante","Imóveis",3,"Olívia Wilson","oliviawilson","Minimalista: nome em script, botões finos em caixa alta e barra de ícones.",
 T({bg:"#f1f1f0",text:"#1b1b1b",muted:"#77746f",primary:"#1b1b1b",secondary:"#e4e2df",btnBg:"#1b1b1b",btnText:"#ffffff",font:F.dm,hf:F.cg,radius:4,btnStyle:"minimal",avSize:110,avRing:"double"}),()=>[
 pg("Início",[CV(NC({img:"art:areia:310",shape:"card",height:"m",overlay:0})),PF({lift:64,avatar:"person:areia:311",name:"",handle:"",verified:false,headline:"",bio:"",location:""}),HL("Olivia Wilson",{font:"Great Vibes (script)",size:"l",align:"center"}),LR("","CORRETORA DE IMÓVEIS","",{size:"m"}),BT(B("Sobre mim"),B("Agendar visita"),B("Imóveis à venda"),B("Contato"),B("Guia gratuito")),DK([DI("chat","Mensagem",PH1),DI("mail","E-mail","contato@exemplo.com"),DI("globe","Site")],{style:"outline"})])]),
X("Mosaico de moda","Comércio",2,"Atelier Lilás","atelierlilas","Faixas coloridas com miniatura e mosaico de coleções, sem bordas duras.",
 T({bg:"#ece9ee",text:"#3a2a3d",muted:"#7c6a80",primary:"#d5a9d9",secondary:"#e0d6e3",btnBg:"#d9b3dc",btnText:"#3a2a3d",font:F.dm,hf:F.pf,radius:14,gap:10}),()=>[
 pg("Início",[CV(NC({img:"art:rosa:312",shape:"edge",height:"m",overlay:0})),TG([TI("Loja","art:lavanda:313"),TI("Marketplace","art:rosa:314"),],{mode:"list",color:"#d9b3dc",space:6,round:"n"}),TG([TI("Novidades","art:coral:315"),TI("Promoção","art:creme:316"),TI("Galeria","art:uva:317",{span:"1x2"}),TI("Coleção","art:areia:318")],{mode:"mosaic",color:"#d9b3dc",space:6,round:"n"})].map(b=>{if(b.type==="TileGrid")b.props.items.forEach(i=>i.fg="#3a2a3d");return b}))]),
X("Creator em arco","Criadores",2,"Avery Davis","averydavis","Foto em arco num cartão creme sobre fundo bege, nome gigante e botão preto.",
 T({bg:"#efe6d8",text:"#151515",muted:"#6b6357",primary:"#151515",secondary:"#e2d6c4",btnBg:"#141414",btnText:"#ffffff",font:F.brc,hf:F.anton,radius:16,frame:"card",frameClr:"#d3c2ab",btnStyle:"pill"}),()=>[
 pg("Início",[CV(NC({img:"person:oliva:319",shape:"arch",height:"l",overlay:0})),HL("Bem-vindo à minha página",{size:"s",align:"center",font:"Bricolage Grotesque"}),HL("AVERY DAVIS",{size:"xl",upper:true,tight:true,align:"center",font:"Anton (impacto)"}),LR("","CRIADORA UGC PARA MARCAS DE BEM-ESTAR","",{}),BX({cols:2,items:[B("Vamos trabalhar"),B("Portfólio")].map((x,i)=>Object.assign(x,{bg:i?"#ff9f2e":"#b58be0",fg:"#151515",style:"pill"}))}),BT(B("AGENDAR CONVERSA","",{size:"xl",style:"solid"}))])]),
X("Designer em relevo escuro","Criadores",3,"Juliana Silva","julianasilva","Neumorfismo escuro com foto em anel dourado, botões em relevo e barra de ícones.",
 T({bg:"#1b1c1e",text:"#eae6da",muted:"#a29c8a",primary:"#d4af37",secondary:"#222426",btnBg:"#222426",btnText:"#eae6da",font:F.pop,hf:F.allura,radius:22,btnStyle:"neu",avRing:"gold",profile:"card",btnAlign:"center"}),()=>[
 pg("Início",[PF({avatar:"person:grafite:320",name:"Juliana Silva",handle:"",verified:false,headline:"DESIGNER GRÁFICA",bio:"Olá, sou a Juliana e crio marcas e peças gráficas. Clique nos botões para saber mais.",location:""}),BT(B("Sobre mim"),B("Portfólio"),B("Site"),B("Redes sociais")),HL("Contato",{font:"Allura (script)",size:"l",align:"center",color:"#d4af37"}),DK([DI("mail","E-mail","contato@exemplo.com"),DI("call","Ligar",PH1),DI("globe","Site"),DI("pin","Endereço")],{style:"neu",play:true})])]),
X("Fotógrafo em faixas","Criativos",3,"Connor Hamilton","connorhamilton","Fundo escuro, nome serifado e faixas de miniaturas com \"ver mais\".",
 T({bg:"#0e0c09",text:"#f5f0e6",muted:"#a99f8c",primary:"#e8cfae",secondary:"#1c1812",btnBg:"#e8cfae",btnText:"#0e0c09",font:F.dm,hf:F.dmsd,radius:6}),()=>[
 pg("Início",[HL("Connor\nHamilton",{size:"l",align:"left",font:"DM Serif Display"}),LR("FOTÓGRAFO","","ENSAIOS E CASAMENTOS",{}),SB([SI("Portfólio","areia",{count:6,shape:"tall"}),SI("Site","cobre",{count:6}),SI("Contato","creme",{count:6,shape:"round"})],{upper:true,thumb:"m"})])]),
X("Vidro e setas","Criadores",2,"Cláudia Alves","claudiaalves","Foto de fundo com cartão de vidro e botões em pílula com seta.",
 T({bg:"#f3e6e1",text:"#3b2a2a",muted:"#7c6461",primary:"#3b2a2a",secondary:"#f3e6e1",btnBg:"#f3e6e1",btnText:"#3b2a2a",font:F.pjs,hf:F.pjs,radius:30,btnStyle:"arrow",bgMode:"image",bgImg:"art:rosa:321",bgOv:22,profile:"card",avRing:"solid"}),()=>[
 pg("Início",[PF({avatar:"person:rosa:322",name:"Claudia Alves",handle:"",verified:false,headline:"DESIGNER GRÁFICA",bio:"",location:""}),BT(B("Site"),B("Portfólio"),B("Novo post"),B("Minha loja"),B("Contato"))])]),
X("Blogger orgânica","Criadores",2,"Niel Tran","nieltran","Formas orgânicas, título manuscrito, blocos com faixa laranja e botão marrom.",
 T({bg:"#f8efe3",text:"#2b1a10",muted:"#8a6a4a",primary:"#c98a3c",secondary:"#efdcc3",btnBg:"#2b1a10",btnText:"#f8efe3",font:F.dm,hf:F.dance,radius:28,btnStyle:"pill",pattern:"blobs",avRing:"solid"}),()=>[
 pg("Início",[PF({avatar:"person:areia:323",name:"blogger de moda",handle:"",verified:false,headline:"",bio:"",location:""}),BT(B("OLÁ, SOU A NIEL TRAN","",{size:"m"})),TX("","Confira os links abaixo para conhecer minha loja e meus conteúdos."),TG([TI("Loja","art:cobre:324"),TI("Bio","art:areia:325"),TI("Blog","art:sol:326"),TI("Vídeos","art:creme:327")],{mode:"grid",color:"#e8a23a",round:"m",space:10}),BT(B("CONTATO","",{size:"l",style:"solid",bg:"#5a3a26",fg:"#fff"}))])]),
X("Nail designer quadro","Beleza & Saúde",2,"Kimberly Nails","kimberlynails","Moldura rosa, fundo dourado suave e faixas coloridas com \"ver mais\".",
 T({bg:"#e6e1dd",text:"#3a3a2a",muted:"#7a7660",primary:"#6f7135",secondary:"#efe9e4",btnBg:"#6f7135",btnText:"#ffffff",font:F.cg,hf:F.allura,radius:10,frame:"card",frameClr:"#eba1b8",pattern:"mesh",bg2:"#e8cf8f",bg3:"#f3ded0",btnStyle:"bar",avRing:"solid",gap:10}),()=>[
 pg("Início",[PF({avatar:"person:rosa:328",name:"nail artist",handle:"",verified:false,headline:"",bio:"",location:""}),BT(B("KIMBERLY","",{bg:"#6f7135",fg:"#fff",badge:"(ver mais)"}),B("Preços","",{bg:"#b8b95a",fg:"#2b2b12",badge:"(ver mais)"}),B("Avaliações","",{bg:"#eeaab6",fg:"#4a1f2b",badge:"(ver mais)"}),B("Contato","",{bg:"#d9cfc4",fg:"#3a2f24",badge:"(ver mais)"}))])]),
X("Yoga sereno","Criadores",2,"Kara Yoga","karayoga","Foto de fundo cinza, título central e botões retangulares translúcidos.",
 T({bg:"#8b8f96",text:"#ffffff",muted:"#e6e8ec",primary:"#ffffff",secondary:"#9a9da3",btnBg:"#9a9da3",btnText:"#1e1f22",font:F.pjs,hf:F.abl,radius:8,bgMode:"image",bgImg:"person:gelo:329",bgOv:18,btnAlign:"center",btnCase:"upper"}),()=>[
 pg("Início",[HL("Olá,\neu sou a Kara!",{size:"l",align:"center",upper:false,font:"Archivo Black"}),TX("","Obrigada pela visita. Siga os links para reservar uma aula ou aproveitar os conteúdos gratuitos."),BT(B("Reservar aula"),B("O podcast"),B("Aulas grátis"),B("A loja")),DK([DI("instagram","Instagram"),DI("youtube","YouTube"),DI("mic","Podcast")],{style:"glass",play:true})])]),
X("Degradê aquarela","Criadores",2,"Samira Hadid","samirahadid","Fundo em malha de cores quentes, foto em arco e botões de vidro.",
 T({bg:"#ffe9a8",text:"#5a2a3a",muted:"#8b4a52",primary:"#ff6a88",secondary:"#ffe6b0",btnBg:"#ffffff",btnText:"#5a2a3a",font:F.dm,hf:F.pf,radius:6,btnStyle:"glass",pattern:"mesh",bg2:"#ff8fa3",bg3:"#ffb36b",avatar:"arch",avRing:"none",avSize:104,btnAlign:"center",btnCase:"upper"}),()=>[
 pg("Início",[PF({avatar:"person:sol:330",name:"",handle:"",verified:false,headline:"",bio:"",location:""}),HL("SAMIRA HADID",{size:"m",align:"center",font:"Playfair Display",upper:true}),BT(B("Sobre mim"),B("Portfólio"),B("Site"),B("Redes sociais"),B("Contato"))])]),
X("Papel artesanal","Criadores",2,"Olívia Wilson Estúdio","oliviaestudio","Foto em forma orgânica, título serifado e botões marrons em duas colunas.",
 T({bg:"#bdb9b3",text:"#3b2a1e",muted:"#6a5a4d",primary:"#553726",secondary:"#d6d1ca",btnBg:"#553726",btnText:"#f4e8dc",font:F.dm,hf:F.cg,radius:8,btnStyle:"solid"}),()=>[
 pg("Início",[CV(NC({img:"person:areia:331",shape:"blob",height:"l",overlay:0})),HL("Olivia Wilson",{size:"l",align:"center",font:"Cormorant Garamond"}),BX({cols:2,items:[B("Site"),B("Portfólio"),B("Sobre nós"),B("Social"),B("Depoimentos"),B("Loja")]})])]),
X("Lista colorida","Criadores",1,"Samira Costa","samiracosta","Barra roxa e botões com quadrado de ícone colorido, fáceis de reconhecer.",
 T({bg:"#ffffff",text:"#111111",muted:"#666666",primary:"#4b0aa8",secondary:"#f2f2f2",btnBg:"#4b0aa8",btnText:"#ffffff",font:F.pop,hf:F.pop,radius:14,btnStyle:"tile",profile:"row",avRing:"none"}),()=>[
 pg("Início",[PF({avatar:"person:vinho:332",name:"Olá, eu sou a Samira",handle:"",verified:false,headline:"",bio:"",location:""}),CV(NC({media:"none",shape:"edge",height:"xs",overlay:0})),BT(B("Podcast","",{icon:"mic",bg:"#d6338a",fg:"#fff"}),B("Álbum","",{icon:"music",bg:"#4b0aa8",fg:"#fff"}),B("Arte","",{icon:"palette",bg:"#d6338a",fg:"#fff"}),B("Mídia","",{icon:"play",bg:"#ff5500",fg:"#fff"}))])]),
X("Brutalista P&B","Criadores",3,"Kyrie Petrakis","kyriepetrakis","Preto, branco e laranja, tipografia condensada gigante e botões em bloco.",
 T({bg:"#0b0b0b",text:"#ffffff",muted:"#b5b5b5",primary:"#e8501a",secondary:"#1c1c1c",btnBg:"#ffffff",btnText:"#0b0b0b",font:F.brc,hf:F.anton,radius:0,btnStyle:"block",gap:8,cardStyle:"flat"}),()=>[
 pg("Início",[LR("CRIADOR UGC","","PARA MARCAS DE BEM-ESTAR"),HL("KYRIE\nPETRAKIS",{size:"xxl",upper:true,tight:true,align:"center",font:"Anton (impacto)"}),LR("INFLUENCIADOR DE ESTILO DE VIDA","","CRIADOR DE CONTEÚDO"),BX({cols:2,join:true,items:[B("AGENDAR CONVERSA","",{bg:"#ffffff",fg:"#0b0b0b"}),B("BLOG","",{bg:"#1c1c1c",fg:"#fff"}),B("SOBRE MIM","",{bg:"#1c1c1c",fg:"#fff"}),B("PORTFÓLIO","",{bg:"#e8501a",fg:"#fff"})]}),TX("","Estamos abertos a parcerias e colaborações com marcas e organizações."),LR("@SEUSITE","","+55 11 90000-0000"),CV(NC({img:"person:terra:333",shape:"card",height:"l",overlay:0}))])]),
X("Pílulas vibrantes","Criadores",2,"Avery Costa","averycosta","Azul royal, quatro pílulas de cores diferentes e foto em cartão com nome serifado.",
 T({bg:"#1c46d6",text:"#ffffff",muted:"#cfdcff",primary:"#ffd23f",secondary:"#2f5bea",btnBg:"#f04a2b",btnText:"#ffffff",font:F.brc,hf:F.dmsd,radius:30,btnStyle:"pill",btnAlign:"center",btnCase:"upper"}),()=>[
 pg("Início",[LR("CRIADORA UGC","","INFLUENCER DE ESTILO DE VIDA"),BX({cols:2,items:[B("Agendar","",{bg:"#f04a2b",fg:"#fff"}),B("Sobre","",{bg:"#8e2fc9",fg:"#fff"}),B("Blog","",{bg:"#1a7f3c",fg:"#fff"}),B("Portfólio","",{bg:"#ec3d3d",fg:"#fff"})]}),CV(NC({img:"person:terra:334",shape:"card",height:"l",overlay:0})),HL("Avery Costa",{size:"xl",align:"center",font:"DM Serif Display"}),LR("","@SEUSITE","")])]),
X("Onda azul freelancer","Cartão digital",2,"Adora Montminy","adoramontminy","Branco com cantos em diagonal azul, botões em degradê e contato em cápsula.",
 T({bg:"#ffffff",text:"#152033",muted:"#5c6b85",primary:"#1e8cff",secondary:"#9bd5ff",btnBg:"#2a5bff",btnText:"#ffffff",font:F.pop,hf:F.pop,radius:12,btnStyle:"gradient",pattern:"diag",btnAlign:"center",btnCase:"upper",avRing:"none"}),()=>[
 pg("Início",[PF({avatar:"person:mar:335",name:"ADORA MONTMINY",handle:"",verified:false,headline:"Freelancer",bio:"",location:""}),BT(B("Sobre mim"),B("Portfólio"),B("Site"),B("Avaliações")),DK([DI("call","Ligar",PH1),DI("mail","E-mail","contato@exemplo.com"),DI("globe","Site")],{style:"outline"})])]),
X("Pop magenta","Criadores",3,"Matt Zhang","mattzhang","Magenta com verde-limão, faixas coladas e tipografia enorme.",
 T({bg:"#b312a8",text:"#ffffff",muted:"#f6c8f2",primary:"#c6f432",secondary:"#d13bc6",btnBg:"#e83fd6",btnText:"#ffffff",font:F.brc,hf:F.anton,radius:0,btnStyle:"block",gap:0,cardStyle:"flat"}),()=>[
 pg("Início",[LR("INFLUENCER DE ESTILO DE VIDA","","BEM-ESTAR"),HL("MATT\nZHANG",{size:"xxl",upper:true,tight:true,align:"center",font:"Anton (impacto)"}),BX({join:true,items:[B("SOBRE MIM","",{icon:"user",bg:"#e83fd6",fg:"#fff"}),B("AGENDAR CONVERSA","",{icon:"chat",bg:"#7a1fa8",fg:"#fff"}),B("BLOG","",{bg:"#b312a8",fg:"#fff"}),B("PORTFÓLIO","",{bg:"#c6f432",fg:"#1a0533",size:"xl"})]}),TX("","Aberto a parcerias com marcas e organizações.")])]),
X("Terra e bege","Criadores",2,"Naomora","naomora","Marrom terroso, foto em forma orgânica e pílulas bege centralizadas.",
 T({bg:"#5b3f2c",text:"#f6ecdf",muted:"#d2b9a1",primary:"#e8cfae",secondary:"#7a5640",btnBg:"#ecd9c0",btnText:"#3a2415",font:F.dm,hf:F.cg,radius:26,btnStyle:"pill",pattern:"blobs",btnAlign:"center"}),()=>[
 pg("Início",[HL("NAOMORA",{size:"m",align:"center",font:"Cormorant Garamond",upper:true}),CV(NC({img:"person:areia:336",shape:"blob",height:"m",overlay:0})),BT(B("Minhas redes"),B("Meu blog"),B("Minha loja"),B("Meu contato"))])]),
X("Serviço 24 horas","Cartão digital",2,"Guincho Vargas 24h","guinchovargas","Preto texturizado com vermelho, botão gigante de chamada e ícones em quadrado.",
 T({bg:"#131313",text:"#ffffff",muted:"#c9c9c9",primary:"#e11d1d",secondary:"#1f1f1f",btnBg:"#e11d1d",btnText:"#ffffff",font:F.brc,hf:F.anton,radius:10,btnStyle:"solid",pattern:"hex",btnAlign:"center",btnCase:"upper"}),()=>[
 pg("Início",[HL("GUINCHO 24H",{size:"l",upper:true,align:"center",font:"Anton (impacto)"}),LR("","ATENDIMENTO EM TODA A REGIÃO","",{align:"center"}),BT(B("CHAMAR AGORA","Toque aqui",{size:"xl",icon:"truck",anim:"pulse"})),CV(NC({img:"art:brasa:337",shape:"card",height:"s",overlay:20})),IG([IT("whatsapp","WhatsApp",PH1),IT("instagram","Instagram"),IT("facebook","Facebook")],{fill:"solid",shape:"square",cols:3,size:"m"})])]),
X("Engenharia diagonal","Cartão digital",3,"Albuquerque Engenharia","albuquerqueeng","Diagonais escuras nos cantos, foto central e botões cinza com ícone.",
 T({bg:"#f4f4f4",text:"#1a1a1a",muted:"#666666",primary:"#111111",secondary:"#d4d4d4",btnBg:"#dcdcdc",btnText:"#1a1a1a",font:F.dm,hf:F.cin,radius:14,btnStyle:"soft",pattern:"diag"}),()=>[
 pg("Início",[HL("ALBUQUERQUE",{size:"m",align:"center",font:"Cinzel",upper:true}),LR("","ENGENHARIA E CONSTRUÇÃO","",{}),CV(NC({img:"art:areia:338",shape:"card",height:"m",overlay:0})),LR("CONSTRUÇÃO CIVIL","","PROJETOS"),BX({cols:2,items:[B("Simulação","Clique aqui",{icon:"calc"}),B("Orçamento","Clique aqui",{icon:"doc"})]}),PHONE_IG({fill:"soft",shape:"round",cols:3,size:"s"})])]),
X("Preto e ouro","Cartão digital",3,"Ana Morais","anamorais","Fundo preto, foto com anel dourado e botões metálicos em caixa alta.",
 T({bg:"#0b0b0b",text:"#f4ecd6",muted:"#b9ab80",primary:"#d4af37",secondary:"#1a1810",btnBg:"#d4af37",btnText:"#1a1400",font:F.dm,hf:F.cin,radius:6,btnStyle:"gold",avRing:"gold",pattern:"hex",avSize:110}),()=>[
 pg("Início",[PF({avatar:"person:ouro:339",name:"ANA MORAIS",handle:"",verified:false,headline:"SOCIAL MEDIA",bio:"",location:""}),BT(B("Portfólio"),B("Orçamento"),B("Contato"),B("E-mail"))])]),
X("Advocacia geométrica","Cartão digital",3,"Juliana Silva Advocacia","julianaadv","Vinho com geometria fina, áreas de atuação em cartão rosé e ícones quadrados.",
 T({bg:"#4d1229",text:"#f1d9d6",muted:"#d1a9a6",primary:"#d19a94",secondary:"#a86a6d",btnBg:"#f1d9d6",btnText:"#4d1229",font:F.dm,hf:F.cg,radius:4,btnStyle:"minimal",pattern:"geo"}),()=>[
 pg("Início",[HL("JULIANA SILVA",{size:"l",align:"center",font:"Cormorant Garamond",upper:true}),LR("","ADVOCACIA E CONSULTORIA JURÍDICA","",{}),LR("","REGISTRO OAB 000000","",{}),TX("Áreas de atuação","Direito da saúde · Direito do consumidor"),IG([IT("call","Chamada",PH1),IT("whatsapp","WhatsApp",PH1),IT("mail","E-mail","contato@exemplo.com"),IT("instagram","Instagram")],{fill:"solid",shape:"square",cols:4,size:"s",hint:"Toque nos ícones"})])]),
X("Varejo laranja","Cartão digital",2,"Móveis Bom Lar","moveisbomlar","Laranja vibrante, capa em onda e seis ícones brancos arredondados.",
 T({bg:"#f1791f",text:"#ffffff",muted:"#ffe3cc",primary:"#ffffff",secondary:"#f79a52",btnBg:"#ffffff",btnText:"#f1791f",font:F.pop,hf:F.pop,radius:20,btnStyle:"solid"}),()=>[
 pg("Início",[CV({img:"art:areia:340",shape:"wave",height:"m",overlay:25,headline:"Tudo para o seu lar!",fx:"none",sub:"",badge:"",align:"left"}),IG([IT("call","Telefone",PH1),IT("whatsapp","WhatsApp",PH1),IT("mail","E-mail","contato@exemplo.com"),IT("pin","Endereço","https://maps.google.com"),IT("instagram","Instagram"),IT("facebook","Facebook")],{fill:"solid",shape:"round",cols:3,size:"m",hint:"Toque nos ícones"})])]),
X("Campanha promocional","Comércio",2,"Loja Presente","lojapresente","Rosa forte, título grande e foto; ideal para datas como Dia dos Namorados.",
 T({bg:"#cf3a7b",text:"#ffffff",muted:"#ffd6e8",primary:"#ffffff",secondary:"#e0629a",btnBg:"#ffffff",btnText:"#cf3a7b",font:F.pop,hf:F.pop,radius:30,btnStyle:"outline"}),()=>[
 pg("Início",[HL("Presenteie quem você mais ama!",{size:"l",align:"left",font:"Poppins"}),TX("","O seu Dia dos Namorados é aqui! Confira as ofertas."),CV(NC({img:"person:coral:341",shape:"card",height:"l",overlay:0})),BT(B("Link na bio","",{size:"l",style:"outline",icon:"gift"}))])]),
X("Brunch e menu do dia","Alimentação",2,"Brunch da Praça","brunchdapraca","Laranja quente, botões brancos retos e cardápio com pedido no WhatsApp.",
 T({bg:"#e9603f",text:"#ffffff",muted:"#ffe0d6",primary:"#ffffff",secondary:"#f07d5f",btnBg:"#ffffff",btnText:"#2b1a10",font:F.dm,hf:F.anton,radius:4,btnStyle:"solid",btnAlign:"center",btnCase:"upper"}),()=>[
 pg("Início",[CV({img:"art:cobre:342",shape:"edge",height:"s",overlay:45,headline:"BRUNCH DE DOMINGO",fx:"none",sub:"Pão de fermentação natural, cheesecake e muito mais!",badge:"",align:"center"}),BT(B("Cardápio"),B("Especiais da semana"),B("Assistir vídeo"),B("Depoimentos"),B("Como pedir"))]),
 pg("Cardápio",[MN("Monte seu pedido","Brunch da Praça",PH1,[M("Brunch","Brunch clássico","Pão, ovos, frutas e café",4200,"art:cobre:343","popular"),M("Brunch","Cheesecake de frutas vermelhas","",1800,"art:rosa:344"),M("Bebidas","Suco natural","300 ml",900,"")],{fee:500})])]),
X("Janela retrô","Criadores",1,"Rosana Aparecida","rosanaaparecida","Fundo rosa claro e botões com contorno grosso e sombra dura, no clima retrô.",
 T({bg:"#fde3ee",text:"#2b2b7a",muted:"#6a6ab0",primary:"#2b2b7a",secondary:"#e6e0ff",btnBg:"#ffffff",btnText:"#2b2b7a",font:F.sg,hf:F.sg,radius:6,btnStyle:"brutal",btnAlign:"center",btnCase:"upper",avRing:"solid"}),()=>[
 pg("Início",[PF({avatar:"person:lavanda:345",name:"ROSANA APARECIDA",handle:"",verified:false,headline:"",bio:"",location:""}),BT(B("Sobre mim"),B("Serviços"),B("Orçamento"),B("Cursos"),B("Contato"))])]),
X("Advogada rosé","Serviços",2,"Diane Santos","dianesantos","Malva com zigue-zague suave, nome em caixa alta e ícones circulares.",
 T({bg:"#b79a97",text:"#ffffff",muted:"#f4e6e4",primary:"#ffffff",secondary:"#c9b0ad",btnBg:"#ffffff",btnText:"#5a3a38",font:F.dm,hf:F.cg,radius:4,btnStyle:"minimal",pattern:"chevron"}),()=>[
 pg("Início",[HL("DIANE SANTOS",{size:"m",align:"center",font:"Cormorant Garamond",upper:true}),LR("","ADVOGADA","",{size:"m"}),LR("","DIREITO DAS FAMÍLIAS E SUCESSÕES","",{}),IG([IT("chat","Mensagem",PH1),IT("call","Chamada",PH1),IT("mail","E-mail","contato@exemplo.com"),IT("instagram","Rede social"),IT("globe","Site")],{fill:"outline",shape:"circle",cols:3,size:"s"})])]),
X("Designer em script","Criadores",2,"Estelle Darcy","estelledarcy","Assinatura em script grande, foto em forma orgânica e texto curto de apresentação.",
 T({bg:"#f5f3ee",text:"#1f1f1f",muted:"#77746f",primary:"#1f1f1f",secondary:"#e7e3da",btnBg:"#1f1f1f",btnText:"#f5f3ee",font:F.dm,hf:F.gv,radius:14,btnStyle:"minimal"}),()=>[
 pg("Início",[HL("Estelle Darcy",{size:"xl",align:"center",font:"Great Vibes (script)"}),CV(NC({img:"person:gelo:346",shape:"blob",height:"m",overlay:0})),LR("DESIGNER GRÁFICA","","EQUIPE CRIATIVA"),TX("","Trabalho com imagens e identidade visual para marcas que querem ser lembradas. Vamos conversar sobre o seu projeto?"),BT(B("Portfólio"),B("Contato")),LR("","@SEUSITE","")])]),
X("Terracota geométrico","Criadores",2,"Nádia Sales","nadiasales","Creme com anéis terracota, foto no topo e botões finos com letras espaçadas.",
 T({bg:"#f6eee5",text:"#4a2c22",muted:"#8a6a5c",primary:"#c9694a",secondary:"#ecd9c8",btnBg:"#4a2c22",btnText:"#f6eee5",font:F.dm,hf:F.allura,radius:2,btnStyle:"minimal",pattern:"rings"}),()=>[
 pg("Início",[CV(NC({img:"person:cobre:347",shape:"edge",height:"m",overlay:0})),LR("","NÃO TENHA MEDO DE FALHAR.","",{size:"m"}),BT(B("Portfólio"),B("Contatos"),B("Grupo VIP"),B("Blog")),HL("NS",{size:"l",align:"center",font:"Allura (script)"})])])
]);

/* ───────── v7 · editorial de luxo (estilo "link na bio" premium) ───────── */
const editT=(o)=>T(Object.assign({bg:"#0c0b0a",text:"#f3ead9",muted:"#c9b48f",primary:"#e8c992",secondary:"#171412",btnBg:"#171412",btnText:"#f3ead9",btnStyle:"glass",cardStyle:"soft",radius:22,frame:"none",avRing:"gold",avSize:118,hf:F.cg,font:F.dm,gap:14,pattern:"none",profile:"center"},o));
P2([
X("Editorial dourado","Criadores",3,"Estelle Duarte","estelleduarte","Capa em retrato, boas-vindas em script e cartões escuros com foto, no estilo revista de luxo.",
 editT({}),()=>[
 pg("Início",[
  CV({img:"person:vinho:401",shape:"edge",align:"left",height:"l",overlay:60,headline:"*Bem-vindo(a)*",fx:"mark",sub:"",badge:""}),
  HL("Página de Link na Bio",{size:"m",align:"left",font:"DM Sans",upper:false}),
  TX("","Olá, seja bem-vindo(a).\nAqui você encontra os links de **serviços e cursos** que ofereço.","none"),
  LR("MEUS","LINKS","",{size:"s"}),
  mk("ServiceBlock",{title:"",phone:PH1,items:[
    S("Curso online",0,0,"Clique aqui","person:vinho:402"),
    S("Curso presencial",0,0,"Clique aqui","person:brasa:403"),
    S("Mentoria 1:1",0,0,"Quero saber mais","person:cobre:404"),
    S("E-book gratuito",0,0,"Baixar agora","person:vinho:405")]}),
  PF({avatar:"person:vinho:401",name:"Estelle Duarte",handle:"@estelleduarte",verified:true,headline:"Especialista em Harmonização Facial",bio:"Cursos, mentorias e atendimento presencial.",location:"São Paulo, SP"}),
  SO("Instagram","TikTok","WhatsApp","YouTube"),
  mk("DividerBlock",{style:"line"}),
  LR("","© 2026 · todos os direitos reservados","")])]),

X("Retrato dourado","Criadores",3,"Marina Costa","marinacosta","Perfil grande no topo, botões em vidro escuro e depoimentos, para consultoras e mentoras.",
 editT({avatar:"arch",profile:"card"}),()=>[
 pg("Início",[
  PF({avatar:"ai:executiva",name:"Marina Costa",handle:"@marinacosta",verified:true,headline:"Consultoria de Imagem & Estilo",bio:"Ajudo você a construir uma imagem autêntica e confiante.",location:"Rio de Janeiro, RJ"}),
  HL("*Seja bem-vinda* à sua transformação",{size:"l",align:"center",font:"Cormorant Garamond"}),
  BT(B("Agendar consultoria",""),B("Ver meu portfólio",""),B("Grupo VIP no WhatsApp","")),
  mk("CardsBlock",{title:"Serviços",cols:2,items:[
    C("Consultoria completa","Análise de estilo e coloração pessoal.","person:cobre:411",{span:"2x1",cta:"Saiba mais"}),
    C("Personal shopper","Acompanhamento em compras.","person:vinho:412",{span:"1x1",cta:"Ver mais"}),
    C("Curso online","Módulos gravados, no seu ritmo.","person:brasa:413",{span:"1x1",cta:"Ver mais"})]}),
  TS(["Camila R.","Atendimento impecável, mudou minha forma de me vestir."],["Bruna A.","Profissional e atenciosa do início ao fim."]),
  SO("Instagram","WhatsApp","Pinterest"),
  mk("DividerBlock",{style:"line"})])]),

X("Boutique noturna","Beleza & Saúde",3,"Studio Noir","studionoir",
 "Fundo preto absoluto, capa em arco e catálogo de serviços com fotos, para clínicas de estética e estúdios de beleza.",
 editT({bg:"#050505",secondary:"#121012",btnStyle:"gold",pattern:"glow"}),()=>[
 pg("Início",[
  CV({img:"person:magenta:420",shape:"arch",align:"center",height:"l",overlay:65,headline:"Studio *Noir*",fx:"words",sub:"Estética avançada e bem-estar",badge:"Agenda aberta"}),
  LR("SEG A SÁB","10H ÀS 20H","AGENDE ONLINE"),
  mk("ServiceBlock",{title:"Procedimentos",phone:PH1,items:[
    S("Limpeza de pele profunda",8000,0,"Agendar","person:magenta:421"),
    S("Massagem modeladora",12000,0,"Agendar","person:vinho:422"),
    S("Design de sobrancelhas",6000,0,"Agendar","person:cobre:423")]}),
  IG([IT("chat","WhatsApp",PH1),IT("instagram","Instagram"),IT("pin","Como chegar"),IT("cal","Agenda")],{cols:4,shape:"circle",fill:"gold"}),
  SO("Instagram","WhatsApp","Google"),
  mk("DividerBlock",{style:"line"})])]),

X("Mentoria autoral","Serviços",3,"Renata Prado","renataprado",
 "Capa cheia com nome em script, faixa de conquistas e cartões escuros para infoprodutores e mentores.",
 editT({hf:F.gv,btnStyle:"outline"}),()=>[
 pg("Início",[
  CV({img:"person:oliva:430",shape:"card",align:"left",height:"xl",overlay:58,headline:"Renata Prado",fx:"none",sub:"Mentora de carreira e negócios",badge:""}),
  LR("+500 alunas","4.9 de avaliação","3 anos de mentoria"),
  BT(B("Quero ser mentorada",""),B("Baixar e-book grátis",""),B("Assistir masterclass","")),
  mk("CardsBlock",{title:"Programas",cols:2,items:[
    C("Mentoria individual","3 meses de acompanhamento próximo.","person:oliva:431",{span:"2x1",cta:"Saber mais"}),
    C("Curso self-paced","Estude no seu ritmo, com suporte.","person:cobre:432",{span:"1x1",cta:"Ver curso"}),
    C("Comunidade VIP","Grupo fechado com encontros mensais.","person:vinho:433",{span:"1x1",cta:"Entrar"})]}),
  TS(["Paula M.","Em 3 meses mudei de área com a mentoria dela."],["Luiza F.","Direta, prática e humana."]),
  SO("Instagram","YouTube","LinkedIn"),
  mk("DividerBlock",{style:"line"})])])
]);

/* ───────── cantores e artistas: do descolado ao sério ───────── */
P2([
X("MC do bairro","Música",1,"MC Dan7","mcdan7",
 "Preto com verde-limão, tipografia de impacto e foco no single novo e nos shows.",
 Object.assign(tk("neon"),{bg:"#0a0a0a",secondary:"#181818",primary:"#c6f432",btnBg:"#c6f432",btnText:"#0a0a0a",btnStyle:"block",radius:2,font:F.brc,hf:F.anton,pattern:"grid",profile:"row",gap:12}),()=>[
 pg("Início",[
  CV({img:"art:neon:500",shape:"edge",height:"l",overlay:62,headline:"Single novo *NA VEIA* já tá tocando",fx:"type",sub:"Batida pesada, letra de rua.",badge:"Lançamento"}),
  PF({avatar:"ai:musico",name:"MC Dan7",handle:"@mcdan7",verified:true,headline:"Funk / Trap · Zona Leste, SP",bio:"De casa pro topo das paradas.",location:"São Paulo, SP"}),
  BT(B("Ouvir no Spotify","Single novo",{badge:"novo",anim:"pulse"}),B("Assistir o clipe","YouTube"),B("Chamar pra evento","")),
  SO("Instagram","TikTok","Spotify","YouTube")]),
 pg("Agenda",[
  LR("40+ shows/ano","1.2M streams","12 cidades"),
  mk("CardsBlock",{title:"Próximos shows",cols:2,items:[
   C("Rio de Janeiro","Sáb · 22h · Casa Preta","art:brasa:502",{span:"2x1",badge:"ingressos",cta:"Garantir"}),
   C("Curitiba","","art:mata:503",{cta:"Ver"}),
   C("Belo Horizonte","","art:vinho:504",{cta:"Ver"})]}),
  wa("Contratar pra evento",PH1,"Fala! Quero contratar o MC Dan7 pro meu evento."),
  mk("DividerBlock",{style:"line"})])]),

X("Popstar em turnê","Música",2,"Lua Nunes","luanunes",
 "Rosa e amarelo vibrantes, stories de bastidores e agenda de turnê com fã-clube.",
 Object.assign(tk("magenta"),{bg:"#ff2e9a",text:"#ffffff",secondary:"#ffd93d",primary:"#2ee6d6",btnBg:"#ffffff",btnText:"#ff2e9a",btnStyle:"pill",radius:30,pattern:"mesh",font:F.pop,hf:F.unb,profile:"center"}),()=>[
 pg("Início",[
  CV({img:"art:magenta:510",shape:"arch",align:"center",height:"l",overlay:35,headline:"Turnê *Coração Neon* 2026",fx:"words",sub:"12 cidades · ingressos à venda",badge:"Turnê nova"}),
  mk("StoryBlock",{shape:"circle",items:[ST("Bastidores","art:magenta:511","Ensaio geral da turnê."),ST("Clipe novo","art:royal:512","Assista agora","Assistir"),ST("Loja oficial","art:sol:513","Camisetas e vinil da turnê.")]}),
  BT(B("Ouvir álbum completo","Spotify e Apple Music",{badge:"novo",anim:"shine"}),B("Ingressos da turnê",""),B("Entrar no fã-clube","")),
  SO("Instagram","TikTok","Spotify","YouTube")]),
 pg("Turnê",[
  mk("CardsBlock",{title:"Próximas datas",cols:2,items:[
   C("São Paulo","Arena Sul · 20h","art:magenta:514",{span:"2x1",badge:"quase esgotado",cta:"Comprar"}),
   C("Recife","","art:sol:515",{cta:"Comprar"}),
   C("Porto Alegre","","art:royal:516",{cta:"Comprar"})]}),
  mk("LeadFormBlock",{title:"Entrar no fã-clube",button:"Quero entrar",note:"Novidades e pré-venda em primeira mão."}),
  mk("DividerBlock",{style:"line"})])]),

X("Banda indie","Música",2,"Garotos de Vinil","garotosdevinil",
 "Tons terrosos, fotografia granulada e tipografia de máquina de escrever para banda autoral.",
 Object.assign(tk("terra"),{bg:"#3a2c22",text:"#f3e9da",secondary:"#4d3c2e",primary:"#e8cfae",btnBg:"#f3e9da",btnText:"#3a2c22",btnStyle:"outline",radius:2,font:F.bar,hf:F.lora,pattern:"none",profile:"left"}),()=>[
 pg("Início",[
  CV({img:"art:terra:520",shape:"edge",align:"left",height:"l",overlay:55,headline:"Garotos de Vinil",fx:"rise",sub:"EP *Estação* já disponível em todas as plataformas.",badge:""}),
  TX("Sobre a banda","Quatro amigos, um estúdio de garagem e canções sobre o dia a dia. Rock e MPB com um pé no lo-fi.",""),
  BT(B("Ouvir o EP","Spotify",{badge:"novo"}),B("Letras e cifras",""),B("Ver próximos shows","")),
  mk("GalleryBlock",{count:6,pal:"terra"})]),
 pg("Imprensa",[
  TS(["Rolling Stone BR","Uma das revelações mais honestas do indie nacional este ano."],["Scenario Cultural","Letras que ficam na cabeça e um som que respira."]),
  SO("Instagram","YouTube","Spotify"),
  wa("Contratar pra evento",PH1,"Olá! Gostaria de contratar a banda para um evento."),
  mk("DividerBlock",{style:"line"})])]),

X("DJ set eletrônico","Música",2,"DJ Nyx","djnyx",
 "Grade neon sobre fundo escuro, estatísticas de carreira e reserva de datas para casas e festivais.",
 Object.assign(tk("neon"),{bg:"#07070f",secondary:"#12122a",primary:"#00e0c6",btnBg:"#00e0c6",btnText:"#07070f",btnStyle:"glass",radius:14,font:F.sg,hf:F.sg,pattern:"grid",profile:"center"}),()=>[
 pg("Início",[
  CV({img:"art:neon:530",shape:"card",align:"center",height:"l",overlay:60,headline:"DJ NYX",fx:"type",sub:"Techno e house para pistas que não param.",badge:"Sets mensais"}),
  LR("+180 sets","30 cidades","4 países"),
  BT(B("Ouvir sets no Spotify","",{anim:"pulse"}),B("Assistir ao vivo","Último set gravado"),B("Reservar para evento","")),
  mk("VideoBlock",{title:"Set ao vivo · Warehouse 2026",poster:"art:neon:531"}),
  SO("Instagram","TikTok","Spotify","YouTube")]),
 pg("Contato",[
  wa("Falar sobre uma data",PH1,"Olá! Quero reservar a DJ Nyx para um evento."),
  mk("LeadFormBlock",{title:"Pedido de booking",button:"Enviar pedido",note:"Responder em até 48h."}),
  mk("DividerBlock",{style:"line"})])]),

X("Cantora autoral MPB","Música",3,"Iara Bastos","iarabastos",
 "Editorial em tons terracota, retrato em destaque e agenda de shows para cantora e compositora.",
 Object.assign(tk("areia"),{bg:"#f6ede1","text":"#3a2416",secondary:"#ecdcc4",primary:"#a3622b",btnBg:"#3a2416",btnText:"#f6ede1",btnStyle:"outline",radius:10,font:F.dm,hf:F.fr,pattern:"none",profile:"left"}),()=>[
 pg("Início",[
  CV({img:"person:areia:540",shape:"edge",align:"left",height:"xl",overlay:38,headline:"Iara Bastos",fx:"none",sub:"Cantora e compositora",badge:"Álbum *Sertão e Mar* já disponível"}),
  TX("Sobre","Iara mistura MPB, jazz e ritmos nordestinos em canções sobre memória e pertencimento.",""),
  BT(B("Ouvir o álbum novo","Spotify e Apple Music",{badge:"novo"}),B("Ver agenda de shows",""),B("Assistir sessão acústica","")),
  mk("CardsBlock",{title:"Discografia",cols:2,items:[
   C("Sertão e Mar","Álbum, 2026","person:areia:541",{span:"2x1",badge:"novo",cta:"Ouvir"}),
   C("Raiz","EP, 2024","person:terra:542",{cta:"Ouvir"}),
   C("Ao vivo no Sesc","Registro, 2023","person:oliva:543",{cta:"Ouvir"})]})]),
 pg("Agenda",[
  mk("CardsBlock",{title:"Próximos shows",cols:2,items:[
   C("Sesc Pompeia, São Paulo","Sex · 21h","person:areia:544",{span:"2x1",cta:"Ingressos"}),
   C("Teatro Rival, Rio de Janeiro","","person:terra:545",{cta:"Ingressos"}),
   C("Blue Note, Curitiba","","person:oliva:546",{cta:"Ingressos"})]}),
  TS(["Folha da Música","Uma das vozes mais sensíveis da nova MPB."],["Rádio Cultura","Arranjos sofisticados e letras que emocionam."]),
  SO("Instagram","YouTube","Spotify"),
  mk("DividerBlock",{style:"line"})])]),

X("Maestro e regente clássico","Música",3,"Mtro. Heitor Braga","heitorbraga",
 "Preto e dourado, tipografia clássica e agenda de temporada para maestro e músico erudito.",
 editT({hf:F.cin,font:F.cg,btnStyle:"gold",avRing:"gold",profile:"center"}),()=>[
 pg("Início",[
  CV({img:"person:ouro:550",shape:"card",align:"center",height:"xl",overlay:55,headline:"Heitor Braga",fx:"none",sub:"Maestro e regente",badge:""}),
  LR("25 anos de carreira","+40 orquestras","3 continentes"),
  BT(B("Agenda de concertos",""),B("Biografia completa",""),B("Imprensa e crítica","")),
  TX("Sobre","Regente titular convidado por orquestras sinfônicas no Brasil e no exterior, com repertório que vai do barroco ao contemporâneo.","")]),
 pg("Temporada",[
  mk("CardsBlock",{title:"Próxima temporada",cols:2,items:[
   C("Sinfonia n.º 9, Beethoven","Sala São Paulo · Out. 2026","person:ouro:551",{span:"2x1",cta:"Programação"}),
   C("Noites de Câmara","Theatro Municipal","person:grafite:552",{cta:"Programação"}),
   C("Turnê Europa","Viena · Berlim · Paris","person:oceano:553",{cta:"Programação"})]}),
  TS(["O Estado de S. Paulo","Regência precisa e uma leitura profunda da partitura."],["Concerto Clássico","Uma das batutas mais respeitadas de sua geração."]),
  SO("Instagram","YouTube","Spotify","Site"),
  mk("DividerBlock",{style:"line"})])])
]);
