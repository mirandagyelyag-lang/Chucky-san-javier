import React,{useEffect,useMemo,useState}from'react';
import{createRoot}from'react-dom/client';
import{Menu,Search,ShoppingBag,Plus,Minus,X,ArrowLeft,Heart,Drumstick,ChevronRight,Sparkles,Home,UtensilsCrossed,MapPin,UserRound,WalletCards,LocateFixed}from'lucide-react';
import'./style.css';

const products=[
{id:1,cat:'Pollo frito',name:'Crujiente Chucky',desc:'Pollo frito extra crujiente, dorado y recién hecho.',price:7990,img:'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=1000&q=90'},
{id:2,cat:'Pollo frito',name:'Balde Chucky',desc:'Balde para compartir con piezas de pollo crujiente.',price:12990,img:'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1000&q=90'},
{id:3,cat:'Sushi',name:'Roll Chucky',desc:'Roll de la casa, cremoso, fresco y lleno de sabor.',price:6990,img:'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1000&q=90'},
{id:4,cat:'Sushi',name:'Roll Crocante',desc:'Roll crocante con cubierta y salsa de la casa.',price:7490,img:'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=1000&q=90'},
{id:6,cat:'Bebidas',name:'Bebida',desc:'Elige entre los sabores disponibles.',price:2000,img:'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=1000&q=90'},
{id:7,cat:'Salsas',name:'Salsa Chucky',desc:'El toque final para tu pedido.',price:800,img:'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=1000&q=90'}
];
const cats=['Pollo frito','Sushi','Salsas','Bebidas'];
const money=n=>'$'+n.toLocaleString('es-CL');

function DesktopOnlyBlock(){return <main className="desktopOnlyBlock"><div><strong>CHUCKY</strong><p>Disponible solo en celular por ahora</p></div></main>}

function App(){
 const[isDesktopDevice,setIsDesktopDevice]=useState(()=>typeof window!=='undefined'&&window.matchMedia('(min-width: 900px)').matches);
 useEffect(()=>{
  const media=window.matchMedia('(min-width: 900px)');
  const sync=()=>setIsDesktopDevice(media.matches);
  sync();
  media.addEventListener?.('change',sync);
  return()=>media.removeEventListener?.('change',sync);
 },[]);
 return isDesktopDevice?<DesktopOnlyBlock/>:<MobileApp/>;
}

function MobileApp(){
 const initialScreen=()=>{try{const hash=window.location.hash.replace('#/','').replace('#','');return ['home','menu','search','cart'].includes(hash)?hash:'home'}catch{return 'home'}};
 const[screen,setScreenState]=useState(initialScreen),[cat,setCat]=useState('Todo'),[q,setQ]=useState(''),[cart,setCart]=useState({}),[selected,setSelected]=useState(null),[lastAdded,setLastAdded]=useState(null);
 const setScreen=next=>{setScreenState(next);try{history.replaceState(null,'',next==='home'?window.location.pathname:window.location.pathname+'#/'+next)}catch{}};
 const add=(id,e)=>{e?.stopPropagation();setCart(c=>({...c,[id]:(c[id]||0)+1}));const product=products.find(p=>p.id===id);if(product){setLastAdded(product);clearTimeout(window.__chuckyCartToastTimer);window.__chuckyCartToastTimer=setTimeout(()=>setLastAdded(null),1800)}};
 const sub=id=>setCart(c=>({...c,[id]:Math.max(0,(c[id]||0)-1)}));
 const count=Object.values(cart).reduce((a,b)=>a+b,0);
 const subtotal=products.reduce((s,p)=>s+(cart[p.id]||0)*p.price,0);
 const filtered=useMemo(()=>products.filter(p=>p.cat===cat),[cat]);
 useEffect(()=>{
  const localAssets=[
   './fondo-chucky-street.webp','./chucky-header.png','./pollo-sushi-titulo.png',
   './sushi-principal.webp','./pollo-frito-principal.webp','./bebidas-chucky.webp',
   './salsas-principal.webp','./aprobado-con-fondo.png','./chucky-logo.webp'
  ];
  const urls=[...localAssets,...products.map(p=>p.img)];
  urls.forEach(src=>{const im=new Image();im.decoding='async';im.src=src;});
 },[]);
 useEffect(()=>{
  if(!selected)return;
  const y=window.scrollY;
  const body=document.body;
  const html=document.documentElement;
  const prev={position:body.style.position,top:body.style.top,width:body.style.width,overflow:body.style.overflow,htmlOverflow:html.style.overflow};
  body.style.position='fixed';
  body.style.top=`-${y}px`;
  body.style.width='100%';
  body.style.overflow='hidden';
  html.style.overflow='hidden';
  return ()=>{
   body.style.position=prev.position;
   body.style.top=prev.top;
   body.style.width=prev.width;
   body.style.overflow=prev.overflow;
   html.style.overflow=prev.htmlOverflow;
   window.scrollTo(0,y);
  };
 },[selected]);
 if(screen==='cart')return <Shell screen={screen} setScreen={setScreen} count={count} lastAdded={lastAdded}><Cart cart={cart} setCart={setCart} add={add} sub={sub} subtotal={subtotal} setScreen={setScreen}/></Shell>;
 return <Shell screen={screen} setScreen={setScreen} count={count} lastAdded={lastAdded}>
  {screen!=='home'&&screen!=='menu'&&<Topbar setScreen={setScreen} count={count}/>}
  {screen==='home'&&<HomePage setScreen={setScreen} setCat={setCat} add={add} setSelected={setSelected}/>}
  {screen==='menu'&&<MenuPage cat={cat} setCat={setCat} filtered={filtered} add={add} setSelected={setSelected} setScreen={setScreen}/>} 
  {screen==='search'&&<SearchPage q={q} setQ={setQ} filtered={products.filter(p=>p.name.toLowerCase().includes(q.toLowerCase())||p.desc.toLowerCase().includes(q.toLowerCase())||p.cat.toLowerCase().includes(q.toLowerCase()))} add={add} setSelected={setSelected}/>}
  {selected&&<Detail p={selected} close={()=>setSelected(null)} add={add}/>}
 </Shell>
}

