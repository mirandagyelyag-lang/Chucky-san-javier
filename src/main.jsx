import React,{useMemo,useState}from'react';
import{createRoot}from'react-dom/client';
import{Menu,Search,ShoppingBag,Plus,Minus,X,ArrowLeft,Heart,Drumstick,ChevronRight,Sparkles,Home,UtensilsCrossed}from'lucide-react';
import'./style.css';

const products=[
{id:1,cat:'Pollo frito',name:'Crujiente Chucky',desc:'Pollo frito extra crujiente, dorado y recién hecho.',price:7990,img:'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=1000&q=90'},
{id:2,cat:'Pollo frito',name:'Balde Chucky',desc:'Balde para compartir con piezas de pollo crujiente.',price:12990,img:'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1000&q=90'},
{id:3,cat:'Sushi',name:'Roll Chucky',desc:'Roll de la casa, cremoso, fresco y lleno de sabor.',price:6990,img:'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1000&q=90'},
{id:4,cat:'Sushi',name:'Roll Crocante',desc:'Roll crocante con cubierta y salsa de la casa.',price:7490,img:'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=1000&q=90'},
{id:5,cat:'Combos',name:'Dúo Chucky',desc:'Pollo frito + roll para mezclar los dos mundos.',price:13990,img:'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1000&q=90'},
{id:6,cat:'Bebidas',name:'Bebida',desc:'Elige entre los sabores disponibles.',price:2000,img:'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=1000&q=90'},
{id:7,cat:'Salsas',name:'Salsa Chucky',desc:'El toque final para tu pedido.',price:800,img:'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=1000&q=90'}
];
const cats=['Pollo frito','Sushi','Combos','Bebidas','Salsas'];
const money=n=>'$'+n.toLocaleString('es-CL');

function App(){
 const initialScreen=()=>{try{const hash=window.location.hash.replace('#/','').replace('#','');return ['home','menu','cart'].includes(hash)?hash:(hash==='search'?'menu':'home')}catch{return 'home'}};
 const[screen,setScreenState]=useState(initialScreen),[cat,setCat]=useState('Pollo frito'),[q,setQ]=useState(''),[cart,setCart]=useState({}),[selected,setSelected]=useState(null);
 const setScreen=next=>{setScreenState(next);try{history.replaceState(null,'',next==='home'?window.location.pathname:window.location.pathname+'#/'+next)}catch{}};
 const add=(id,e)=>{e?.stopPropagation();setCart(c=>({...c,[id]:(c[id]||0)+1}))};
 const sub=id=>setCart(c=>({...c,[id]:Math.max(0,(c[id]||0)-1)}));
 const count=Object.values(cart).reduce((a,b)=>a+b,0);
 const subtotal=products.reduce((s,p)=>s+(cart[p.id]||0)*p.price,0);
 const filtered=useMemo(()=>products.filter(p=>p.cat===cat),[cat]);
 if(screen==='cart')return <Shell screen={screen} setScreen={setScreen} count={count}><Cart cart={cart} setCart={setCart} add={add} sub={sub} subtotal={subtotal} setScreen={setScreen}/></Shell>;
 return <Shell screen={screen} setScreen={setScreen} count={count}>
  <Topbar setScreen={setScreen} count={count}/>
  {screen==='home'&&<HomePage setScreen={setScreen} setCat={setCat} add={add} setSelected={setSelected}/>}
  {screen==='menu'&&<MenuPage cat={cat} setCat={setCat} filtered={filtered} add={add} setSelected={setSelected}/>}
  {selected&&<Detail p={selected} close={()=>setSelected(null)} add={add}/>}
 </Shell>
}

