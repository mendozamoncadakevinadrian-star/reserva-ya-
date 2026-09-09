/* =====================================================
   RESERVAYA V4
   NÚCLEO PRINCIPAL
   -----------------------------------------------------
   Mantiene:
   - Supabase Auth
   - Negocios
   - Favoritos
   - Reservas
   - Horarios
   - Disponibilidad
   - Perfil
   - Business
   - Servicios

   Añade:
   - Sistema multidioma
   - Descubrimiento mejorado
   - Dashboard Business avanzado
   - ReservaYa Pulse
   - Estadísticas calculadas
   - Mejor manejo de reservas
   - Preparación Premium
   - Notificaciones preparadas
===================================================== */


/* =====================================================
   SUPABASE
===================================================== */

const SUPABASE_URL =
  "https://mjxiyzapdybzckurootw.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_Ox1Wz7UT2Gw6uHOP6SncjQ_sGapEEB-";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


/* =====================================================
   ESTADO GLOBAL
===================================================== */

const ReservaYa = {

  version: "4.0.0",

  usuario: null,

  negocioActual: null,

  categoriaActual: "",

  negocios: [],

  favoritos: [],

  reservas: [],

  notificaciones: [],

  serviciosActuales: [],

  idioma:
    localStorage.getItem("reservaya_idioma") ||
    "es",

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
   IDIOMAS
===================================================== */

const IDIOMAS = {

  es: {
    nombre: "Español",
    bandera: "🇪🇸",

    search: "Buscar negocios, servicios o ciudades...",
    home: "Inicio",
    searchTab: "Buscar",
    favorites: "Favoritos",
    reservations: "Reservas",
    profile: "Perfil",

    login: "Iniciar sesión",
    logout: "Cerrar sesión",

    reserve: "Reservar cita",
    viewBusiness: "Ver negocio",
    save: "Guardar",
    saved: "Guardado",

    noResults: "No encontramos resultados",
    noResultsText:
      "Prueba con otro nombre, categoría o ciudad.",

    loginRequired:
      "Debes iniciar sesión para continuar.",

    reservationCreated:
      "Reserva creada correctamente.",

    reservationCancelled:
      "Reserva cancelada.",

    loading: "Cargando...",

    language: "Idioma",

    business: "ReservaYa Business",

    dashboard: "Panel de negocio",

    pulse: "ReservaYa Pulse",

    premium: "ReservaYa Premium"

  },


  en: {
    nombre: "English",
    bandera: "🇺🇸",

    search: "Search businesses, services or cities...",
    home: "Home",
    searchTab: "Search",
    favorites: "Favorites",
    reservations: "Bookings",
    profile: "Profile",

    login: "Sign in",
    logout: "Sign out",

    reserve: "Book appointment",
    viewBusiness: "View business",
    save: "Save",
    saved: "Saved",

    noResults: "No results found",
    noResultsText:
      "Try another business, category or city.",

    loginRequired:
      "You must sign in to continue.",

    reservationCreated:
      "Booking created successfully.",

    reservationCancelled:
      "Booking cancelled.",

    loading: "Loading...",

    language: "Language",

    business: "ReservaYa Business",

    dashboard: "Business dashboard",

    pulse: "ReservaYa Pulse",

    premium: "ReservaYa Premium"

  },


  pt: {
    nombre: "Português",
    bandera: "🇧🇷",

    search: "Buscar empresas, serviços ou cidades...",
    home: "Início",
    searchTab: "Buscar",
    favorites: "Favoritos",
    reservations: "Reservas",
    profile: "Perfil",

    login: "Entrar",
    logout: "Sair",

    reserve: "Agendar",
    viewBusiness: "Ver empresa",
    save: "Salvar",
    saved: "Salvo",

    noResults: "Nenhum resultado encontrado",
    noResultsText:
      "Tente outro nome, categoria ou cidade.",

    loginRequired:
      "Você precisa entrar para continuar.",

    reservationCreated:
      "Reserva criada com sucesso.",

    reservationCancelled:
      "Reserva cancelada.",

    loading: "Carregando...",

    language: "Idioma",

    business: "ReservaYa Business",

    dashboard: "Painel da empresa",

    pulse: "ReservaYa Pulse",

    premium: "ReservaYa Premium"

  },


  fr: {
    nombre: "Français",
    bandera: "🇫🇷",

    search: "Rechercher des entreprises, services ou villes...",
    home: "Accueil",
    searchTab: "Rechercher",
    favorites: "Favoris",
    reservations: "Réservations",
    profile: "Profil",

    login: "Se connecter",
    logout: "Se déconnecter",

    reserve: "Réserver",
    viewBusiness: "Voir l'entreprise",
    save: "Enregistrer",
    saved: "Enregistré",

    noResults: "Aucun résultat",
    noResultsText:
      "Essayez un autre nom, une autre catégorie ou une autre ville.",

    loginRequired:
      "Vous devez vous connecter pour continuer.",

    reservationCreated:
      "Réservation créée avec succès.",

    reservationCancelled:
      "Réservation annulée.",

    loading: "Chargement...",

    language: "Langue",

    business: "ReservaYa Business",

    dashboard: "Tableau de bord",

    pulse: "ReservaYa Pulse",

    premium: "ReservaYa Premium"

  },


  de: {
    nombre: "Deutsch",
    bandera: "🇩🇪",

    search: "Unternehmen, Dienstleistungen oder Städte suchen...",
    home: "Startseite",
    searchTab: "Suchen",
    favorites: "Favoriten",
    reservations: "Buchungen",
    profile: "Profil",

    login: "Anmelden",
    logout: "Abmelden",

    reserve: "Termin buchen",
    viewBusiness: "Unternehmen ansehen",
    save: "Speichern",
    saved: "Gespeichert",

    noResults: "Keine Ergebnisse gefunden",
    noResultsText:
      "Versuche einen anderen Namen, eine Kategorie oder Stadt.",

    loginRequired:
      "Du musst dich anmelden, um fortzufahren.",

    reservationCreated:
      "Buchung erfolgreich erstellt.",

    reservationCancelled:
      "Buchung storniert.",

    loading: "Laden...",

    language: "Sprache",

    business: "ReservaYa Business",

    dashboard: "Unternehmens-Dashboard",

    pulse: "ReservaYa Pulse",

    premium: "ReservaYa Premium"

  },


  it: {
    nombre: "Italiano",
    bandera: "🇮🇹",

    search: "Cerca attività, servizi o città...",
    home: "Home",
    searchTab: "Cerca",
    favorites: "Preferiti",
    reservations: "Prenotazioni",
    profile: "Profilo",

    login: "Accedi",
    logout: "Esci",

    reserve: "Prenota",
    viewBusiness: "Vedi attività",
    save: "Salva",
    saved: "Salvato",

    noResults: "Nessun risultato",
    noResultsText:
      "Prova un altro nome, categoria o città.",

    loginRequired:
      "Devi accedere per continuare.",

    reservationCreated:
      "Prenotazione creata correttamente.",

    reservationCancelled:
      "Prenotazione annullata.",

    loading: "Caricamento...",

    language: "Lingua",

    business: "ReservaYa Business",

    dashboard: "Dashboard attività",

    pulse: "ReservaYa Pulse",

    premium: "ReservaYa Premium"

  }

};


/* =====================================================
   TRADUCCIÓN
===================================================== */

function t(clave) {

  const idioma =
    IDIOMAS[ReservaYa.idioma] ||
    IDIOMAS.es;

  return idioma[clave] || IDIOMAS.es[clave] || clave;

}


function cambiarIdioma(idioma) {

  if (!IDIOMAS[idioma]) {
    idioma = "es";
  }

  ReservaYa.idioma = idioma;

  localStorage.setItem(
    "reservaya_idioma",
    idioma
  );

  aplicarIdioma();

  mostrarToast(
    `${IDIOMAS[idioma].bandera} ${IDIOMAS[idioma].nombre}`
  );

}


function aplicarIdioma() {

  const input =
    document.getElementById("globalSearch");

  if (input) {
    input.placeholder = t("search");
  }

  document.documentElement.lang =
    ReservaYa.idioma;

  actualizarSelectorIdioma();

}


function actualizarSelectorIdioma() {

  const select =
    document.getElementById(
      "languageSelector"
    );

  if (!select) return;

  select.value =
    ReservaYa.idioma;

}


/* =====================================================
   INICIO
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  iniciarReservaYa
);


function iniciarReservaYa() {

  console.log(
    `ReservaYa V${ReservaYa.version} iniciando...`
  );

  cargarCategorias();

  cargarCategoriasFiltro();

  aplicarIdioma();

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
      localStorage.getItem(
        "reservaya_favoritos"
      );

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
   NEGOCIOS
===================================================== */

async function cargarDatosDemo() {

  const {
    data,
    error
  } = await supabaseClient
    .from("negocios")
    .select("*")
    .order("nombre", {
      ascending: true
    });

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

  ReservaYa.negocios =
    (data || []).map(negocio => {

      return {

        id: negocio.id,

        nombre:
          negocio.nombre ||
          "Negocio",

        categoria:
          negocio.categoria ||
          "otros",

        ciudad:
          negocio.direccion ||
          "Ubicación no disponible",

        ubicacion:
          negocio.direccion ||
          "",

        descripcion:
          negocio.descripcion ||
          "",

        rating:
          Number(negocio.rating || 0),

        reseñas:
          Number(
            negocio.reseñas ||
            negocio.resenas ||
            0
          ),

        destacado:
          Boolean(
            negocio.destacado
          ),

        usuario_id:
          negocio.usuario_id ||
          null

      };

    });

  renderizarNegociosCercanos();

  renderizarDestacados();

  renderizarFavoritos();

  actualizarContadores();

}


/* =====================================================
   CATEGORÍAS
===================================================== */

function cargarCategorias() {

  const contenedor =
    document.getElementById(
      "categoryGrid"
    );

  if (!contenedor) return;

  contenedor.innerHTML = "";

  CATEGORIAS
    .filter(
      categoria =>
        categoria.id !== "todos"
    )
    .forEach(categoria => {

      const card =
        document.createElement(
          "button"
        );

      card.className =
        "category-card";

      card.innerHTML = `
        <span class="category-icon">
          ${categoria.icono}
        </span>

        <strong>
          ${escaparHTML(
            categoria.nombre
          )}
        </strong>
      `;

      card.onclick = () => {

        ReservaYa.categoriaActual =
          categoria.id;

        cambiarVista("search");

        const select =
          document.getElementById(
            "categoryFilter"
          );

        if (select) {
          select.value =
            categoria.id;
        }

        filtrarNegocios();

      };

      contenedor.appendChild(card);

    });

}


function cargarCategoriasFiltro() {

  const select =
    document.getElementById(
      "categoryFilter"
    );

  if (!select) return;

  select.innerHTML =
    `<option value="">Todas las categorías</option>`;

  CATEGORIAS
    .filter(
      c => c.id !== "todos"
    )
    .forEach(categoria => {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        categoria.id;

      option.textContent =
        categoria.nombre;

      select.appendChild(
        option
      );

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
    ordenarNegociosParaDescubrimiento(
      ReservaYa.negocios
    ).slice(0, 3);

  contenedor.innerHTML =
    negocios.length
      ? negocios
          .map(
            crearTarjetaNegocio
          )
          .join("")
      : `
        <div style="
          padding:30px;
          text-align:center;
          color:#727887;
        ">
          No hay negocios disponibles todavía.
        </div>
      `;

}


/* =====================================================
   DESCUBRIMIENTO
===================================================== */

function ordenarNegociosParaDescubrimiento(
  negocios
) {

  return [...negocios].sort(
    (a, b) => {

      if (
        Boolean(a.destacado) !==
        Boolean(b.destacado)
      ) {

        return a.destacado
          ? -1
          : 1;

      }

      if (
        Number(a.rating || 0) !==
        Number(b.rating || 0)
      ) {

        return (
          Number(b.rating || 0) -
          Number(a.rating || 0)
        );

      }

      return String(
        a.nombre || ""
      ).localeCompare(
        String(
          b.nombre || ""
        )
      );

    }
  );

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
    ordenarNegociosParaDescubrimiento(
      ReservaYa.negocios.filter(
        n => n.destacado
      )
    );

  contenedor.innerHTML =
    negocios.length
      ? negocios
          .map(
            crearTarjetaNegocio
          )
          .join("")
      : `
        <div style="
          padding:30px;
          text-align:center;
          color:#727887;
        ">
          <div style="font-size:40px">
            ✨
          </div>

          <strong>
            Próximamente más destacados
          </strong>

          <p style="
            margin-top:7px;
          ">
            Estamos preparando nuevas
            oportunidades para negocios.
          </p>
        </div>
      `;

}


/* =====================================================
   TARJETA DE NEGOCIO
===================================================== */

function crearTarjetaNegocio(
  negocio
) {

  const categoria =
    CATEGORIAS.find(
      c =>
        c.id === negocio.categoria
    );

  const icono =
    categoria?.icono ||
    "📍";

  const favorito =
    ReservaYa.favoritos.includes(
      negocio.id
    );

  return `

    <article class="business-card">

      <div class="business-cover">

        ${icono}

        ${
          negocio.destacado
            ? `
              <span style="
                position:absolute;
                top:10px;
                right:10px;
                background:#111827;
                color:white;
                padding:5px 9px;
                border-radius:20px;
                font-size:11px;
                font-weight:700;
              ">
                ✨ DESTACADO
              </span>
            `
            : ""
        }

      </div>

      <div class="business-info">

        <h3>
          ${escaparHTML(
            negocio.nombre
          )}
        </h3>

        <div class="business-category">

          ${escaparHTML(
            categoria?.nombre ||
            "Negocio"
          )}

        </div>

        <div class="business-location">

          📍
          ${escaparHTML(
            negocio.ubicacion ||
            negocio.ciudad
          )}

        </div>

        <div class="business-rating">

          ⭐
          ${Number(
            negocio.rating || 0
          ).toFixed(1)}

          ·

          ${Number(
            negocio.reseñas || 0
          )}

          reseñas

        </div>

        <div class="business-footer">

          <button
            class="secondary-button"
            onclick="
              alternarFavorito(
                '${negocio.id}'
              )
            "
          >
            ${
              favorito
                ? "♥ Guardado"
                : "♡ Guardar"
            }
          </button>

          <button
            class="primary-button"
            onclick="
              abrirNegocio(
                '${negocio.id}'
              )
            "
          >
            ${t("viewBusiness")}
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
    String(texto || "")
      .trim()
      .toLowerCase();

  const suggestions =
    document.getElementById(
      "searchSuggestions"
    );

  if (!suggestions) return;

  if (!valor) {

    suggestions.classList.add(
      "hidden"
    );

    return;

  }

  const resultados =
    ReservaYa.negocios
      .filter(negocio => {

        const categoria =
          CATEGORIAS.find(
            c =>
              c.id ===
              negocio.categoria
          );

        const textoCompleto =
          [
            negocio.nombre,
            negocio.ciudad,
            negocio.ubicacion,
            negocio.descripcion,
            negocio.categoria,
            categoria?.nombre
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return textoCompleto.includes(
          valor
        );

      })
      .slice(0, 5);

  suggestions.innerHTML =
    resultados.length

      ? resultados
          .map(
            n => `

              <button
                style="
                  width:100%;
                  padding:14px;
                  background:white;
                  text-align:left;
                  border-bottom:1px solid #eee;
                "
                onclick="
                  abrirNegocio(
                    '${n.id}'
                  )
                "
              >

                🔎
                ${escaparHTML(
                  n.nombre
                )}

              </button>

            `
          )
          .join("")

      : `

          <div style="
            padding:15px;
            color:#727887;
          ">

            ${t("noResults")}

          </div>

        `;

  suggestions.classList.remove(
    "hidden"
  );

}


function ejecutarBusqueda() {

  const input =
    document.getElementById(
      "globalSearch"
    );

  const texto =
    input?.value.trim() ||
    "";

  cambiarVista("search");

  const searchInput =
    document.getElementById(
      "searchInput"
    );

  if (searchInput) {
    searchInput.value =
      texto;
  }

  const suggestions =
    document.getElementById(
      "searchSuggestions"
    );

  if (suggestions) {
    suggestions.classList.add(
      "hidden"
    );
  }

  filtrarNegocios();

}


/* =====================================================
   FILTRAR
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
    ReservaYa.negocios.filter(
      negocio => {

        const categoriaObjeto =
          CATEGORIAS.find(
            c =>
              c.id ===
              negocio.categoria
          );

        const textoCompleto =
          [
            negocio.nombre,
            negocio.ciudad,
            negocio.ubicacion,
            negocio.descripcion,
            negocio.categoria,
            categoriaObjeto?.nombre
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        const coincideTexto =
          !texto ||
          textoCompleto.includes(
            texto
          );

        const coincideCategoria =
          !categoria ||
          negocio.categoria ===
            categoria;

        return (
          coincideTexto &&
          coincideCategoria
        );

      }
    );

  const contenedor =
    document.getElementById(
      "searchResults"
    );

  if (!contenedor) return;

  contenedor.innerHTML =
    resultados.length

      ? ordenarNegociosParaDescubrimiento(
          resultados
        )
          .map(
            crearTarjetaNegocio
          )
          .join("")

      : `

        <div style="
          grid-column:1/-1;
          padding:50px 20px;
          text-align:center;
        ">

          <div style="
            font-size:45px
          ">
            🔎
          </div>

          <h3>
            ${t("noResults")}
          </h3>

          <p style="
            color:#727887;
            margin-top:8px
          ">
            ${t("noResultsText")}
          </p>

        </div>

      `;

}


/* =====================================================
   NEGOCIO
===================================================== */

async function abrirNegocio(id) {

  const negocio =
    ReservaYa.negocios.find(
      n => n.id === id
    );

  if (!negocio) return;

  ReservaYa.negocioActual =
    negocio;

  const {
    data: horarios
  } =
    await supabaseClient
      .from("reserva_horarios")
      .select("*")
      .eq(
        "negocio_id",
        negocio.id
      )
      .order(
        "dia_semana",
        {
          ascending: true
        }
      );

  const horariosGuardados =
    horarios || [];

  const lunes =
    horariosGuardados.find(
      h =>
        Number(
          h.dia_semana
        ) === 1
    );

  const domingo =
    horariosGuardados.find(
      h =>
        Number(
          h.dia_semana
        ) === 0
    );

  let resumenHorario =
    "Horario no configurado";

  if (lunes?.abierto) {

    const apertura =
      lunes.hora_apertura
        ? lunes.hora_apertura.slice(
            0,
            5
          )
        : "--:--";

    const cierre =
      lunes.hora_cierre
        ? lunes.hora_cierre.slice(
            0,
            5
          )
        : "--:--";

    resumenHorario =
      `Lun–Sáb · ${apertura}–${cierre}`;

  }

  if (
    domingo &&
    !domingo.abierto
  ) {

    resumenHorario +=
      " · Dom cerrado";

  }

  const categoria =
    CATEGORIAS.find(
      c =>
        c.id === negocio.categoria
    );

  abrirModal(`

    <div style="
      text-align:center
    ">

      <div style="
        font-size:55px
      ">
        ${
          categoria?.icono ||
          "📍"
        }
      </div>

      <h2 style="
        margin-top:10px
      ">
        ${escaparHTML(
          negocio.nombre
        )}
      </h2>

      <p style="
        color:#727887;
        margin-top:5px
      ">
        ${escaparHTML(
          negocio.ciudad
        )}
      </p>

      ${
        negocio.descripcion
          ? `
            <p style="
              margin-top:14px;
              color:#555;
              line-height:1.5;
              text-align:left;
            ">
              ${escaparHTML(
                negocio.descripcion
              )}
            </p>
          `
          : ""
      }

      <div style="
        margin-top:15px
      ">
        ⭐
        ${Number(
          negocio.rating || 0
        ).toFixed(1)}

        ·

        ${Number(
          negocio.reseñas || 0
        )}

        reseñas
      </div>

      <div style="
        margin-top:20px;
        padding:14px;
        border-radius:14px;
        background:#f8f9fb;
        text-align:left;
      ">

        <div style="
          font-weight:700;
          margin-bottom:5px;
        ">
          🕐 Horario de atención
        </div>

        <div style="
          color:#727887;
          font-size:14px;
        ">
          ${escaparHTML(
            resumenHorario
          )}
        </div>

        <button
          class="secondary-button"
          style="
            width:100%;
            margin-top:10px;
          "
          onclick="
            verHorariosNegocio(
              '${negocio.id}'
            )
          "
        >
          🕐 Ver horarios completos
        </button>

      </div>

      <button
        class="primary-button"
        style="
          width:100%;
          margin-top:18px;
        "
        onclick="
          iniciarReserva(
            '${negocio.id}'
          )
        "
      >
        📅 ${t("reserve")}
      </button>

      <button
        class="secondary-button"
        style="
          width:100%;
          margin-top:8px;
        "
        onclick="
          alternarFavorito(
            '${negocio.id}'
          )
        "
      >
        ${
          ReservaYa.favoritos.includes(
            id
          )
            ? "♥ Quitar de favoritos"
            : "♡ Añadir a favoritos"
        }
      </button>

    </div>

  `);

}


/* =====================================================
   HORARIOS
===================================================== */

async function verHorariosNegocio(
  id
) {

  const negocio =
    ReservaYa.negocios.find(
      n => n.id === id
    );

  if (!negocio) return;

  const {
    data: horarios,
    error
  } =
    await supabaseClient
      .from("reserva_horarios")
      .select("*")
      .eq(
        "negocio_id",
        id
      )
      .order(
        "dia_semana",
        {
          ascending: true
        }
      );

  if (error) {

    console.error(
      "Error cargando horarios:",
      error
    );

    mostrarToast(
      "No se pudieron cargar los horarios."
    );

    return;

  }

  const dias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado"
  ];

  const horariosGuardados =
    horarios || [];

  const horariosHTML =
    dias
      .map(
        (
          dia,
          indice
        ) => {

          const horario =
            horariosGuardados.find(
              h =>
                Number(
                  h.dia_semana
                ) === indice
            );

          if (
            !horario ||
            !horario.abierto
          ) {

            return `

              <div style="
                display:flex;
                justify-content:space-between;
                padding:9px 0;
                border-bottom:1px solid #eee;
              ">

                <span>
                  ${dia}
                </span>

                <span style="
                  color:#e05252;
                  font-weight:600;
                ">
                  Cerrado
                </span>

              </div>

            `;

          }

          const apertura =
            horario.hora_apertura
              ? horario.hora_apertura.slice(
                  0,
                  5
                )
              : "--:--";

          const cierre =
            horario.hora_cierre
              ? horario.hora_cierre.slice(
                  0,
                  5
                )
              : "--:--";

          return `

            <div style="
              display:flex;
              justify-content:space-between;
              padding:9px 0;
              border-bottom:1px solid #eee;
            ">

              <span>
                ${dia}
              </span>

              <span style="
                color:#198754;
                font-weight:600;
              ">
                ${apertura}
                –
                ${cierre}
              </span>

            </div>

          `;

        }
      )
      .join("");

  abrirModal(`

    <div>

      <h2 style="
        margin-bottom:5px
      ">
        🕐 Horarios
      </h2>

      <p style="
        color:#727887;
        margin-bottom:18px;
      ">
        ${escaparHTML(
          negocio.nombre
        )}
      </p>

      <div style="
        background:#f8f9fb;
        padding:12px 15px;
        border-radius:14px;
      ">
        ${horariosHTML}
      </div>

      <button
        class="primary-button"
        style="
          width:100%;
          margin-top:18px;
        "
        onclick="
          iniciarReserva(
            '${negocio.id}'
          )
        "
      >
        📅 ${t("reserve")}
      </button>

    </div>

  `, `
    abrirNegocio(
      '${negocio.id}'
    )
  `);

}


/* =====================================================
   INICIAR RESERVA
===================================================== */

async function iniciarReserva(
  negocioId
) {

  if (!ReservaYa.usuario) {

    mostrarToast(
      t("loginRequired")
    );

    return;

  }

  const negocio =
    ReservaYa.negocios.find(
      n => n.id === negocioId
    );

  if (!negocio) return;

  ReservaYa.negocioActual =
    negocio;

  const {
    data: servicios,
    error
  } =
    await supabaseClient
      .from("servicios")
      .select("*")
      .eq(
        "negocio_id",
        negocioId
      )
      .order(
        "nombre",
        {
          ascending: true
        }
      );

  if (error) {

    console.error(
      "Error cargando servicios:",
      error
    );

    mostrarToast(
      "No se pudieron cargar los servicios."
    );

    return;

  }

  ReservaYa.serviciosActuales =
    servicios || [];

  const opciones =
    (servicios || [])
      .map(
        servicio => `

          <option
            value="${servicio.id}"
          >
            ${escaparHTML(
              servicio.nombre
            )}

            ${
              servicio.precio !== null &&
              servicio.precio !== undefined
                ? ` · ${formatearPrecio(
                    servicio.precio
                  )}`
                : ""
            }

          </option>

        `
      )
      .join("");

  abrirModal(`

    <div>

      <h2>
        📅 Reservar cita
      </h2>

      <p style="
        color:#727887;
        margin:5px 0 18px;
      ">
        ${escaparHTML(
          negocio.nombre
        )}
      </p>

      <label style="
        display:block;
        font-weight:700;
        margin-bottom:7px;
      ">
        🛠️ Servicio
      </label>

      <select
        id="reservationService"
        style="
          width:100%;
          padding:12px;
          border:1px solid #ddd;
          border-radius:10px;
          margin-bottom:16px;
        "
      >
        <option value="">
          Selecciona un servicio
        </option>

        ${
          opciones ||
          `
            <option value="">
              No hay servicios configurados
            </option>
          `
        }

      </select>

      <label style="
        display:block;
        font-weight:700;
        margin-bottom:7px;
      ">
        📅 Fecha
      </label>

      <input
        id="reservationDate"
        type="date"
        min="${obtenerFechaHoy()}"
        onchange="
          actualizarHorarioSeleccionado(
            '${negocio.id}'
          )
        "
        style="
          width:100%;
          padding:12px;
          border:1px solid #ddd;
          border-radius:10px;
          margin-bottom:12px;
        "
      >

      <div
        id="reservationScheduleStatus"
        style="
          font-size:13px;
          margin-bottom:12px;
        "
      ></div>

      <label style="
        display:block;
        font-weight:700;
        margin-bottom:7px;
      ">
        🕐 Hora
      </label>

      <input
        id="reservationTime"
        type="time"
        disabled
        style="
          width:100%;
          padding:12px;
          border:1px solid #ddd;
          border-radius:10px;
          margin-bottom:12px;
        "
      >

      <div
        id="reservationHours"
        style="
          display:grid;
          grid-template-columns:
            repeat(3,1fr);
          gap:8px;
          margin-bottom:16px;
        "
      ></div>

      <label style="
        display:block;
        font-weight:700;
        margin-bottom:7px;
      ">
        💬 Comentario
      </label>

      <textarea
        id="reservationComment"
        rows="3"
        placeholder="¿Algo que quieras comentar?"
        style="
          width:100%;
          padding:12px;
          border:1px solid #ddd;
          border-radius:10px;
          resize:vertical;
        "
      ></textarea>

      <button
        class="primary-button"
        style="
          width:100%;
          margin-top:18px;
        "
        onclick="
          confirmarReserva(
            '${negocio.id}'
          )
        "
      >
        ✅ Confirmar reserva
      </button>

    </div>

  `);

}


/* =====================================================
   HORARIO DEL DÍA
===================================================== */

async function obtenerHorarioDelDia(
  negocioId,
  fecha
) {

  const fechaObj =
    new Date(
      `${fecha}T12:00:00`
    );

  const diaSemana =
    fechaObj.getDay();

  const {
    data,
    error
  } =
    await supabaseClient
      .from("reserva_horarios")
      .select("*")
      .eq(
        "negocio_id",
        negocioId
      )
      .eq(
        "dia_semana",
        diaSemana
      )
      .maybeSingle();

  if (error) {

    console.error(
      "Error consultando horario:",
      error
    );

    return null;

  }

  if (!data) {

    return {

      abierto: false,

      hora_apertura: null,

      hora_cierre: null

    };

  }

  return {

    abierto:
      Boolean(
        data.abierto
      ),

    hora_apertura:
      data.hora_apertura,

    hora_cierre:
      data.hora_cierre

  };

}


/* =====================================================
   HORAS OCUPADAS
===================================================== */

async function cargarHorasOcupadas(
  negocioId,
  fecha
) {

  const {
    data,
    error
  } =
    await supabaseClient
      .from("Citas")
      .select("hora")
      .eq(
        "negocio_id",
        negocioId
      )
      .eq(
        "fecha",
        fecha
      )
      .neq(
        "estado",
        "Cancelada"
      );

  if (error) {

    console.error(
      "Error cargando horas ocupadas:",
      error
    );

    return [];

  }

  return (data || [])
    .map(
      cita => cita.hora
    )
    .filter(Boolean)
    .map(
      hora =>
        hora.slice(0, 5)
    );

}


/* =====================================================
   GENERAR HORAS
===================================================== */

function generarHorasDisponibles(
  apertura,
  cierre,
  horasOcupadas
) {

  const horas = [];

  if (!apertura || !cierre) {
    return horas;
  }

  let [
    hora,
    minuto
  ] =
    apertura
      .split(":")
      .map(Number);

  const [
    horaCierre,
    minutoCierre
  ] =
    cierre
      .split(":")
      .map(Number);

  while (
    hora < horaCierre ||
    (
      hora === horaCierre &&
      minuto <= minutoCierre
    )
  ) {

    const horaTexto =
      `${String(
        hora
      ).padStart(2, "0")}:${String(
        minuto
      ).padStart(2, "0")}`;

    horas.push({

      hora: horaTexto,

      ocupada:
        horasOcupadas.includes(
          horaTexto
        )

    });

    minuto += 30;

    if (minuto >= 60) {

      minuto = 0;

      hora++;

    }

  }

  return horas;

}


/* =====================================================
   ACTUALIZAR HORARIO
===================================================== */

async function actualizarHorarioSeleccionado(
  negocioId
) {

  const fecha =
    document.getElementById(
      "reservationDate"
    )?.value;

  const status =
    document.getElementById(
      "reservationScheduleStatus"
    );

  const timeInput =
    document.getElementById(
      "reservationTime"
    );

  const hoursContainer =
    document.getElementById(
      "reservationHours"
    );

  if (!fecha) {

    if (status) {
      status.textContent = "";
    }

    if (timeInput) {
      timeInput.value = "";
      timeInput.disabled = true;
    }

    if (hoursContainer) {
      hoursContainer.innerHTML = "";
    }

    return;

  }

  const horario =
    await obtenerHorarioDelDia(
      negocioId,
      fecha
    );

  if (
    !horario ||
    !horario.abierto
  ) {

    if (status) {

      status.innerHTML = `
        <span style="
          color:#e05252;
          font-weight:600;
        ">
          🔴 Cerrado ese día.
        </span>
      `;

    }

    if (timeInput) {

      timeInput.value = "";

      timeInput.disabled = true;

    }

    if (hoursContainer) {
      hoursContainer.innerHTML = "";
    }

    return;

  }

  const apertura =
    horario.hora_apertura
      ? horario.hora_apertura.slice(
          0,
          5
        )
      : null;

  const cierre =
    horario.hora_cierre
      ? horario.hora_cierre.slice(
          0,
          5
        )
      : null;

  const ocupadas =
    await cargarHorasOcupadas(
      negocioId,
      fecha
    );

  const horas =
    generarHorasDisponibles(
      apertura,
      cierre,
      ocupadas
    );

  if (status) {

    status.innerHTML = `
      <span style="
        color:#198754;
        font-weight:600;
      ">
        🟢 Abierto:
        ${apertura}
        –
        ${cierre}
      </span>
    `;

  }

  if (timeInput) {

    timeInput.value = "";

    timeInput.disabled = true;

  }

  if (!hoursContainer) {
    return;
  }

  hoursContainer.innerHTML =
    horas
      .map(
        item => {

          if (item.ocupada) {

            return `

              <button
                type="button"
                disabled
                style="
                  padding:9px 5px;
                  border-radius:9px;
                  border:1px solid #eee;
                  background:#f1f1f1;
                  color:#aaa;
                  text-decoration:line-through;
                "
              >
                ${item.hora}
              </button>

            `;

          }

          return `

            <button
              type="button"
              onclick="
                seleccionarHora(
                  '${item.hora}'
                )
              "
              style="
                padding:9px 5px;
                border-radius:9px;
                border:1px solid #e7e9ef;
                background:white;
                color:#222;
              "
            >
              ${item.hora}
            </button>

          `;

        }
      )
      .join("");

}


/* =====================================================
   SELECCIONAR HORA
===================================================== */

function seleccionarHora(
  hora
) {

  const horaInput =
    document.getElementById(
      "reservationTime"
    );

  if (!horaInput) return;

  horaInput.value =
    hora;

  const botones =
    document.querySelectorAll(
      "#reservationHours button:not(:disabled)"
    );

  botones.forEach(
    boton => {

      boton.style.background =
        "white";

      boton.style.color =
        "#222";

      boton.style.borderColor =
        "#e7e9ef";

    }
  );

  botones.forEach(
    boton => {

      if (
        boton.textContent.trim() ===
        hora
      ) {

        boton.style.background =
          "#111827";

        boton.style.color =
          "white";

        boton.style.borderColor =
          "#111827";

      }

    }
  );

}


/* =====================================================
   CONFIRMAR RESERVA
===================================================== */

async function confirmarReserva(
  id
) {

  if (!ReservaYa.usuario) {

    mostrarToast(
      t("loginRequired")
    );

    return;

  }

  const servicioId =
    document.getElementById(
      "reservationService"
    )?.value;

  const fecha =
    document.getElementById(
      "reservationDate"
    )?.value;

  const hora =
    document.getElementById(
      "reservationTime"
    )?.value;

  const comentario =
    document.getElementById(
      "reservationComment"
    )?.value.trim() ||
    "";

  if (!servicioId) {

    mostrarToast(
      "Selecciona un servicio."
    );

    return;

  }

  if (!fecha) {

    mostrarToast(
      "Selecciona una fecha."
    );

    return;

  }

  if (!hora) {

    mostrarToast(
      "Selecciona una hora."
    );

    return;

  }

  const horario =
    await obtenerHorarioDelDia(
      id,
      fecha
    );

  if (
    !horario ||
    !horario.abierto
  ) {

    mostrarToast(
      "El negocio está cerrado ese día."
    );

    return;

  }

  const apertura =
    horario.hora_apertura
      ? horario.hora_apertura.slice(
          0,
          5
        )
      : null;

  const cierre =
    horario.hora_cierre
      ? horario.hora_cierre.slice(
          0,
          5
        )
      : null;

  if (
    hora < apertura ||
    hora > cierre
  ) {

    mostrarToast(
      "La hora seleccionada está fuera del horario."
    );

    return;

  }

  /*
     SEGUNDA COMPROBACIÓN
     JUSTO ANTES DE INSERTAR.
  */

  const horasOcupadas =
    await cargarHorasOcupadas(
      id,
      fecha
    );

  if (
    horasOcupadas.includes(
      hora
    )
  ) {

    mostrarToast(
      "Esa hora acaba de ser ocupada. Selecciona otra."
    );

    await actualizarHorarioSeleccionado(
      id
    );

    return;

  }

  const servicio =
    await cargarServicioPorId(
      servicioId
    );

  if (!servicio) {

    mostrarToast(
      "No se pudo encontrar el servicio."
    );

    return;

  }

  const negocio =
    ReservaYa.negocios.find(
      n => n.id === id
    );

  const nombreCliente =
    ReservaYa.usuario
      .user_metadata
      ?.nombre ||
    ReservaYa.usuario.email ||
    "Cliente";

  const {
    data,
    error
  } =
    await supabaseClient
      .from("Citas")
      .insert({

        negocio_id:
          id,

        servicio_id:
          servicioId,

        nombre_cliente:
          nombreCliente,

        fecha:
          fecha,

        hora:
          hora,

        comentario:
          comentario,

        estado:
          "Pendiente",

        usuario:
          ReservaYa.usuario.id

      })
      .select()
      .single();

  if (error) {

    console.error(
      "Error creando reserva:",
      error
    );

    mostrarToast(
      "No se pudo crear la reserva."
    );

    return;

  }

  const reservaLocal = {

    id:
      data.id,

    negocio_id:
      id,

    servicio_id:
      servicioId,

    negocio:
      negocio?.nombre ||
      "Negocio",

    servicio:
      servicio.nombre,

    fecha:
      fecha,

    hora:
      hora,

    comentario:
      comentario,

    estado:
      "Pendiente"

  };

  ReservaYa.reservas.push(
    reservaLocal
  );

  cerrarModal();

  mostrarToast(
    t("reservationCreated")
  );

  /*
     Actualizamos inmediatamente
     la pantalla de reservas.
  */

  if (
    document
      .getElementById(
        "view-reservations"
      )
      ?.classList.contains(
        "active"
      )
  ) {

    await mostrarReservas(
      "proximas"
    );

  }

}


/* =====================================================
   SERVICIO
===================================================== */

async function cargarServicioPorId(
  servicioId
) {

  const local =
    ReservaYa.serviciosActuales
      .find(
        servicio =>
          servicio.id ===
          servicioId
      );

  if (local) {
    return local;
  }

  const {
    data,
    error
  } =
    await supabaseClient
      .from("servicios")
      .select("*")
      .eq(
        "id",
        servicioId
      )
      .maybeSingle();

  if (error) {

    console.error(
      "Error cargando servicio:",
      error
    );

    return null;

  }

  return data || null;

}


/* =====================================================
   FAVORITOS
===================================================== */

async function cargarFavoritos() {

  if (!ReservaYa.usuario) {

    ReservaYa.favoritos = [];

    return;

  }

  const {
    data,
    error
  } =
    await supabaseClient
      .from("reserva_favoritos")
      .select(
        "negocio_id"
      )
      .eq(
        "usuario_id",
        ReservaYa.usuario.id
      );

  if (error) {

    console.error(
      "Error cargando favoritos:",
      error
    );

    return;

  }

  ReservaYa.favoritos =
    (data || [])
      .map(
        favorito =>
          favorito.negocio_id
      )
      .filter(Boolean);

  localStorage.setItem(
    "reservaya_favoritos",
    JSON.stringify(
      ReservaYa.favoritos
    )
  );

  renderizarDestacados();

  renderizarFavoritos();

}


async function alternarFavorito(
  id
) {

  if (!ReservaYa.usuario) {

    mostrarToast(
      t("loginRequired")
    );

    return;

  }

  const indice =
    ReservaYa.favoritos.indexOf(
      id
    );

  if (indice >= 0) {

    const {
      error
    } =
      await supabaseClient
        .from(
          "reserva_favoritos"
        )
        .delete()
        .eq(
          "usuario_id",
          ReservaYa.usuario.id
        )
        .eq(
          "negocio_id",
          id
        );

    if (error) {

      console.error(
        "Error eliminando favorito:",
        error
      );

      mostrarToast(
        "No se pudo eliminar el favorito."
      );

      return;

    }

    ReservaYa.favoritos.splice(
      indice,
      1
    );

    mostrarToast(
      "Eliminado de favoritos."
    );

  } else {

    const {
      error
    } =
      await supabaseClient
        .from(
          "reserva_favoritos"
        )
        .insert({

          usuario_id:
            ReservaYa.usuario.id,

          negocio_id:
            id

        });

    if (error) {

      console.error(
        "ERROR COMPLETO FAVORITO:",
        error
      );

      mostrarToast(
        "Error: " +
        (
          error.message ||
          "desconocido"
        )
      );

      return;

    }

    ReservaYa.favoritos.push(
      id
    );

    mostrarToast(
      "Añadido a favoritos."
    );

  }

  localStorage.setItem(
    "reservaya_favoritos",
    JSON.stringify(
      ReservaYa.favoritos
    )
  );

  renderizarNegociosCercanos();

  renderizarDestacados();

  renderizarFavoritos();

}


/* =====================================================
   FAVORITOS UI
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
        ReservaYa.favoritos.includes(
          negocio.id
        )
    );

  contenedor.innerHTML =
    negocios.length

      ? negocios
          .map(
            crearTarjetaNegocio
          )
          .join("")

      : `

        <div style="
          grid-column:1/-1;
          padding:50px 20px;
          text-align:center;
        ">

          <div style="
            font-size:50px
          ">
            ♡
          </div>

          <h3>
            No tienes favoritos todavía
          </h3>

          <p style="
            color:#727887;
            margin-top:8px
          ">
            Guarda negocios para encontrarlos rápidamente.
          </p>

        </div>

      `;

}


/* =====================================================
   RESERVAS
===================================================== */

async function mostrarReservas(tipo = "proximas", boton = null) {

  document
    .querySelectorAll(".reservation-tabs button")
    .forEach(btn =>
      btn.classList.remove("active")
    );

  if (boton) {

    boton.classList.add("active");

  } else {

    const botones =
      document.querySelectorAll(
        ".reservation-tabs button"
      );

    if (botones.length) {

      if (tipo === "proximas") {

        botones[0].classList.add("active");

      } else {

        botones[1]?.classList.add("active");

      }

    }

  }


  const contenedor =
    document.getElementById(
      "reservationsContainer"
    );

  if (!contenedor) return;


  if (!ReservaYa.usuario) {

    contenedor.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          🔐
        </div>

        <h3>
          Inicia sesión
        </h3>

        <p>
          Inicia sesión para consultar tus reservas.
        </p>
      </div>
    `;

    return;

  }


  contenedor.innerHTML = `
    <div class="loading-state">
      Cargando reservas...
    </div>
  `;


  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .from("Citas")
        .select(`
          *,
          servicios (
            nombre,
            precio,
            duracion
          )
        `)
        .eq(
          "usuario",
          ReservaYa.usuario.id
        )
        .order(
          "fecha",
          {
            ascending: true
          }
        )
        .order(
          "hora",
          {
            ascending: true
          }
        );


    if (error) {

      console.error(
        "Error cargando reservas:",
        error
      );

      contenedor.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            ⚠️
          </div>

          <h3>
            No pudimos cargar tus reservas
          </h3>

          <p>
            Inténtalo nuevamente.
          </p>
        </div>
      `;

      return;

    }


    const ahora =
      new Date();


    const reservas =
      (data || [])
        .map(reserva => {

          const negocio =
            ReservaYa.negocios.find(
              n =>
                n.id ===
                reserva.negocio_id
            );


          const horaReserva =
            String(
              reserva.hora ||
              "00:00"
            ).slice(
              0,
              5
            );


          const [
            anio,
            mes,
            dia
          ] =
            String(
              reserva.fecha
            )
              .split("-")
              .map(Number);


          const [
            hora,
            minutos
          ] =
            horaReserva
              .split(":")
              .map(Number);


          const fechaHora =
            new Date(
              anio,
              mes - 1,
              dia,
              hora || 0,
              minutos || 0,
              0,
              0
            );


          return {

            id:
              reserva.id,

            negocioId:
              reserva.negocio_id,

            negocio:
              negocio?.nombre ||
              "Negocio",

            servicio:
              reserva.servicios
                ?.nombre ||
              "Servicio",

            precio:
              reserva.servicios
                ?.precio ??
              null,

            duracion:
              reserva.servicios
                ?.duracion ??
              null,

            fecha:
              reserva.fecha,

            hora:
              String(
                reserva.hora ||
                ""
              ).slice(
                0,
                5
              ),

            comentario:
              reserva.comentario ||
              "",

            estado:
              reserva.estado ||
              "Pendiente",

            fechaHora

          };

        });


    ReservaYa.reservas =
      reservas;


    /*
      IDs que el usuario decidió
      quitar de su historial.
    */

    const historialOculto =
      JSON.parse(
        localStorage.getItem(
          "reservaya_historial_oculto"
        ) ||
        "[]"
      );


    const filtradas =
      reservas.filter(
        reserva => {

          const estado =
            String(
              reserva.estado
            ).toLowerCase();


          const finalizada =
            [
              "cancelada",
              "completada",
              "completed",
              "cancelled"
            ].includes(
              estado
            );


          if (
            tipo ===
            "proximas"
          ) {

            return (
              reserva.fechaHora >=
                ahora &&
              !finalizada
            );

          }


          return (
            (
              reserva.fechaHora <
                ahora ||
              finalizada
            ) &&
            !historialOculto.includes(
              reserva.id
            )
          );

        }
      );


    if (!filtradas.length) {

      contenedor.innerHTML = `
        <div class="empty-state">

          <div class="empty-state-icon">
            ${
              tipo === "proximas"
                ? "📅"
                : "🕘"
            }
          </div>

          <h3>
            ${
              tipo === "proximas"
                ? "No tienes reservas próximas"
                : "Tu historial está vacío"
            }
          </h3>

          <p>
            ${
              tipo === "proximas"
                ? "Cuando hagas una reserva aparecerá aquí."
                : "Las reservas que retires del historial dejarán de aparecer aquí."
            }
          </p>

        </div>
      `;

      return;

    }


   contenedor.innerHTML =
  filtradas
    .map(
      reserva =>
        crearTarjetaReserva(
          reserva,
          tipo
        )
    )
    .join("");


  } catch (error) {

    console.error(
      "Error inesperado cargando reservas:",
      error
    );

    contenedor.innerHTML = `
      <div class="empty-state">

        <div class="empty-state-icon">
          ⚠️
        </div>

        <h3>
          Ocurrió un error
        </h3>

        <p>
          Inténtalo nuevamente.
        </p>

      </div>
    `;

  }

}

/* =========================================================
   RESERVAYA — QUITAR RESERVA DEL HISTORIAL
   ========================================================= */

function eliminarDelHistorial(id) {

  if (!id) return;

  const confirmar =
    confirm(
      "¿Quieres quitar esta reserva de tu historial?\n\n" +
      "La reserva no se borrará de ReservaYa ni de los registros del negocio."
    );

  if (!confirmar) return;


  let historialOculto = [];

  try {

    historialOculto =
      JSON.parse(
        localStorage.getItem(
          "reservaya_historial_oculto"
        ) ||
        "[]"
      );

  } catch (error) {

    historialOculto = [];

  }


  if (
    !historialOculto.includes(id)
  ) {

    historialOculto.push(id);

  }


  localStorage.setItem(
    "reservaya_historial_oculto",
    JSON.stringify(
      historialOculto
    )
  );


  mostrarToast(
    "Reserva retirada del historial."
  );


  mostrarReservas(
    "historial"
  );

}

/* =====================================================
   TARJETA RESERVA
===================================================== */

function crearTarjetaReserva(
  reserva,
  tipo = "proximas"
) {

  const estado =
    String(
      reserva.estado ||
      "Pendiente"
    );

  const estadoLower =
    estado.toLowerCase();

  const cancelada =
    [
      "cancelada",
      "cancelled"
    ].includes(
      estadoLower
    );

  const fechaBonita =
    formatearFecha(
      reserva.fecha
    );

  return `

    <article class="reservation-card">

      <div class="reservation-card-header">

        <div class="reservation-business">

          <div class="reservation-business-icon">
            🏪
          </div>

          <div>
            <div class="reservation-business-label">
              NEGOCIO
            </div>

            <h3>
              ${escaparHTML(
                reserva.negocio
              )}
            </h3>

            <div class="reservation-service">
              🛠️
              ${escaparHTML(
                reserva.servicio
              )}
            </div>
          </div>

        </div>

        <span class="reservation-status ${
          cancelada
            ? "cancelled"
            : "pending"
        }">
          ${escaparHTML(
            estado
          )}
        </span>

      </div>


      <div class="reservation-details">

        <div class="reservation-detail">

          <span class="reservation-detail-icon">
            📅
          </span>

          <div>
            <small>Fecha</small>
            <strong>
              ${fechaBonita}
            </strong>
          </div>

        </div>


        <div class="reservation-detail">

          <span class="reservation-detail-icon">
            🕐
          </span>

          <div>
            <small>Hora</small>
            <strong>
              ${escaparHTML(
                reserva.hora
              )}
            </strong>
          </div>

        </div>


        ${
          reserva.duracion
            ? `
              <div class="reservation-detail">

                <span class="reservation-detail-icon">
                  ⏱️
                </span>

                <div>
                  <small>Duración</small>
                  <strong>
                    ${Number(
                      reserva.duracion
                    )} min
                  </strong>
                </div>

              </div>
            `
            : ""
        }


        ${
          reserva.precio !== null
            ? `
              <div class="reservation-detail">

                <span class="reservation-detail-icon">
                  💰
                </span>

                <div>
                  <small>Precio</small>
                  <strong>
                    ${formatearPrecio(
                      reserva.precio
                    )}
                  </strong>
                </div>

              </div>
            `
            : ""
        }

      </div>


      ${
        reserva.comentario
          ? `
            <div class="reservation-comment">

              <span>
                💬
              </span>

              <div>
                <small>Comentario</small>
                <p>
                  ${escaparHTML(
                    reserva.comentario
                  )}
                </p>
              </div>

            </div>
          `
          : ""
      }


      <div class="reservation-actions">

        <button
          class="secondary-button"
          onclick="
            verDetallesReserva(
              '${reserva.id}'
            )
          "
        >
          👁️ Ver detalles
        </button>

        ${
          !cancelada &&
          reserva.fechaHora >= new Date()
            ? `
              <button
                class="secondary-button reservation-cancel-button"
                onclick="
                  cancelarReserva(
                    '${reserva.id}'
                  )
                "
              >
                Cancelar
              </button>
            `
            : ""
        }

      </div>

    </article>

  `;

}

/* =====================================================
   DETALLES RESERVA
===================================================== */

async function verDetallesReserva(
  id
) {

  let reserva =
    ReservaYa.reservas.find(
      r => r.id === id
    );

  if (!reserva) {

    const {
      data
    } =
      await supabaseClient
        .from("Citas")
        .select(`
          *,
          servicios (
            nombre,
            precio,
            duracion
          )
        `)
        .eq(
          "id",
          id
        )
        .maybeSingle();

    if (!data) {

      mostrarToast(
        "No se encontró la reserva."
      );

      return;

    }

    const negocio =
      ReservaYa.negocios.find(
        n =>
          n.id ===
          data.negocio_id
      );

    reserva = {

      id:
        data.id,

      negocio:
        negocio?.nombre ||
        "Negocio",

      servicio:
        data.servicios
          ?.nombre ||
        "Servicio",

      precio:
        data.servicios
          ?.precio ??
        null,

      duracion:
        data.servicios
          ?.duracion ??
        null,

      fecha:
        data.fecha,

      hora:
        String(
          data.hora || ""
        ).slice(
          0,
          5
        ),

      comentario:
        data.comentario ||
        "",

      estado:
        data.estado ||
        "Pendiente"

    };

  }

  abrirModal(`

    <div>

      <h2>
        📅 Detalles de reserva
      </h2>

      <div style="
        margin-top:20px;
        display:grid;
        gap:12px;
      ">

        <div>
          <strong>
            🏢 Negocio
          </strong>

          <div style="
            color:#727887;
            margin-top:4px;
          ">
            ${escaparHTML(
              reserva.negocio
            )}
          </div>
        </div>

        <div>
          <strong>
            🛠️ Servicio
          </strong>

          <div style="
            color:#727887;
            margin-top:4px;
          ">
            ${escaparHTML(
              reserva.servicio
            )}
          </div>
        </div>

        <div>
          <strong>
            📅 Fecha
          </strong>

          <div style="
            color:#727887;
            margin-top:4px;
          ">
            ${formatearFecha(
              reserva.fecha
            )}
          </div>
        </div>

        <div>
          <strong>
            🕐 Hora
          </strong>

          <div style="
            color:#727887;
            margin-top:4px;
          ">
            ${escaparHTML(
              reserva.hora
            )}
          </div>
        </div>

        ${
          reserva.duracion
            ? `
              <div>
                <strong>
                  ⏱️ Duración
                </strong>

                <div style="
                  color:#727887;
                  margin-top:4px;
                ">
                  ${Number(
                    reserva.duracion
                  )} minutos
                </div>
              </div>
            `
            : ""
        }

        ${
          reserva.precio !== null
            ? `
              <div>
                <strong>
                  💰 Precio
                </strong>

                <div style="
                  color:#727887;
                  margin-top:4px;
                ">
                  ${formatearPrecio(
                    reserva.precio
                  )}
                </div>
              </div>
            `
            : ""
        }

        ${
          reserva.comentario
            ? `
              <div>
                <strong>
                  💬 Comentario
                </strong>

                <div style="
                  color:#727887;
                  margin-top:4px;
                ">
                  ${escaparHTML(
                    reserva.comentario
                  )}
                </div>
              </div>
            `
            : ""
        }

        <div>

          <strong>
            Estado
          </strong>

          <div style="
            margin-top:5px;
            font-weight:700;
          ">
            ${escaparHTML(
              reserva.estado
            )}
          </div>

        </div>

      </div>

    </div>

  `);

}


/* =====================================================
   CANCELAR RESERVA
===================================================== */

async function cancelarReserva(
  id
) {

  if (!ReservaYa.usuario) {

    mostrarToast(
      t("loginRequired")
    );

    return;

  }

  const reserva =
    ReservaYa.reservas.find(
      r => r.id === id
    );

  const confirmar =
    window.confirm(
      `¿Quieres cancelar esta reserva${
        reserva?.negocio
          ? ` con ${reserva.negocio}`
          : ""
      }?`
    );

  if (!confirmar) {
    return;
  }

  const {
    error
  } =
    await supabaseClient
      .from("Citas")
      .update({

        estado:
          "Cancelada"

      })
      .eq(
        "id",
        id
      )
      .eq(
        "usuario",
        ReservaYa.usuario.id
      );

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

  const local =
    ReservaYa.reservas.find(
      r => r.id === id
    );

  if (local) {
    local.estado =
      "Cancelada";
  }

  mostrarToast(
    t("reservationCancelled")
  );

  await mostrarReservas(
    "proximas"
  );

}


/* =====================================================
   NAVEGACIÓN
===================================================== */

function cambiarVista(
  nombre,
  boton = null
) {

  document
    .querySelectorAll(
      ".view"
    )
    .forEach(
      view =>
        view.classList.remove(
          "active"
        )
    );

  const vista =
    document.getElementById(
      `view-${nombre}`
    );

  if (vista) {
    vista.classList.add(
      "active"
    );
  }

  document
    .querySelectorAll(
      ".bottom-nav button"
    )
    .forEach(
      btn =>
        btn.classList.remove(
          "active"
        )
    );

  if (boton) {

    boton.classList.add(
      "active"
    );

  } else {

    document
      .querySelector(
        `.bottom-nav button[data-view="${nombre}"]`
      )
      ?.classList.add(
        "active"
      );

  }

  if (
    nombre ===
    "favorites"
  ) {

    renderizarFavoritos();

  }

  if (
    nombre ===
    "reservations"
  ) {

    mostrarReservas(
      "proximas"
    );

  }

  if (
    nombre ===
    "business"
  ) {

    cargarDatosPanelNegocio();

  }

  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

}


function irInicio() {

  cambiarVista(
    "home"
  );

}


/* =====================================================
   MODAL
===================================================== */

function abrirModal(
  html,
  accionCerrar = null
) {

  const overlay =
    document.getElementById(
      "modalOverlay"
    );

  const content =
    document.getElementById(
      "modalContent"
    );

  if (!overlay || !content) {
    return;
  }

  const accionX =
    accionCerrar ||
    "cerrarModal()";

  content.innerHTML = `

    <button
      onclick="${accionX}"
      style="
       float:right;
       width:35px;
       height:35px;
       border-radius:50%;
       background:#1d2331;
       color:white;
       border:1px solid rgba(255,255,255,0.1);
       cursor:pointer;
     "
      aria-label="Cerrar"
    >
      ✕
    </button>

    ${html}

  `;

  overlay.classList.remove(
    "hidden"
  );

}


function cerrarModal(
  event
) {

  if (
    event &&
    event.target !==
      event.currentTarget
  ) {

    return;

  }

  document
    .getElementById(
      "modalOverlay"
    )
    ?.classList.add(
      "hidden"
    );

}


/* =====================================================
   PREMIUM
===================================================== */

function abrirPremium() {

  abrirModal(`

    <div style="
      text-align:center;
    ">

      <div style="
        font-size:55px;
      ">
        🚀
      </div>

      <span style="
        display:inline-block;
        margin-top:10px;
        padding:5px 10px;
        border-radius:20px;
        background:#111827;
        color:white;
        font-size:11px;
        font-weight:700;
      ">
        PREMIUM
      </span>

      <h2 style="
        margin-top:12px;
      ">
        ReservaYa Business
      </h2>

      <p style="
        color:#727887;
        line-height:1.5;
      ">
        Herramientas para que tu negocio
        consiga más visibilidad y tome
        mejores decisiones.
      </p>

      <div style="
        text-align:left;
        margin-top:20px;
        display:grid;
        gap:12px;
      ">

        <div>
          ✨ Mayor visibilidad
        </div>

        <div>
          📊 Estadísticas avanzadas
        </div>

        <div>
          🎯 ReservaYa Pulse
        </div>

        <div>
          📣 Promociones
        </div>

        <div>
          📈 Herramientas de crecimiento
        </div>

        <div>
          🌎 Mayor exposición
        </div>

      </div>

      <button
        class="primary-button"
        style="
          width:100%;
          margin-top:22px;
        "
        onclick="
          mostrarToast(
            'La suscripción Premium estará disponible próximamente.'
          )
        "
      >
        🚀 Próximamente
      </button>

    </div>

  `);

}


/* =====================================================
   BUSINESS
===================================================== */

async function abrirPanelNegocio() {

  if (!ReservaYa.usuario) {

    mostrarToast(
      "Debes iniciar sesión."
    );

    return;

  }

  if (
    !ReservaYa.negocioActual
  ) {

    await detectarNegocioUsuario();

  }

  if (
    ReservaYa.negocioActual
  ) {

    cambiarVista(
      "business"
    );

    await cargarDatosPanelNegocio();

    return;

  }

  mostrarToast(
    "Todavía no tienes un negocio registrado."
  );

}


/* =====================================================
   DETECTAR NEGOCIO
===================================================== */

async function detectarNegocioUsuario() {

  if (!ReservaYa.usuario) {

    ReservaYa.negocioActual =
      null;

    return null;

  }

  const {
    data,
    error
  } =
    await supabaseClient
      .from("negocios")
      .select("*")
      .eq(
        "usuario_id",
        ReservaYa.usuario.id
      )
      .maybeSingle();

  if (error) {

    console.error(
      "Error buscando negocio:",
      error
    );

    ReservaYa.negocioActual =
      null;

    return null;

  }

  ReservaYa.negocioActual =
    data || null;

  return data || null;

}


/* =====================================================
   DASHBOARD BUSINESS
===================================================== */

async function cargarDatosPanelNegocio() {

  if (
    !ReservaYa.usuario
  ) {

    return;

  }

  if (
    !ReservaYa.negocioActual
  ) {

    await detectarNegocioUsuario();

  }

  if (
    !ReservaYa.negocioActual
  ) {

    return;

  }

  const negocioId =
    ReservaYa.negocioActual.id;

  const [
    citasResponse,
    serviciosResponse
  ] =
    await Promise.all([

      supabaseClient
        .from("Citas")
        .select("*")
        .eq(
          "negocio_id",
          negocioId
        ),

      supabaseClient
        .from("servicios")
        .select("*")
        .eq(
          "negocio_id",
          negocioId
        )

    ]);

  if (
    citasResponse.error
  ) {

    console.error(
      "Error cargando citas Business:",
      citasResponse.error
    );

    mostrarToast(
      "No se pudieron cargar los datos del negocio."
    );

    return;

  }

  const reservas =
    citasResponse.data ||
    [];

  const servicios =
    serviciosResponse.data ||
    [];

  const totalReservas =
    reservas.length;

  const clientesUnicos =
    new Set(
      reservas
        .map(
          reserva =>
            reserva.usuario
        )
        .filter(Boolean)
    );

  const totalClientes =
    clientesUnicos.size;

  const pendientes =
    reservas.filter(
      r =>
        ![
          "Cancelada",
          "Completada"
        ].includes(
          String(
            r.estado
          )
        )
    ).length;

  const completadas =
    reservas.filter(
      r =>
        String(
          r.estado
        ).toLowerCase() ===
        "completada"
    ).length;

  const canceladas =
    reservas.filter(
      r =>
        String(
          r.estado
        ).toLowerCase() ===
        "cancelada"
    ).length;

  const ingresos =
    calcularIngresos(
      reservas,
      servicios
    );

  actualizarElemento(
    "statReservations",
    totalReservas
  );

  actualizarElemento(
    "statClients",
    totalClientes
  );

  actualizarElemento(
    "statViews",
    "—"
  );

  actualizarElemento(
    "statRating",
    Number(
      ReservaYa.negocioActual.rating ||
      0
    ).toFixed(1)
  );

  actualizarElemento(
    "businessPendingReservations",
    pendientes
  );

  actualizarElemento(
    "businessCompletedReservations",
    completadas
  );

  actualizarElemento(
    "businessCancelledReservations",
    canceladas
  );

  actualizarElemento(
    "businessRevenue",
    formatearPrecio(
      ingresos
    )
  );

  actualizarElemento(
    "businessName",
    ReservaYa.negocioActual.nombre
  );

  actualizarElemento(
    "businessDescription",
    ReservaYa.negocioActual.descripcion ||
      "Administra tu negocio desde ReservaYa."
  );

  renderizarResumenBusiness(
    reservas,
    servicios
  );

  renderizarPulse(
    reservas,
    servicios
  );

}


/* =====================================================
   INGRESOS
===================================================== */

function calcularIngresos(
  reservas,
  servicios
) {

  let total = 0;

  reservas.forEach(
    reserva => {

      const estado =
        String(
          reserva.estado ||
          ""
        ).toLowerCase();

      if (
        [
          "cancelada",
          "cancelled"
        ].includes(
          estado
        )
      ) {

        return;

      }

      const servicio =
        servicios.find(
          s =>
            s.id ===
            reserva.servicio_id
        );

      if (servicio) {

        total +=
          Number(
            servicio.precio || 0
          );

      }

    }
  );

  return total;

}


/* =====================================================
   RESUMEN BUSINESS
===================================================== */

function renderizarResumenBusiness(
  reservas,
  servicios
) {

  const contenedor =
    document.getElementById(
      "businessSummary"
    );

  if (!contenedor) return;

  const pendientes =
    reservas.filter(
      r =>
        ![
          "Cancelada",
          "Completada"
        ].includes(
          String(
            r.estado
          )
        )
    );

  const proximas =
    pendientes
      .map(
        r => {

          return {

            ...r,

            fechaHora:
              new Date(
                `${r.fecha}T${String(
                  r.hora ||
                  "00:00"
                ).slice(0,5)}`
              )

          };

        }
      )
      .filter(
        r =>
          r.fechaHora >=
          new Date()
      )
      .sort(
        (
          a,
          b
        ) =>
          a.fechaHora -
          b.fechaHora
      )
      .slice(0, 5);

  if (!proximas.length) {

    contenedor.innerHTML = `

      <div style="
        padding:25px;
        border:1px solid #eee;
        border-radius:16px;
        text-align:center;
        color:#727887;
      ">

        <div style="
          font-size:35px;
        ">
          📅
        </div>

        <strong>
          No tienes próximas reservas
        </strong>

      </div>

    `;

    return;

  }

  contenedor.innerHTML = proximas
    .map(
      reserva => {

        const servicio =
          servicios.find(
            s =>
              s.id ===
              reserva.servicio_id
          );

        return `

          <div style="
            padding:15px;
            border-bottom:1px solid #eee;
            display:flex;
            justify-content:space-between;
            gap:15px;
          ">

            <div>

              <strong>
                ${escaparHTML(
                  reserva.nombre_cliente ||
                  "Cliente"
                )}
              </strong>

              <div style="
                color:#727887;
                margin-top:4px;
              ">
                ${
                  servicio?.nombre ||
                  "Servicio"
                }
              </div>

            </div>

            <div style="
              text-align:right;
              white-space:nowrap;
            ">

              <strong>
                ${formatearFecha(
                  reserva.fecha
                )}
              </strong>

              <div style="
                color:#727887;
                margin-top:4px;
              ">
                ${escaparHTML(
                  String(
                    reserva.hora ||
                    ""
                  ).slice(0,5)
                )}
              </div>

            </div>

          </div>

        `;

      }
    )
    .join("");

}


/* =====================================================
   RESERVAYA PULSE
===================================================== */

function analizarPulse(
  reservas,
  servicios
) {

  const ahora =
    new Date();

  const hace30Dias =
    new Date(
      ahora.getTime() -
      30 *
        24 *
        60 *
        60 *
        1000
    );

  const hace60Dias =
    new Date(
      ahora.getTime() -
      60 *
        24 *
        60 *
        60 *
        1000
    );

  const recientes =
    reservas.filter(
      reserva => {

        const fecha =
          new Date(
            `${reserva.fecha}T12:00:00`
          );

        return fecha >=
          hace30Dias;

      }
    );

  const anteriores =
    reservas.filter(
      reserva => {

        const fecha =
          new Date(
            `${reserva.fecha}T12:00:00`
          );

        return (
          fecha >= hace60Dias &&
          fecha < hace30Dias
        );

      }
    );

  const crecimiento =
    anteriores.length
      ? (
          (
            recientes.length -
            anteriores.length
          ) /
          anteriores.length
        ) *
        100
      : null;

  const servicioContador =
    {};

  reservas.forEach(
    reserva => {

      if (
        !reserva.servicio_id
      ) return;

      servicioContador[
        reserva.servicio_id
      ] =
        (
          servicioContador[
            reserva.servicio_id
          ] ||
          0
        ) + 1;

    }
  );

  let servicioTop =
    null;

  Object.entries(
    servicioContador
  ).forEach(
    ([
      id,
      cantidad
    ]) => {

      if (
        !servicioTop ||
        cantidad >
          servicioTop.cantidad
      ) {

        servicioTop = {

          id,

          cantidad

        };

      }

    }
  );

  const servicioTopInfo =
    servicios.find(
      servicio =>
        servicio.id ===
        servicioTop?.id
    );

  const horarios = {};

  reservas.forEach(
    reserva => {

      if (!reserva.hora) {
        return;
      }

      const hora =
        String(
          reserva.hora
        ).slice(0,5);

      horarios[hora] =
        (
          horarios[hora] ||
          0
        ) + 1;

    }
  );

  let horaTop =
    null;

  Object.entries(
    horarios
  ).forEach(
    ([
      hora,
      cantidad
    ]) => {

      if (
        !horaTop ||
        cantidad >
          horaTop.cantidad
      ) {

        horaTop = {

          hora,

          cantidad

        };

      }

    }
  );

  return {

    total:
      reservas.length,

    recientes:
      recientes.length,

    anteriores:
      anteriores.length,

    crecimiento,

    servicioTop:
      servicioTopInfo
        ? {
            nombre:
              servicioTopInfo.nombre,

            cantidad:
              servicioTop.cantidad
          }
        : null,

    horaTop

  };

}


function renderizarPulse(
  reservas,
  servicios
) {

  const contenedor =
    document.getElementById(
      "pulseContainer"
    );

  if (!contenedor) {
    return;
  }

  const datos =
    analizarPulse(
      reservas,
      servicios
    );

  const tarjetas = [];

  if (
    datos.crecimiento !== null
  ) {

    const positivo =
      datos.crecimiento >= 0;

    tarjetas.push(`

      <div style="
        padding:16px;
        border-radius:16px;
        background:#f8f9fb;
      ">

        <div style="
          font-size:25px;
        ">
          ${
            positivo
              ? "📈"
              : "📉"
          }
        </div>

        <strong>
          ${
            positivo
              ? "Tu demanda está creciendo"
              : "Tu demanda bajó"
          }
        </strong>

        <div style="
          margin-top:5px;
          color:#727887;
        ">
          ${
            positivo
              ? "+"
              : ""
          }${datos.crecimiento.toFixed(
            0
          )}%
          frente al período anterior.
        </div>

      </div>

    `);

  } else {

    tarjetas.push(`

      <div style="
        padding:16px;
        border-radius:16px;
        background:#f8f9fb;
      ">

        <div style="
          font-size:25px;
        ">
          🌱
        </div>

        <strong>
          ReservaYa está aprendiendo
        </strong>

        <div style="
          margin-top:5px;
          color:#727887;
        ">
          Necesitamos más reservas
          para detectar tendencias.
        </div>

      </div>

    `);

  }

  if (
    datos.servicioTop
  ) {

    tarjetas.push(`

      <div style="
        padding:16px;
        border-radius:16px;
        background:#f8f9fb;
      ">

        <div style="
          font-size:25px;
        ">
          🏆
        </div>

        <strong>
          Servicio más reservado
        </strong>

        <div style="
          margin-top:5px;
          color:#727887;
        ">
          ${escaparHTML(
            datos.servicioTop.nombre
          )}

          ·

          ${datos.servicioTop.cantidad}
          reservas
        </div>

      </div>

    `);

  }

  if (
    datos.horaTop
  ) {

    tarjetas.push(`

      <div style="
        padding:16px;
        border-radius:16px;
        background:#f8f9fb;
      ">

        <div style="
          font-size:25px;
        ">
          🔥
        </div>

        <strong>
          Hora con más reservas
        </strong>

        <div style="
          margin-top:5px;
          color:#727887;
        ">
          ${datos.horaTop.hora}
          ·
          ${datos.horaTop.cantidad}
          reservas
        </div>

      </div>

    `);

  }

  tarjetas.push(`

    <div style="
      padding:16px;
      border-radius:16px;
      background:#f8f9fb;
    ">

      <div style="
        font-size:25px;
      ">
        💡
      </div>

      <strong>
        Oportunidad
      </strong>

      <div style="
        margin-top:5px;
        color:#727887;
      ">

        Usa tus horarios disponibles
        para atraer nuevos clientes.

      </div>

    </div>

  `);

  contenedor.innerHTML = `

    <div style="
      display:grid;
      gap:10px;
    ">

      ${tarjetas.join("")}

    </div>

  `;

}


/* =====================================================
   SERVICIOS BUSINESS
===================================================== */

async function administrarServicios() {

  if (
    !ReservaYa.usuario ||
    !ReservaYa.negocioActual
  ) {

    mostrarToast(
      "Necesitas un negocio registrado."
    );

    return;

  }

  const {
    data,
    error
  } =
    await supabaseClient
      .from("servicios")
      .select("*")
      .eq(
        "negocio_id",
        ReservaYa.negocioActual.id
      )
      .order(
        "nombre",
        {
          ascending: true
        }
      );

  if (error) {

    console.error(
      "Error cargando servicios:",
      error
    );

    mostrarToast(
      "No se pudieron cargar los servicios."
    );

    return;

  }

  const servicios =
    data || [];

  abrirModal(`

    <div>

      <h2>
        🛠️ Servicios
      </h2>

      <p style="
        color:#727887;
        margin:5px 0 18px;
      ">
        Servicios configurados para tu negocio.
      </p>

      ${
        servicios.length

          ? servicios
              .map(
                servicio => `

                  <div style="
                    padding:14px 0;
                    border-bottom:1px solid #eee;
                    display:flex;
                    justify-content:space-between;
                    gap:10px;
                  ">

                    <div>

                      <strong>
                        ${escaparHTML(
                          servicio.nombre
                        )}
                      </strong>

                      ${
                        servicio.duracion
                          ? `
                            <div style="
                              color:#727887;
                              margin-top:4px;
                              font-size:13px;
                            ">
                              ⏱️
                              ${Number(
                                servicio.duracion
                              )} min
                            </div>
                          `
                          : ""
                      }

                    </div>

                    <strong>
                      ${
                        servicio.precio !== null
                          ? formatearPrecio(
                              servicio.precio
                            )
                          : "—"
                      }
                    </strong>

                  </div>

                `
              )
              .join("")

          : `

              <div style="
                padding:30px;
                text-align:center;
                color:#727887;
              ">

                🛠️

                <p>
                  Todavía no tienes servicios configurados.
                </p>

              </div>

            `
      }

    </div>

  `);

}


/* =====================================================
   HORARIOS BUSINESS
===================================================== */

async function administrarHorarios() {

  if (
    !ReservaYa.usuario ||
    !ReservaYa.negocioActual
  ) {

    mostrarToast(
      "Necesitas un negocio registrado."
    );

    return;

  }

  const {
    data,
    error
  } =
    await supabaseClient
      .from("reserva_horarios")
      .select("*")
      .eq(
        "negocio_id",
        ReservaYa.negocioActual.id
      )
      .order(
        "dia_semana",
        {
          ascending: true
        }
      );

  if (error) {

    console.error(
      "Error cargando horarios:",
      error
    );

    mostrarToast(
      "No se pudieron cargar los horarios."
    );

    return;

  }

  const horarios =
    data || [];

  const dias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado"
  ];

  const contenido =
    dias
      .map(
        (
          dia,
          indice
        ) => {

          const horario =
            horarios.find(
              h =>
                Number(
                  h.dia_semana
                ) === indice
            );

          const abierto =
            horario
              ? Boolean(
                  horario.abierto
                )
              : false;

          const apertura =
            horario?.hora_apertura
              ? horario.hora_apertura.slice(
                  0,
                  5
                )
              : "06:30";

          const cierre =
            horario?.hora_cierre
              ? horario.hora_cierre.slice(
                  0,
                  5
                )
              : "20:00";

          return `

            <div style="
              padding:15px 0;
              border-bottom:1px solid #eee;
            ">

              <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
              ">

                <strong>
                  ${dia}
                </strong>

                <label style="
                  display:flex;
                  gap:7px;
                  align-items:center;
                  font-size:13px;
                ">

                  <input
                    id="horarioAbierto${indice}"
                    type="checkbox"
                    ${
                      abierto
                        ? "checked"
                        : ""
                    }
                    onchange="
                      alternarHorario(
                        ${indice}
                      )
                    "
                  >

                  Abierto

                </label>

              </div>

              <div
                id="horarioCampos${indice}"
                style="
                  display:${
                    abierto
                      ? "grid"
                      : "none"
                  };
                  grid-template-columns:
                    1fr 1fr;
                  gap:10px;
                  margin-top:10px;
                "
              >

                <div>

                  <small>
                    Apertura
                  </small>

                  <input
                    id="horaApertura${indice}"
                    type="time"
                    value="${apertura}"
                    style="
                      width:100%;
                      padding:10px;
                      border:1px solid #ddd;
                      border-radius:9px;
                      margin-top:4px;
                    "
                  >

                </div>

                <div>

                  <small>
                    Cierre
                  </small>

                  <input
                    id="horaCierre${indice}"
                    type="time"
                    value="${cierre}"
                    style="
                      width:100%;
                      padding:10px;
                      border:1px solid #ddd;
                      border-radius:9px;
                      margin-top:4px;
                    "
                  >

                </div>

              </div>

            </div>

          `;

        }
      )
      .join("");

  abrirModal(`

    <div>

      <h2>
        🕐 Horarios
      </h2>

      <p style="
        color:#727887;
        margin:5px 0 15px;
      ">
        Configura cuándo puede recibir reservas tu negocio.
      </p>

      ${contenido}

      <button
        class="primary-button"
        style="
          width:100%;
          margin-top:18px;
        "
        onclick="
          guardarHorarios()
        "
      >
        💾 Guardar horarios
      </button>

    </div>

  `);

}


function alternarHorario(
  dia
) {

  const checkbox =
    document.getElementById(
      `horarioAbierto${dia}`
    );

  const campos =
    document.getElementById(
      `horarioCampos${dia}`
    );

  if (!checkbox || !campos) {
    return;
  }

  campos.style.display =
    checkbox.checked
      ? "grid"
      : "none";

}


/* =====================================================
   GUARDAR HORARIOS
===================================================== */

async function guardarHorarios() {

  if (
    !ReservaYa.usuario ||
    !ReservaYa.negocioActual
  ) {

    mostrarToast(
      "Necesitas un negocio registrado."
    );

    return;

  }

  const negocioId =
    ReservaYa.negocioActual.id;

  const dias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado"
  ];

  const horarios = [];

  for (
    let dia = 0;
    dia < 7;
    dia++
  ) {

    const abierto =
      document.getElementById(
        `horarioAbierto${dia}`
      )?.checked ||
      false;

    const horaApertura =
      document.getElementById(
        `horaApertura${dia}`
      )?.value ||
      null;

    const horaCierre =
      document.getElementById(
        `horaCierre${dia}`
      )?.value ||
      null;

    if (
      abierto &&
      (
        !horaApertura ||
        !horaCierre
      )
    ) {

      mostrarToast(
        `Completa el horario de ${dias[dia]}.`
      );

      return;

    }

    if (
      abierto &&
      horaApertura >=
        horaCierre
    ) {

      mostrarToast(
        `El horario de ${dias[dia]} no es válido.`
      );

      return;

    }

    horarios.push({

      negocio_id:
        negocioId,

      dia_semana:
        dia,

      abierto:
        abierto,

      hora_apertura:
        abierto
          ? horaApertura
          : null,

      hora_cierre:
        abierto
          ? horaCierre
          : null

    });

  }

  const {
    error:
      errorEliminar
  } =
    await supabaseClient
      .from(
        "reserva_horarios"
      )
      .delete()
      .eq(
        "negocio_id",
        negocioId
      );

  if (
    errorEliminar
  ) {

    console.error(
      errorEliminar
    );

    mostrarToast(
      "No se pudieron actualizar los horarios."
    );

    return;

  }

  const {
    error:
      errorGuardar
  } =
    await supabaseClient
      .from(
        "reserva_horarios"
      )
      .insert(
        horarios
      );

  if (
    errorGuardar
  ) {

    console.error(
      errorGuardar
    );

    mostrarToast(
      "No se pudieron guardar los horarios."
    );

    return;

  }

  cerrarModal();

  mostrarToast(
    `Horarios de ${ReservaYa.negocioActual.nombre} guardados correctamente.`
  );

}


/* =====================================================
   EMPLEADOS
===================================================== */

function administrarEmpleados() {

  abrirModal(`

    <div style="
      text-align:center;
    ">

      <div style="
        font-size:50px;
      ">
        👥
      </div>

      <h2>
        Gestión de empleados
      </h2>

      <p style="
        color:#727887;
        line-height:1.5;
      ">
        Esta herramienta está preparada
        para una futura versión de
        ReservaYa Business.
      </p>

      <div style="
        margin-top:18px;
        padding:15px;
        border-radius:14px;
        background:#f8f9fb;
        text-align:left;
      ">

        <strong>
          Próximamente podrás:
        </strong>

        <div style="
          margin-top:10px;
          display:grid;
          gap:7px;
          color:#555;
        ">

          <div>
            👤 Gestionar empleados
          </div>

          <div>
            📅 Asignar horarios
          </div>

          <div>
            🛠️ Asignar servicios
          </div>

          <div>
            📊 Ver rendimiento
          </div>

        </div>

      </div>

      <p style="
        font-size:12px;
        color:#999;
        margin-top:15px;
      ">
        Requiere nuevas estructuras de datos
        en Supabase para funcionar completamente.
      </p>

    </div>

  `);

}


/* =====================================================
   ESTADÍSTICAS
===================================================== */

async function abrirEstadisticas() {

  if (
    !ReservaYa.negocioActual
  ) {

    mostrarToast(
      "No hay un negocio seleccionado."
    );

    return;

  }

  const negocioId =
    ReservaYa.negocioActual.id;

  const {
    data: reservas,
    error
  } =
    await supabaseClient
      .from("Citas")
      .select("*")
      .eq(
        "negocio_id",
        negocioId
      );

  if (error) {

    console.error(
      error
    );

    mostrarToast(
      "No se pudieron cargar las estadísticas."
    );

    return;

  }

  const total =
    (reservas || []).length;

  const canceladas =
    (reservas || []).filter(
      r =>
        String(
          r.estado
        ).toLowerCase() ===
        "cancelada"
    ).length;

  const completadas =
    (reservas || []).filter(
      r =>
        String(
          r.estado
        ).toLowerCase() ===
        "completada"
    ).length;

  const clientes =
    new Set(
      (reservas || [])
        .map(
          r => r.usuario
        )
        .filter(Boolean)
    ).size;

  const tasaCancelacion =
    total
      ? (
          canceladas /
          total
        ) *
        100
      : 0;

  abrirModal(`

    <div>

      <h2>
        📊 Estadísticas
      </h2>

      <p style="
        color:#727887;
      ">
        Datos calculados a partir de
        tus reservas actuales.
      </p>

      <div style="
        display:grid;
        grid-template-columns:
          repeat(2,1fr);
        gap:10px;
        margin-top:20px;
      ">

        ${crearStatModal(
          "📅",
          total,
          "Reservas"
        )}

        ${crearStatModal(
          "👥",
          clientes,
          "Clientes"
        )}

        ${crearStatModal(
          "✅",
          completadas,
          "Completadas"
        )}

        ${crearStatModal(
          "❌",
          canceladas,
          "Canceladas"
        )}

      </div>

      <div style="
        margin-top:15px;
        padding:15px;
        border-radius:14px;
        background:#f8f9fb;
      ">

        <strong>
          Tasa de cancelación
        </strong>

        <div style="
          font-size:25px;
          font-weight:800;
          margin-top:5px;
        ">
          ${tasaCancelacion.toFixed(
            1
          )}%
        </div>

      </div>

    </div>

  `);

}


function crearStatModal(
  icono,
  valor,
  titulo
) {

  return `

    <div style="
      padding:15px;
      border:1px solid #eee;
      border-radius:14px;
    ">

      <div style="
        font-size:25px;
      ">
        ${icono}
      </div>

      <strong style="
        font-size:24px;
        display:block;
        margin-top:5px;
      ">
        ${valor}
      </strong>

      <small style="
        color:#727887;
      ">
        ${titulo}
      </small>

    </div>

  `;

}


/* =====================================================
   PERFIL / USUARIO
===================================================== */

async function actualizarInterfazUsuario() {

  const loginBox =
    document.getElementById(
      "loginBox"
    );

  const profileCard =
    document.querySelector(
      "#view-profile .profile-card"
    );

  const settingsList =
    document.querySelector(
      "#view-profile .settings-list"
    );

  if (!ReservaYa.usuario) {

    if (loginBox) {
      loginBox.style.display =
        "block";
    }

    if (profileCard) {
      profileCard.style.display =
        "none";
    }

    if (settingsList) {
      settingsList.style.display =
        "none";
    }

    ReservaYa.negocioActual =
      null;

    actualizarBotonBusiness(
      null
    );

    return;

  }

  if (loginBox) {
    loginBox.style.display =
      "none";
  }

  if (profileCard) {
    profileCard.style.display =
      "block";
  }

  if (settingsList) {
    settingsList.style.display =
      "block";
  }

  const nombre =
    ReservaYa.usuario.nombre ||
    ReservaYa.usuario.user_metadata
      ?.nombre ||
    ReservaYa.usuario.email ||
    "Usuario";

  const inicial =
    nombre
      .charAt(0)
      .toUpperCase();

  const userAvatar =
    document.getElementById(
      "userAvatar"
    );

  const profileAvatar =
    document.getElementById(
      "profileAvatar"
    );

  const profileName =
    document.getElementById(
      "profileName"
    );

  const profileEmail =
    document.getElementById(
      "profileEmail"
    );

  if (userAvatar) {
    userAvatar.textContent =
      inicial;
  }

  if (profileAvatar) {
    profileAvatar.textContent =
      inicial;
  }

  if (profileName) {
    profileName.textContent =
      nombre;
  }

  if (profileEmail) {
    profileEmail.textContent =
      ReservaYa.usuario.email ||
      "-";
  }

  await detectarNegocioUsuario();

  actualizarBotonBusiness(
    ReservaYa.negocioActual
  );

}


function actualizarBotonBusiness(
  negocio
) {

  const boton =
    document.getElementById(
      "businessProfileButton"
    );

  const texto =
    document.getElementById(
      "businessProfileButtonText"
    );

  if (!boton) return;

  if (negocio) {

    boton.style.display =
      "flex";

    if (texto) {

      texto.textContent =
        negocio.nombre
          ? `Business · ${negocio.nombre}`
          : "ReservaYa Business";

    }

  } else {

    boton.style.display =
      "flex";

    if (texto) {

      texto.textContent =
        "ReservaYa Business";

    }

  }

}


/* =====================================================
   SESIÓN
===================================================== */

async function restaurarSesion() {

  const {
    data,
    error
  } =
    await supabaseClient.auth
      .getSession();

  if (error) {

    console.error(
      "Error recuperando sesión:",
      error
    );

    return;

  }

  if (
    data.session?.user
  ) {

    ReservaYa.usuario =
      data.session.user;

    await cargarFavoritos();

    await actualizarInterfazUsuario();

  } else {

    ReservaYa.usuario =
      null;

    actualizarInterfazUsuario();

  }

}


supabaseClient.auth.onAuthStateChange(
  async (
    event,
    session
  ) => {

    if (
      event ===
        "SIGNED_IN" ||
      event ===
        "TOKEN_REFRESHED"
    ) {

      ReservaYa.usuario =
        session?.user ||
        null;

      await cargarFavoritos();

      await actualizarInterfazUsuario();

    }

    if (
      event ===
      "SIGNED_OUT"
    ) {

      ReservaYa.usuario =
        null;

      ReservaYa.favoritos =
        [];

      ReservaYa.negocioActual =
        null;

      actualizarInterfazUsuario();

    }

  }
);


restaurarSesion();


/* =====================================================
   LOGIN
===================================================== */

async function iniciarSesion() {

  const email =
    document.getElementById(
      "loginEmail"
    )?.value.trim();

  const password =
    document.getElementById(
      "loginPassword"
    )?.value;

  if (
    !email ||
    !password
  ) {

    mostrarToast(
      "Completa correo y contraseña."
    );

    return;

  }

  const {
    data,
    error
  } =
    await supabaseClient.auth
      .signInWithPassword({

        email,

        password

      });

  if (error) {

    console.error(
      "Error iniciando sesión:",
      error
    );

    mostrarToast(
      "No se pudo iniciar sesión."
    );

    return;

  }

  ReservaYa.usuario =
    data.user;

  await cargarFavoritos();

  await actualizarInterfazUsuario();

  mostrarToast(
    "Sesión iniciada."
  );

  const loginBox =
    document.getElementById(
      "loginBox"
    );

  if (loginBox) {
    loginBox.style.display =
      "none";
  }

  cambiarVista(
    "home"
  );

}


/* =====================================================
   REGISTRO
===================================================== */

async function registrarse() {

  const email =
    document.getElementById(
      "loginEmail"
    )?.value.trim();

  const password =
    document.getElementById(
      "loginPassword"
    )?.value;

  if (
    !email ||
    !password
  ) {

    mostrarToast(
      "Completa correo y contraseña."
    );

    return;

  }

  if (password.length < 6) {

    mostrarToast(
      "La contraseña debe tener al menos 6 caracteres."
    );

    return;

  }

  const {
    data,
    error
  } =
    await supabaseClient.auth
      .signUp({

        email,

        password

      });

  if (error) {

    console.error(
      "Error registrando usuario:",
      error
    );

    mostrarToast(
      "No se pudo crear la cuenta."
    );

    return;

  }

  if (
    data.user &&
    !data.session
  ) {

    mostrarToast(
      "Cuenta creada. Revisa tu correo para confirmarla."
    );

  } else {

    ReservaYa.usuario =
      data.user;

    await actualizarInterfazUsuario();

    mostrarToast(
      "Cuenta creada correctamente."
    );

    cambiarVista(
      "home"
    );

  }

}


/* =====================================================
   CERRAR SESIÓN
===================================================== */

async function cerrarSesion() {

  const {
    error
  } =
    await supabaseClient.auth
      .signOut();

  if (error) {

    console.error(
      "Error cerrando sesión:",
      error
    );

    mostrarToast(
      "No se pudo cerrar la sesión."
    );

    return;

  }

  ReservaYa.usuario =
    null;

  ReservaYa.favoritos =
    [];

  ReservaYa.negocioActual =
    null;

  localStorage.removeItem(
    "reservaya_favoritos"
  );

  actualizarInterfazUsuario();

  cambiarVista(
    "home"
  );

  mostrarToast(
    "Sesión cerrada."
  );

}


/* =====================================================
   PERFIL
===================================================== */

function abrirMenuUsuario() {

  cambiarVista(
    "profile"
  );

}


function editarPerfil() {

  if (!ReservaYa.usuario) {

    mostrarToast(
      t("loginRequired")
    );

    return;

  }

  const nombreActual =
    ReservaYa.usuario
      .user_metadata
      ?.nombre ||
    "";

  abrirModal(`

    <div>

      <h2>
        👤 Mi perfil
      </h2>

      <p style="
        color:#727887;
      ">
        Información básica de tu cuenta.
      </p>

      <label style="
        display:block;
        margin-top:18px;
        font-weight:700;
      ">
        Nombre
      </label>

      <input
        id="profileEditName"
        value="${escaparHTML(
          nombreActual
        )}"
        style="
          width:100%;
          margin-top:6px;
          padding:12px;
          border:1px solid #ddd;
          border-radius:10px;
        "
      >

      <button
        class="primary-button"
        style="
          width:100%;
          margin-top:16px;
        "
        onclick="
          guardarPerfil()
        "
      >
        Guardar
      </button>

    </div>

  `);

}


async function guardarPerfil() {

  const nombre =
    document.getElementById(
      "profileEditName"
    )?.value.trim();

  if (!nombre) {

    mostrarToast(
      "Escribe tu nombre."
    );

    return;

  }

  const {
    data,
    error
  } =
    await supabaseClient.auth
      .updateUser({

        data: {
          nombre
        }

      });

  if (error) {

    console.error(
      error
    );

    mostrarToast(
      "No se pudo actualizar el perfil."
    );

    return;

  }

  ReservaYa.usuario =
    data.user;

  cerrarModal();

  actualizarInterfazUsuario();

  mostrarToast(
    "Perfil actualizado."
  );

}


/* =====================================================
   CONFIGURACIÓN
===================================================== */

function abrirConfiguracion() {

  abrirModal(`

    <div>

      <h2>
        ⚙️ Configuración
      </h2>

      <div style="
        display:grid;
        gap:10px;
        margin-top:20px;
      ">

        <div style="
          padding:15px;
          border:1px solid #eee;
          border-radius:14px;
        ">

          <strong>
            🌐 Idioma
          </strong>

          <select
            id="languageSelector"
            onchange="
              cambiarIdioma(
                this.value
              )
            "
            style="
              display:block;
              width:100%;
              margin-top:8px;
              padding:10px;
              border:1px solid #ddd;
              border-radius:9px;
            "
          >

            ${Object.entries(
              IDIOMAS
            )
              .map(
                ([
                  id,
                  idioma
                ]) => `

                  <option
                    value="${id}"
                    ${
                      ReservaYa.idioma ===
                      id
                        ? "selected"
                        : ""
                    }
                  >
                    ${idioma.bandera}
                    ${idioma.nombre}
                  </option>

                `
              )
              .join("")}

          </select>

        </div>

        <div style="
          padding:15px;
          border:1px solid #eee;
          border-radius:14px;
        ">

          <strong>
            🔔 Notificaciones
          </strong>

          <label style="
            display:flex;
            align-items:center;
            gap:8px;
            margin-top:10px;
          ">

            <input
              type="checkbox"
              ${
                ReservaYa.configuracion
                  .notificacionesActivas
                  ? "checked"
                  : ""
              }
              onchange="
                cambiarNotificaciones(
                  this.checked
                )
              "
            >

            Activadas

          </label>

        </div>

        <div style="
          padding:15px;
          border:1px solid #eee;
          border-radius:14px;
        ">

          <strong>
            📍 Ubicación
          </strong>

          <p style="
            color:#727887;
            margin-top:5px;
            font-size:13px;
          ">
            La búsqueda cercana se podrá
            activar cuando conectemos
            geolocalización.
          </p>

          <button
            class="secondary-button"
            style="
              width:100%;
              margin-top:8px;
            "
            onclick="
              buscarCercanos()
            "
          >
            📍 Buscar cerca de mí
          </button>

        </div>

      </div>

    </div>

  `);

}


function cambiarNotificaciones(
  activadas
) {

  ReservaYa.configuracion
    .notificacionesActivas =
    Boolean(
      activadas
    );

  localStorage.setItem(
    "reservaya_notificaciones",
    String(
      Boolean(
        activadas
      )
    )
  );

  mostrarToast(
    activadas
      ? "Notificaciones activadas."
      : "Notificaciones desactivadas."
  );

}


/* =====================================================
   NOTIFICACIONES
===================================================== */

function abrirNotificaciones() {

  abrirModal(`

    <div>

      <h2>
        🔔 Notificaciones
      </h2>

      <div style="
        padding:30px;
        text-align:center;
        color:#727887;
      ">

        <div style="
          font-size:45px;
        ">
          🔔
        </div>

        <p style="
          margin-top:10px;
        ">
          Tu centro de notificaciones
          está preparado.
        </p>

        <small>
          Las notificaciones automáticas
          requerirán una futura integración.
        </small>

      </div>

    </div>

  `);

}


/* =====================================================
   CATEGORÍAS
===================================================== */

function mostrarTodasCategorias() {

  cambiarVista(
    "search"
  );

  const select =
    document.getElementById(
      "categoryFilter"
    );

  if (select) {
    select.value = "";
  }

  ReservaYa.categoriaActual =
    "";

  filtrarNegocios();

}


/* =====================================================
   UBICACIÓN
===================================================== */

function buscarCercanos() {

  if (
    !navigator.geolocation
  ) {

    mostrarToast(
      "Tu dispositivo no permite geolocalización."
    );

    return;

  }

  mostrarToast(
    "Solicitando ubicación..."
  );

  navigator.geolocation.getCurrentPosition(

    position => {

      ReservaYa.configuracion
        .ubicacionActiva =
        true;

      localStorage.setItem(
        "reservaya_ubicacion",
        JSON.stringify({

          lat:
            position.coords.latitude,

          lng:
            position.coords.longitude

        })
      );

      mostrarToast(
        "Ubicación activada."
      );

      /*
         En V4 la ubicación queda preparada.
         Para calcular distancias reales entre
         negocios necesitamos coordenadas
         lat/lng en la tabla negocios.
      */

    },

    error => {

      console.warn(
        "Geolocalización:",
        error
      );

      mostrarToast(
        "No pudimos obtener tu ubicación."
      );

    },

    {

      enableHighAccuracy:
        true,

      timeout:
        10000,

      maximumAge:
        300000

    }

  );

}


/* =====================================================
   UTILIDADES
===================================================== */

function obtenerIconoCategoria(
  categoria
) {

  return (

    CATEGORIAS.find(
      c =>
        c.id ===
        categoria
    )?.icono ||
    "📍"

  );

}


function obtenerFechaHoy() {

  const ahora =
    new Date();

  const año =
    ahora.getFullYear();

  const mes =
    String(
      ahora.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const dia =
    String(
      ahora.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${año}-${mes}-${dia}`;

}


