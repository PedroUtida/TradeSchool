//Produtos
var titulos = { livros: 'Livros escolares', materiais: 'Materiais escolares', enem: 'Livros para o ENEM' };
var imagens = { livros: 'img/apostila.jpg', materiais: 'img/material_escolar.jpg', enem: 'img/livros.jpg' };

var produtos = [
  { id: 1, cat: 'livros', nome: 'Matemática – Ensino Fundamental II', preco: 35.9 },
  { id: 2, cat: 'livros', nome: 'Português – Ensino Fundamental II', preco: 32.5 },
  { id: 3, cat: 'livros', nome: 'Ciências – 7º ano', preco: 29.9 },
  { id: 4, cat: 'livros', nome: 'Geografia – Ensino Médio', preco: 38.0 },
  { id: 5, cat: 'livros', nome: 'História – Ensino Médio', preco: 38.0 },
  { id: 6, cat: 'livros', nome: 'Inglês – Ensino Fundamental', preco: 27.5 },
  { id: 7, cat: 'materiais', nome: 'Lápis preto (caixa com 12)', preco: 14.9 },
  { id: 8, cat: 'materiais', nome: 'Borracha branca macia', preco: 2.5 },
  { id: 9, cat: 'materiais', nome: 'Caneta azul (kit com 4)', preco: 8.9 },
  { id: 10, cat: 'materiais', nome: 'Caderno universitário 10 matérias', preco: 22.0 },
  { id: 11, cat: 'materiais', nome: 'Estojo escolar', preco: 12.0 },
  { id: 12, cat: 'materiais', nome: 'Régua 30 cm e apontador', preco: 6.5 },
  { id: 13, cat: 'enem', nome: 'Memórias Póstumas de Brás Cubas', preco: 24.9 },
  { id: 14, cat: 'enem', nome: 'Dom Casmurro', preco: 22.9 },
  { id: 15, cat: 'enem', nome: 'O Cortiço', preco: 21.5 },
  { id: 16, cat: 'enem', nome: 'Vidas Secas', preco: 20.0 },
  { id: 17, cat: 'enem', nome: 'Iracema', preco: 18.9 },
  { id: 18, cat: 'enem', nome: 'Apostila de Redação ENEM', preco: 34.0 }
];

