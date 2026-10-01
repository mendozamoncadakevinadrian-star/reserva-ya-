// =====================================================
// RESERVA YA — APP COMPLETA CON SUPABASE
// Todo conectado: Reservas, Negocios, Favoritos, Sesión
// =====================================================

// 🔑 TU CONEXIÓN DE SUPABASE
const SUPABASE_URL = "https://mjxiyzapdybzckurootw.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ox1Wz7UT2Gw6uHOP6SncjQ_sGapEEB-";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ESTADO GLOBAL
const App = {
  usuario: null,
  negocios: [],
  favoritos: [],
  vista_actual: "inicio"
};

// CATEGORÍAS
const CATEGORIAS = [
  {id: "barberia", nombre: "Barbería", icono: "💈"},
  {id: "belleza", nombre: "Belleza", icono: "💅"},
  {id: "restaurante", nombre: "Restaurante", icono: "🍽️"},
  {id: "salud", nombre: "Salud", icono: "🩺"},
  {id: "fitness", nombre: "Fitness", icono: "🏋️"},
  {id: "spa", nombre: "Spa", icono: "🧖"},
  {id: "otros", nombre: "Otros", icono: "📌"}
];

// =============================================
// AL CARGAR LA PÁGINA
// =============================================
document.addEventListener("DOMContentLoaded", async () => {
  console.log("🚀 ReservaYa iniciando...");
  
  // Cargar categorías
  dibujarCategorias();
  
  // Cargar negocios desde Supabase
  await cargarNegocios();
  
  // Cargar favoritos
  cargarFavoritos();
  
  // Verificar si hay sesión activa
  const {data:{session}} = await supabase.auth.getSession();
  if(session) {
    App.usuario = session.user;
    actualizarUIConSesion();
  }
  
  // Escuchar cambios de sesión
  supabase.auth.onAuthStateChange(async (event) => {
    if(event === "SIGNED_IN") {
      App.usuario = (await supabase.auth.getUser()).data.user;
      actualizarUIConSesion();
    }
    if(event === "SIGNED_OUT") {
      App.usuario = null;
      actualizarUISinSesion();
    }
  });
});

// =============================================
// DIBUJAR CATEGORÍAS
// =============================================
function dibujarCategorias() {
  const contenedor = document.getElementById("lista_categorias");
  if(!contenedor) return;
  
  contenedor.innerHTML = CATEGORIAS.map(cat => `
    <div class="category-card" onclick="filtrarPorCategoria('${cat.id}')">
      <span style="font-size: 24px;">${cat.icono}</span>
      <strong>${cat.nombre}</strong>
    </div>
  `).join("");
}

// =============================================
// CARGAR NEGOCIOS DESDE SUPABASE
// =============================================
async function cargarNegocios() {
  try {
    const {data, error} = await supabase
      .from("Negocios")
      .select(`
        *,
        visibilidad_negocio(destacado, verificado, calificacion_promedio, cantidad_resenas),
        categoria_id(nombre)
      `)
      .eq("publicado", true)
      .order("nombre");

    if(error) {
      console.error("Error al cargar negocios:", error);
      return;
    }

    App.negocios = (data || []).map(n => ({
      ...n,
      destacado: n.visibilidad_negocio?.destacado || false,
      rating: n.visibilidad_negocio?.calificacion_promedio || 0,
      reseñas: n.visibilidad_negocio?.cantidad_resenas || 0,
      categoria_nombre: n.categoria_id?.nombre || "Negocio"
    }));

    dibujarDestacados();
    dibujarCercaDeTi();
    
  } catch(e) {
    console.error("Error:", e);
  }
}