function escaparHTML(
  valor
) {

  return String(
    valor ?? ""
  )
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );

}


function actualizarElemento(
  id,
  valor
) {

  const elemento =
    document.getElementById(
      id
    );

  if (elemento) {

    elemento.textContent =
      valor;

  }

}


/* =====================================================
   FORMATO FECHA
===================================================== */

function formatearFecha(
  fecha
) {

  if (!fecha) {
    return "Fecha no disponible";
  }

  const partes =
    String(
      fecha
    ).split("-");

  if (
    partes.length !==
    3
  ) {

    return fecha;

  }

  const [
    año,
    mes,
    dia
  ] = partes;

  const date =
    new Date(
      Number(año),
      Number(mes) - 1,
      Number(dia)
    );

  try {

    return new Intl.DateTimeFormat(
      ReservaYa.idioma,
      {

        year:
          "numeric",

        month:
          "long",

        day:
          "numeric"

      }
    ).format(
      date
    );

  } catch {

    return `${dia}/${mes}/${año}`;

  }

}


/* =====================================================
   FORMATO PRECIO
===================================================== */

function formatearPrecio(
  valor
) {

  const numero =
    Number(
      valor
    );

  if (
    !Number.isFinite(
      numero
    )
  ) {

    return "—";

  }

  /*
     V4 utiliza la configuración
     regional del navegador para
     mostrar el número.

     Cuando agreguemos moneda real
     al negocio podremos sustituir
     esto por moneda/país del negocio.
  */

  try {

    return new Intl.NumberFormat(
      obtenerLocale(),
      {

        maximumFractionDigits:
          2

      }
    ).format(
      numero
    );

  } catch {

    return String(
      numero
    );

  }

}


