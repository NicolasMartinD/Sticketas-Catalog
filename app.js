const products = [
  {id:1,name:"Sticker Sheet — Main Character",subtitle:"Vinilo mate · resistente al agua",price:4200,category:"stickers",badge:"BESTSELLER",image:"./assets/product-sheet.svg"},
  {id:2,name:"Mini Tags — Pretty Things",subtitle:"Pack x12 · papel premium",price:3600,category:"papeleria",badge:"NEW",image:"./assets/product-tags.svg"},
  {id:3,name:"Sticker Pack — Desk Crush",subtitle:"Pack x8 · troquel individual",price:4800,category:"stickers",badge:"DROP 01",image:"./assets/product-pack.svg"},
  {id:4,name:"Name Labels — Your Version",subtitle:"Personalizadas · 24 unidades",price:5900,category:"personalizados",badge:"CUSTOM",image:"./assets/product-labels.svg"},
  {id:5,name:"Gift Kit — Wrap It Cute",subtitle:"Tags + stickers + tarjeta",price:7900,category:"papeleria",badge:"GIFTABLE",image:"./assets/product-giftkit.svg"},
  {id:6,name:"Business Pack — Tiny Branding",subtitle:"Etiquetas para emprendimientos",price:11500,category:"personalizados",badge:"CUSTOM",image:"./assets/product-business.svg"},
  {id:7,name:"Sticker Duo — Soft Reminder",subtitle:"Vinilo transparente · pack x2",price:2600,category:"stickers",badge:"NEW",image:"./assets/product-duo.svg"},
  {id:8,name:"Mini Note Set — Things To Do",subtitle:"Block + mini stickers",price:6500,category:"papeleria",badge:"STICKETAS PICK",image:"./assets/product-notes.svg"}
];

const grid = document.querySelector("#productGrid");
const filterButtons = document.querySelectorAll(".filter-chip");
const cartDrawer = document.querySelector("#cartDrawer");
const backdrop = document.querySelector("#drawerBackdrop");
const cartBtn = document.querySelector("#cartBtn");
const closeCart = document.querySelector("#closeCart");
const cartItems = document.querySelector("#cartItems");
const cartCount = document.querySelector("#cartCount");
const cartTotal = document.querySelector("#cartTotal");
let cart = JSON.parse(localStorage.getItem("sticketas-cart") || "[]");

function money(n){
  return new Intl.NumberFormat("es-AR",{style:"currency",currency:"ARS",maximumFractionDigits:0}).format(n);
}

function renderProducts(filter="all"){
  const list = filter === "all" ? products : products.filter(p=>p.category===filter);
  grid.innerHTML = list.map(p=>`
    <article class="product-card">
      <div class="product-media">
        <img src="${p.image}" alt="${p.name}">
        <span class="product-badge">${p.badge}</span>
        <button class="quick-add" data-add="${p.id}" aria-label="Agregar ${p.name} al carrito">+</button>
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.subtitle}</p>
        <span class="product-price">${money(p.price)}</span>
      </div>
    </article>
  `).join("");
}

filterButtons.forEach(btn=>{
  btn.addEventListener("click",()=>{
    filterButtons.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts(btn.dataset.filter);
  });
});

grid.addEventListener("click",e=>{
  const btn = e.target.closest("[data-add]");
  if(!btn) return;
  addToCart(Number(btn.dataset.add));
});

function addToCart(id){
  const item = cart.find(i=>i.id===id);
  if(item) item.qty++;
  else cart.push({id,qty:1});
  persistCart();
  renderCart();
  openCart();
}

function removeFromCart(id){
  cart = cart.filter(i=>i.id!==id);
  persistCart();
  renderCart();
}

function persistCart(){
  localStorage.setItem("sticketas-cart",JSON.stringify(cart));
}

function renderCart(){
  cartCount.textContent = cart.reduce((a,i)=>a+i.qty,0);
  if(!cart.length){
    cartItems.innerHTML = `<div class="empty-cart">Todavía no pegaste<br>nada por acá.</div>`;
    cartTotal.textContent = money(0);
    return;
  }
  cartItems.innerHTML = cart.map(i=>{
    const p=products.find(p=>p.id===i.id);
    return `<div class="cart-item">
      <img src="${p.image}" alt="">
      <div><h4>${p.name}</h4><small>${i.qty} × ${money(p.price)}</small></div>
      <button class="remove-item" data-remove="${p.id}">Quitar</button>
    </div>`;
  }).join("");
  const total=cart.reduce((a,i)=>{
    const p=products.find(p=>p.id===i.id);
    return a+p.price*i.qty;
  },0);
  cartTotal.textContent=money(total);
}