function Topbar({setScreen,count}){return <header className="topbar topbarConcept editorialTopbar">
 <button className="heroMenuBtn" aria-label="Abrir menú" onClick={()=>setScreen('menu')}><Menu/></button>
 <button className="brand brandConcept editorialBrand cleanChuckyBrand" onClick={()=>setScreen('home')} aria-label="Chucky · Pollo frito y sushi">
  <span className="chuckyTextBrand">CHUCKY<small>POLLO FRITO × SUSHI</small></span>
 </button>
 <div className="topActions editorialActions">
  <button className="ghostBtn cartBtn premiumCart" onClick={()=>setScreen('cart')} aria-label="Ver carrito"><ShoppingBag/>{count>0&&<i>{count}</i>}</button>
 </div>
 </header>}

function HomePage({setScreen,setCat,add,setSelected}){
 const go=cat=>{setCat(cat);setScreen('menu')};
 const categoryItems=[
  ['Sushi','ROLLS, HANDROLLS Y MÁS.','./sushi-principal.webp?v=2','Sushi'],
  ['Pollo frito','PIEZAS, ALITAS Y COMBOS.','./pollo-frito-principal.webp?v=2','Pollo frito'],
  ['Bebidas','PARA ACOMPAÑAR.','./bebidas-chucky.webp?v=1','Bebidas'],
  ['Salsas','EL TOQUE FINAL.','./salsas-principal.webp?v=2','Salsas']
 ];
 return <main className="content homeEditorial homeSales exactHome chuckyContinuous">
  <section className="exactHero">
   <img className="exactHeroImg" src="./fondo-chucky-street.webp?v=5" alt="Chucky" loading="eager" decoding="async" fetchPriority="high"/>
   <div className="exactHeroShade"/>
   <button className="exactMenu" onClick={()=>setScreen('menu')} aria-label="Menú"><Menu/></button>
   <img className="exactLogo exactLogoImg" src="./chucky-header.png?v=1" alt="Chucky" loading="eager" decoding="async" fetchPriority="high"/>
   <button className="exactCart" onClick={()=>setScreen('cart')} aria-label="Carrito"><ShoppingBag/></button>
   <div className="exactCopy"><img className="exactHeroTitleImg" src="./pollo-sushi-titulo.png?v=1" alt="Pollo frito y sushi." loading="eager" decoding="async" fetchPriority="high"/><button className="exactOrderCta" onClick={()=>setScreen('menu')}><ShoppingBag/> <strong>Pide ahora</strong> <span>→</span></button></div>
  </section>
  <section className="exactShop">
   <div className="exactTitle"><h2>¿Qué vas a pedir?<b>⌁</b></h2><p>TODO A UN TOQUE.</p></div>
   <div className="exactGrid">{categoryItems.map(([name,sub,img,target])=><button key={name} className="exactCat" onClick={()=>go(target)} aria-label={name}><img src={img} alt="" loading="eager" decoding="async" fetchPriority="high" onError={(e)=>{console.log("No cargó esta imagen:",e.currentTarget.src)}}/><span className="exactCatLabel"><strong>{name}</strong><small>{sub}</small></span><b aria-hidden="true">→</b></button>)}</div>
  </section>

 </main>
}
function MenuPage({cat,setCat,filtered,add,setSelected,setScreen}){
 const menuCats=['Todo',...cats];
 const[justAdded,setJustAdded]=useState(null);
 const sectionMeta={
  'Pollo frito':{kicker:'NUESTRO CLÁSICO',note:'CRUJIENTE · JUGOSO · RECIÉN HECHO'},
  'Sushi':{kicker:'ROLLS DE LA CASA',note:'FRESCO · CREMOSO · HECHO AL MOMENTO'},
  'Salsas':{kicker:'EL TOQUE FINAL',note:'PARA ACOMPAÑAR TU PEDIDO'},
  'Bebidas':{kicker:'PARA TOMAR',note:'FRÍAS · SIMPLES · AL PUNTO'}
 };
 const jump=(c)=>{
  setCat(c);
  if(c==='Todo'){window.scrollTo({top:0,behavior:'smooth'});return}
  document.getElementById('menu-'+c.toLowerCase().replace(/\s+/g,'-'))?.scrollIntoView({behavior:'smooth',block:'start'});
 };
 return <main className="content menuRef">
  <div className="menuRefTop">
   <section className="menuRefHero">
    <img className="menuRefStamp" src="./aprobado-con-fondo.png?v=6" alt="Aprobado por Chucky" loading="eager" decoding="async"/>
    <div className="menuRefHeroCopy">
     <small>CHUCKY</small>
     <h1>MENÚ</h1>
     <span>POLLO FRITO · SUSHI · SALSAS · BEBIDAS</span>
    </div>
    <span className="menuRefCrown" aria-hidden="true">♕</span>
    <button className="menuRefSearch" onClick={()=>setScreen('search')} aria-label="Buscar"><Search/></button>
   </section>

   <nav className="menuRefTabs">
    {menuCats.map(c=><button key={c} className={cat===c?'on':''} onClick={()=>jump(c)}>{c}</button>)}
   </nav>
  </div>

  <div className="menuRefBody">
   {cats.map(c=>{
    const items=products.filter(p=>p.cat===c);
    if(!items.length)return null;
    const id='menu-'+c.toLowerCase().replace(/\s+/g,'-');
    return <section id={id} key={c} className="menuRefSection">
     <header className="menuRefHeading menuEditorialHeading">
      <div className="menuEditorialKicker">
       <span>{sectionMeta[c].kicker}</span>
       <i aria-hidden="true"/>
       {c==='Pollo frito'&&<img className="menuEditorialFoodIcon" src="./pollo-frito.png?v=1" alt="" aria-hidden="true" loading="eager" decoding="async"/>}
       {c==='Sushi'&&<img className="menuEditorialFoodIcon menuEditorialFoodIconSushi" src="./sushi.png?v=2" alt="" aria-hidden="true" loading="eager" decoding="async"/>}
       {c==='Salsas'&&<img className="menuEditorialFoodIcon menuEditorialFoodIconSalsas" src="./salsas.png?v=1" alt="" aria-hidden="true" loading="eager" decoding="async"/>}
       {c==='Bebidas'&&<img className="menuEditorialFoodIcon menuEditorialFoodIconBebidas" src="./bebidas.png?v=1" alt="" aria-hidden="true" loading="eager" decoding="async"/>}
      </div>
      <div className="menuEditorialTitleRow">
       <h2>{c}</h2>
       <button onClick={()=>jump(c)}>Ver todo <ChevronRight/></button>
      </div>
      <div className="menuEditorialNote"><i aria-hidden="true"/><small>{sectionMeta[c].note}</small><i aria-hidden="true"/></div>
     </header>

     <div className="menuRefRail">
      {items.map(p=><article className="menuRefCard" key={p.id} onClick={()=>setSelected(p)}>
       <div className="menuRefPhoto">
        <img src={p.img} alt={p.name} loading="lazy" decoding="async"/>
        <button className="menuRefHeart" onClick={e=>e.stopPropagation()} aria-label={'Favorito '+p.name}><Heart/></button>
       </div>
       <div className="menuRefCardBody" data-cat={p.cat}>
        <h3>{p.name}</h3>
        <p>{p.desc}</p>
        <strong>{money(p.price)}</strong>
       </div>
       <button className={'menuRefAdd '+(justAdded===p.id?'added':'')} onClick={e=>{add(p.id,e);setJustAdded(p.id);setTimeout(()=>setJustAdded(null),900)}} aria-label={'Agregar '+p.name}>{justAdded===p.id?'✓':'+'}</button>
      </article>)}
     </div>
    </section>
   })}
  </div>
 </main>
}