function obtenerLocale() {

  const locales = {

    es:
      "es-CO",

    en:
      "en-US",

    pt:
      "pt-BR",

    fr:
      "fr-FR",

    de:
      "de-DE",

    it:
      "it-IT"

  };

  return (
    locales[
      ReservaYa.idioma
    ] ||
    "es-CO"
  );

}


/* =====================================================
   CONTADORES
===================================================== */

function actualizarContadores() {

  const favoritos =
    ReservaYa.favoritos.length;

  const favoritosBadge =
    document.getElementById(
      "favoritesCount"
    );

  if (favoritosBadge) {

    favoritosBadge.textContent =
      favoritos;

    favoritosBadge.style.display =
      favoritos
        ? "inline-flex"
        : "none";

  }

}


/* =====================================================
   TOAST
===================================================== */

let toastTimer = null;


function mostrarToast(
  mensaje
) {

  const toast =
    document.getElementById(
      "toast"
    );

  if (!toast) return;

  toast.textContent =
    mensaje;

  toast.classList.remove(
    "hidden"
  );

  clearTimeout(
    toastTimer
  );

  toastTimer =
    setTimeout(
      () => {

        toast.classList.add(
          "hidden"
        );

      },
      3000
    );

}


/* =====================================================
   INICIALIZACIÓN EXTRA
===================================================== */

(function cargarConfiguracionLocal() {

  try {

    const notificaciones =
      localStorage.getItem(
        "reservaya_notificaciones"
      );

    if (
      notificaciones !==
      null
    ) {

      ReservaYa.configuracion
        .notificacionesActivas =
        notificaciones ===
        "true";

    }

    const ubicacion =
      localStorage.getItem(
        "reservaya_ubicacion"
      );

    if (ubicacion) {

      ReservaYa.configuracion
        .ubicacionActiva =
        true;

    }

  } catch (error) {

    console.warn(
      "No se pudo cargar configuración local:",
      error
    );

  }

})();


/* =====================================================
   FIN RESERVAYA V4
===================================================== */

console.log(
  "🚀 ReservaYa V4 cargado correctamente."
);