function Topbar({setScreen,count}){return <header className="topbar topbarConcept editorialTopbar">
 <button className="heroMenuBtn" aria-label="Abrir menú" onClick={()=>setScreen('menu')}><Menu/></button>
 <button className="brand brandConcept editorialBrand cleanChuckyBrand" onClick={()=>setScreen('home')} aria-label="Chucky · Pollo frito y sushi">
  <img className="chuckyHeaderTransparent" src="/chucky-header.png" alt="Chucky · Pollo frito x sushi"/>
 </button>
 <div className="topActions editorialActions">
  <button className="ghostBtn cartBtn premiumCart" onClick={()=>setScreen('cart')} aria-label="Ver pedido"><ShoppingBag/>{count>0&&<i>{count}</i>}</button>
 </div>
 </header>}

function HomePage({setScreen,setCat,add,setSelected}){
 const go=cat=>{setCat(cat);setScreen('menu')};
 const categoryItems=[
  ['Sushi','Rolls, handrolls y más.',products.find(p=>p.cat==='Sushi').img,'Sushi'],
  ['Pollo frito','Piezas, alitas y combos.',products[0].img,'Pollo frito'],
  ['Bebidas','Para acompañar.',products.find(p=>p.cat==='Bebidas').img,'Bebidas'],
  ['Salsas','El toque final.',products.find(p=>p.cat==='Salsas').img,'Salsas']
 ];
 const favorites=[products[0],products[2],products[4],products[3]];
 return <main className="content homeEditorial homeSales">
  <section className="editorialHero salesHero">
   <img src="/chucky-hero.png" alt="Pollo frito y sushi Chucky" loading="eager" fetchPriority="high"/>
   <div className="editorialHeroShade"/>
   <div className="editorialHeroCopy">
    <small>DOS ANTOJOS.<br/>UN SOLO CHUCKY.</small>
    <h1>Pollo frito<br/>y sushi.</h1><span className="editorialStroke"/><span className="heroCrown" aria-hidden="true">♛</span><span className="heroSideNote">MISMAS GANAS.<br/>MEJOR COMIDA.</span>
    <p>MITAD CRUJIENTE<br/>MITAD FRESCO<br/>100% CHUCKY</p>
    <button className="heroOrderPill" onClick={()=>setScreen('menu')}><span className="heroOrderText">Haz tu pedido</span><span className="heroOrderCircle">→</span></button>
   </div>
  </section>
  <section className="quickShop">
   <div className="quickTitle"><div><h2>¿Qué vas a pedir?</h2><p>TODO A UN TOQUE.</p></div></div>
   <div className="quickGrid">{categoryItems.map(([name,sub,img,target])=><button key={name} className="quickCard" onClick={()=>go(target)}>
    <img src={img} alt={name}/><span className="quickShade"/><span className="quickCopy"><b>{name}</b><small>{sub}</small></span><i>→</i>
   </button>)}</div>
  </section>
  <section className="homeFavorites">
   <div className="favoritesHead"><h2>Los más pedidos <span>♛</span></h2><button onClick={()=>setScreen('menu')}>Ver todos&nbsp; →</button></div>
   <div className="favoritesRail">{favorites.map(p=><article className="favoriteMini" key={p.id} onClick={()=>setSelected(p)}>
    <img src={p.img} alt={p.name}/><div><b>{p.name}</b><span>{money(p.price)}</span></div><button onClick={e=>add(p.id,e)} aria-label={'Agregar '+p.name}>+</button>
   </article>)}</div>
  </section>
 </main>
}
function MenuPage({cat,setCat,filtered,add,setSelected}){return <main className="content menuContent menuRedesign02">
 <section className="menuHero02">
  <img src="/chucky-pollo-hero.png" alt="" loading="eager"/>
  <div className="menuHero02Shade"/>
  <div className="menuHero02Copy">
   <small>DOS ANTOJOS. UN SOLO CHUCKY.</small>
   <h1>MENÚ</h1>
   <i aria-hidden="true"></i>
   <p>POLLO FRITO · SUSHI<br/>COMBOS · BEBIDAS</p>
  </div>
  <div className="menuHero02Note">POLLO<br/>+ SUSHI<br/>CHUCKY</div>
 </section>
 <nav className="menuTabs02">{cats.map(c=><button key={c} className={cat===c?'on':''} onClick={()=>setCat(c)}>
  <b>{c}</b>
 </button>)}</nav>
 <div className="menuTitle02"><div><small>MENÚ CHUCKY</small><h2>{cat}</h2></div><p>{filtered.length} opciones disponibles</p></div>
 <div className="menuList menuList02">{filtered.map((p,i)=><Card key={p.id} p={p} add={add} setSelected={setSelected} featured={i===0} wide/>)}</div>
 </main>}
