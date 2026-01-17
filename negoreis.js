/***********************
 * DADOS DOS PRODUTOS
 * Use `imgs` (array) para múltiplas fotos
 ***********************/
const products = [
  {
    id: 1,
    title: "Plano Família",
    price: "90,00",
    cat: "Planos",
    imgs: [
      "imagens/plano.png"
    ],
    desc: "Plano Mensal por apenas 90 reais, incluindo até 4 cortes no mês, podendo cortar qualquer familiar.\n\nContato: (32) 99185-6625.",
    whatsappMsg: "Opa! Tenho interesse no plano mensal de 90 reais, pode me passar mais detalhes?"
  },
  {
    id: 2,
    title: "Corte Tradicional",
    price: "30,00",
    cat: "Cortes",
    imgs: [
      "imagens/corte1.png",
      "imagens/corte2.png"
    ],
    desc: "Corte de cabelo clássico na tesoura ou máquina, acabamento preciso e finalização profissional.\n\nContato: (32) 99185-6625.",
    whatsappMsg: "Olá! Gostaria de marcar um horário para cortar o cabelo."
  },
  {
    id: 3,
    title: "Barba Completa",
    price: "10,00",
    cat: "Barbas",
    imgs: [
      "imagens/barba1.png",
      "imagens/barba2.png"
    ],
    desc: "Modelagem completa da barba com máquina, tesoura e navalha.\n\nContato: (32) 99185-6625.",
    whatsappMsg: "Olá! Tenho interesse em fazer a barba. Pode me passar mais detalhes?"
  },
  {
    id: 4,
    title: "Camisas Oakley",
    price: "80,00",
    cat: "Roupas",
    imgs: [
      "imagens/camisa1.jpg",
      "imagens/camisa2.jpg"
    ],
    desc: "Camiseta Oakley, tecido de alta qualidade, conforto e durabilidade.\n\nContato: (32) 99185-6625.",
    whatsappMsg: "Olá! Gostaria de saber mais sobre as camisetas Oakley."
  },
  {
    id: 5,
    title: "Curso de Barbeiro",
    price: "499,00",
    cat: "Cursos",
    imgs: [
      "imagens/curso1.png"
    ],
    desc: "Curso completo para quem quer entrar no mercado da barbearia. Do básico ao avançado, com prática real e técnicas atuais.\n\nContato: (32) 99185-6625.",
    whatsappMsg: "Olá! Tenho interesse no curso de barbeiro. Ele ainda está disponível?"
  }
];

/***********************
 * CONFIGURAÇÕES RÁPIDAS
 ***********************/
const whatsappPhone = "5532991856625"; // número em formato internacional sem sinais
const brandName = "Barbearia_Nego Reis";

/***********************
 * ELEMENTOS
 ***********************/
const grid = document.getElementById('grid');
const filtersEl = document.getElementById('filters');
const searchInput = document.getElementById('searchInput');
const qrBtn = document.getElementById('qrBtn');
const qrModal = document.getElementById('qrModal');
const qrcodeEl = document.getElementById('qrcode');
const catalogLink = document.getElementById('catalogLink');
const qrClose = document.getElementById('qrClose');
const copyBtn = document.getElementById('copyBtn');

const detailsModal = document.getElementById('detailsModal');
const carouselImg = document.getElementById('carouselImg');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const thumbsContainer = document.getElementById('thumbsContainer');
const detailTitle = document.getElementById('detailTitle');
const detailDesc = document.getElementById('detailDesc');
const detailPrice = document.getElementById('detailPrice');
const detailCat = document.getElementById('detailCat');
const detailWhats = document.getElementById('detailWhats');
const detailClose = document.getElementById('detailClose');
const closeDetailsBtn = document.getElementById('closeDetailsBtn');

/***********************
 * Monta lista de categorias
 ***********************/
const categories = ["Todos", ...Array.from(new Set(products.map(p => p.cat)))];
let activeCat = "Todos";
categories.forEach(cat => {
  const btn = document.createElement('button');
  btn.className = 'filter-btn ' + (cat === "Todos" ? "active" : "");
  btn.innerText = cat;
  btn.onclick = () => { document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); activeCat = cat; render(); }
  filtersEl.appendChild(btn);
});

/***********************
 * Renderiza produtos (cards)
 ***********************/
