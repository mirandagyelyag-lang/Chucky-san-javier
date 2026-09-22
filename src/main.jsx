import React,{useMemo,useState}from'react';
import{createRoot}from'react-dom/client';
import{Menu,Search,ShoppingBag,Plus,Minus,X,ArrowLeft,Heart,Drumstick,ChevronRight,Sparkles}from'lucide-react';
import'./style.css';

const products=[
{id:1,cat:'Pollo frito',name:'Chicken Crunch',desc:'Pollo frito extra crujiente, dorado y recién hecho.',price:7990,img:'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=1000&q=90'},
{id:2,cat:'Pollo frito',name:'Chucky Bucket',desc:'Bucket para compartir con piezas de pollo crujiente.',price:12990,img:'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1000&q=90'},
{id:3,cat:'Sushi',name:'Chucky Roll',desc:'Roll de la casa, cremoso, fresco y lleno de sabor.',price:6990,img:'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1000&q=90'},
{id:4,cat:'Sushi',name:'Crunch Roll',desc:'Roll crocante con topping y salsa de la casa.',price:7490,img:'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=1000&q=90'},
{id:5,cat:'Combos',name:'Dúo Chucky',desc:'Pollo frito + roll para mezclar los dos mundos.',price:13990,img:'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1000&q=90'},
{id:6,cat:'Bebidas',name:'Bebida',desc:'Elige entre los sabores disponibles.',price:2000,img:'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=1000&q=90'}
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
  <Topbar setScreen={setScreen} count={count}/>
  {screen==='home'&&<HomePage setScreen={setScreen} setCat={setCat} add={add} setSelected={setSelected}/>}
  {screen==='menu'&&<MenuPage cat={cat} setCat={setCat} filtered={filtered} add={add} setSelected={setSelected}/>}
  {screen==='search'&&<SearchPage q={q} setQ={setQ} filtered={filtered} add={add} setSelected={setSelected}/>}
  {selected&&<Detail p={selected} close={()=>setSelected(null)} add={add}/>}
 </Shell>
}

function Topbar({setScreen,count}){return <header className="topbar topbarConcept">
 <button className="ghostBtn" aria-label="Abrir menú"><Menu/></button>
 <button className="brand brandConcept" onClick={()=>setScreen('home')}><span>CHUCKY</span><small>FRIED CHICKEN · SUSHI</small></button>
 <div className="topActions"><span className="notifyDot"/><button className="ghostBtn cartBtn" onClick={()=>setScreen('cart')} aria-label="Ver pedido"><ShoppingBag/>{count>0&&<i>{count}</i>}</button></div>
 </header>}


function HomePage({setScreen,setCat,add,setSelected}){const categoryCards=[
 {label:'POLLO FRITO',img:products[0].img,cat:'Pollo frito'},
 {label:'SUSHI',img:products[2].img,cat:'Sushi'},
 {label:'COMBOS',img:products[4].img,cat:'Combos'},
 {label:'EXTRAS',img:'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=90',cat:'Bebidas'}
];return <main className="content homeConcept">
 <section className="heroConcept">
   <div className="heroConceptCopy">
    <div className="scribbleCrown">♕</div>
    <h1><span>TOO GOOD</span><small>TO BE</small><em>INNOCENT.</em></h1>
    <p>Pollo frito. Sushi.<br/>La misma tentación, dos formas.</p>
    <button onClick={()=>setScreen('menu')}>VER MENÚ <ChevronRight/></button>
    <div className="heroDots"><i className="on"/><i/><i/></div>
   </div>
   <div className="heroConceptFood">
    <div className="bucketCard"><img src={products[0].img}/><span className="bucketBrand">CHUCKY</span><span className="bucketSmile">⌣</span></div>
    <div className="sushiBoard"><img src={products[2].img}/></div>
   </div>
 </section>

 <section className="categoryRail">
  {categoryCards.map(c=><button key={c.label} className="categoryTile" onClick={()=>{setCat(c.cat);setScreen('menu')}}>
    <img src={c.img}/><div/><span>{c.label}</span><b>›</b>
  </button>)}
 </section>

 <section className="popularHead"><div><small>LOS FAVORITOS</small><h2>POPULARES</h2></div><button onClick={()=>setScreen('menu')}>Ver todos <ChevronRight/></button></section>

 <section className="popularGrid">
  {products.slice(0,2).map((p,i)=><article key={p.id} className="popularCard" onClick={()=>setSelected(p)}>
    <div className="popularPhoto"><img src={p.img}/><button className="heartMini" onClick={e=>e.stopPropagation()}><Heart/></button>{i===0&&<span className="popularCrown">♕</span>}</div>
    <div className="popularInfo"><h3>{i===0?'Original Chucky':'Roll Diabólico'}</h3><p>{i===0?'Crujiente por fuera. Adictivo por dentro.':'Fresco, cremoso y con un toque spicy.'}</p><div><strong>{money(p.price)}</strong><button onClick={e=>add(p.id,e)}><Plus/></button></div></div>
  </article>)}
 </section>
 </main>}