cartItems.addEventListener("click",e=>{
  const btn=e.target.closest("[data-remove]");
  if(btn) removeFromCart(Number(btn.dataset.remove));
});

function openCart(){
  cartDrawer.classList.add("open");
  backdrop.classList.add("open");
  cartDrawer.setAttribute("aria-hidden","false");
  document.body.classList.add("no-scroll");
}
function closeCartFn(){
  cartDrawer.classList.remove("open");
  backdrop.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden","true");
  document.body.classList.remove("no-scroll");
}
cartBtn.addEventListener("click",openCart);
closeCart.addEventListener("click",closeCartFn);
backdrop.addEventListener("click",closeCartFn);

document.querySelector(".checkout-btn").addEventListener("click",()=>{
  const items=cart.map(i=>{
    const p=products.find(p=>p.id===i.id);
    return `${i.qty}x ${p.name}`;
  }).join("%0A");
  alert("Demo: acá puede abrirse WhatsApp con el pedido prearmado. Reemplazamos el numero y activamos el link cuando tengamos todo");
});

const searchPanel=document.querySelector("#searchPanel");
const searchBtn=document.querySelector("#searchBtn");
const searchClose=document.querySelector("#searchClose");
const searchInput=document.querySelector("#searchInput");
const searchResults=document.querySelector("#searchResults");

searchBtn.addEventListener("click",()=>{
  searchPanel.classList.add("open");
  searchPanel.setAttribute("aria-hidden","false");
  document.body.classList.add("no-scroll");
  setTimeout(()=>searchInput.focus(),100);
});
searchClose.addEventListener("click",closeSearch);
function closeSearch(){
  searchPanel.classList.remove("open");
  searchPanel.setAttribute("aria-hidden","true");
  document.body.classList.remove("no-scroll");
}
searchInput.addEventListener("input",()=>{
  const q=searchInput.value.trim().toLowerCase();
  const list=q ? products.filter(p=>(p.name+" "+p.subtitle+" "+p.category).toLowerCase().includes(q)) : [];
  searchResults.innerHTML=list.map(p=>`<a class="search-result" href="#shop" onclick="document.querySelector('#searchClose').click()">${p.name} · ${money(p.price)}</a>`).join("");
});

document.querySelector("#newsletterForm").addEventListener("submit",e=>{
  e.preventDefault();
  document.querySelector("#newsletterMsg").textContent="Listo ✦ esto se conectaría a tu plataforma de email. La idea es que demos a los clientes un newsletter o algun que otro cuponcito para enganche";
  e.currentTarget.reset();
});

// Drag & drop sólo para stickers decorativos.
document.querySelectorAll("[data-draggable]").forEach(el=>{
  const rotation=Number(el.dataset.rotation || 0);
  el.style.transform=`rotate(${rotation}deg)`;
  let dragging=false, startX=0, startY=0, baseLeft=0, baseTop=0;

  el.addEventListener("pointerdown",e=>{
    dragging=true;
    el.classList.add("dragging");
    const rect=el.getBoundingClientRect();
    const parent=el.offsetParent.getBoundingClientRect();
    baseLeft=rect.left-parent.left;
    baseTop=rect.top-parent.top;
    startX=e.clientX;
    startY=e.clientY;
    el.style.left=baseLeft+"px";
    el.style.top=baseTop+"px";
    el.style.right="auto";
    el.style.bottom="auto";
    el.setPointerCapture(e.pointerId);
  });

  el.addEventListener("pointermove",e=>{
    if(!dragging) return;
    const dx=e.clientX-startX, dy=e.clientY-startY;
    const parent=el.offsetParent;
    const maxX=parent.clientWidth-el.offsetWidth;
    const maxY=parent.clientHeight-el.offsetHeight;
    const x=Math.max(0,Math.min(maxX,baseLeft+dx));
    const y=Math.max(0,Math.min(maxY,baseTop+dy));
    el.style.left=x+"px";
    el.style.top=y+"px";
    el.style.transform=`rotate(${rotation + Math.max(-5,Math.min(5,dx/30))}deg) scale(1.03)`;
  });

  const end=()=>{
    dragging=false;
    el.classList.remove("dragging");
    el.style.transform=`rotate(${rotation}deg)`;
  };
  el.addEventListener("pointerup",end);
  el.addEventListener("pointercancel",end);
});

document.querySelector("#menuBtn").addEventListener("click",()=>{
  const target=document.querySelector("#colecciones");
  target.scrollIntoView({behavior:"smooth"});
});

renderProducts();
renderCart();
