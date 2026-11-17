/* ===== Troca Escolar - JS compartilhado por todas as páginas ===== */

const CATEGORIAS = [
  { id: 'livros', titulo: '📚 Livros escolares' },
  { id: 'materiais', titulo: '✏️ Materiais escolares' },
  { id: 'enem', titulo: '🎓 Livros para o ENEM' }
];

const PRODUCTS = [
  // Livros escolares
  { id: 1, cat: 'livros', nome: 'Matemática – Ensino Fundamental II', preco: 35.9, emoji: '📘' },
  { id: 2, cat: 'livros', nome: 'Português – Ensino Fundamental II', preco: 32.5, emoji: '📗' },
  { id: 3, cat: 'livros', nome: 'Ciências – 7º ano', preco: 29.9, emoji: '🔬' },
  { id: 4, cat: 'livros', nome: 'Geografia – Ensino Médio', preco: 38.0, emoji: '🌎' },
  { id: 5, cat: 'livros', nome: 'História – Ensino Médio', preco: 38.0, emoji: '🏛️' },
  { id: 6, cat: 'livros', nome: 'Inglês – Ensino Fundamental', preco: 27.5, emoji: '🔤' },
  // Materiais escolares
  { id: 7, cat: 'materiais', nome: 'Lápis preto (caixa com 12)', preco: 14.9, emoji: '✏️' },
  { id: 8, cat: 'materiais', nome: 'Borracha branca macia', preco: 2.5, emoji: '🧽' },
  { id: 9, cat: 'materiais', nome: 'Caneta azul (kit com 4)', preco: 8.9, emoji: '🖊️' },
  { id: 10, cat: 'materiais', nome: 'Caderno universitário 10 matérias', preco: 22.0, emoji: '📓' },
  { id: 11, cat: 'materiais', nome: 'Estojo escolar', preco: 12.0, emoji: '🎒' },
  { id: 12, cat: 'materiais', nome: 'Régua 30 cm e apontador', preco: 6.5, emoji: '📏' },
  // Livros para o ENEM
  { id: 13, cat: 'enem', nome: 'Memórias Póstumas de Brás Cubas', preco: 24.9, emoji: '📖' },
  { id: 14, cat: 'enem', nome: 'Dom Casmurro', preco: 22.9, emoji: '📕' },
  { id: 15, cat: 'enem', nome: 'O Cortiço', preco: 21.5, emoji: '📙' },
  { id: 16, cat: 'enem', nome: 'Vidas Secas', preco: 20.0, emoji: '📔' },
  { id: 17, cat: 'enem', nome: 'Iracema', preco: 18.9, emoji: '📚' },
  { id: 18, cat: 'enem', nome: 'Apostila de Redação ENEM', preco: 34.0, emoji: '📝' }
];

const fmt = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/* ---------- Armazenamento (localStorage com proteção) ---------- */
function lerJSON(chave, padrao) {
  try { return JSON.parse(localStorage.getItem(chave)) || padrao; }
  catch (e) { return padrao; }
}
function salvarJSON(chave, valor) {
  try { localStorage.setItem(chave, JSON.stringify(valor)); } catch (e) { /* ignora */ }
}

const getCart = () => lerJSON('cart', {});
function saveCart(c) { salvarJSON('cart', c); updateBadge(); }

function updateBadge() {
  const el = document.getElementById('cart-count');
  if (!el) return;
  el.textContent = Object.values(getCart()).reduce((a, b) => a + b, 0);
}

function toast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 1800);
}

function addToCart(id) {
  const c = getCart();
  c[id] = (c[id] || 0) + 1;
  saveCart(c);
  const p = PRODUCTS.find(x => x.id === id);
  toast('✔ ' + p.nome + ' adicionado ao carrinho');
}

/* ---------- Header: menu do usuário e busca ---------- */
function initHeader() {
  const btn = document.getElementById('user-btn');
  const dd = document.getElementById('user-dropdown');
  if (btn && dd) {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      dd.hidden = !dd.hidden;
      btn.setAttribute('aria-expanded', String(!dd.hidden));
    });
    document.addEventListener('click', e => {
      if (!dd.contains(e.target)) { dd.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    });
  }

  const form = document.getElementById('search-form');
  const input = document.getElementById('search-input');
  if (form && input) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (document.getElementById('carrosseis')) {
        renderCarousels(input.value);
      } else {
        window.location.href = 'index.html?q=' + encodeURIComponent(input.value);
      }
    });
    if (document.getElementById('carrosseis')) {
      input.addEventListener('input', () => renderCarousels(input.value));
    }
  }
  updateBadge();
}

