import React,{useMemo,useState}from'react';import{createRoot}from'react-dom/client';import{Search,Plus,Minus,X,ShoppingBag,MapPin,Clock,ChevronRight}from'lucide-react';import'./style.css';

const cats=['Todos','Hamburguesas','Completos','Papas','Bebidas','Promos'];
const products=[
{id:1,cat:'Hamburguesas',name:'La Callejera',desc:'Doble carne, cheddar, tocino, cebolla caramelizada y salsa de la casa.',price:7900,img:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=85',tag:'Más pedido'},
{id:2,cat:'Hamburguesas',name:'La Chucky',desc:'Carne smash, queso fundido, pepinillos y salsa especial.',price:6900,img:'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=700&q=85'},
{id:3,cat:'Completos',name:'El Italiano',desc:'Vienesa, tomate, palta y mayo casera.',price:4900,img:'https://images.unsplash.com/photo-1612392062631-94dd858cba88?auto=format&fit=crop&w=700&q=85'},
{id:4,cat:'Papas',name:'Papas del Barrio',desc:'Papas crujientes, cheddar, carne y cebollín.',price:5900,img:'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=85'},
{id:5,cat:'Bebidas',name:'Bebida en lata',desc:'Elige tu sabor disponible.',price:1800,img:'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=700&q=85'},
{id:6,cat:'Promos',name:'Combo Chucky',desc:'La Chucky + papas + bebida. Todo resuelto.',price:9900,img:'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=700&q=85',tag:'Promo'}
];
const money=n=>'$'+n.toLocaleString('es-CL');

function App(){
 const[cat,setCat]=useState('Todos'),[q,setQ]=useState(''),[cart,setCart]=useState({}),[cartOpen,setCartOpen]=useState(false);
 const add=id=>setCart(c=>({...c,[id]:(c[id]||0)+1}));
 const sub=id=>setCart(c=>({...c,[id]:Math.max(0,(c[id]||0)-1)}));
 const count=Object.values(cart).reduce((a,b)=>a+b,0);
 const total=products.reduce((s,p)=>s+(cart[p.id]||0)*p.price,0);
 const visible=useMemo(()=>products.filter(p=>(cat==='Todos'||p.cat===cat)&&(!q||p.name.toLowerCase().includes(q.toLowerCase())||p.desc.toLowerCase().includes(q.toLowerCase()))),[cat,q]);
 const groups=cats.slice(1).map(c=>[c,visible.filter(p=>p.cat===c)]).filter(([,ps])=>ps.length);
 return <div className="app">
  <div className="cover"><div className="coverShade"/><div className="coverText"><span>FOODTRUCK · SAN JAVIER</span><h1>'ONDE EL CHUCKY</h1><p>Hamburguesas, completos y antojos hechos al momento.</p></div></div>
  <main>
   <section className="store">
    <div className="avatar">OC</div><div className="storeInfo"><h2>'Onde el Chucky</h2><div><span className="open">Abierto</span><span><Clock/> 20–35 min</span><span><MapPin/> San Javier</span></div></div>
   </section>
   <div className="notice"><b>🔥 Hoy se come rico.</b><span>Pide directo desde acá y nosotros hacemos el resto.</span></div>
   <label className="search"><Search/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar en el menú"/></label>
   <nav className="cats">{cats.map(c=><button className={cat===c?'active':''} onClick={()=>setCat(c)}>{c}</button>)}</nav>
   <section className="menu">
    {groups.length?groups.map(([c,ps])=><div className="group" key={c}><div className="groupTitle"><h3>{c}</h3><span>{ps.length} producto{ps.length!==1?'s':''}</span></div><div className="list">{ps.map(p=><article className="product" key={p.id}><div className="productCopy">{p.tag&&<small>{p.tag}</small>}<h4>{p.name}</h4><p>{p.desc}</p><b>{money(p.price)}</b></div><div className="photo"><img src={p.img}/>{cart[p.id]?<div className="stepper"><button onClick={()=>sub(p.id)}><Minus/></button><strong>{cart[p.id]}</strong><button onClick={()=>add(p.id)}><Plus/></button></div>:<button className="plus" onClick={()=>add(p.id)}><Plus/></button>}</div></article>)}</div></div>):<div className="noResults">No encontramos nada con “{q}”.</div>}
   </section>
  </main>
  <footer><strong>'ONDE EL CHUCKY</strong><span>Menú de demostración · productos y datos referenciales</span></footer>
  {count>0&&<button className="cartBar" onClick={()=>setCartOpen(true)}><span className="bubble">{count}</span><strong>Ver pedido</strong><b>{money(total)}</b><ChevronRight/></button>}
  {cartOpen&&<div className="overlay" onClick={()=>setCartOpen(false)}><aside onClick={e=>e.stopPropagation()}><div className="cartHead"><div><small>TU PEDIDO</small><h2>Revisa tu pedido</h2></div><button onClick={()=>setCartOpen(false)}><X/></button></div>{products.filter(p=>cart[p.id]).map(p=><div className="cartLine"><img src={p.img}/><div><strong>{p.name}</strong><span>{money(p.price)}</span></div><div className="qty"><button onClick={()=>sub(p.id)}><Minus/></button><b>{cart[p.id]}</b><button onClick={()=>add(p.id)}><Plus/></button></div></div>)}<div className="sum"><span>Total</span><b>{money(total)}</b></div><button className="checkout"><ShoppingBag/> Continuar pedido</button><p className="demo">Checkout de demostración por ahora.</p></aside></div>}
 </div>
}
createRoot(document.getElementById('root')).render(<App/>);
