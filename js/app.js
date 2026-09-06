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

async function cargarDatosDemo() {

  const { data, error } = await supabaseClient
    .from("negocios")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) {
    console.error(
      "Error cargando negocios:",
      error
    );

    mostrarToast(
      "No se pudieron cargar los negocios."
    );

    return;
  }

  ReservaYa.negocios = (data || []).map(negocio => {

    return {
      id: negocio.id,
      nombre: negocio.nombre || "Negocio",
      categoria: "otros",
      ciudad: negocio.direccion || "Ubicación no disponible",
      ubicacion: negocio.direccion || "",
      descripcion: negocio.descripcion || "",
      rating: 0,
      reseñas: 0,
      destacado: false
    };

  });

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

async function cargarServiciosReserva(negocioId) {

  const { data, error } = await supabaseClient
    .from("servicios")
    .select("*")
    .eq("negocio_id", negocioId)
    .order("nombre", { ascending: true });

  if (error) {
    console.error("Error cargando servicios:", error);
    return [];
  }

  return data || [];
}

/* =====================================================
   RESERVA
===================================================== */

async function iniciarReserva(id) {

  const negocio =
    ReservaYa.negocios.find(
      n => n.id === id
    );

  if (!negocio) return;
  const servicios = await cargarServiciosReserva(id);
  abrirModal(`

    <h2>
      Reservar en
      ${escaparHTML(negocio.nombre)}
    </h2>

<p style="color:#727887;margin-top:6px">
  Selecciona un servicio, fecha y hora.
</p>

<label style="
  display:block;
  margin-top:20px;
  font-weight:700;
">
  Servicio
</label>

<select
  id="reservationService"
  style="
    width:100%;
    padding:13px;
    margin-top:7px;
    border:1px solid #e7e9ef;
    border-radius:11px;
  "
>
  <option value="">
    Selecciona un servicio
  </option>

  ${servicios.map(servicio => `
    <option value="${servicio.id}">
      ${escaparHTML(servicio.nombre || "Servicio")}
      ${servicio.precio != null ? ` — $${Number(servicio.precio).toLocaleString("es-CO")}` : ""}
    </option>
  `).join("")}

</select>

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
    <label style="
  display:block;
  margin-top:15px;
  font-weight:700;
">
  Comentario
</label>

<textarea
  id="reservationComment"
  placeholder="¿Quieres agregar algún comentario?"
  rows="3"
  style="
    width:100%;
    padding:13px;
    margin-top:7px;
    border:1px solid #e7e9ef;
    border-radius:11px;
    resize:vertical;
    font-family:inherit;
  "
></textarea>

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


async function confirmarReserva(id) {

  if (!ReservaYa.usuario) {
    mostrarToast("Debes iniciar sesión para reservar.");
    return;
  }

  const servicioId =
    document.getElementById("reservationService")?.value;

  const fecha =
    document.getElementById("reservationDate")?.value;

  const hora =
    document.getElementById("reservationTime")?.value;
   
  const comentario =
    document.getElementById("reservationComment")?.value.trim() || "";

  if (!servicioId) {
    mostrarToast("Selecciona un servicio.");
    return;
  }

  if (!fecha || !hora) {
    mostrarToast("Selecciona fecha y hora.");
    return;
  }

  const negocio =
    ReservaYa.negocios.find(n => n.id === id);

  if (!negocio) {
    mostrarToast("No se encontró el negocio.");
    return;
  }

  const servicio =
    await cargarServicioPorId(servicioId);

  const nombreCliente =
    ReservaYa.usuario.user_metadata?.nombre ||
    ReservaYa.usuario.email ||
    "Cliente";

  const { data, error } = await supabaseClient
    .from("Citas")
    .insert({
      negocio_id: id,
      servicio_id: servicioId,
      nombre_cliente: nombreCliente,
      fecha: fecha,
      hora: hora,
      comentario: comentario,
      estado: "Pendiente",
      usuario: ReservaYa.usuario.id
    })
    .select()
    .single();

  if (error) {
    console.error("Error creando reserva:", error);
    mostrarToast("No se pudo crear la reserva.");
    return;
  }

  ReservaYa.reservas.push({
    id: data.id,
    negocio_id: id,
    servicio_id: servicioId,
    negocio: negocio.nombre,
    servicio: servicio?.nombre || "Servicio",
    fecha: fecha,
    hora: hora,
    estado: "Pendiente"
  });

  cerrarModal();

  mostrarToast("Reserva creada correctamente.");

  console.log("Reserva guardada:", data);
}

async function cargarServicioPorId(servicioId) {

  const { data, error } = await supabaseClient
    .from("servicios")
    .select("*")
    .eq("id", servicioId)
    .single();

  if (error) {
    console.error("Error cargando servicio:", error);
    return null;
  }

  return data;
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
  console.error("ERROR COMPLETO FAVORITO:", error);
  mostrarToast(
    "Error: " + (error.message || "desconocido")
  );
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

async function mostrarReservas(tipo, boton) {

  document
    .querySelectorAll(".reservation-tabs button")
    .forEach(b =>
      b.classList.remove("active")
    );

  if (boton) {
    boton.classList.add("active");
  }

  const contenedor =
    document.getElementById("reservationsContainer");

  if (!contenedor) return;

  if (!ReservaYa.usuario) {
    contenedor.innerHTML = `
      <div style="
        text-align:center;
        padding:60px 20px;
      ">
        <div style="font-size:50px">🔐</div>

        <h3>Inicia sesión</h3>

        <p style="
          color:#727887;
          margin-top:7px;
        ">
          Inicia sesión para ver tus reservas.
        </p>
      </div>
    `;

    return;
  }

  contenedor.innerHTML = `
    <div style="
      text-align:center;
      padding:40px 20px;
      color:#727887;
    ">
      Cargando reservas...
    </div>
  `;

  const { data, error } = await supabaseClient
    .from("Citas")
    .select(`
      *,
      servicios (
        nombre
      )
    `)
    .eq("usuario", ReservaYa.usuario.id)
    .order("fecha", { ascending: true })
    .order("hora", { ascending: true });

  if (error) {
    console.error("Error cargando reservas:", error);

    contenedor.innerHTML = `
      <div style="
        text-align:center;
        padding:60px 20px;
      ">
        <div style="font-size:50px">⚠️</div>

        <h3>
          No se pudieron cargar las reservas
        </h3>

        <p style="
          color:#727887;
          margin-top:7px;
        ">
          Intenta nuevamente.
        </p>
      </div>
    `;

    return;
  }

  const ahora = new Date();

  ReservaYa.reservas = (data || []).map(reserva => {

    const negocio =
      ReservaYa.negocios.find(
        n => n.id === reserva.negocio_id
      );

    const fechaHora =
      new Date(`${reserva.fecha}T${reserva.hora}`);

    return {
      id: reserva.id,
      negocio_id: reserva.negocio_id,
      servicio_id: reserva.servicio_id,

      negocio:
        negocio?.nombre || "Negocio",

      servicio:
        reserva.servicios?.nombre || "Servicio",

      fecha:
        reserva.fecha,

      hora:
        reserva.hora,

      comentario:
        reserva.comentario || "",

      estado:
        reserva.estado,

      fechaHora:
        fechaHora
    };

  });

  let reservasFiltradas;

  if (tipo === "proximas") {

    reservasFiltradas =
      ReservaYa.reservas.filter(reserva => {

        const estado =
          String(reserva.estado || "").toLowerCase();

        return (
          reserva.fechaHora >= ahora &&
          estado !== "cancelada" &&
          estado !== "completada"
        );

      });

  } else {

    reservasFiltradas =
      ReservaYa.reservas.filter(reserva => {

        const estado =
          String(reserva.estado || "").toLowerCase();

        return (
          reserva.fechaHora < ahora ||
          estado === "cancelada" ||
          estado === "completada"
        );

      });

  }

  contenedor.innerHTML =

    reservasFiltradas.length

      ? reservasFiltradas.map(reserva => `

          <article class="reservation-card">

            <h3>
              ${escaparHTML(reserva.negocio)}
            </h3>

            <div class="reservation-meta">

              📋 ${escaparHTML(
                reserva.servicio
              )}

              <br>

              📅 ${escaparHTML(
                reserva.fecha
              )}

              <br>

              🕐 ${escaparHTML(
                reserva.hora
              )}

              <br>

              💬 ${
                reserva.comentario
                  ? escaparHTML(reserva.comentario)
                  : "Sin comentario"
              }

              <br>
📌 ${escaparHTML(
  reserva.estado
)}

</div>

<div style="
  display:flex;
  gap:10px;
  margin-top:15px;
">

  <button
    class="secondary-button"
    onclick="verDetallesReserva('${reserva.id}')"
  >
    Ver detalles
  </button>

  ${
    String(reserva.estado || "").toLowerCase() !== "cancelada"
      ? `
        <button
          class="secondary-button"
          onclick="cancelarReserva('${reserva.id}')"
        >
          Cancelar
        </button>
      `
      : ""
  }

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
            ${
              tipo === "proximas"
                ? "No tienes reservas próximas"
                : "No tienes historial"
            }
          </h3>

          <p style="
            color:#727887;
            margin-top:7px;
          ">
            ${
              tipo === "proximas"
                ? "Cuando hagas una reserva aparecerá aquí."
                : "Tus reservas anteriores aparecerán aquí."
            }
          </p>

        </div>

      `;

}

async function verDetallesReserva(id) {

  const reserva =
    ReservaYa.reservas.find(
      r => r.id === id
    );

  if (!reserva) {
    mostrarToast("No se encontró la reserva.");
    return;
  }

  abrirModal(`
    <h2>
      Detalles de la reserva
    </h2>

    <div style="
      margin-top:20px;
      line-height:1.8;
    ">

      <strong>
        🏢 Negocio
      </strong>

      <br>

      ${escaparHTML(reserva.negocio)}

      <br><br>

      <strong>
        📋 Servicio
      </strong>

      <br>

      ${escaparHTML(reserva.servicio)}

      <br><br>

      <strong>
        📅 Fecha
      </strong>

      <br>

      ${escaparHTML(reserva.fecha)}

      <br><br>

      <strong>
        🕐 Hora
      </strong>

      <br>

      ${escaparHTML(reserva.hora)}

      <br><br>

      <strong>
        💬 Comentario
      </strong>

      <br>

      ${
        reserva.comentario
          ? escaparHTML(reserva.comentario)
          : "Sin comentario"
      }

      <br><br>

      <strong>
        📌 Estado
      </strong>

      <br>

      ${escaparHTML(reserva.estado)}

    </div>
  `);
}


async function cancelarReserva(id) {

  if (!ReservaYa.usuario) {
    mostrarToast("Debes iniciar sesión.");
    return;
  }

  const confirmar =
    confirm("¿Quieres cancelar esta reserva?");

  if (!confirmar) return;

  const { error } = await supabaseClient
    .from("Citas")
    .update({
      estado: "Cancelada"
    })
    .eq("id", id)
    .eq("usuario", ReservaYa.usuario.id);

  if (error) {
    console.error(
      "Error cancelando reserva:",
      error
    );

    mostrarToast(
      "No se pudo cancelar la reserva."
    );

    return;
  }

  mostrarToast(
    "Reserva cancelada correctamente."
  );

  await mostrarReservas(
    "proximas",
    document.querySelector(
      ".reservation-tabs button.active"
    )
  );
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

function abrirPanelNegocio() {

  if (!ReservaYa.usuario) {
    mostrarToast("Debes iniciar sesión.");
    return;
  }

  if (ReservaYa.negocioActual) {
    cambiarVista("business");
    return;
  }

  mostrarToast("Todavía no tienes un negocio registrado.");
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

async function actualizarInterfazUsuario() {

  const loginBox = document.getElementById("loginBox");

  const profileCard = document.querySelector(
    "#view-profile .profile-card"
  );

  const settingsList = document.querySelector(
    "#view-profile .settings-list"
  );

  // No hay usuario conectado
  if (!ReservaYa.usuario) {

    if (loginBox) {
      loginBox.style.display = "block";
    }

    if (profileCard) {
      profileCard.style.display = "none";
    }

    if (settingsList) {
      settingsList.style.display = "none";
    }

    ReservaYa.negocioActual = null;

    return;
  }

  // Hay usuario conectado
  if (loginBox) {
    loginBox.style.display = "none";
  }

  if (profileCard) {
    profileCard.style.display = "block";
  }

  if (settingsList) {
    settingsList.style.display = "block";
  }

  const nombre =
    ReservaYa.usuario.nombre ||
    ReservaYa.usuario.user_metadata?.nombre ||
    ReservaYa.usuario.email ||
    "Usuario";

  const inicial =
    nombre.charAt(0).toUpperCase();

  const userAvatar =
    document.getElementById("userAvatar");

  const profileAvatar =
    document.getElementById("profileAvatar");

  const profileName =
    document.getElementById("profileName");

  const profileEmail =
    document.getElementById("profileEmail");

  if (userAvatar) {
    userAvatar.textContent = inicial;
  }

  if (profileAvatar) {
    profileAvatar.textContent = inicial;
  }

  if (profileName) {
    profileName.textContent = nombre;
  }

  if (profileEmail) {
    profileEmail.textContent =
      ReservaYa.usuario.email || "-";
  }

  // Buscar si el usuario tiene un negocio
  const { data: negocio, error } = await supabaseClient
    .from("negocios")
    .select("*")
    .eq("usuario_id", ReservaYa.usuario.id)
    .maybeSingle();

  if (error) {
    console.error(
      "Error buscando negocio del usuario:",
      error
    );

    ReservaYa.negocioActual = null;
    return;
  }

  if (negocio) {

    ReservaYa.negocioActual = negocio;

    console.log(
      "Negocio del usuario encontrado:",
      negocio
    );

  } else {

    ReservaYa.negocioActual = null;

    console.log(
      "El usuario no tiene un negocio registrado."
    );
  }
}

async function restaurarSesion() {

  const { data, error } =
    await supabaseClient.auth.getSession();

  if (error) {
    console.error(
      "Error recuperando sesión:",
      error
    );
    return;
  }

  if (data.session?.user) {

    ReservaYa.usuario =
      data.session.user;

     await cargarFavoritos();
    actualizarInterfazUsuario();

  } else {

    ReservaYa.usuario = null;

    actualizarInterfazUsuario();

  }
}
restaurarSesion();

// ==========================================
// CARGAR FAVORITOS DESDE SUPABASE
// ==========================================

async function cargarFavoritos() {

  if (!ReservaYa.usuario) {
    ReservaYa.favoritos = [];
    return;
  }

  const { data, error } = await supabaseClient
    .from("reserva_favoritos")
    .select("negocio_id")
    .eq("usuario_id", ReservaYa.usuario.id);

  if (error) {
    console.error("Error cargando favoritos:", error);
    return;
  }

  ReservaYa.favoritos = (data || [])
    .map(favorito => favorito.negocio_id)
    .filter(Boolean);

  renderizarDestacados();
  renderizarFavoritos();
}
/* =====================================================
   CERRAR SESIÓN
===================================================== */
async function cerrarSesion() {

  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    console.error("Error cerrando sesión:", error);
    mostrarToast("No se pudo cerrar la sesión.");
    return;
  }

  ReservaYa.usuario = null;
  ReservaYa.favoritos = [];

  localStorage.removeItem("reservaya_favoritos");

  actualizarInterfazUsuario();

  cambiarVista("home");

  mostrarToast("Sesión cerrada.");

}
async function iniciarSesion() {

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    mostrarToast("Completa correo y contraseña.");
    return;
  }

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    console.error("Error iniciando sesión:", error);
    mostrarToast("No se pudo iniciar sesión.");
    return;
  }

  ReservaYa.usuario = data.user;
   
  await cargarFavoritos();
   
  actualizarInterfazUsuario();
   
  mostrarToast("Sesión iniciada.");

  document.getElementById("loginBox").style.display = "none";

  cambiarVista("home");
}
async function registrarse() {

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    mostrarToast("Completa correo y contraseña.");
    return;
  }

  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: password
  });

  if (error) {
    console.error("Error registrando usuario:", error);
    mostrarToast("No se pudo crear la cuenta.");
    return;
  }

  if (data.user && !data.session) {
    mostrarToast("Cuenta creada. Revisa tu correo para confirmarla.");
  } else {
    ReservaYa.usuario = data.user;
    actualizarInterfazUsuario();
    mostrarToast("Cuenta creada correctamente.");
    cambiarVista("home");
  }
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