/* ---------- Home: carrosséis ---------- */
function renderCarousels(filtro) {
  const box = document.getElementById('carrosseis');
  if (!box) return;
  const q = (filtro || '').trim().toLowerCase();
  box.innerHTML = '';
  let achou = false;

  CATEGORIAS.forEach(cat => {
    const lista = PRODUCTS.filter(p => p.cat === cat.id && p.nome.toLowerCase().includes(q));
    if (!lista.length) return;
    achou = true;

    const sec = document.createElement('section');
    sec.className = 'categoria';
    sec.innerHTML =
      '<h2>' + cat.titulo + '</h2>' +
      '<div class="carousel">' +
      '<button class="carousel-btn prev" aria-label="Anterior">‹</button>' +
      '<div class="carousel-track"></div>' +
      '<button class="carousel-btn next" aria-label="Próximo">›</button>' +
      '</div>';

    const track = sec.querySelector('.carousel-track');
    lista.forEach(p => {
      const card = document.createElement('article');
      card.className = 'produto';
      card.innerHTML =
        '<div class="img">' + p.emoji + '</div>' +
        '<h3></h3>' +
        '<span class="tipo">Doação / troca / venda solidária</span>' +
        '<span class="preco">' + fmt(p.preco) + '</span>' +
        '<button class="btn" type="button">Adicionar ao carrinho</button>';
      card.querySelector('h3').textContent = p.nome;
      card.querySelector('button').addEventListener('click', () => addToCart(p.id));
      track.appendChild(card);
    });

    const passo = () => 226;
    sec.querySelector('.prev').addEventListener('click', () => track.scrollBy({ left: -passo(), behavior: 'smooth' }));
    sec.querySelector('.next').addEventListener('click', () => track.scrollBy({ left: passo(), behavior: 'smooth' }));

    // Passagem automática (pausa ao passar o mouse)
    let pausado = false;
    track.addEventListener('mouseenter', () => pausado = true);
    track.addEventListener('mouseleave', () => pausado = false);
    track.addEventListener('touchstart', () => pausado = true, { passive: true });
    track._auto = setInterval(() => {
      if (pausado || !document.body.contains(track)) return;
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: passo(), behavior: 'smooth' });
      }
    }, 3000);

    box.appendChild(sec);
  });

  if (!achou) {
    box.innerHTML = '<div class="card vazio">Nenhum produto encontrado para "' +
      q.replace(/[<>&]/g, '') + '".</div>';
  }
}

/* ---------- Carrinho ---------- */
function renderCart() {
  const body = document.getElementById('cart-items');
  if (!body) return;
  const cart = getCart();
  const ids = Object.keys(cart).map(Number).filter(id => PRODUCTS.some(p => p.id === id));
  const wrap = document.getElementById('cart-wrap');
  const vazio = document.getElementById('cart-vazio');
  const totalEl = document.getElementById('cart-total');
  const qtdEl = document.getElementById('cart-qtd');

  body.innerHTML = '';
  if (!ids.length) {
    wrap.hidden = true; vazio.hidden = false;
    updateBadge();
    return;
  }
  wrap.hidden = false; vazio.hidden = true;

  let total = 0, qtdTotal = 0;
  ids.forEach(id => {
    const p = PRODUCTS.find(x => x.id === id);
    const q = cart[id];
    const sub = p.preco * q;
    total += sub; qtdTotal += q;

    const tr = document.createElement('tr');
    tr.innerHTML =
      '<td><div class="item-nome"><span class="mini">' + p.emoji + '</span><span></span></div></td>' +
      '<td>' + fmt(p.preco) + '</td>' +
      '<td><div class="qtd"><button data-a="menos" aria-label="Diminuir">−</button><span>' + q +
      '</span><button data-a="mais" aria-label="Aumentar">+</button></div></td>' +
      '<td><strong>' + fmt(sub) + '</strong></td>' +
      '<td><button class="btn perigo" data-a="remover">Remover</button></td>';
    tr.querySelector('.item-nome span:last-child').textContent = p.nome;
    tr.addEventListener('click', e => {
      const a = e.target.dataset && e.target.dataset.a;
      if (!a) return;
      const c = getCart();
      if (a === 'mais') c[id] = (c[id] || 0) + 1;
      if (a === 'menos') { c[id] = (c[id] || 0) - 1; if (c[id] <= 0) delete c[id]; }
      if (a === 'remover') delete c[id];
      saveCart(c);
      renderCart();
    });
    body.appendChild(tr);
  });

  totalEl.textContent = fmt(total);
  qtdEl.textContent = qtdTotal + (qtdTotal === 1 ? ' item' : ' itens');
  updateBadge();
}