function SearchPage({q,setQ,filtered,add,setSelected}){
 const[searchCat,setSearchCat]=useState('Todo');
 const visible=filtered.filter(p=>searchCat==='Todo'||p.cat===searchCat);
 return <main className="content searchPage searchRedesign02">
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
 <div className="foodPhoto"><img src={p.img}/><div className="photoShade"/>{featured&&<span className="pickTag"><Sparkles/> FAVORITO CHUCKY</span>}<span className="cardCat">{p.cat}</span></div>
 <div className="foodInfo"><div><h3>{p.name}</h3><p>{p.desc}</p></div><div className="priceRow"><strong>{money(p.price)}</strong><button onClick={e=>add(p.id,e)} aria-label={'Agregar '+p.name}><Plus/></button></div></div>
 </article>}

function Detail({p,close,add}){return <div className="detail">
 <div className="detailPhoto"><img src={p.img}/><div className="detailShade"/><button onClick={close}><ArrowLeft/></button><button className="heart"><Heart/></button><span>{p.cat}</span></div>
 <div className="detailBody"><small>SELECCIÓN CHUCKY</small><h1>{p.name}</h1><p>{p.desc}</p><div className="detailPrice"><strong>{money(p.price)}</strong><span>IVA incl.</span></div><button className="bigAdd" onClick={e=>{add(p.id,e);close()}}>AGREGAR AL PEDIDO <Plus/></button></div>
 </div>}

