/* =====================================================
   RESERVAYA V3
   NÚCLEO PRINCIPAL
===================================================== */


/* =====================================================
   ESTADO GLOBAL
===================================================== */
// ==========================================
// SUPABASE
// ==========================================

const SUPABASE_URL = "https://mjxiyzapdybzckurootw.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ox1Wz7UT2Gw6uHOP6SncjQ_sGapEEB-";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
const ReservaYa = {

  version: "3.0.0",

  usuario: null,

  negocioActual: null,

  categoriaActual: "",

  negocios: [],

  favoritos: [],

  reservas: [],

  notificaciones: [],

  configuracion: {

    ubicacionActiva: false,

    notificacionesActivas: true

  }

};


/* =====================================================
   CATEGORÍAS
===================================================== */

const CATEGORIAS = [

  {
    id: "todos",
    nombre: "Todos",
    icono: "✨"
  },

  {
    id: "barberia",
    nombre: "Barbería",
    icono: "💈"
  },

  {
    id: "belleza",
    nombre: "Belleza",
    icono: "💅"
  },

  {
    id: "restaurante",
    nombre: "Restaurante",
    icono: "🍽️"
  },

  {
    id: "salud",
    nombre: "Salud",
    icono: "🩺"
  },

  {
    id: "fitness",
    nombre: "Fitness",
    icono: "🏋️"
  },

  {
    id: "spa",
    nombre: "Spa",
    icono: "🧖"
  },

  {
    id: "mascotas",
    nombre: "Mascotas",
    icono: "🐾"
  },

  {
    id: "automotriz",
    nombre: "Automotriz",
    icono: "🚗"
  },

  {
    id: "educacion",
    nombre: "Educación",
    icono: "📚"
  },

  {
    id: "profesional",
    nombre: "Profesional",
    icono: "💼"
  },

  {
    id: "otros",
    nombre: "Otros",
    icono: "📌"
  }

];


/* =====================================================
   INICIO
===================================================== */

document.addEventListener("DOMContentLoaded", iniciarReservaYa);


function iniciarReservaYa() {

  console.log(
    `ReservaYa V${ReservaYa.version} iniciando...`
  );

  cargarCategorias();

  cargarCategoriasFiltro();

  cargarDatosLocales();

  cargarDatosDemo();

  actualizarInterfazUsuario();

}


/* =====================================================
   DATOS LOCALES
===================================================== */

function cargarDatosLocales() {

  try {

    const favoritos =
      localStorage.getItem("reservaya_favoritos");

    if (favoritos) {

      ReservaYa.favoritos =
        JSON.parse(favoritos);

    }

  } catch (error) {

    console.warn(
      "No se pudieron cargar favoritos",
      error
    );

  }

}


/* =====================================================
   DATOS DEMO
===================================================== */

function cargarDatosDemo() {

  ReservaYa.negocios = [

    {
      id: "demo-1",
      nombre: "Urban Barber",
      categoria: "barberia",
      ciudad: "Villavicencio",
      ubicacion: "Centro",
      rating: 4.9,
      reseñas: 128,
      destacado: true
    },

    {
      id: "demo-2",
      nombre: "Belleza Studio",
      categoria: "belleza",
      ciudad: "Villavicencio",
      ubicacion: "Barzal",
      rating: 4.8,
      reseñas: 94,
      destacado: true
    },

    {
      id: "demo-3",
      nombre: "Fitness Zone",
      categoria: "fitness",
      ciudad: "Villavicencio",
      ubicacion: "La Esperanza",
      rating: 4.7,
      reseñas: 76,
      destacado: false
    },

    {
      id: "demo-4",
      nombre: "Clínica Salud Plus",
      categoria: "salud",
      ciudad: "Villavicencio",
      ubicacion: "Buque",
      rating: 4.9,
      reseñas: 215,
      destacado: true
    },

    {
      id: "demo-5",
      nombre: "Pet House",
      categoria: "mascotas",
      ciudad: "Villavicencio",
      ubicacion: "Cofrem",
      rating: 4.8,
      reseñas: 63,
      destacado: false
    },

    {
      id: "demo-6",
      nombre: "Auto Expert",
      categoria: "automotriz",
      ciudad: "Villavicencio",
      ubicacion: "Porfía",
      rating: 4.6,
      reseñas: 51,
      destacado: false
    }

  ];

  renderizarNegociosCercanos();

  renderizarDestacados();

}