function render(){
  const q = (searchInput.value || "").toLowerCase().trim();
  grid.innerHTML = "";
  const filtered = products.filter(p => {
    const inCat = activeCat === "Todos" ? true : p.cat === activeCat;
    const matches = [p.title, p.desc, p.price, p.cat].join(" ").toLowerCase().includes(q);
    return inCat && matches;
  });
  if(filtered.length === 0){
    grid.innerHTML = `<div style="grid-column:1/-1;padding:22px;border-radius:10px;background:#fff;text-align:center;color:${getComputedStyle(document.documentElement).getPropertyValue('--muted')};">Nenhum produto encontrado.</div>`;
    return;
  }
  filtered.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    const thumbSrc = (p.imgs && p.imgs.length) ? p.imgs[0] : '';
    card.innerHTML = `
      <img class="thumb" src="${thumbSrc}" alt="${escapeHtml(p.title)}"onclick="showDetails(${p.id})" style="cursor:pointer;" />
      <div class="meta">
        <div>
          <div class="title">${escapeHtml(p.title)}</div>
          <div class="desc">${escapeHtml(p.desc)}</div>
        </div>
        <div style="text-align:right">
          <div class="price"><span class="currency">R$</span> ${escapeHtml(p.price)}</div>
          <div style="font-size:12px;color:var(--muted);margin-top:6px">${escapeHtml(p.cat)}</div>
        </div>
      </div>
      <div class="actions">
        
<button class="btn whatsapp-btn" onclick='openWhatsApp(${p.id})'>

  <img src="imagens/whatsapp.png" alt="WhatsApp">

  <span>WhatsApp</span>

</button>
        <button class="btn details" onclick='showDetails(${p.id})'>🔍 Detalhes</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function escapeHtml(str){ return (str||"").replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

/***********************
 * WhatsApp -> abre com mensagem predefinida
 ***********************/
function openWhatsApp(productId){
  const p = products.find(x=>x.id===productId);
  const msg = encodeURIComponent(`${p.whatsappMsg} (${brandName} / catálogo)`);
  const link = `https://wa.me/${whatsappPhone}?text=${msg}`;
  window.open(link, '_blank');
}

/***********************
 * Modal de detalhes + Carrossel
 ***********************/
let currentImages = [];
let currentIndex = 0;
let currentProductId = null;

function showDetails(productId){
  const p = products.find(x => x.id === productId);
  currentImages = (p.imgs && p.imgs.length) ? p.imgs.slice() : [''];
  currentIndex = 0;
  currentProductId = productId;

  carouselImg.src = currentImages[currentIndex] || '';
  detailTitle.innerText = p.title;
  detailDesc.innerText = p.desc;
  detailPrice.innerHTML = `<span class="currency">R$</span> ${escapeHtml(p.price)}`;
  detailCat.innerText = p.cat;

  // montar thumbs
  thumbsContainer.innerHTML = '';
  currentImages.forEach((src, idx) => {
    const t = document.createElement('img');
    t.src = src;
    t.alt = p.title + ' - ' + (idx+1);
    t.className = idx === 0 ? 'active' : '';
    t.onclick = () => { currentIndex = idx; updateCarousel(); }
    thumbsContainer.appendChild(t);
  });

  detailsModal.style.display = "flex";

  detailWhats.onclick = () => openWhatsApp(productId);
  detailClose.onclick = closeDetails;
  closeDetailsBtn.onclick = closeDetails;
}

function closeDetails(){
  detailsModal.style.display = "none";
}

function updateCarousel(){
  carouselImg.src = currentImages[currentIndex] || '';
  // atualizar classe nas thumbs
  Array.from(thumbsContainer.children).forEach((el, idx) => {
    if(idx === currentIndex) el.classList.add('active'); else el.classList.remove('active');
  });
}

function nextImg(){
  if(!currentImages.length) return;
  currentIndex = (currentIndex + 1) % currentImages.length;
  updateCarousel();
}

function prevImg(){
  if(!currentImages.length) return;
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  updateCarousel();
}

prevBtn.addEventListener('click', prevImg);
nextBtn.addEventListener('click', nextImg);

// fechar modal clicando fora do conteúdo
detailsModal.addEventListener('click', (e) => {
  if(e.target === detailsModal) closeDetails();
});

/***********************
 * Busca em tempo real
 ***********************/
searchInput.addEventListener('input', ()=>render());

/***********************
 * QR Code do catálogo
 ***********************/
qrBtn.addEventListener('click', ()=> {
  const url = location.href; // link atual (cada cliente terá seu link único)
  catalogLink.value = url;
  qrcodeEl.innerHTML = "";
  new QRCode(qrcodeEl, { text: url, width: 180, height: 180 });
  qrModal.style.display = 'flex';
});
qrClose.addEventListener('click', ()=>qrModal.style.display='none');
copyBtn.addEventListener('click', ()=> {
  catalogLink.select(); catalogLink.setSelectionRange(0,99999);
  document.execCommand('copy');
  copyBtn.innerText = "Copiado ✓";
  setTimeout(()=> copyBtn.innerText = "Copiar link", 1500);
});
// fechar QR clicando fora
qrModal.addEventListener('click', (e) => { if(e.target === qrModal) qrModal.style.display = 'none'; });

/***********************
 * Inicializa
 ***********************/

render();





