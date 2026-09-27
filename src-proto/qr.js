/* ───────── gerador de QR Code real (modo byte, correção M, versões 1–10) ───────── */
const QR=(()=>{
  const ECC=[0,10,16,26,18,24,16,18,22,22,26],BLK=[0,1,1,1,2,2,4,4,4,5,5];
  const raw=v=>{let r=(16*v+128)*v+64;if(v>=2){const n=Math.floor(v/7)+2;r-=(25*n-10)*n-55;if(v>=7)r-=36}return r};
  const dataCw=v=>Math.floor(raw(v)/8)-ECC[v]*BLK[v];
  const gexp=[],glog=[];{let x=1;for(let i=0;i<255;i++){gexp[i]=x;glog[x]=i;x<<=1;if(x&256)x^=0x11d}for(let i=255;i<512;i++)gexp[i]=gexp[i-255]}
  const gmul=(a,b)=>a&&b?gexp[glog[a]+glog[b]]:0;
  const divisor=d=>{let r=[1];for(let i=0;i<d;i++){const n=new Array(r.length+1).fill(0);for(let j=0;j<r.length;j++){n[j]^=r[j];n[j+1]^=gmul(r[j],gexp[i])}r=n}return r.slice(1)};
  const rem=(data,div)=>{const r=new Array(div.length).fill(0);for(const b of data){const f=b^r.shift();r.push(0);div.forEach((c,i)=>r[i]^=gmul(c,f))}return r};
  const bit=(x,i)=>((x>>>i)&1)!==0;
  function make(text){
    const bytes=[...new TextEncoder().encode(text)];
    let ver=1;for(;ver<=10;ver++){const cc=ver<10?8:16;if(4+cc+8*bytes.length<=dataCw(ver)*8)break}
    if(ver>10)return null;
    const bits=[];const put=(v,n)=>{for(let i=n-1;i>=0;i--)bits.push((v>>>i)&1)};
    put(4,4);put(bytes.length,ver<10?8:16);bytes.forEach(b=>put(b,8));
    const cap=dataCw(ver)*8;put(0,Math.min(4,cap-bits.length));while(bits.length%8)bits.push(0);
    const data=[];for(let i=0;i<bits.length;i+=8){let b=0;for(let j=0;j<8;j++)b=(b<<1)|bits[i+j];data.push(b)}
    for(let p=0xec;data.length<dataCw(ver);p^=0xec^0x11)data.push(p);
    /* blocos + ECC */
    const nb=BLK[ver],el=ECC[ver],rc=Math.floor(raw(ver)/8),ns=nb-rc%nb,sl=Math.floor(rc/nb),dv=divisor(el),blocks=[];
    for(let i=0,k=0;i<nb;i++){const dl=sl-el+(i<ns?0:1);const d=data.slice(k,k+dl);k+=dl;const e=rem(d,dv);if(i<ns)d.push(0);blocks.push(d.concat(e))}
    const all=[];for(let i=0;i<blocks[0].length;i++)blocks.forEach((b,j)=>{if(i!==sl-el||j>=ns)all.push(b[i])});
    /* matriz */
    const size=ver*4+17,m=Array.from({length:size},()=>new Array(size).fill(false)),fn=Array.from({length:size},()=>new Array(size).fill(false));
    const set=(x,y,d)=>{m[y][x]=d;fn[y][x]=true};
    for(let i=0;i<size;i++){set(6,i,i%2===0);set(i,6,i%2===0)}
    const finder=(x,y)=>{for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){const d=Math.max(Math.abs(dx),Math.abs(dy)),xx=x+dx,yy=y+dy;if(xx>=0&&xx<size&&yy>=0&&yy<size)set(xx,yy,d!==2&&d!==4)}};
    finder(3,3);finder(size-4,3);finder(3,size-4);
    if(ver>1){const n=Math.floor(ver/7)+2,st=ver===32?26:Math.ceil((ver*4+4)/(n*2-2))*2,pos=[6];for(let p=size-7;pos.length<n;p-=st)pos.splice(1,0,p);
      pos.forEach((px,i)=>pos.forEach((py,j)=>{if((i===0&&j===0)||(i===0&&j===n-1)||(i===n-1&&j===0))return;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)set(px+dx,py+dy,Math.max(Math.abs(dx),Math.abs(dy))!==1)}))}
    const fmt=mask=>{const d=(0<<3)|mask;let r=d;for(let i=0;i<10;i++)r=(r<<1)^((r>>>9)*0x537);const b=((d<<10)|r)^0x5412;
      for(let i=0;i<=5;i++)set(8,i,bit(b,i));set(8,7,bit(b,6));set(8,8,bit(b,7));set(7,8,bit(b,8));for(let i=9;i<15;i++)set(14-i,8,bit(b,i));
      for(let i=0;i<8;i++)set(size-1-i,8,bit(b,i));for(let i=8;i<15;i++)set(8,size-15+i,bit(b,i));set(8,size-8,true)};
    fmt(0);
    if(ver>=7){let r=ver;for(let i=0;i<12;i++)r=(r<<1)^((r>>>11)*0x1f25);const b=(ver<<12)|r;for(let i=0;i<18;i++){const v=bit(b,i),a=size-11+i%3,c=Math.floor(i/3);set(a,c,v);set(c,a,v)}}
    let k=0;for(let right=size-1;right>=1;right-=2){if(right===6)right=5;for(let vert=0;vert<size;vert++)for(let j=0;j<2;j++){const x=right-j,up=((right+1)&2)===0,y=up?size-1-vert:vert;if(!fn[y][x]&&k<all.length*8){m[y][x]=bit(all[k>>>3],7-(k&7));k++}}}
    const mf=[(x,y)=>(x+y)%2===0,(x,y)=>y%2===0,(x,y)=>x%3===0,(x,y)=>(x+y)%3===0,(x,y)=>(Math.floor(x/3)+Math.floor(y/2))%2===0,(x,y)=>x*y%2+x*y%3===0,(x,y)=>(x*y%2+x*y%3)%2===0,(x,y)=>((x+y)%2+x*y%3)%2===0];
    const apply=mk=>{for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(!fn[y][x]&&mf[mk](x,y))m[y][x]=!m[y][x]};
    const pen=()=>{let p=0;for(let y=0;y<size;y++)for(const line of[m[y],m.map(r=>r[y])]){let run=1;for(let x=1;x<size;x++){if(line[x]===line[x-1]){run++;if(run===5)p+=3;else if(run>5)p++}else run=1}}
      for(let y=0;y<size-1;y++)for(let x=0;x<size-1;x++)if(m[y][x]===m[y][x+1]&&m[y][x]===m[y+1][x]&&m[y][x]===m[y+1][x+1])p+=3;
      let dark=0;m.forEach(r=>r.forEach(v=>{if(v)dark++}));p+=Math.floor(Math.abs(dark*20-size*size*10)/(size*size))*10;return p};
    let best=0,bp=1e9;for(let mk=0;mk<8;mk++){apply(mk);fmt(mk);const p=pen();if(p<bp){bp=p;best=mk}apply(mk)}
    apply(best);fmt(best);return m}
  function svg(text,fg,bg,label){
    const m=make(text||"https://exemplo.com");if(!m)return`<div class="phead">Endereço muito longo para o QR Code.</div>`;
    const n=m.length,q=4;let d="";m.forEach((r,y)=>{for(let x=0;x<n;x++)if(r[x])d+=`M${x+q} ${y+q}h1v1h-1z`});
    return `<svg class="qrs" viewBox="0 0 ${n+q*2} ${n+q*2}" shape-rendering="crispEdges" role="img" aria-label="${label||"QR Code"}"><rect width="100%" height="100%" fill="${bg}"/><path d="${d}" fill="${fg}"/></svg>`}
  return{make,svg}})();