/* =====================================================
   CATEGORÍAS
===================================================== */

function cargarCategorias() {

  const contenedor =
    document.getElementById("categoryGrid");

  if (!contenedor) return;

  contenedor.innerHTML = "";

  CATEGORIAS
    .filter(categoria => categoria.id !== "todos")
    .forEach(categoria => {

      const card =
        document.createElement("button");

      card.className = "category-card";

      card.innerHTML = `
        <span class="category-icon">
          ${categoria.icono}
        </span>

        <strong>
          ${escaparHTML(categoria.nombre)}
        </strong>
      `;

      card.onclick = () => {

        ReservaYa.categoriaActual =
          categoria.id;

        cambiarVista("search");

        document.getElementById(
          "categoryFilter"
        ).value = categoria.id;

        filtrarNegocios();

      };

      contenedor.appendChild(card);

    });

}


/* =====================================================
   SELECT DE CATEGORÍAS
===================================================== */

function cargarCategoriasFiltro() {

  const select =
    document.getElementById("categoryFilter");

  if (!select) return;

  CATEGORIAS
    .filter(c => c.id !== "todos")
    .forEach(categoria => {

      const option =
        document.createElement("option");

      option.value = categoria.id;

      option.textContent =
        categoria.nombre;

      select.appendChild(option);

    });

}


/* =====================================================
   NEGOCIOS CERCANOS
===================================================== */

function renderizarNegociosCercanos() {

  const contenedor =
    document.getElementById(
      "nearbyBusinesses"
    );

  if (!contenedor) return;

  const negocios =
    ReservaYa.negocios.slice(0, 3);

  contenedor.innerHTML =
    negocios.map(crearTarjetaNegocio).join("");

}


/* =====================================================
   DESTACADOS
===================================================== */

function renderizarDestacados() {

  const contenedor =
    document.getElementById(
      "featuredBusinesses"
    );

  if (!contenedor) return;

  const negocios =
    ReservaYa.negocios
      .filter(n => n.destacado);

  contenedor.innerHTML =
    negocios.map(crearTarjetaNegocio).join("");

}


/* =====================================================
   TARJETA DE NEGOCIO
===================================================== */

function crearTarjetaNegocio(negocio) {

  const categoria =
    CATEGORIAS.find(
      c => c.id === negocio.categoria
    );

  const icono =
    categoria?.icono || "📍";

  const favorito =
    ReservaYa.favoritos.includes(
      negocio.id
    );

  return `

    <article class="business-card">

      <div class="business-cover">
        ${icono}
      </div>

      <div class="business-info">

        <h3>
          ${escaparHTML(negocio.nombre)}
        </h3>

        <div class="business-category">
          ${escaparHTML(
            categoria?.nombre || "Negocio"
          )}
        </div>

        <div class="business-location">
          📍
          ${escaparHTML(
            negocio.ubicacion || negocio.ciudad
          )}
        </div>

        <div class="business-rating">
          ⭐ ${negocio.rating}
          · ${negocio.reseñas} reseñas
        </div>

        <div class="business-footer">

          <button
            class="secondary-button"
            onclick="alternarFavorito('${negocio.id}')"
          >
            ${favorito ? "♥ Guardado" : "♡ Guardar"}
          </button>

          <button
            class="primary-button"
            onclick="abrirNegocio('${negocio.id}')"
          >
            Ver negocio
          </button>

        </div>

      </div>

    </article>

  `;

}


/* =====================================================
   BUSCAR
===================================================== */