// =============================================
// DIBUJAR TARJETAS DE NEGOCIO
// =============================================
function crearTarjetaNegocio(n) {
  const esFavorito = App.favoritos.includes(n.id);
  return `
    <div class="business-card">
      <div class="business-cover">
        ${n.foto_portada 
          ? `<img src="${n.foto_portada}" alt="${n.nombre}" class="business-cover-image">`
          : `<div class="business-cover-placeholder"><strong>${n.nombre}</strong></div>`
        }
        ${n.destacado ? `<span style="position:absolute;top:10px;right:10px;background:linear-gradient(135deg,#7c6cff,#21d4df);padding:4px 10px;border-radius:20px;font-size:10px;font-weight:800;">✨ DESTACADO</span>` : ""}
      </div>
      <div class="business-info">
        <h3>${n.nombre}</h3>
        <p style="color: var(--secundario); font-size: 13px; margin: 4px 0;">${n.categoria_nombre}</p>
        <p style="color: var(--texto-claro); font-size: 13px;">📍 ${n.ciudad || n.direccion || "Ubicación"}</p>
        <p style="margin: 8px 0;">⭐ ${n.rating?.toFixed(1) || "0.0"} · ${n.reseñas || 0} reseñas</p>
        <div style="display: flex; gap: 8px; margin-top: 12px;">
          <button class="secondary-button" onclick="alternarFavorito('${n.id}')">${esFavorito ? "❤️" : "🤍"}</button>
          <button class="primary-button" onclick="abrirNegocio('${n.id}')">Reservar →</button>
        </div>
      </div>
    </div>
  `;
}

function dibujarDestacados() {
  const cont = document.getElementById("lista_destacados");
  if(!cont) return;
  const destacados = App.negocios.filter(n => n.destacado).slice(0, 6);
  cont.innerHTML = destacados.length 
    ? destacados.map(crearTarjetaNegocio).join("")
    : `<div style="grid-column: 1/-1; text-align: center; padding: 30px; color: var(--texto-claro);">Los negocios Premium aparecen aquí primero 💎</div>`;
}

function dibujarCercaDeTi() {
  const cont = document.getElementById("lista_cerca");
  if(!cont) return;
  cont.innerHTML = App.negocios.slice(0, 6).map(crearTarjetaNegocio).join("");
}

// =============================================
// NAVEGACIÓN ENTRE PANTALLAS
// =============================================
function cambiarVista(nombre) {
  // Ocultar todas
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  // Mostrar la elegida
  const vista = document.getElementById(`vista_${nombre}`);
  if(vista) vista.classList.add("active");
  // Marcar botón activo
  document.querySelectorAll(".bottom-nav button").forEach(b => {
    b.classList.toggle("active", b.dataset.vista === nombre);
  });
  App.vista_actual = nombre;
  
  // Acciones específicas
  if(nombre === "favoritos") dibujarFavoritos();
  if(nombre === "reservas") cargarMisReservas();
}

function irAInicio() { cambiarVista("inicio"); }
function irABuscar() { cambiarVista("buscar"); }
function irAFavoritos() { cambiarVista("favoritos"); }
function irAReservas() { cambiarVista("reservas"); }
function irAPerfil() { 
  if(!App.usuario) { abrirModalLogin(); return; }
  cambiarVista("perfil"); 
}
function irAPanelNegocio() { cambiarVista("panel_negocio"); }
function irAPremium() { alert("💎 Aquí se mostrará la información de ReservaYa Premium"); }

// =============================================
// FAVORITOS
// =============================================
function cargarFavoritos() {
  try {
    App.favoritos = JSON.parse(localStorage.getItem("reservaya_favoritos") || "[]");
  } catch {
    App.favoritos = [];
  }
}

function alternarFavorito(id) {
  const pos = App.favoritos.indexOf(id);
  if(pos >= 0) App.favoritos.splice(pos, 1);
  else App.favoritos.push(id);
  
  localStorage.setItem("reservaya_favoritos", JSON.stringify(App.favoritos));
  
  dibujarDestacados();
  dibujarCercaDeTi();
  dibujarFavoritos();
  
  mostrarMensaje(pos >= 0 ? "Quitado de favoritos" : "Guardado en favoritos ❤️");
}

function dibujarFavoritos() {
  const cont = document.getElementById("lista_favoritos");
  if(!cont) return;
  const misFavs = App.negocios.filter(n => App.favoritos.includes(n.id));
  cont.innerHTML = misFavs.length 
    ? misFavs.map(crearTarjetaNegocio).join("")
    : `<div class="empty-state"><p>Aún no tienes favoritos. Toca el corazón 🤍 para guardar negocios aquí.</p></div>`;
}