function MenuPage({cat,setCat,filtered,add,setSelected}){return <main className="content menuContent">
 <section className="menuIntro">
  <div><small>いただきます</small><h1>ELIGE<br/><em>TU MOOD.</em></h1><p>Pollo crujiente, sushi fresco y cero vueltas.</p></div>
  <span>食</span>
 </section>
 <nav className="tabs">{cats.map(c=><button key={c} className={cat===c?'on':''} onClick={()=>setCat(c)}>{c}</button>)}</nav>
 <Headline kicker="MENÚ CHUCKY" title={cat} note={filtered.length+' opciones disponibles'}/>
 <div className="menuList">{filtered.map((p,i)=><Card key={p.id} p={p} add={add} setSelected={setSelected} wide={i%3===0}/>)}</div>
 </main>}

function SearchPage({q,setQ,filtered,add,setSelected}){return <main className="content searchPage">
 <Headline kicker="BUSCA SIN DAR VUELTAS" title="¿QUÉ SE TE ANTOJA?" note="Pollo, sushi, combo o bebida."/>
 <label className="searchBox"><Search/><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Escribe aquí..."/>{q&&<button onClick={()=>setQ('')}><X/></button>}</label>
 <div className="searchCount">{q?filtered.length+' resultados para “'+q+'”':'TODOS LOS SABORES'}</div>
 <div className="menuList">{filtered.map((p,i)=><Card key={p.id} p={p} add={add} setSelected={setSelected} wide={i%3===0}/>)}</div>
 </main>}

function Headline({kicker,title,note}){return <div className="headline"><small>{kicker}</small><div><h2>{title}</h2>{note&&<p>{note}</p>}</div></div>}

function Card({p,add,setSelected,featured,wide}){return <article className={'foodCard '+(wide?'wide':'')} onClick={()=>setSelected(p)}>
 <div className="foodPhoto"><img src={p.img}/><div className="photoShade"/>{featured&&<span className="pickTag"><Sparkles/> CHUCKY PICK</span>}<span className="cardCat">{p.cat}</span></div>
 <div className="foodInfo"><div><h3>{p.name}</h3><p>{p.desc}</p></div><div className="priceRow"><strong>{money(p.price)}</strong><button onClick={e=>add(p.id,e)} aria-label={'Agregar '+p.name}><Plus/></button></div></div>
 </article>}

function Detail({p,close,add}){return <div className="detail">
 <div className="detailPhoto"><img src={p.img}/><div className="detailShade"/><button onClick={close}><ArrowLeft/></button><button className="heart"><Heart/></button><span>{p.cat}</span></div>
 <div className="detailBody"><small>CHUCKY SELECTION</small><h1>{p.name}</h1><p>{p.desc}</p><div className="detailPrice"><strong>{money(p.price)}</strong><span>IVA incl.</span></div><button className="bigAdd" onClick={e=>{add(p.id,e);close()}}>AGREGAR AL PEDIDO <Plus/></button></div>
 </div>}

function Cart({cart,add,sub,subtotal,setScreen}){const items=products.filter(p=>cart[p.id]);return <main className="content cart">
 <div className="cartTop"><div><small>CHUCKY ORDER</small><h1>TU PEDIDO</h1></div><button className="close" onClick={()=>setScreen('home')}><X/></button></div>
 {items.length?items.map(p=><article className="cartItem" key={p.id}><img src={p.img}/><div className="cartCopy"><small>{p.cat}</small><b>{p.name}</b><strong>{money(p.price)}</strong></div><div className="qty"><button onClick={()=>sub(p.id)}><Minus/></button><span>{cart[p.id]}</span><button onClick={e=>add(p.id,e)}><Plus/></button></div></article>):<div className="empty"><span>空</span><b>ESTÁ VACÍO.</b><p>Eso se arregla rápido.</p><button onClick={()=>setScreen('menu')}>IR AL MENÚ <ChevronRight/></button></div>}
 <div className="bill"><div><span>Subtotal</span><b>{money(subtotal)}</b></div><div className="billTotal"><span>TOTAL</span><b>{money(subtotal)}</b></div></div>
 <button className="checkout" disabled={!items.length}>FINALIZAR PEDIDO <ChevronRight/></button>
 </main>}

function Shell({children,screen,setScreen,count}){return <div className="app"><div className="grain"/>{children}<nav className="nav">
 <button className={screen==='home'?'on':''} onClick={()=>setScreen('home')}><span>⌂</span><b>Inicio</b></button>
 <button className={screen==='menu'?'on':''} onClick={()=>setScreen('menu')}><span>食</span><b>Menú</b></button>
 <button className={screen==='search'?'on':''} onClick={()=>setScreen('search')}><Search/><b>Buscar</b></button>
 <button className={screen==='cart'?'on':''} onClick={()=>setScreen('cart')}><ShoppingBag/><b>Pedido</b>{count>0&&<i>{count}</i>}</button>
 </nav></div>}

createRoot(document.getElementById('root')).render(<App/>);