function buscarGlobal(texto) {

  const valor =
    texto.trim().toLowerCase();

  const suggestions =
    document.getElementById(
      "searchSuggestions"
    );

  if (!valor) {

    suggestions.classList.add("hidden");

    return;

  }

  const resultados =
    ReservaYa.negocios
      .filter(negocio => {

        return (

          negocio.nombre
            .toLowerCase()
            .includes(valor)

          ||

          negocio.ciudad
            .toLowerCase()
            .includes(valor)

          ||

          negocio.categoria
            .toLowerCase()
            .includes(valor)

        );

      })
      .slice(0, 5);

  suggestions.innerHTML =
    resultados.length

      ? resultados.map(n => `

          <button
            style="
              width:100%;
              padding:14px;
              background:white;
              text-align:left;
              border-bottom:1px solid #eee;
            "
            onclick="abrirNegocio('${n.id}')"
          >
            🔎
            ${escaparHTML(n.nombre)}
          </button>

        `).join("")

      : `
        <div style="padding:15px;color:#727887">
          No encontramos ese negocio todavía.
        </div>
      `;

  suggestions.classList.remove("hidden");

}


function ejecutarBusqueda() {

  const input =
    document.getElementById(
      "globalSearch"
    );

  const texto =
    input?.value.trim() || "";

  cambiarVista("search");

  document.getElementById(
    "searchInput"
  ).value = texto;

  filtrarNegocios();

}


/* =====================================================
   FILTRAR NEGOCIOS
===================================================== */

function filtrarNegocios() {

  const texto =
    document.getElementById(
      "searchInput"
    )?.value
      .toLowerCase()
      .trim() || "";

  const categoria =
    document.getElementById(
      "categoryFilter"
    )?.value || "";

  const resultados =
    ReservaYa.negocios.filter(negocio => {

      const coincideTexto =

        !texto ||

        negocio.nombre
          .toLowerCase()
          .includes(texto)

        ||

        negocio.ciudad
          .toLowerCase()
          .includes(texto)

        ||

        negocio.ubicacion
          .toLowerCase()
          .includes(texto);

      const coincideCategoria =

        !categoria ||

        negocio.categoria === categoria;

      return (
        coincideTexto &&
        coincideCategoria
      );

    });

  const contenedor =
    document.getElementById(
      "searchResults"
    );

  if (!contenedor) return;

  contenedor.innerHTML =

    resultados.length

      ? resultados
          .map(crearTarjetaNegocio)
          .join("")

      : `

        <div
          style="
            grid-column:1/-1;
            padding:50px 20px;
            text-align:center;
          "
        >

          <div style="font-size:45px">
            🔎
          </div>

          <h3>
            No encontramos resultados
          </h3>

          <p style="color:#727887;margin-top:8px">
            Prueba con otro nombre,
            categoría o ciudad.
          </p>

        </div>

      `;

}


/* =====================================================
   NEGOCIO
===================================================== */

function abrirNegocio(id) {

  const negocio =
    ReservaYa.negocios.find(
      n => n.id === id
    );

  if (!negocio) return;

  ReservaYa.negocioActual =
    negocio;

  abrirModal(`

    <div style="text-align:center">

      <div style="font-size:55px">
        ${obtenerIconoCategoria(
          negocio.categoria
        )}
      </div>

      <h2 style="margin-top:10px">
        ${escaparHTML(negocio.nombre)}
      </h2>

      <p style="color:#727887;margin-top:5px">
        ${escaparHTML(
          negocio.ciudad
        )}
      </p>

      <div style="margin-top:15px">
        ⭐ ${negocio.rating}
        · ${negocio.reseñas} reseñas
      </div>

      <button
        class="primary-button"
        style="
          width:100%;
          margin-top:22px;
        "
        onclick="iniciarReserva('${negocio.id}')"
      >
        📅 Reservar cita
      </button>

      <button
        class="secondary-button"
        style="
          width:100%;
          margin-top:8px;
        "
        onclick="alternarFavorito('${negocio.id}')"
      >
        ${
          ReservaYa.favoritos.includes(id)
            ? "♥ Quitar de favoritos"
            : "♡ Añadir a favoritos"
        }
      </button>

    </div>

  `);

}