function fmt(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function limpar(texto) {
  return String(texto).replace(/[<>&]/g, '');
}

function achar(id) {
  for (var i = 0; i < produtos.length; i++) {
    if (produtos[i].id == id) return produtos[i];
  }
}

// Salvar e ler dados 
function lerNome() {
  try { return JSON.parse(window.name) || {}; } catch (e) { return {}; }
}

function pegar(chave, padrao) {
  var texto = lerNome()[chave];
  if (!texto) {
    try { texto = localStorage.getItem(chave); } catch (e) {}
  }
  try { return JSON.parse(texto) || padrao; } catch (e) { return padrao; }
}

function guardar(chave, valor) {
  var dados = lerNome();
  dados[chave] = JSON.stringify(valor);
  window.name = JSON.stringify(dados);
  try { localStorage.setItem(chave, dados[chave]); } catch (e) {}
}

// Carrinho
function salvarCarrinho(carrinho) {
  guardar('cart', carrinho);
  atualizarContador();
}

function atualizarContador() {
  var carrinho = pegar('cart', {});
  var total = 0;
  for (var id in carrinho) total += carrinho[id];
  var el = document.getElementById('cart-count');
  if (el) el.textContent = total;
}


function toast(msg) {
  var t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(timer);
  timer = setTimeout(function () { t.classList.remove('show'); }, 1800);
}


function mudarQtd(id, n) {
  var carrinho = pegar('cart', {});
  carrinho[id] = (carrinho[id] || 0) + n;
  if (carrinho[id] <= 0) delete carrinho[id];
  salvarCarrinho(carrinho);
  mostrarCarrinho();
}

function adicionar(id) {
  var carrinho = pegar('cart', {});
  carrinho[id] = (carrinho[id] || 0) + 1;
  salvarCarrinho(carrinho);
  toast('✔ ' + achar(id).nome + ' adicionado ao carrinho');
}

function removerItem(id) {
  var carrinho = pegar('cart', {});
  delete carrinho[id];
  salvarCarrinho(carrinho);
  mostrarCarrinho();
}

function mostrarCarrinho() {
  var corpo = document.getElementById('cart-items');
  if (!corpo) return;
  var carrinho = pegar('cart', {});
  var html = '', total = 0, qtd = 0;

  for (var id in carrinho) {
    var p = achar(id);
    if (!p) continue;
    total += p.preco * carrinho[id];
    qtd += carrinho[id];
    html += '<tr>' +
      '<td><div class="item-nome"><img class="mini-img" src="' + imagens[p.cat] + '" alt=""><span>' + p.nome + '</span></div></td>' +
      '<td>' + fmt(p.preco) + '</td>' +
      '<td><div class="qtd"><button onclick="mudarQtd(' + id + ', -1)">−</button><span>' + carrinho[id] +
      '</span><button onclick="mudarQtd(' + id + ', 1)">+</button></div></td>' +
      '<td><strong>' + fmt(p.preco * carrinho[id]) + '</strong></td>' +
      '<td><button class="btn perigo" onclick="removerItem(' + id + ')">Remover</button></td></tr>';
  }

  corpo.innerHTML = html;
  document.getElementById('cart-wrap').hidden = (qtd == 0);
  document.getElementById('cart-vazio').hidden = (qtd != 0);
  document.getElementById('cart-total').textContent = fmt(total);
  document.getElementById('cart-qtd').textContent = qtd + (qtd == 1 ? ' item' : ' itens');
}

function esvaziar() {
  salvarCarrinho({});
  mostrarCarrinho();
  toast('Carrinho esvaziado');
}

function comprar() {
  salvarCarrinho({});
  mostrarCarrinho();
  document.getElementById('modal-compra').hidden = false;
}

function fecharModal() {
  document.getElementById('modal-compra').hidden = true;
}

function iniciarCarrinho() {
  var modal = document.getElementById('modal-compra');
  if (!modal) return;
  document.getElementById('cart-limpar').onclick = esvaziar;
  document.getElementById('cart-finalizar').onclick = comprar;
  document.getElementById('modal-fechar').onclick = fecharModal;
  modal.onclick = function (e) { if (e.target == modal) fecharModal(); };
  document.onkeydown = function (e) { if (e.key == 'Escape') fecharModal(); };
  mostrarCarrinho();
}

//Header
function iniciarCabecalho() {
  var menu = document.getElementById('user-dropdown');
  document.getElementById('user-btn').onclick = function (e) {
    e.stopPropagation();
    menu.hidden = !menu.hidden;
  };
  document.onclick = function () { menu.hidden = true; };

  var campo = document.getElementById('search-input');
  var naHome = document.getElementById('carrosseis');
  document.getElementById('search-form').onsubmit = function (e) {
    e.preventDefault();
    if (naHome) mostrarProdutos(campo.value);
    else window.location.href = 'index.html?q=' + encodeURIComponent(campo.value);
  };
  if (naHome) campo.oninput = function () { mostrarProdutos(campo.value); };
}

//Carrossel
function rolar(botao, valor) {
  botao.parentNode.querySelector('.carousel-track').scrollBy({ left: valor, behavior: 'smooth' });
}


function mostrarProdutos(filtro) {
  var box = document.getElementById('carrosseis');
  if (!box) return;
  filtro = (filtro || '').trim().toLowerCase();
  var html = '';

  for (var cat in titulos) {
    var cards = '';
    for (var i = 0; i < produtos.length; i++) {
      var p = produtos[i];
      if (p.cat == cat && p.nome.toLowerCase().indexOf(filtro) != -1) {
        cards += '<article class="produto"><div class="img"><img src="' + imagens[cat] + '" alt=""></div>' +
          '<h3>' + p.nome + '</h3>' +
          '<span class="tipo">Doação / troca / venda solidária</span>' +
          '<span class="preco">' + fmt(p.preco) + '</span>' +
          '<button class="btn" onclick="adicionar(' + p.id + ')">Adicionar ao carrinho</button></article>';
      }
    }
    if (cards != '') {
      html += '<section class="categoria"><h2>' + titulos[cat] + '</h2><div class="carousel">' +
        '<button class="carousel-btn prev" onclick="rolar(this, -226)">‹</button>' +
        '<div class="carousel-track" onmouseover="parado = true" onmouseout="parado = false">' + cards + '</div>' +
        '<button class="carousel-btn next" onclick="rolar(this, 226)">›</button></div></section>';
    }
  }

  if (html == '') html = '<div class="card vazio">Nenhum produto encontrado para "' + limpar(filtro) + '".</div>';
  box.innerHTML = html;
}

//usuario
var camposUsuario = ['nome', 'email', 'telefone', 'cidade', 'estado', 'bairro'];

function mostrarPerfil() {
  var d = pegar('usuario', {});
  document.getElementById('perfil-resumo').hidden = !d.nome;
  if (!d.nome) return;
  document.getElementById('avatar').textContent = d.nome.trim().charAt(0).toUpperCase();
  document.getElementById('res-nome').textContent = d.nome;
  for (var i = 1; i < camposUsuario.length; i++) {
    document.getElementById('res-' + camposUsuario[i]).textContent = d[camposUsuario[i]] || '—';
  }
}

function iniciarUsuario() {
  var form = document.getElementById('user-form');
  if (!form) return;
  var salvo = pegar('usuario', {});
  for (var i = 0; i < camposUsuario.length; i++) {
    form[camposUsuario[i]].value = salvo[camposUsuario[i]] || '';
  }
  mostrarPerfil();

  form.onsubmit = function (e) {
    e.preventDefault();
    var d = {};
    for (var i = 0; i < camposUsuario.length; i++) {
      d[camposUsuario[i]] = form[camposUsuario[i]].value.trim();
    }
    guardar('usuario', d);
    mostrarPerfil();
    toast('✔ Dados salvos');
  };
}

//Anuncio
function mostrarAnuncios() {
  var lista = pegar('anuncios', []);
  var html = lista.length ? '' : '<p class="vazio">Você ainda não anunciou nenhum material.</p>';

  for (var i = 0; i < lista.length; i++) {
    var a = lista[i];
    var detalhe = (a.tipo == 'Venda' && a.preco) ? fmt(Number(a.preco)) : limpar(a.descricao);
    html += '<div class="anuncio"><span class="badge ' + (a.tipo == 'Doação' ? 'doar' : '') + '">' + a.tipo + '</span>' +
      '<strong>' + limpar(a.nome) + '</strong><span>' + a.categoria + ' • ' + a.condicao + '</span>' +
      '<span>' + detalhe + '</span>' +
      '<button class="btn perigo" onclick="excluirAnuncio(' + i + ')">Excluir</button></div>';
  }
  document.getElementById('anuncios-lista').innerHTML = html;
}

function excluirAnuncio(i) {
  var lista = pegar('anuncios', []);
  lista.splice(i, 1);
  guardar('anuncios', lista);
  mostrarAnuncios();
}

function iniciarAnuncios() {
  var form = document.getElementById('anuncio-form');
  if (!form) return;
  var campoPreco = document.getElementById('campo-preco');

  form.tipo.onchange = function () { campoPreco.hidden = (form.tipo.value != 'Venda'); };

  form.onsubmit = function (e) {
    e.preventDefault();
    var lista = pegar('anuncios', []);
    lista.unshift({
      nome: form.nome.value.trim(), categoria: form.categoria.value, condicao: form.condicao.value,
      tipo: form.tipo.value, preco: form.preco.value, descricao: form.descricao.value.trim()
    });
    guardar('anuncios', lista);
    form.reset();
    campoPreco.hidden = true;
    mostrarAnuncios();
    toast('✔ Material anunciado');
  };
  mostrarAnuncios();
}

document.addEventListener('DOMContentLoaded', function () {
  iniciarCabecalho();
  atualizarContador();
  var busca = new URLSearchParams(window.location.search).get('q') || '';
  document.getElementById('search-input').value = busca;
  mostrarProdutos(busca);
  setInterval(rolarSozinho, 3000);
  iniciarCarrinho();
  iniciarUsuario();
  iniciarAnuncios();
});
