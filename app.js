const products = [
  {id:1,name:"Sticker Sheet — Main Character",subtitle:"Vinilo mate · resistente al agua",price:4200,category:"stickers",badge:"BESTSELLER",image:"./assets/product-sheet.svg",hoverImage:"./assets/idea-notebook.svg"},
  {id:2,name:"Mini Tags — Pretty Things",subtitle:"Pack x12 · papel premium",price:3600,category:"papeleria",badge:"NEW",image:"./assets/product-tags.svg",hoverImage:"./assets/idea-package.svg"},
  {id:3,name:"Sticker Pack — Desk Crush",subtitle:"Pack x8 · troquel individual",price:4800,category:"stickers",badge:"DROP 01",image:"./assets/product-pack.svg",hoverImage:"./assets/idea-notebook.svg"},
  {id:4,name:"Name Labels — Your Version",subtitle:"Personalizadas · 24 unidades",price:5900,category:"personalizados",badge:"CUSTOM",image:"./assets/product-labels.svg",hoverImage:"./assets/idea-cup.svg"},
  {id:5,name:"Gift Kit — Wrap It Cute",subtitle:"Tags + stickers + tarjeta",price:7900,category:"papeleria",badge:"GIFTABLE",image:"./assets/product-giftkit.svg",hoverImage:"./assets/idea-package.svg"},
  {id:6,name:"Business Pack — Tiny Branding",subtitle:"Etiquetas para emprendimientos",price:11500,category:"personalizados",badge:"CUSTOM",image:"./assets/product-business.svg",hoverImage:"./assets/idea-package.svg"},
  {id:7,name:"Sticker Duo — Soft Reminder",subtitle:"Vinilo transparente · pack x2",price:2600,category:"stickers",badge:"NEW",image:"./assets/product-duo.svg",hoverImage:"./assets/idea-cup.svg"},
  {id:8,name:"Mini Note Set — Things To Do",subtitle:"Block + mini stickers",price:6500,category:"papeleria",badge:"STICKETAS PICK",image:"./assets/product-notes.svg",hoverImage:"./assets/idea-notebook.svg"}
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
        <img class="product-image product-image-primary" src="${p.image}" alt="${p.name}">
        ${p.hoverImage ? `<img class="product-image product-image-hover" src="${p.hoverImage}" alt="" aria-hidden="true">` : ""}
        <span class="product-badge ${p.badge === "CUSTOM" ? "product-badge-accent" : ""}">${p.badge}</span>

        <div class="quick-add-wrap">
          <span class="add-feedback" aria-hidden="true">added to your things</span>
          <button class="quick-add" data-add="${p.id}" aria-label="Agregar ${p.name} al carrito">
            <span class="quick-add-symbol">+</span>
          </button>
        </div>
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

  showAddFeedback(btn);
  addToCart(Number(btn.dataset.add));
});


function showAddFeedback(btn){
  const wrap = btn.closest(".quick-add-wrap");
  const symbol = btn.querySelector(".quick-add-symbol");

  btn.classList.remove("is-added");
  wrap?.classList.remove("show-feedback");
  void btn.offsetWidth;

  btn.classList.add("is-added");
  wrap?.classList.add("show-feedback");
  if(symbol) symbol.textContent = "✓";

  cartCount.classList.remove("cart-count-pop");
  void cartCount.offsetWidth;
  cartCount.classList.add("cart-count-pop");

  window.setTimeout(()=>{
    btn.classList.remove("is-added");
    wrap?.classList.remove("show-feedback");
    if(symbol) symbol.textContent = "+";
  }, 900);
}

function addToCart(id){
  const item = cart.find(i=>i.id===id);
  if(item) item.qty++;
  else cart.push({id,qty:1});
  persistCart();
  renderCart();
  openCart();
}

function removeFromCart(id, element) {
  element.classList.add("is-removing");

  setTimeout(() => {
    cart = cart.filter(i => i.id !== id);
    persistCart();
    renderCart();
  }, 280);
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

cartItems.addEventListener("click", e => {
  const btn = e.target.closest("[data-remove]");
  if (!btn) return;

  const item = btn.closest(".cart-item");

  removeFromCart(
    Number(btn.dataset.remove),
    item
  );
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

  const tel="5491158369279";

  if (!cart.length){
    return;
  }

  const items=cart.map(i=>{
    const p=products.find(p=>p.id===i.id);

    const subtotal = p.price * i.qty;

    return `• ${i.qty}x ${p.name}
    ${money(subtotal)}`;
  }).join("\n\n");

  const total = cart.reduce((acc, i) =>{
    const product = products.find(p => p.id === i.id);

    return acc + product.price * i.qty;
  }, 0)

  const message = `
    Hola! Quiero hacer este pedido en Sticketas ✦

    ${items}

    Total: ${money(total)}
      `.trim();

  const whatsappUrl =
    `https://wa.me/${tel}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");

  //alert("Demo: acá puede abrirse WhatsApp con el pedido prearmado. Despues reemplazamos por el numero real");
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
  document.querySelector("#newsletterMsg").textContent="Listo ✦ Esto se conectaría a tu plataforma de email. La idea es enviar newsletters y algun que otro cupon para enganche";
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


/* =========================================================
   STICKETAS IN REAL LIFE — galería escalable
   Agregá nuevos objetos a realLifeItems para sumar imágenes.
   ========================================================= */

const realLifeItems = [
  {
    image: "./assets/idea-notebook.svg",
    alt: "Notebook decorada con stickers Sticketas",
    caption: "your notes, but cuter"
  },
  {
    image: "./assets/idea-package.svg",
    alt: "Packaging decorado con etiquetas Sticketas",
    caption: "packaging crush"
  },
  {
    image: "./assets/idea-cup.svg",
    alt: "Vaso personalizado con stickers Sticketas",
    caption: "everyday things club"
  },
  {
    image: "./assets/idea-notebook.svg",
    alt: "Agenda y papelería intervenida con Sticketas",
    caption: "little details, big mood"
  },
  {
    image: "./assets/idea-package.svg",
    alt: "Packaging creativo con detalles Sticketas",
    caption: "made to make it yours"
  }
];

const lookbook = document.querySelector("#lookbook");
const ideasPrev = document.querySelector("#ideasPrev");
const ideasNext = document.querySelector("#ideasNext");

function getTiltClass(index){
  const pattern = ["tilt-left", "tilt-right", ""];
  return pattern[index % pattern.length];
}

function renderRealLife(){
  if(!lookbook) return;

  lookbook.innerHTML = realLifeItems.map((item, index) => `
    <figure class="idea-card ${getTiltClass(index)}">
      <img src="${item.image}" alt="${item.alt}" loading="lazy" />
      <figcaption>${item.caption}</figcaption>
    </figure>
  `).join("");
}

function scrollIdeas(direction){
  if(!lookbook) return;

  const firstCard = lookbook.querySelector(".idea-card");
  const gap = 20;
  const amount = firstCard
    ? firstCard.getBoundingClientRect().width + gap
    : lookbook.clientWidth * 0.75;

  lookbook.scrollBy({
    left: amount * direction,
    behavior: "smooth"
  });
}

ideasPrev?.addEventListener("click", () => scrollIdeas(-1));
ideasNext?.addEventListener("click", () => scrollIdeas(1));

renderRealLife();


renderProducts();
renderCart();