/* =====================================================
   RESERVA
===================================================== */

function iniciarReserva(id) {

  const negocio =
    ReservaYa.negocios.find(
      n => n.id === id
    );

  if (!negocio) return;

  abrirModal(`

    <h2>
      Reservar en
      ${escaparHTML(negocio.nombre)}
    </h2>

    <p style="color:#727887;margin-top:6px">
      Selecciona una fecha para continuar.
    </p>

    <label style="
      display:block;
      margin-top:20px;
      font-weight:700;
    ">
      Fecha
    </label>

    <input
      id="reservationDate"
      type="date"
      min="${obtenerFechaHoy()}"
      style="
        width:100%;
        padding:13px;
        margin-top:7px;
        border:1px solid #e7e9ef;
        border-radius:11px;
      "
    >

    <label style="
      display:block;
      margin-top:15px;
      font-weight:700;
    ">
      Hora
    </label>

    <input
      id="reservationTime"
      type="time"
      style="
        width:100%;
        padding:13px;
        margin-top:7px;
        border:1px solid #e7e9ef;
        border-radius:11px;
      "
    >

    <button
      class="primary-button"
      style="
        width:100%;
        margin-top:20px;
      "
      onclick="confirmarReserva('${negocio.id}')"
    >
      Confirmar reserva
    </button>

  `);

}


function confirmarReserva(id) {

  const fecha =
    document.getElementById(
      "reservationDate"
    )?.value;

  const hora =
    document.getElementById(
      "reservationTime"
    )?.value;

  if (!fecha || !hora) {

    mostrarToast(
      "Selecciona fecha y hora."
    );

    return;

  }

  /*
    IMPORTANTE:

    En la siguiente etapa esta función
    se conectará directamente con Supabase
    y la tabla Citas.

    Por ahora guardamos una reserva
    local para probar la interfaz.
  */

  const negocio =
    ReservaYa.negocios.find(
      n => n.id === id
    );

  const reserva = {

    id:
      "local-" +
      Date.now(),

    negocio_id: id,

    negocio:
      negocio?.nombre || "Negocio",

    fecha,

    hora,

    estado: "Pendiente"

  };

  ReservaYa.reservas.push(
    reserva
  );

  cerrarModal();

  mostrarToast(
    "Reserva creada correctamente."
  );

}


/* =====================================================
   FAVORITOS
===================================================== */

async function alternarFavorito(id) {

  if (!ReservaYa.usuario) {
    mostrarToast("Inicia sesión para guardar favoritos.");
    return;
  }

  const indice = ReservaYa.favoritos.indexOf(id);

  if (indice >= 0) {

    // Eliminar de Supabase
    const { error } = await supabaseClient
      .from("reserva_favoritos")
      .delete()
      .eq("usuario_id", ReservaYa.usuario.id)
      .eq("negocio_id", id);

    if (error) {
      console.error("Error eliminando favorito:", error);
      mostrarToast("No se pudo eliminar el favorito.");
      return;
    }

    ReservaYa.favoritos.splice(indice, 1);

    mostrarToast("Eliminado de favoritos.");

  } else {

    // Guardar en Supabase
    const { error } = await supabaseClient
      .from("reserva_favoritos")
      .insert({
        usuario_id: ReservaYa.usuario.id,
        negocio_id: id
      });

    if (error) {
      console.error("Error guardando favorito:", error);
      mostrarToast("No se pudo guardar el favorito.");
      return;
    }

    ReservaYa.favoritos.push(id);

    mostrarToast("Añadido a favoritos.");
  }

  // Mantener copia local para que la interfaz siga funcionando
  localStorage.setItem(
    "reservaya_favoritos",
    JSON.stringify(ReservaYa.favoritos)
  );

  renderizarDestacados();
  renderizarFavoritos();
}
/* =====================================================
   FAVORITOS
===================================================== */