function SearchPage({q,setQ,filtered,add,setSelected}){
 const[searchCat,setSearchCat]=useState('Todo');
 const visible=filtered.filter(p=>searchCat==='Todo'||p.cat===searchCat);
 return <main className="content searchPage searchRedesign02 chuckyScreen">
  <section className="searchIntro02">
   <small>BUSCAR</small>
   <div className="searchIntroRow02"><h1>¿QUÉ SE TE<br/>ANTOJA?</h1><p>POLLO<br/>SUSHI<br/>COMBOS<br/>BEBIDAS</p></div>
  </section>
  <label className="searchBox02"><Search/><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar pollo, sushi, combos..."/>{q&&<button onClick={()=>setQ('')} aria-label="Limpiar búsqueda"><X/></button>}</label>
  <nav className="searchFilters02">
   {['Todo','Pollo frito','Sushi','Bebidas'].map(c=><button key={c} className={searchCat===c?'on':''} onClick={()=>setSearchCat(c)}>
    {c==='Pollo frito'?'Pollo':c}
   </button>)}
  </nav>
  <div className="searchSectionHead02"><b>{q?'RESULTADOS':'PRODUCTOS DESTACADOS'}</b><span>{visible.length} {visible.length===1?'producto':'productos'}</span></div>
  <div className="searchResults02">
   {visible.map((p,i)=><Card key={p.id} p={p} add={add} setSelected={setSelected} featured={!q&&searchCat==='Todo'&&i===0} wide/>)}
   {!visible.length&&<div className="searchEmpty02"><Search/><b>NO ENCONTRAMOS ESO.</b><p>Prueba con otro nombre o categoría.</p></div>}
  </div>
 </main>
}