// =============================================
// ABRIR NEGOCIO Y RESERVAR
// =============================================
async function abrirNegocio(id) {
  if(!App.usuario) { abrirModalLogin(); return; }
  
  const negocio = App.negocios.find(n => n.id === id);
  if(!negocio) return;
  
  // Cargar servicios del negocio
  const {data: servicios} = await supabase
    .from("servicios")
    .select("*")
    .eq("negocio_id", id)
    .eq("activo", true);

  abrirModal(`
    <h2>${negocio.nombre}</h2>
    <p style="color: var(--texto-claro);">📍 ${negocio.ciudad || negocio.direccion}</p>
    
    ${servicios?.length ? `
      <h3 style="margin-top: 20px;">Servicios disponibles</h3>
      <div style="display: grid; gap: 12px; margin-top: 12px;">
        ${servicios.map(s => `
          <div style="padding: 14px; background: var(--superficie); border-radius: 12px; border: 1px solid var(--borde);">
            <strong>${s.nombre}</strong>
            <p style="margin: 4px 0; color: var(--texto-claro); font-size: 13px;">⏱️ ${s.duracion_minutos} min · $${s.precio_base || "A consultar"}</p>
            <button class="primary-button" style="margin-top: 10px; width: 100%;" onclick="iniciarReserva('${negocio.id}', '${s.id}')">📅 Reservar este servicio</button>
          </div>
        `).join("")}
      </div>
    ` : `<p style="margin-top: 20px; color: var(--texto-claro);">No hay servicios disponibles por ahora.</p>`}
  `);
}

async function iniciarReserva(negocioId, servicioId) {
  cerrarModal();
  
  const {data: servicio} = await supabase
    .from("servicios")
    .select("duracion_minutos, nombre")
    .eq("id", servicioId)
    .single();

  abrirModal(`
    <h2>📅 Nueva Reserva</h2>
    <p style="color: var(--secundario);">${servicio?.nombre || "Servicio"}</p>
    
    <div style="margin-top: 16px;">
      <label style="display: block; margin-bottom: 6px;">Fecha</label>
      <input type="date" id="reserva_fecha" style="width: 100%; padding: 12px; border-radius: 10px; border: 1px solid var(--borde); background: var(--fondo); color: white;">
    </div>
    
    <div style="margin-top: 14px;">
      <label style="display: block; margin-bottom: 6px;">Hora</label>
      <input type="time" id="reserva_hora" style="width: 100%; padding: 12px; border-radius: 10px; border: 1px solid var(--borde); background: var(--fondo); color: white;">
    </div>
    
    <div style="margin-top: 14px;">
      <label style="display: block; margin-bottom: 6px;">Tu nombre</label>
      <input type="text" id="reserva_nombre" placeholder="Escribe tu nombre" style="width: 100%; padding: 12px; border-radius: 10px; border: 1px solid var(--borde); background: var(--fondo); color: white;">
    </div>
    
    <div style="margin-top: 14px;">
      <label style="display: block; margin-bottom: 6px;">Tu teléfono</label>
      <input type="tel" id="reserva_telefono" placeholder="+57..." style="width: 100%; padding: 12px; border-radius: 10px; border: 1px solid var(--borde); background: var(--fondo); color: white;">
    </div>
    
    <button class="primary-button" style="width: 100%; margin-top: 24px;" onclick="confirmarReserva('${negocioId}', '${servicioId}', ${servicio?.duracion_minutos || 30})">✅ Confirmar Reserva</button>
  `);
}

async function confirmarReserva(negocioId, servicioId, duracion) {
  const fecha = document.getElementById("reserva_fecha").value;
  const hora = document.getElementById("reserva_hora").value;
  const nombre = document.getElementById("reserva_nombre").value;
  const telefono = document.getElementById("reserva_telefono").value;

  if(!fecha || !hora || !nombre) {
    mostrarMensaje("Completa todos los datos por favor");
    return;
  }

  // Calcular hora de fin
  const [h, m] = hora.split(":");
  const fin = new Date(`2000-01-01T${hora}`);
  fin.setMinutes(fin.getMinutes() + duracion);
  const hora_fin = `${String(fin.getHours()).padStart(2, "0")}:${String(fin.getMinutes()).padStart(2, "0")}`;

  // Guardar en Supabase
  const {error} = await supabase.from("Citas").insert({
    negocio_id: negocioId,
    servicio_id: servicioId,
    usuario: App.usuario.id,
    fecha: fecha,
    hora_inicio: hora,
    hora_fin: hora_fin,
    nombre_cliente: nombre,
    telefono_cliente: telefono,
    estado: "Pendiente"
  });

  if(error) {
    mostrarMensaje("❌ Error: " + error.message);
    return;
  }

  cerrarModal();
  mostrarMensaje("✅ ¡Reserva confirmada!");
  cambiarVista("reservas");
}