function renderizarFavoritos() {

  const contenedor =
    document.getElementById(
      "favoritesContainer"
    );

  if (!contenedor) return;

  const negocios =
    ReservaYa.negocios.filter(
      negocio =>
        ReservaYa.favoritos
          .includes(negocio.id)
    );

  contenedor.innerHTML =

    negocios.length

      ? negocios
          .map(crearTarjetaNegocio)
          .join("")

      : `

        <div
          style="
            grid-column:1/-1;
            text-align:center;
            padding:60px 20px;
          "
        >

          <div style="font-size:50px">
            ♡
          </div>

          <h3>
            Todavía no tienes favoritos
          </h3>

          <p style="
            color:#727887;
            margin-top:7px;
          ">
            Guarda negocios para
            encontrarlos rápidamente.
          </p>

        </div>

      `;

}


/* =====================================================
   RESERVAS
===================================================== */

function mostrarReservas(tipo, boton) {

  document
    .querySelectorAll(
      ".reservation-tabs button"
    )
    .forEach(b =>
      b.classList.remove("active")
    );

  if (boton) {
    boton.classList.add("active");
  }

  const contenedor =
    document.getElementById(
      "reservationsContainer"
    );

  if (!contenedor) return;

  const reservas =
    tipo === "proximas"

      ? ReservaYa.reservas

      : ReservaYa.reservas;

  contenedor.innerHTML =

    reservas.length

      ? reservas.map(reserva => `

          <article class="reservation-card">

            <h3>
              ${escaparHTML(
                reserva.negocio
              )}
            </h3>

            <div class="reservation-meta">

              📅 ${escaparHTML(
                reserva.fecha
              )}

              <br>

              🕐 ${escaparHTML(
                reserva.hora
              )}

              <br>

              📌 ${escaparHTML(
                reserva.estado
              )}

            </div>

          </article>

        `).join("")

      : `

        <div style="
          text-align:center;
          padding:60px 20px;
        ">

          <div style="font-size:50px">
            📅
          </div>

          <h3>
            No tienes reservas
          </h3>

          <p style="
            color:#727887;
            margin-top:7px;
          ">
            Cuando hagas una reserva
            aparecerá aquí.
          </p>

        </div>

      `;

}


/* =====================================================
   NAVEGACIÓN
===================================================== */

