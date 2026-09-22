import React,{useMemo,useState}from'react';
import{createRoot}from'react-dom/client';
import{Menu,Search,ShoppingBag,Plus,Minus,X,ArrowLeft,Heart,Drumstick}from'lucide-react';
import'./style.css';

const products=[
{id:1,cat:'Pollo frito',name:'Chicken Crunch',desc:'Pollo frito extra crujiente, dorado y recién hecho.',price:7990,img:'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=900&q=90'},
{id:2,cat:'Pollo frito',name:'Chucky Bucket',desc:'Bucket para compartir con piezas de pollo crujiente.',price:12990,img:'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=900&q=90'},
{id:3,cat:'Sushi',name:'Chucky Roll',desc:'Roll de la casa, cremoso, fresco y lleno de sabor.',price:6990,img:'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=90'},
{id:4,cat:'Sushi',name:'Crunch Roll',desc:'Roll crocante con topping y salsa de la casa.',price:7490,img:'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=900&q=90'},
{id:5,cat:'Combos',name:'Dúo Chucky',desc:'Pollo frito + roll para mezclar los dos mundos.',price:13990,img:'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=900&q=90'},
{id:6,cat:'Bebidas',name:'Bebida',desc:'Elige entre los sabores disponibles.',price:2000,img:'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=900&q=90'}
];
const cats=['Pollo frito','Sushi','Combos','Bebidas'];
const money=n=>'$'+n.toLocaleString('es-CL');

function App(){
 const[screen,setScreen]=useState('home'),[cat,setCat]=useState('Pollo frito'),[q,setQ]=useState(''),[cart,setCart]=useState({}),[selected,setSelected]=useState(null);
 const add=(id,e)=>{e?.stopPropagation();setCart(c=>({...c,[id]:(c[id]||0)+1}))};
 const sub=id=>setCart(c=>({...c,[id]:Math.max(0,(c[id]||0)-1)}));
 const count=Object.values(cart).reduce((a,b)=>a+b,0);
 const subtotal=products.reduce((s,p)=>s+(cart[p.id]||0)*p.price,0);
 const filtered=useMemo(()=>products.filter(p=>(screen==='search'||p.cat===cat)&&(!q||p.name.toLowerCase().includes(q.toLowerCase())||p.cat.toLowerCase().includes(q.toLowerCase()))),[screen,cat,q]);
 if(screen==='cart')return <Shell screen={screen} setScreen={setScreen} count={count}><Cart cart={cart} add={add} sub={sub} subtotal={subtotal} setScreen={setScreen}/></Shell>;
 return <Shell screen={screen} setScreen={setScreen} count={count}>
   <header className="topbar"><button><Menu/></button><div className="logo"><b>CHUCKY</b><span>CHICKEN × SUSHI</span></div><button onClick={()=>setScreen('cart')}><ShoppingBag/>{count>0&&<i>{count}</i>}</button></header>
   {screen==='home'&&<HomePage setScreen={setScreen} setCat={setCat} add={add} setSelected={setSelected}/>}
   {screen==='menu'&&<MenuPage cat={cat} setCat={setCat} filtered={filtered} add={add} setSelected={setSelected}/>}
   {screen==='search'&&<SearchPage q={q} setQ={setQ} filtered={filtered} add={add} setSelected={setSelected}/>}
   {selected&&<Detail p={selected} close={()=>setSelected(null)} add={add}/>}
 </Shell>
}
function HomePage({setScreen,setCat,add,setSelected}){return <main className="content">
 <section className="hero"><div className="heroCopy"><small>CRUNCH MEETS ROLL</small><h1>FRIED<br/><em>CHICKEN</em><br/>× SUSHI</h1><p>Dos antojos.<br/>Un solo lugar.</p><button onClick={()=>setScreen('menu')}>VER MENÚ ↗</button></div><img src={products[0].img}/><span className="stamp">CHUCKY<br/>MADE IT.</span></section>
 <div className="switchCards"><button onClick={()=>{setCat('Pollo frito');setScreen('menu')}}><Drumstick/><span><small>CRISPY SIDE</small><b>POLLO FRITO</b></span></button><button onClick={()=>{setCat('Sushi');setScreen('menu')}}><span className="rollIcon">◉</span><span><small>FRESH SIDE</small><b>SUSHI</b></span></button></div>
 <Title eyebrow="LOS IMPERDIBLES" title="CHUCKY PICKS"/>
 <div className="grid">{products.slice(0,4).map((p,i)=><Card key={p.id} p={p} add={add} setSelected={setSelected} featured={i===0}/>)}</div>
 </main>}