function Headline({kicker,title,note}){return <div className="headline"><small>{kicker}</small><div><h2>{title}</h2>{note&&<p>{note}</p>}</div></div>}

function Card({p,add,setSelected,featured,wide}){return <article className={'foodCard '+(wide?'wide':'')} onClick={()=>setSelected(p)}>
 <div className="foodPhoto"><img src={p.img} loading="lazy" decoding="async"/><div className="photoShade"/>{featured&&<span className="pickTag"><Sparkles/> FAVORITO CHUCKY</span>}<span className="cardCat">{p.cat}</span></div>
 <div className="foodInfo"><div><h3>{p.name}</h3><p>{p.desc}</p></div><div className="priceRow"><strong>{money(p.price)}</strong><button onClick={e=>add(p.id,e)} aria-label={'Agregar '+p.name}><Plus/></button></div></div>
 </article>}

function Detail({p,close,add}){return <div className="detail detailChalk">
 <div className="detailPhoto"><img src={p.img} decoding="async"/><div className="detailShade"/><button onClick={close} aria-label="Volver"><ArrowLeft/></button><button className="heart" aria-label="Favorito"><Heart/></button></div>
 <div className="detailBody">
  <span className="detailCat">{p.cat}</span>
  <span className="detailChalkMarks detailChalkMarksA" aria-hidden="true"></span>
  <span className="detailChalkMarks detailChalkMarksB" aria-hidden="true"></span>
  <h1>{p.name}</h1>
  <p>{p.desc}</p>
  <div className="detailPrice"><strong>{money(p.price)}</strong></div>
  <button className="bigAdd" onClick={e=>{add(p.id,e);close()}}><Plus/><span>Agregar al carrito</span></button>
 </div>
 </div>}