function cambiarVista(nombre, boton = null) {

  document
    .querySelectorAll(".view")
    .forEach(view => {

      view.classList.remove("active");

    });

  const vista =
    document.getElementById(
      `view-${nombre}`
    );

  if (vista) {

    vista.classList.add("active");

  }

  document
    .querySelectorAll(".bottom-nav button")
    .forEach(btn =>
      btn.classList.remove("active")
    );

  if (boton) {

    boton.classList.add("active");

  } else {

    const nav =
      document.querySelector(
        `.bottom-nav button[data-view="${nombre}"]`
      );

    nav?.classList.add("active");

  }

  if (nombre === "favorites") {

    renderizarFavoritos();

  }

  if (nombre === "reservations") {

    mostrarReservas("proximas");

  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


function irInicio() {

  cambiarVista("home");

}


/* =====================================================
   MODAL
===================================================== */

function abrirModal(html) {

  const overlay =
    document.getElementById(
      "modalOverlay"
    );

  const content =
    document.getElementById(
      "modalContent"
    );

  if (!overlay || !content) return;

  content.innerHTML = `

    <button
      onclick="cerrarModal()"
      style="
        float:right;
        width:35px;
        height:35px;
        border-radius:50%;
        background:#f0f2f7;
      "
      aria-label="Cerrar"
    >
      ✕
    </button>

    ${html}

  `;

  overlay.classList.remove("hidden");

}


function cerrarModal(event) {

  if (
    event &&
    event.target !== event.currentTarget
  ) {
    return;
  }

  document
    .getElementById(
      "modalOverlay"
    )
    ?.classList.add("hidden");

}


/* =====================================================
   PREMIUM
===================================================== */

function abrirPremium() {

  abrirModal(`

    <div style="text-align:center">

      <div style="font-size:55px">
        🚀
      </div>

      <h2 style="margin-top:10px">
        ReservaYa Business
      </h2>

      <p style="
        color:#727887;
        margin-top:10px;
        line-height:1.6;
      ">
        Estamos preparando herramientas
        avanzadas para que los negocios
        puedan crecer dentro de ReservaYa.
      </p>

      <div style="
        text-align:left;
        margin-top:22px;
        display:grid;
        gap:10px;
      ">

        <div>📍 Mayor visibilidad</div>
        <div>📊 Estadísticas avanzadas</div>
        <div>📣 Promociones</div>
        <div>👥 Gestión de empleados</div>
        <div>🏢 Gestión de sucursales</div>
        <div>🚀 Posicionamiento destacado</div>

      </div>

      <button
        class="primary-button"
        style="
          width:100%;
          margin-top:22px;
        "
        onclick="mostrarToast('Esta función estará disponible próximamente.')"
      >
        Próximamente

      </button>

    </div>

  `);

}


/* =====================================================
   FUNCIONES PREPARADAS
===================================================== */

function buscarCercanos() {

  mostrarToast(
    "La búsqueda por ubicación estará disponible al conectar geolocalización."
  );

}


function abrirNotificaciones() {

  mostrarToast(
    "Centro de notificaciones preparado para la siguiente versión."
  );

}


function abrirMenuUsuario() {

  cambiarVista("profile");

}


function editarPerfil() {

  mostrarToast(
    "Editor de perfil preparado."
  );

}


function abrirConfiguracion() {

  mostrarToast(
    "Configuración preparada."
  );

}


function administrarServicios() {

  mostrarToast(
    "Administrador de servicios preparado."
  );

}


function administrarHorarios() {

  mostrarToast(
    "Administrador de horarios preparado."
  );

}


function administrarEmpleados() {

  mostrarToast(
    "Gestión de empleados preparada."
  );

}


function abrirEstadisticas() {

  mostrarToast(
    "Estadísticas avanzadas preparadas."
  );

}


function mostrarTodasCategorias() {

  cambiarVista("search");

}


/* =====================================================
   USUARIO
===================================================== */

function actualizarInterfazUsuario() {

  const nombre =
    ReservaYa.usuario?.nombre ||
    "Usuario";

  const inicial =
    nombre
      .charAt(0)
      .toUpperCase();

  document.getElementById(
    "userAvatar"
  ).textContent = inicial;

  document.getElementById(
    "profileAvatar"
  ).textContent = inicial;

  document.getElementById(
    "profileName"
  ).textContent = nombre;

}


/* =====================================================
   CERRAR SESIÓN
===================================================== */

function cerrarSesion() {

  ReservaYa.usuario = null;

  actualizarInterfazUsuario();

  cambiarVista("home");

  mostrarToast(
    "Sesión cerrada."
  );

}


/* =====================================================
   TOAST
===================================================== */

let toastTimer = null;

function mostrarToast(mensaje) {

  const toast =
    document.getElementById(
      "toast"
    );

  if (!toast) return;

  toast.textContent = mensaje;

  toast.classList.remove(
    "hidden"
  );

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {

    toast.classList.add(
      "hidden"
    );

  }, 3000);

}


/* =====================================================
   UTILIDADES
===================================================== */

function obtenerIconoCategoria(categoria) {

  return (

    CATEGORIAS.find(
      c => c.id === categoria
    )?.icono || "📍"

  );

}


function obtenerFechaHoy() {

  const ahora = new Date();

  const año =
    ahora.getFullYear();

  const mes =
    String(
      ahora.getMonth() + 1
    ).padStart(2, "0");

  const dia =
    String(
      ahora.getDate()
    ).padStart(2, "0");

  return `${año}-${mes}-${dia}`;

}


function escaparHTML(valor) {

  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}
