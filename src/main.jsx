import React,{useMemo,useState}from'react';import{createRoot}from'react-dom/client';import{Menu,Search,ShoppingCart,MapPin,Plus,Minus,X,ChevronRight,ArrowLeft,Trash2,Home,Grid2X2,Heart}from'lucide-react';import'./style.css';
const cats=['Hamburguesas','Papas','Bebidas','Extras'];
const CatIcon=({type})=>type==='Hamburguesas'?<svg viewBox="0 0 32 32"><path d="M6 14c1-6 19-6 20 0M5 18h22M7 22h18M9 26h14"/></svg>:type==='Papas'?<svg viewBox="0 0 32 32"><path d="M9 10l2 16h10l2-16M11 10l-1-6M15 10V3M19 10l1-7M23 10l2-5"/></svg>:type==='Bebidas'?<svg viewBox="0 0 32 32"><path d="M10 10h13l-2 17h-9L10 10ZM18 10l3-7M20 4h6"/></svg>:<svg viewBox="0 0 32 32"><circle cx="12" cy="13" r="5"/><circle cx="20" cy="19" r="5"/><path d="M8 23c4-3 12-11 16-14"/></svg>;
const data=[
{id:1,cat:'Hamburguesas',name:'Clásica',desc:'Carne, queso cheddar, lechuga, tomate, cebolla y salsa de la casa.',price:6500,img:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=90'},
{id:2,cat:'Hamburguesas',name:'Doble',desc:'Doble carne, doble queso, lechuga, tomate, cebolla y salsa de la casa.',price:8500,img:'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=700&q=90'},
{id:3,cat:'Hamburguesas',name:'Bacon',desc:'Carne, queso cheddar, tocino crujiente, cebolla crispy y salsa BBQ.',price:7900,img:'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=700&q=90'},
{id:4,cat:'Hamburguesas',name:'Especial',desc:'Carne, queso, tocino, huevo, lechuga, tomate, cebolla y salsa de la casa.',price:8900,img:'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=700&q=90'},
{id:5,cat:'Completos',name:'Completo Italiano',desc:'Vienesa, tomate, palta y mayo.',price:4500,img:'https://images.unsplash.com/photo-1612392062631-94dd858cba88?auto=format&fit=crop&w=700&q=90'},
{id:6,cat:'Completos',name:'Completo Dinámico',desc:'Vienesa, tomate, palta, mayo y mostaza.',price:4500,img:'https://images.unsplash.com/photo-1612392062631-94dd858cba88?auto=format&fit=crop&w=700&q=90'},
{id:7,cat:'Completos',name:'Completo Chacarero',desc:'Vienesa, tomate, palta, porotos verdes y mayo.',price:4800,img:'https://images.unsplash.com/photo-1612392062631-94dd858cba88?auto=format&fit=crop&w=700&q=90'},
{id:8,cat:'Papas',name:'Papas Grandes',desc:'Papas fritas doradas y crujientes.',price:3500,img:'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=90'},
{id:9,cat:'Papas',name:'Papas Cheddar',desc:'Papas crujientes con cheddar.',price:4000,img:'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=90'},
{id:10,cat:'Bebidas',name:'Bebida en lata',desc:'Elige tu sabor disponible.',price:2000,img:'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=700&q=90'},
{id:11,cat:'Promos',name:'Combo',desc:'Hamburguesa + papas + bebida.',price:9900,img:'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=700&q=90'}];
const money=n=>'$'+n.toLocaleString('es-CL');
function App(){const[screen,setScreen]=useState('intro'),[cat,setCat]=useState('Hamburguesas'),[q,setQ]=useState(''),[cart,setCart]=useState({}),[selected,setSelected]=useState(null),[note,setNote]=useState('');
const add=(id,e)=>{e?.stopPropagation();setCart(c=>({...c,[id]:(c[id]||0)+1}))},sub=(id,e)=>{e?.stopPropagation();setCart(c=>({...c,[id]:Math.max(0,(c[id]||0)-1)}))};
const count=Object.values(cart).reduce((a,b)=>a+b,0),subtotal=data.reduce((s,p)=>s+(cart[p.id]||0)*p.price,0),delivery=count?2000:0,total=subtotal+delivery;
const filtered=useMemo(()=>data.filter(p=>(screen==='search'||p.cat===cat)&&(!q||p.name.toLowerCase().includes(q.toLowerCase())||p.desc.toLowerCase().includes(q.toLowerCase()))),[cat,q,screen]);
if(screen==='intro')return <div className="intro introExact"><img src="/intro-cover.jpg?v=20260921-2" alt="'Onde el Chucky Street Food"/><button className="introHotspot" aria-label="Comenzar" onClick={()=>setScreen('home')}></button></div>;
if(screen==='promos')return <Shell screen={screen} setScreen={setScreen} count={count}><div className="darkScreen"><h1>Promociones</h1><p>MÁS SABOR, MÁS PLANES</p>{data.filter(x=>x.cat==='Promos').concat(data.filter(x=>x.cat==='Papas').slice(0,1)).map(p=><article className="promoCard"><img src={p.img}/><div><b>{p.name.toUpperCase()}</b><span>{p.desc}</span><strong>{money(p.price)}</strong></div><button onClick={e=>add(p.id,e)}><Plus/></button></article>)}</div></Shell>;
if(screen==='search')return <Shell screen={screen} setScreen={setScreen} count={count}><div className="darkScreen searchScreen"><h1>Buscar</h1><p>ENCUENTRA TU ANTOJO</p><label><Search/><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar..."/></label>{filtered.map(p=><ProductRow p={p} add={add} setSelected={setSelected}/>)}</div></Shell>;
if(screen==='cart')return <Cart cart={cart} data={data} add={add} sub={sub} note={note} setNote={setNote} subtotal={subtotal} delivery={delivery} total={total} setScreen={setScreen}/>;
return <Shell screen={screen} setScreen={setScreen} count={count}><header className="top homeTop"><button><Menu/></button><div className="brand"><strong>'ONDE<br/>EL CHUCKY</strong><span>STREET FOOD</span></div><button onClick={()=>setScreen('cart')} className="cartIcon"><ShoppingCart/>{count>0&&<i>{count}</i>}</button></header><main className="home">
{screen==='home'&&<><section className="homeFreshHero"><div className="freshCopy"><small>STREET FOOD · SAN JAVIER</small><h1>ANTOJO<br/><span>SIN VUELTAS.</span></h1><p>Hamburguesas, papas y completos.<br/>Pide lo que de verdad querías.</p><button onClick={()=>setScreen('menu')}>VER MENÚ <b>→</b></button></div><img src="/chucky-mascot-final.png?v=3" alt="Mascota Onde el Chucky"/><div className="freshStamp">BUENA<br/>COMIDA<br/><b>SIEMPRE.</b></div></section><nav className="freshCats">{cats.map(c=><button onClick={()=>{setCat(c==='Extras'?'Completos':c);setScreen('menu')}}><CatIcon type={c}/><span>{c}</span></button>)}</nav><div className="freshTitle"><div><small>LOS FAVORITOS</small><h2>LO MÁS PEDIDO</h2></div><button onClick={()=>setScreen('menu')}>VER TODO →</button></div><div className="freshPopular">{[data[0],data[3],data[8]].map(p=><article onClick={()=>setSelected(p)}><img src={p.img}/><div><b>{p.name==='Clásica'?'Chucky Clásica':p.name==='Especial'?'Chucky Especial':p.name}</b><strong>{money(p.price)}</strong></div><button onClick={e=>add(p.id,e)}><Plus/></button></article>)}</div><section className="freshCombo" onClick={()=>setScreen('promos')}><img src={data[10].img}/><div><small>PARA COMPARTIR · O NO</small><strong>COMBOS</strong><b>Hamburguesa + papas + bebida</b><button>VER COMBOS →</button></div></section></>}
{screen==='menu'&&<><section className="menuPosterHero"><img src={data.find(p=>p.cat===cat)?.img||data[0].img} alt={cat}/><div className="mphShade"/><div className="mphCopy"><span>{cat==='Hamburguesas'?'HAMBUR-\nGUESAS':cat.toUpperCase()}</span><b>{cat==='Hamburguesas'?'CARNE, SABOR\nY ACTITUD.':cat==='Completos'?'CARGADOS Y\nSIN VERGÜENZA.':cat==='Papas'?'CRUJIENTES\nHASTA EL FINAL.':'FRÍAS. COMO\nTIENE QUE SER.'}</b></div><div className="mphDoodle">GOOD<br/>FOOD<br/><strong>BAD<br/>MOOD</strong></div><div className="mphTape">{cat.toUpperCase()}<br/>COMO DEBE SER</div><div className="mphCrown">♕</div></section><nav className="menuPosterTabs">{['Hamburguesas','Completos','Papas','Bebidas'].map(c=><button className={cat===c?'on':''} onClick={()=>setCat(c)}><CatIcon type={c}/><span>{c}</span></button>)}</nav><div className="menuPosterGrid">{filtered.map((p,i)=><ProductRow key={p.id} p={p} index={i} add={add} setSelected={setSelected}/>)}</div></>}
</main>{selected&&<Detail p={selected} close={()=>setSelected(null)} add={add} sub={sub} qty={cart[selected.id]||1}/>}</Shell>}
function ProductRow({p,add,setSelected,index=0}){return <article className={"menuV3Card "+(index===0?'featured':'')} onClick={()=>setSelected(p)}><div className="menuV3Photo"><img src={p.img} alt={p.name}/>{index===0&&<span>FAVORITA</span>}</div><div className="menuV3Info"><small>{p.cat}</small><h3>{p.name}</h3><p>{p.desc}</p><strong>{money(p.price)}</strong></div><button className="menuV3Plus" onClick={e=>add(p.id,e)}><Plus/></button></article>}
function Shell({children,screen,setScreen,count}){return <div className="page">{children}<nav className="bottomNav"><button className={screen==='home'?'on':''} onClick={()=>setScreen('home')}><Home/><span>Inicio</span></button><button className={screen==='menu'?'on':''} onClick={()=>setScreen('menu')}><Grid2X2/><span>Menú</span></button><button className={screen==='search'?'on':''} onClick={()=>setScreen('search')}><Search/><span>Buscar</span></button><button className={screen==='cart'?'on':''} onClick={()=>setScreen('cart')}><ShoppingCart/><span>Pedido</span>{count>0&&<i>{count}</i>}</button></nav></div>}
function Detail({p,close,add,sub,qty}){return <div className="productV2">
  <div className="pv2Photo">
    <img src={p.img} alt={p.name}/>
    <div className="pv2Shade"/>
    <button className="pv2Back" onClick={close}><ArrowLeft/></button>
    <button className="pv2Heart"><Heart/></button>
    <div className="pv2Sticker">LA CLÁSICA<br/>NUNCA FALLA!</div>
  </div>
  <main className="pv2Main">
    <div className="pv2Title"><h1>{p.name}</h1><strong>{money(p.price)}</strong></div>
    <p className="pv2Desc">{p.desc}</p>
    <div className="pv2Scribble">GOOD FOOD<br/><b>BAD MOOD</b></div>
    <h2>PERSONALIZA TU HAMBURGUESA</h2>
    <div className="pv2Options">
      <button><span><CatIcon type="Hamburguesas"/><b>Tipo de carne</b></span><em>Normal <ChevronRight/></em></button>
      <button><span><CatIcon type="Papas"/><b>Extras</b></span><em>0 seleccionados <ChevronRight/></em></button>
      <button><span className="pv2SauceIcon">S</span><b>Salsas</b><em>0 seleccionadas <ChevronRight/></em></button>
    </div>
  </main>
  <footer className="pv2Bar">
    <div className="pv2Qty"><button onClick={e=>sub(p.id,e)}><Minus/></button><b>{qty}</b><button onClick={e=>add(p.id,e)}><Plus/></button></div>
    <button className="pv2Add" onClick={e=>{add(p.id,e);close()}}>AGREGAR <span>{money(p.price)}</span></button>
  </footer>
</div>}
function Cart({cart,data,add,sub,note,setNote,subtotal,delivery,total,setScreen}){const items=data.filter(p=>cart[p.id]);return <div className="cartV2">
  <header className="cv2Head"><div><small>CASI TUYO</small><h1>TU PEDIDO</h1><p>{items.length?items.length+' antojo'+(items.length>1?'s':'')+' en la bolsa':'LA BOLSA ESTÁ PIDIENDO COMIDA'}</p></div><button onClick={()=>setScreen('home')}><X/></button></header>
  <div className="cv2Doodle">GOOD FOOD<br/><b>GOOD MOOD</b></div>
  {items.length>0?<section className="cv2Items">{items.map(p=><article><img src={p.img}/><div><small>{p.cat}</small><b>{p.name}</b><strong>{money(p.price)}</strong><div className="cv2MiniQty"><button onClick={e=>sub(p.id,e)}><Minus/></button><span>{cart[p.id]}</span><button onClick={e=>add(p.id,e)}><Plus/></button></div></div></article>)}</section>:<section className="cv2Empty"><span>♕</span><h2>¿NADA TODAVÍA?</h2><p>Eso se arregla con una hamburguesa.</p><button onClick={()=>setScreen('menu')}>VER MENÚ →</button></section>}
  <label className="cv2Note"><span>NOTA PARA LA COCINA</span><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Sin cebolla, extra salsa, bien tostado..."/></label>
  <section className="cv2Summary"><small>RESUMEN</small><p><span>Subtotal</span><b>{money(subtotal)}</b></p><p><span>Envío</span><b>{money(delivery)}</b></p><div><span>TOTAL</span><strong>{money(total)}</strong></div></section>
  <button className="cv2Finish" disabled={!items.length} onClick={()=>items.length&&setScreen('confirm')}><span>FINALIZAR PEDIDO</span><b>{money(total)} →</b></button>
  <section className="cv2Upsell"><div><small>POR SI QUEDÓ HAMBRE</small><h2>AGRÉGALE ALGO</h2></div><div className="cv2UpsellGrid">{data.filter(p=>['Papas','Bebidas'].includes(p.cat)&&!cart[p.id]).slice(0,3).map(p=><article><img src={p.img}/><div><b>{p.name}</b><span>{money(p.price)}</span></div><button onClick={e=>add(p.id,e)}><Plus/></button></article>)}</div></section>
</div>}
createRoot(document.getElementById('root')).render(<App/>);