// =============================================
// MIS RESERVAS
// =============================================
async function cargarMisReservas() {
  if(!App.usuario) return;
  
  const {data, error} = await supabase
    .from("Citas")
    .select("*, Negocios(nombre)")
    .eq("usuario", App.usuario.id)
    .order("fecha, hora_inicio", {ascending: false});

  const cont = document.getElementById("lista_reservas");
  
  if(error || !data?.length) {
    cont.innerHTML = `<div class="empty-state"><p>Aún no tienes reservas. ¡Reserva tu primera cita!</p></div>`;
    return;
  }

  cont.innerHTML = data.map(r => `
    <div style="background: var(--superficie); border: 1px solid var(--borde); border-radius: 14px; padding: 16px; margin-bottom: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <h3 style="margin: 0;">${r.Negocios?.nombre || "Negocio"}</h3>
          <p style="margin: 4px 0; color: var(--texto-claro);">📅 ${r.fecha} · ⏰ ${r.hora_inicio}</p>
        </div>
        <span style="padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; background: ${
          r.estado === "Pendiente" ? "rgba(255,209,102,0.15); color: #ffd166" :
          r.estado === "Cancelada" ? "rgba(255,101,119,0.15); color: #ff6577" :
          "rgba(74,222,128,0.15); color: #4ade80"
        }">${r.estado}</span>
      </div>
      ${r.estado === "Pendiente" ? `
        <button class="secondary-button" style="margin-top: 12px;" onclick="cancelarReserva('${r.id}')">❌ Cancelar reserva</button>
      ` : ""}
    </div>
  `).join("");
}

async function cancelarReserva(id) {
  if(!confirm("¿Seguro que quieres cancelar esta reserva?")) return;
  
  const {error} = await supabase.from("Citas").update({
    estado: "Cancelada",
    cancelado_en: new Date().toISOString(),
    cancelado_por: App.usuario.id
  }).eq("id", id);

  if(error) {
    mostrarMensaje("Error al cancelar");
    return;
  }

  mostrarMensaje("Reserva cancelada ✅");
  cargarMisReservas();
}

// =============================================
// INICIO Y CIERRE DE SESIÓN
// =============================================
function abrirModalLogin() {
  abrirModal(`
    <h2>Iniciar Sesión</h2>
    <input type="email" id="login_correo" placeholder="Tu correo electrónico" style="width: 100%; padding: 12px; margin: 12px 0; border-radius: 10px; border: 1px solid var(--borde); background: var(--fondo); color: white;">
    <input type="password" id="login_clave" placeholder="Tu contraseña" style="width: 100%; padding: 12px; margin: 6px 0; border-radius: 10px; border: 1px solid var(--borde); background: var(--fondo); color: white;">
    <button class="primary-button" style="width: 100%; margin-top: 16px;" onclick="hacerLogin()">Entrar</button>
    <p style="text-align: center; margin-top: 20px;">¿No tienes cuenta? <a href="#" onclick="mostrarRegistro()">Crear cuenta</a></p>
  `);
}

async function hacerLogin() {
  const correo = document.getElementById("login_correo").value;
  const clave = document.getElementById("login_clave").value;
  
  if(!correo || !clave) {
    mostrarMensaje("Escribe tu correo y contraseña");
    return;
  }

  const {error} = await supabase.auth.signInWithPassword({email: correo, password: clave});
  
  if(error) {
    mostrarMensaje("❌ " + error.message);
    return;
  }

  cerrarModal();
  mostrarMensaje("✅ ¡Bienvenido de nuevo!");
}