function Cart({cart,setCart,add,sub,subtotal,setScreen}){
 const items=products.filter(p=>cart[p.id]);
 const[customer,setCustomer]=useState({name:'',phone:'',email:'',delivery:'Retiro en local',address:'',street:'',streetNumber:'',floor:'',notes:'',payment:'',cashAmount:'',lat:'',lon:''});
 const[sending,setSending]=useState(false);
 const[sent,setSent]=useState(false);
 const[error,setError]=useState('');
 const[addressSuggestions,setAddressSuggestions]=useState([]);
 const[addressLoading,setAddressLoading]=useState(false);
 const[addressLocked,setAddressLocked]=useState(false);
 const[locating,setLocating]=useState(false);
 const[locationStatus,setLocationStatus]=useState('');
 const change=e=>setCustomer(c=>({...c,[e.target.name]:e.target.value}));
 const emailOk=!customer.email.trim()||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim());
 const hasStreetNumber=/\d/.test(customer.streetNumber.trim());
 const canSend=items.length&&customer.name.trim()&&customer.phone.trim()&&emailOk&&customer.payment&&(customer.delivery==='Retiro en local'||(customer.street.trim()&&hasStreetNumber))&&(customer.payment!=='Efectivo'||!customer.cashAmount||Number(customer.cashAmount.replace(/\D/g,''))>=subtotal);
 const normalizePlace=v=>(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const isSanJavierPlace=v=>normalizePlace(v).includes('san javier');

 useEffect(()=>{
  if(customer.delivery!=='Despacho'||customer.street.trim().length<2){setAddressSuggestions([]);return}
  const timer=setTimeout(async()=>{
   setAddressLoading(true);
   try{
    const response=await fetch('/api/geoapify',{
     method:'POST',
     headers:{'Content-Type':'application/json'},
     body:JSON.stringify({input:customer.street.trim()})
    });
    const data=await response.json();
    if(!response.ok)throw new Error(data?.error||'geoapify');
    const seen=new Set();
    const suggestions=(data.suggestions||[]).map(x=>({
     label:(x.street||x.addressLine1||'').replace(/\s+\d+[A-Za-z-]*$/,'').trim(),
     meta:x.addressLine2||'San Javier',
     lat:x.lat,
     lon:x.lon
    })).filter(x=>{
     if(!x.label)return false;
     const key=normalizePlace(x.label);
     if(seen.has(key))return false;
     seen.add(key);
     return true;
    }).slice(0,6);
    setAddressSuggestions(suggestions);
   }catch(e){
    setAddressSuggestions([]);
    if(String(e?.message||'').includes('GEOAPIFY_API_KEY_NOT_CONFIGURED'))setLocationStatus('Falta configurar Geoapify para las sugerencias.');
   }finally{setAddressLoading(false)}
  },260);
  return()=>clearTimeout(timer);
 },[customer.street,customer.delivery]);
 const chooseStreet=s=>{
  if(!s)return;
  setCustomer(c=>({...c,street:s.label,address:'',lat:'',lon:''}));
  setAddressSuggestions([]);
  setAddressLocked(false);
  setLocationStatus('');
 };

 const verifyAddress=async()=>{
  if(!customer.street.trim()||!hasStreetNumber){
   setLocationStatus('Escribe la calle y el número.');
   return;
  }
  setAddressLoading(true);
  setLocationStatus('Verificando dirección…');
  try{
   const fullQuery=(customer.street.trim()+' '+customer.streetNumber.trim());
   const response=await fetch('/api/geoapify',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({input:fullQuery})
   });
   const data=await response.json();
   if(!response.ok)throw new Error(data?.error||'geoapify');
   const wanted=customer.streetNumber.trim().toLowerCase();
   const matches=(data.suggestions||[]).filter(x=>String(x.housenumber||'').toLowerCase()===wanted);
   const best=matches[0]||data.suggestions?.[0];
   if(!best){
    setAddressLocked(false);
    setCustomer(c=>({...c,address:fullQuery+', San Javier',lat:'',lon:''}));
    setLocationStatus('No pudimos verificar el número, pero puedes continuar con la dirección escrita.');
    return;
   }
   const full=(best.formatted||[fullQuery,best.addressLine2].filter(Boolean).join(', ')).trim();
   if(!isSanJavierPlace(full)){
    setAddressLocked(false);
    setLocationStatus('Solo hacemos despachos dentro de San Javier.');
    return;
   }
   setAddressLocked(true);
   setCustomer(c=>({...c,address:full,lat:String(best.lat||''),lon:String(best.lon||'')}));
   setLocationStatus('Dirección verificada');
  }catch{
   setAddressLocked(false);
   setCustomer(c=>({...c,address:(customer.street.trim()+' '+customer.streetNumber.trim()+', San Javier'),lat:'',lon:''}));
   setLocationStatus('No pudimos verificarla ahora, pero puedes continuar con la dirección escrita.');
  }finally{setAddressLoading(false)}
 };
 const useMyLocation=()=>{
  if(!navigator.geolocation){setLocationStatus('Este dispositivo no permite obtener la ubicación.');return}
  setLocating(true);setLocationStatus('Buscando tu ubicación…');
  navigator.geolocation.getCurrentPosition(async pos=>{
   const lat=pos.coords.latitude.toFixed(6),lon=pos.coords.longitude.toFixed(6);
   let label=lat+', '+lon;
   try{
    const r=await fetch('/api/geoapify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({lat,lon})});
    if(r.ok){
     const data=await r.json();
     if(data.formatted)label=data.formatted;
     if(data.street||data.housenumber)setCustomer(c=>({...c,street:data.street||c.street,streetNumber:data.housenumber||c.streetNumber}));
    }
   }catch{}
   if(!isSanJavierPlace(label)){
    setLocationStatus('La ubicación está fuera de San Javier. Solo hacemos despachos dentro de la comuna.');
    setLocating(false);
    return;
   }
   setAddressLocked(true);
   setCustomer(c=>({...c,address:label,lat,lon}));
   setAddressSuggestions([]);
   setLocationStatus('Ubicación en San Javier confirmada');
   setLocating(false);
  },()=>{setLocationStatus('No pudimos obtener tu ubicación. Revisa el permiso de ubicación.');setLocating(false)},{enableHighAccuracy:true,timeout:12000,maximumAge:0});
 };

 const sendOrder=async()=>{
  if(!canSend||sending)return;
  setSending(true);setError('');
  const detail=items.map(p=>`${cart[p.id]} x ${p.name} — ${money(cart[p.id]*p.price)}`).join('\n');
  const data=new FormData();
  data.append('_subject',`Nuevo pedido Chucky — ${customer.name}`);
  data.append('_template','table');
  data.append('Nombre',customer.name);
  data.append('Teléfono',customer.phone);
  if(customer.email.trim()){
   data.append('email',customer.email.trim());
   data.append('_autoresponse',`¡Hola ${customer.name}! Recibimos tu solicitud de pedido en Chucky.\n\n${detail}\n\nTOTAL: ${money(subtotal)}\n\nEl negocio te contactará para confirmar disponibilidad, horario y entrega. Este mensaje no confirma todavía la preparación.`);
  }
  data.append('Entrega',customer.delivery);
  data.append('Dirección',customer.delivery==='Despacho'?(customer.address||[customer.street,customer.streetNumber,'San Javier'].filter(Boolean).join(' ')):'Retiro en local');
  if(customer.delivery==='Despacho'){
   data.append('Piso / departamento',customer.floor||'No aplica');
   data.append('Coordenadas',customer.lat&&customer.lon?`${customer.lat}, ${customer.lon}`:'No disponibles');
   if(customer.lat&&customer.lon)data.append('Mapa',`https://www.google.com/maps?q=${customer.lat},${customer.lon}`);
  }
  data.append('Forma de pago',customer.payment);
  if(customer.payment==='Efectivo')data.append('Paga con',customer.cashAmount?money(Number(customer.cashAmount.replace(/\D/g,''))):'Monto exacto / no indicado');
  data.append('Pedido',detail);
  data.append('Total productos',money(subtotal));
  data.append('Notas',customer.notes||'Sin indicaciones');
  try{
   const response=await fetch('https://formsubmit.co/ajax/antonia.miranda.acmmo@gmail.com',{method:'POST',headers:{Accept:'application/json'},body:data});
   const result=await response.json();
   if(!response.ok||result.success===false)throw new Error('No se pudo enviar');
   setSent(true);setCart({});
  }catch(e){
   setError('No pudimos enviar el pedido. Inténtalo nuevamente.');
  }finally{setSending(false)}
 };
 if(sent)return <main className="content cart orderSuccess">
  <div className="successMark"><b>CHUCKY</b></div>
  <small>PEDIDO ENVIADO</small>
  <h1>¡RECIBIDO!</h1>
  <p>El pedido fue enviado al negocio. Te contactaremos al teléfono indicado para confirmarlo.</p>
  <button className="backHome" onClick={()=>setScreen('home')}>VOLVER AL INICIO <ChevronRight/></button>
 </main>;
 return <main className={"content cart cartSmart chuckyScreen"+(!items.length?" cartSmartEmpty":"")}>
 {items.length?<><div className="smartCartHead"><small>TU CARRITO</small><img className="summaryLogo" src="/resumen.png?v=1" alt="Resumen"/><p>{items.reduce((s,p)=>s+cart[p.id],0)} productos</p></div>
  <section className="smartSummary">
   <div className="smartSummaryTop"><b>Productos</b><strong>{money(subtotal)}</strong></div>
   {items.map(p=><article className="smartCartItem" key={p.id}>
    <img src={p.img} alt={p.name} loading="lazy" decoding="async"/>
    <div className="smartItemCopy"><b>{p.name}</b><span>{money(p.price)}</span></div>
    <div className="smartQty"><button onClick={()=>sub(p.id)} aria-label={'Quitar uno de '+p.name}><Minus/></button><strong>{cart[p.id]}</strong><button onClick={e=>add(p.id,e)} aria-label={'Agregar uno de '+p.name}><Plus/></button></div>
   </article>)}
   <div className="smartDelivery"><span>Despacho</span><b>{customer.delivery==='Despacho'?'Se confirma con el negocio':'Retiro · $0'}</b></div>
   <div className="smartTotal"><span>TOTAL PRODUCTOS</span><strong>{money(subtotal)}</strong></div>
  </section>
  <button className="smartCheckoutJump" onClick={()=>document.querySelector('.customerForm')?.scrollIntoView({behavior:'smooth'})}>CONTINUAR CON MIS DATOS <ChevronRight/></button>

  <section className="customerForm smartCustomer checkoutFormV2">
   <div className="orderFormHead"><small>FINALIZAR COMPRA</small><h2>Tus datos</h2></div>

   <div className="checkoutGroup">
    <div className="checkoutGroupTitle"><UserRound/><h3>Contacto</h3></div>
    <label>Nombre y apellido <em>*</em><input name="name" value={customer.name} onChange={change} placeholder="Tu nombre" autoComplete="name"/></label>
    <label>Teléfono <em>*</em><input name="phone" value={customer.phone} onChange={change} placeholder="+56 9 1234 5678" inputMode="tel" autoComplete="tel"/></label>
    <label>Correo electrónico <span className="optionalTag">OPCIONAL</span><input type="email" name="email" value={customer.email} onChange={change} placeholder="nombre@ejemplo.com" inputMode="email" autoComplete="email"/>{customer.email&&!emailOk&&<small className="fieldError">Escribe un correo válido.</small>}</label>
   </div>

   <div className="checkoutGroup">
    <div className="checkoutGroupTitle"><MapPin/><h3>Entrega</h3></div>
    <div className="deliveryChoice">
     <button className={customer.delivery==='Retiro en local'?'on':''} onClick={()=>{setAddressSuggestions([]);setAddressLocked(false);setLocationStatus('');setCustomer(c=>({...c,delivery:'Retiro en local',address:'',street:'',streetNumber:'',lat:'',lon:''}))}}>Retiro</button>
     <button className={customer.delivery==='Despacho'?'on':''} onClick={()=>{setAddressSuggestions([]);setAddressLocked(false);setCustomer(c=>({...c,delivery:'Despacho'}))}}>Despacho</button>
    </div>
    {customer.delivery==='Despacho'&&<>
     <button className="useLocationBtn" type="button" onClick={useMyLocation} disabled={locating}><LocateFixed/>{locating?'Buscando ubicación…':'Usar mi ubicación actual'}</button>
     {locationStatus&&<small className="locationStatus">{locationStatus}</small>}
     <div className="addressFields">
      <label className="addressAutocomplete">Calle <em>*</em><small className="addressZoneHint">Solo San Javier</small>
       <input name="street" value={customer.street} onChange={e=>{setAddressLocked(false);setLocationStatus('');setCustomer(c=>({...c,street:e.target.value,address:'',lat:'',lon:''}))}} placeholder="Ej: Hernán Lobos Arias" autoComplete="off"/>
       {addressSuggestions.length>0&&<div className="addressSuggestions">
        {addressSuggestions.map((s,i)=><button type="button" key={s.label+'-'+i} onClick={()=>chooseStreet(s)}><MapPin/><span><b>{s.label}</b>{s.meta&&<small>{s.meta}</small>}</span></button>)}<div className="geoapifyAttribution" translate="no">Powered by Geoapify</div>
       </div>}
      </label>
      <label>Número <em>*</em>
       <input name="streetNumber" value={customer.streetNumber} onChange={e=>{setAddressLocked(false);setLocationStatus('');setCustomer(c=>({...c,streetNumber:e.target.value.replace(/[^0-9A-Za-z-]/g,''),address:'',lat:'',lon:''}))}} placeholder="Ej: 2972" inputMode="numeric" autoComplete="off"/>
       {customer.streetNumber.trim()&&!hasStreetNumber&&<small className="fieldError addressNumberError">Escribe un número válido.</small>}
      </label>
      <button type="button" className="verifyAddressBtn" onClick={verifyAddress} disabled={!customer.street.trim()||!hasStreetNumber||addressLoading}>{addressLoading?'VERIFICANDO…':'VERIFICAR DIRECCIÓN'}</button>
     </div>
     <label>Piso y departamento <span className="optionalTag">OPCIONAL</span><input name="floor" value={customer.floor} onChange={change} placeholder="Ej: 1B"/></label>
     <label>Indicaciones <span className="optionalTag">OPCIONAL</span><textarea name="notes" value={customer.notes} onChange={change} placeholder="Casa con portón rojo, llamar al llegar..."/></label>
    </>}
   </div>

   <div className="checkoutGroup">
    <div className="checkoutGroupTitle"><WalletCards/><h3>Forma de pago <em>*</em></h3></div>
    <div className="paymentOptions">
     {['Efectivo','Transferencia'].map(method=><label className={'paymentOption '+(customer.payment===method?'on':'')} key={method}><input className="paymentRadio" type="radio" name="payment" value={method} checked={customer.payment===method} onChange={change}/><b>{method}</b></label>)}
    </div>
    {customer.payment==='Efectivo'&&<label className="cashField">¿Con cuánto vas a pagar? <span className="optionalTag">OPCIONAL</span><input name="cashAmount" value={customer.cashAmount} onChange={change} placeholder="$0" inputMode="numeric"/></label>}
   </div>

   <section className="checkoutFinalSummary">
    <h3>Resumen</h3>
    <div><span>Subtotal</span><b>{money(subtotal)}</b></div>
    <div><span>{customer.delivery==='Despacho'?'Costo de envío':'Retiro'}</span><b>{customer.delivery==='Despacho'?'Por confirmar':'$0'}</b></div>
    <div className="checkoutTotalLine"><span>Total productos</span><strong>{money(subtotal)}</strong></div>
   </section>
  </section>

  {error&&<p className="orderError">{error}</p>}
  <button className="checkout smartFinal checkoutConfirmV2" disabled={!canSend||sending} onClick={sendOrder}>{sending?'ENVIANDO...':'CONFIRMAR PEDIDO'} {!sending&&<ChevronRight/>}</button>
  <button className="checkoutBackV2" onClick={()=>setScreen('menu')}>VOLVER AL MENÚ</button>
 </>:<div className="smartEmpty"><small>TU CARRITO</small><div className="emptyPedidoArtwork" aria-hidden="true"></div><img className="pedidoChuckyLogo" src="./chucky-logo.webp?v=1" alt="Chucky"/><div className="pedidoEmptyCopy"><h1>Tu carrito está <em>vacío.</em></h1><p>¿Lo arreglamos?</p><button onClick={()=>setScreen('menu')}>IR AL MENÚ <ChevronRight/></button></div></div>}
 </main>}