function initCart() {
  const limpar = document.getElementById('cart-limpar');
  if (limpar) limpar.addEventListener('click', () => { saveCart({}); renderCart(); });
  const fin = document.getElementById('cart-finalizar');
  if (fin) fin.addEventListener('click', () => {
    toast('Pedido enviado! Obrigado por ajudar 💙');
    saveCart({});
    setTimeout(renderCart, 600);
  });
  renderCart();
}

/* ---------- Usuário ---------- */
function initUser() {
  const form = document.getElementById('user-form');
  if (!form) return;
  const campos = ['nome', 'email', 'telefone', 'cidade', 'estado', 'bairro'];

  function mostrar() {
    const d = lerJSON('usuario', null);
    const resumo = document.getElementById('perfil-resumo');
    if (!d || !d.nome) { resumo.hidden = true; return; }
    resumo.hidden = false;
    document.getElementById('avatar').textContent = d.nome.trim().charAt(0).toUpperCase();
    document.getElementById('res-nome').textContent = d.nome;
    campos.slice(1).forEach(c => {
      const el = document.getElementById('res-' + c);
      if (el) el.textContent = d[c] || '—';
    });
  }

  const salvo = lerJSON('usuario', {});
  campos.forEach(c => { if (salvo[c]) form[c].value = salvo[c]; });
  mostrar();

  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = {};
    campos.forEach(c => d[c] = form[c].value.trim());
    salvarJSON('usuario', d);
    mostrar();
    toast('✔ Dados salvos');
  });
}

/* ---------- Anunciar (troca / doação / venda) ---------- */
function initAnunciar() {
  const form = document.getElementById('anuncio-form');
  if (!form) return;
  const lista = document.getElementById('anuncios-lista');

  function render() {
    const itens = lerJSON('anuncios', []);
    lista.innerHTML = '';
    if (!itens.length) {
      lista.innerHTML = '<p class="vazio">Você ainda não anunciou nenhum material.</p>';
      return;
    }
    itens.forEach((a, i) => {
      const d = document.createElement('div');
      d.className = 'anuncio';
      d.innerHTML = '<span class="badge"></span><strong class="n"></strong><span class="c"></span>' +
        '<span class="p"></span><button class="btn perigo" type="button">Excluir</button>';
      const b = d.querySelector('.badge');
      b.textContent = a.tipo;
      if (a.tipo === 'Doação') b.classList.add('doar');
      d.querySelector('.n').textContent = a.nome;
      d.querySelector('.c').textContent = a.categoria + ' • ' + a.condicao;
      d.querySelector('.p').textContent = a.tipo === 'Venda' && a.preco ? fmt(Number(a.preco)) : (a.descricao || '');
      d.querySelector('button').addEventListener('click', () => {
        const l = lerJSON('anuncios', []); l.splice(i, 1); salvarJSON('anuncios', l); render();
      });
      lista.appendChild(d);
    });
  }

  const tipo = form.tipo, preco = document.getElementById('campo-preco');
  const ajustar = () => { preco.hidden = tipo.value !== 'Venda'; };
  tipo.addEventListener('change', ajustar); ajustar();

  form.addEventListener('submit', e => {
    e.preventDefault();
    const l = lerJSON('anuncios', []);
    l.unshift({
      nome: form.nome.value.trim(), categoria: form.categoria.value,
      condicao: form.condicao.value, tipo: form.tipo.value,
      preco: form.preco.value, descricao: form.descricao.value.trim()
    });
    salvarJSON('anuncios', l);
    form.reset(); ajustar(); render();
    toast('✔ Material anunciado');
  });
  render();
}

/* ---------- Inicialização ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q') || '';
  const input = document.getElementById('search-input');
  if (input && q) input.value = q;
  renderCarousels(q);
  initCart();
  initUser();
  initAnunciar();
});