function Cart({cart,setCart,add,sub,subtotal,setScreen}){
 const items=products.filter(p=>cart[p.id]);
 const[customer,setCustomer]=useState({name:'',phone:'',email:'',delivery:'Retiro en local',address:'',notes:''});
 const[sending,setSending]=useState(false);
 const[sent,setSent]=useState(false);
 const[error,setError]=useState('');
 const change=e=>setCustomer(c=>({...c,[e.target.name]:e.target.value}));
 const emailOk=!customer.email.trim()||/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(customer.email.trim());
 const canSend=items.length&&customer.name.trim()&&customer.phone.trim()&&emailOk&&(customer.delivery==='Retiro en local'||customer.address.trim());
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
  data.append('Dirección',customer.delivery==='Despacho'?customer.address:'Retiro en local');
  data.append('Pedido',detail);
  data.append('Total',money(subtotal));
  data.append('Notas',customer.notes||'Sin notas');
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
  <div className="successMark"><img src="/chucky-nuevo.png" alt="Chucky"/></div>
  <small>PEDIDO ENVIADO</small>
  <h1>¡RECIBIDO!</h1>
  <p>El pedido fue enviado al negocio. Te contactaremos al teléfono indicado para confirmarlo.</p>
  <button className="backHome" onClick={()=>setScreen('home')}>VOLVER AL INICIO <ChevronRight/></button>
 </main>;
 return <main className={"content cart cartSmart"+(!items.length?" cartSmartEmpty":"")}>
 {items.length?<><div className="smartCartHead"><small>TU PEDIDO</small><h1>RESUMEN</h1><p>${items.reduce((s,p)=>s+cart[p.id],0)} productos</p></div>
  <section className="smartSummary">
   <div className="smartSummaryTop"><b>Productos</b><strong>{money(subtotal)}</strong></div>
   {items.map(p=><article className="smartCartItem" key={p.id}>
    <img src={p.img} alt={p.name}/>
    <div className="smartItemCopy"><b>{p.name}</b><span>{money(p.price)}</span></div>
    <div className="smartQty"><button onClick={()=>sub(p.id)}><Minus/></button><strong>{cart[p.id]}</strong><button onClick={e=>add(p.id,e)}><Plus/></button></div>
   </article>)}
   <div className="smartDelivery"><span>Entrega</span><b>Se calcula al confirmar</b></div>
   <div className="smartTotal"><span>TOTAL</span><strong>{money(subtotal)}</strong></div>
  </section>
  <button className="smartCheckoutJump" onClick={()=>document.querySelector('.customerForm')?.scrollIntoView({behavior:'smooth'})}>FINALIZAR PEDIDO <ChevronRight/></button>
  <section className="smartExtras"><div><small>¿ALGO MÁS?</small><b>Completa tu pedido</b></div><div className="smartSuggestions">
   {products.filter(p=>!cart[p.id]).slice(0,3).map(p=><button className="smartSuggest" key={p.id} onClick={e=>add(p.id,e)}><img src={p.img} alt=""/><span><b>{p.name}</b><small>{money(p.price)}</small></span><i>+</i></button>)}
  </div><button className="smartMore" onClick={()=>setScreen('menu')}>VER MÁS</button></section>
  <section className="customerForm smartCustomer">
   <div className="orderFormHead"><small>DATOS DEL CLIENTE</small><h2>¿A QUIÉN ENTREGAMOS?</h2></div>
   <label>Nombre<input name="name" value={customer.name} onChange={change} placeholder="Tu nombre" autoComplete="name"/></label>
   <label>Teléfono<input name="phone" value={customer.phone} onChange={change} placeholder="+56 9..." inputMode="tel" autoComplete="tel"/></label>
   <label>Correo <span className="optionalTag">OPCIONAL</span><input type="email" name="email" value={customer.email} onChange={change} placeholder="tu@correo.com" inputMode="email" autoComplete="email"/>{customer.email&&!emailOk&&<small className="fieldError">Escribe un correo válido.</small>}</label>
   <label>Tipo de entrega<select name="delivery" value={customer.delivery} onChange={change}><option>Retiro en local</option><option>Despacho</option></select></label>
   {customer.delivery==='Despacho'&&<label>Dirección<input name="address" value={customer.address} onChange={change} placeholder="Calle, número y comuna" autoComplete="street-address"/></label>}
   <label>Notas<textarea name="notes" value={customer.notes} onChange={change} placeholder="Salsas o indicaciones..."/></label>
  </section>
  {error&&<p className="orderError">{error}</p>}
  <button className="checkout smartFinal" disabled={!canSend||sending} onClick={sendOrder}>{sending?'ENVIANDO...':'HACER PEDIDO'} {!sending&&<ChevronRight/>}</button>
 </>:<div className="smartEmpty"><small>TU PEDIDO</small><div className="emptyPedidoArtwork" aria-hidden="true"></div><h1>Tu pedido está vacío.</h1><p>Toda buena historia empieza<br/>con algo delicioso.</p><button onClick={()=>setScreen('menu')}>IR AL MENÚ <ChevronRight/></button></div>}
 </main>}

function Shell({children,screen,setScreen,count}){return <div className="app"><div className="grain"/>{children}<nav className="nav chuckyNav">
 <button className={screen==='home'?'on':''} onClick={()=>setScreen('home')}><Home/><b>Inicio</b></button>
 <button className={screen==='menu'?'on':''} onClick={()=>setScreen('menu')}><UtensilsCrossed/><b>Menú</b></button>
 <button className={screen==='cart'?'on':''} onClick={()=>setScreen('cart')}><ShoppingBag/><b>Pedido</b>{count>0&&<i>{count}</i>}</button>
 </nav></div>}

createRoot(document.getElementById('root')).render(<App/>);
/* deploy-sync-2026-09-22 */

/* deploy-sync-footer-design */