function MenuPage({cat,setCat,filtered,add,setSelected}){return <main className="content menuContent">
 <section className="menuHero"><small>¿QUÉ TOCA HOY?</small><h1>CRUNCH<br/>OR ROLL?</h1><p>Pollo brutalmente crujiente.<br/>Sushi hecho para repetir.</p></section>
 <nav className="tabs">{cats.map(c=><button className={cat===c?'on':''} onClick={()=>setCat(c)}>{c}</button>)}</nav>
 <Title eyebrow="ELIGE SIN MIEDO" title={cat}/>
 <div className="grid">{filtered.map(p=><Card key={p.id} p={p} add={add} setSelected={setSelected}/>)}</div>
 </main>}
function SearchPage({q,setQ,filtered,add,setSelected}){return <main className="content searchPage"><Title eyebrow="ENCUENTRA TU ANTOJO" title="BUSCAR"/><label className="searchBox"><Search/><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Pollo, sushi, combo..."/></label><div className="grid">{filtered.map(p=><Card key={p.id} p={p} add={add} setSelected={setSelected}/>)}</div></main>}
function Title({eyebrow,title}){return <div className="sectionTitle"><small>{eyebrow}</small><h2>{title}</h2></div>}
function Card({p,add,setSelected,featured}){return <article className="foodCard" onClick={()=>setSelected(p)}><div><img src={p.img}/>{featured&&<span>CHUCKY PICK</span>}</div><small>{p.cat}</small><h3>{p.name}</h3><p>{p.desc}</p><strong>{money(p.price)}</strong><button onClick={e=>add(p.id,e)}><Plus/></button></article>}
function Detail({p,close,add}){return <div className="detail"><div className="detailPhoto"><img src={p.img}/><button onClick={close}><ArrowLeft/></button><button className="heart"><Heart/></button></div><div className="detailBody"><small>{p.cat}</small><h1>{p.name}</h1><p>{p.desc}</p><strong>{money(p.price)}</strong><button className="bigAdd" onClick={e=>{add(p.id,e);close()}}>AGREGAR AL PEDIDO +</button></div></div>}
function Cart({cart,add,sub,subtotal,setScreen}){const items=products.filter(p=>cart[p.id]);return <main className="content cart"><button className="close" onClick={()=>setScreen('home')}><X/></button><Title eyebrow="CASI LISTO" title="TU PEDIDO"/>{items.length?items.map(p=><article className="cartItem"><img src={p.img}/><div><small>{p.cat}</small><b>{p.name}</b><strong>{money(p.price)}</strong></div><div className="qty"><button onClick={()=>sub(p.id)}><Minus/></button><span>{cart[p.id]}</span><button onClick={e=>add(p.id,e)}><Plus/></button></div></article>):<div className="empty"><b>EMPTY?</b><p>Eso se arregla con crunch o sushi.</p><button onClick={()=>setScreen('menu')}>IR AL MENÚ</button></div>}<div className="total"><span>TOTAL</span><b>{money(subtotal)}</b></div><button className="checkout" disabled={!items.length}>FINALIZAR PEDIDO ↗</button></main>}
function Shell({children,screen,setScreen,count}){return <div className="app"><div className="grain"/>{children}<nav className="nav"><button className={screen==='home'?'on':''} onClick={()=>setScreen('home')}><span>⌂</span><b>Inicio</b></button><button className={screen==='menu'?'on':''} onClick={()=>setScreen('menu')}><span>✦</span><b>Menú</b></button><button className={screen==='search'?'on':''} onClick={()=>setScreen('search')}><Search/><b>Buscar</b></button><button className={screen==='cart'?'on':''} onClick={()=>setScreen('cart')}><ShoppingBag/><b>Pedido</b>{count>0&&<i>{count}</i>}</button></nav></div>}
createRoot(document.getElementById('root')).render(<App/>);