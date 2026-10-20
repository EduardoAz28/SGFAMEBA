/* ===== CARRITO DE COMPRAS - SGFAMEBASAC ===== */
const NUMERO_WHATSAPP = "51999999999"; // <-- cambia por el número real (51 + número)
let carrito = JSON.parse(localStorage.getItem("carritoFameba")) || [];

const $ = (id) => document.getElementById(id);
const dinero = (n) => "S/ " + n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function guardar() { localStorage.setItem("carritoFameba", JSON.stringify(carrito)); }

function aviso(texto) {
  const a = $("aviso");
  a.textContent = texto;
  a.classList.add("ver");
  setTimeout(() => a.classList.remove("ver"), 1800);
}

function agregar(producto) {
  const existente = carrito.find((p) => p.id === producto.id);
  if (existente) existente.cantidad++;      // si ya está: 1 → 2 → 3 ...
  else carrito.push({ ...producto, cantidad: 1 });
  guardar();
  dibujar();
  aviso("✔ " + producto.nombre + " añadido");
  const b = $("btnCarrito");
  b.classList.remove("rebote"); void b.offsetWidth; b.classList.add("rebote");
}

function cambiarCantidad(id, delta) {
  const item = carrito.find((p) => p.id === id);
  if (!item) return;
  item.cantidad += delta;
  if (item.cantidad <= 0) carrito = carrito.filter((p) => p.id !== id);
  guardar();
  dibujar();
}

function quitar(id) {
  carrito = carrito.filter((p) => p.id !== id);
  guardar();
  dibujar();
}

function dibujar() {
  const cont = $("itemsCarrito");
  const totalUnidades = carrito.reduce((s, p) => s + p.cantidad, 0);
  const total = carrito.reduce((s, p) => s + p.precio * p.cantidad, 0);

  $("contadorCarrito").textContent = totalUnidades;
  $("totalCarrito").textContent = dinero(total);

  if (carrito.length === 0) {
    cont.innerHTML = '<div class="carrito-vacio"><i class="fa-solid fa-cart-shopping"></i>Tu carrito está vacío</div>';
    return;
  }

  cont.innerHTML = carrito.map((p, i) => `
    <div class="item">
      <div class="num">${i + 1}</div>
      <div>
        <div class="nombre">${p.nombre}</div>
        <div class="unit">${dinero(p.precio)} c/u</div>
        <div class="cantidad">
          <button onclick="cambiarCantidad('${p.id}',-1)">−</button>
          <span>${p.cantidad}</span>
          <button onclick="cambiarCantidad('${p.id}',1)">+</button>
        </div>
      </div>
      <div class="derecha">
        <div class="subtotal">${dinero(p.precio * p.cantidad)}</div>
        <button class="quitar" onclick="quitar('${p.id}')">Quitar</button>
      </div>
    </div>`).join("");
}

function abrir(estado) {
  $("panelCarrito").classList.toggle("abierto", estado);
  $("fondoCarrito").classList.toggle("abierto", estado);
}

function enviarWhatsapp() {
  if (carrito.length === 0) return aviso("Tu carrito está vacío");
  let msg = "Hola SGFAMEBASAC, deseo cotizar este pedido:%0A%0A";
  carrito.forEach((p, i) => {
    msg += `${i + 1}. ${p.nombre} x${p.cantidad} = ${dinero(p.precio * p.cantidad)}%0A`;
  });
  msg += `%0ATotal: ${dinero(carrito.reduce((s, p) => s + p.precio * p.cantidad, 0))}`;
  window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${msg}`, "_blank");
}

/* ===== EVENTOS ===== */
document.querySelectorAll(".btn-agregar").forEach((btn) => {
  btn.addEventListener("click", () => {
    const c = btn.closest(".producto");
    agregar({ id: c.dataset.id, nombre: c.dataset.nombre, precio: parseFloat(c.dataset.precio) });
  });
});

$("btnCarrito").addEventListener("click", () => abrir(true));
$("cerrarCarrito").addEventListener("click", () => abrir(false));
$("fondoCarrito").addEventListener("click", () => abrir(false));
$("btnVaciar").addEventListener("click", () => { carrito = []; guardar(); dibujar(); });
$("btnWhatsapp").addEventListener("click", enviarWhatsapp);

/* Filtros por categoría */
document.querySelectorAll(".filtros button").forEach((b) => {
  b.addEventListener("click", () => {
    document.querySelectorAll(".filtros button").forEach((x) => x.classList.remove("activo"));
    b.classList.add("activo");
    const f = b.dataset.filtro;
    document.querySelectorAll(".producto").forEach((p) => {
      p.style.display = f === "todos" || p.dataset.categoria === f ? "" : "none";
    });
  });
});

dibujar();