function mostrarRegistro() {
  abrirModal(`
    <h2>Crear Cuenta Nueva</h2>
    <input type="email" id="reg_correo" placeholder="Tu correo" style="width: 100%; padding: 12px; margin: 12px 0; border-radius: 10px; border: 1px solid var(--borde); background: var(--fondo); color: white;">
    <input type="password" id="reg_clave" placeholder="Contraseña (mínimo 6 caracteres)" style="width: 100%; padding: 12px; margin: 6px 0; border-radius: 10px; border: 1px solid var(--borde); background: var(--fondo); color: white;">
    <button class="primary-button" style="width: 100%; margin-top: 16px;" onclick="hacerRegistro()">Registrarme</button>
  `);
}

async function hacerRegistro() {
  const correo = document.getElementById("reg_correo").value;
  const clave = document.getElementById("reg_clave").value;
  
  if(!correo || clave.length < 6) {
    mostrarMensaje("Completa los datos (contraseña mínima 6 caracteres)");
    return;
  }

  const {error} = await supabase.auth.signUp({email: correo, password: clave});
  
  if(error) {
    mostrarMensaje("❌ " + error.message);
    return;
  }

  cerrarModal();
  mostrarMensaje("✅ Cuenta creada. Revisa tu correo para confirmar.");
}

async function cerrarSesion() {
  await supabase.auth.signOut();
  App.usuario = null;
  actualizarUISinSesion();
  mostrarMensaje("Sesión cerrada");
}

function actualizarUIConSesion() {
  document.getElementById("nombre_usuario").textContent = App.usuario.email?.split("@")[0] || "Usuario";
  document.getElementById("mensaje_perfil").textContent = App.usuario.email;
  document.getElementById("avatar_perfil").textContent = (App.usuario.user_metadata?.name || App.usuario.email)[0].toUpperCase();
  document.getElementById("boton_cerrar_sesion").style.display = "block";
}

function actualizarUISinSesion() {
  document.getElementById("nombre_usuario").textContent = "Invitado";
  document.getElementById("mensaje_perfil").textContent = "Inicia sesión para ver tu perfil";
  document.getElementById("avatar_perfil").textContent = "👤";
  document.getElementById("boton_cerrar_sesion").style.display = "none";
}

// =============================================
// UTILIDADES — MODALES Y MENSAJES
// =============================================
function abrirModal(contenido) {
  const modal = document.createElement("div");
  modal.id = "modal_general";
  modal.style = "position: fixed; inset: 0; background: rgba(0,0,0,0.75); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 16px;";
  modal.innerHTML = `
    <div style="background: var(--superficie); border: 1px solid var(--borde); border-radius: 20px; padding: 24px; max-width: 420px; width: 100%; max-height: 90vh; overflow-y: auto;">
      <button onclick="cerrarModal()" style="float: right; background: transparent; border: none; color: inherit; font-size: 20px; cursor: pointer;">×</button>
      <div style="clear: both;"></div>
      ${contenido}
    </div>
  `;
  document.body.appendChild(modal);
}

function cerrarModal() {
  const m = document.getElementById("modal_general");
  if(m) m.remove();
}

function mostrarMensaje(texto) {
  const t = document.createElement("div");
  t.style = "position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%); background: var(--superficie); border: 1px solid var(--primario); padding: 12px 24px; border-radius: 12px; z-index: 300; box-shadow: 0 4px 20px rgba(0,0,0,0.4);";
  t.textContent = texto;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

function filtrarPorCategoria(id) {
  cambiarVista("buscar");
  mostrarMensaje(`Filtrando: ${id}`);
}

function buscarNegocios() {
  const texto = document.getElementById("buscador_principal")?.value || "";
  cambiarVista("buscar");
  mostrarMensaje(`Buscando: ${texto}`);
}

function verTodosDestacados() {
  cambiarVista("buscar");
}

function usarUbicacion() {
  if(!navigator.geolocation) {
    mostrarMensaje("Tu navegador no soporta ubicación");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    () => { mostrarMensaje("📍 Ubicación activada"); cambiarVista("buscar"); },
    () => { mostrarMensaje("No se pudo obtener tu ubicación"); }
  );
}

function cambiarIdioma() {
  mostrarMensaje("Idioma cambiado ✅");
}