function Shell({children,screen,setScreen,count,lastAdded}){return <div className="app"><div className="grain"/>{children}
 {lastAdded&&screen!=='cart'&&<button className="cartAddedToast" onClick={()=>setScreen('cart')} aria-label="Ver carrito"><span className="cartAddedCheck">✓</span><span><small>AGREGADO AL CARRITO</small><b>{lastAdded.name}</b></span><strong>Ver carrito <ChevronRight/></strong></button>}
 <div className="mobileNavSpace" aria-hidden="true"/><nav className="nav chuckyNav">
 <button className={screen==='home'?'on':''} onClick={()=>setScreen('home')}><Home/><b>Inicio</b></button>
 <button className={screen==='menu'?'on':''} onClick={()=>setScreen('menu')}><UtensilsCrossed/><b>Menú</b></button>
 <button className={screen==='cart'?'on':''} onClick={()=>setScreen('cart')} aria-label={count?('Carrito, '+count+' '+(count===1?'producto':'productos')):'Carrito vacío'}><ShoppingBag/><b>Carrito</b>{count>0&&<i>{count}</i>}</button>
 </nav></div>}

createRoot(document.getElementById('root')).render(<App/>);
/* deploy-sync-2026-09-22 */

/* deploy-sync-footer-design */

 

/* vercel-sync-correct-project-2026-09-24 */

/* deploy-after-vercel-disconnect-2026-09-24 */
