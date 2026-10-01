// =====================================================
// RESERVAYA — CÓDIGO COMPLETO CON TODO LO CONSTRUIDO
// =====================================================

// 🔑 Conexión con tu proyecto real
const SUPABASE_URL = "https://mjxiyzapdybzckurootw.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ox1Wz7UT2Gw6uHOP6SncjQ_sGapEEB-";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Estado Global — Todo lo que maneja la app
const App = {
  usuario: null,
  negocio: null,
  plan: "gratis", // gratis | premium | pro
  negocios: [],
  favoritos: JSON.parse(localStorage.getItem("favoritos") || "[]"),
  notificaciones: JSON.parse(localStorage.getItem("notificaciones") || "[]"),
  filtroEstado: "todas",
  negocioSeleccionado: null,
  sucursales: [],
  promociones: [],
  equipo: []
};

// Categorías definidas
const CATEGORIAS = [
  {id:"barberia", nombre:"Barbería", icono:"💈"},
  {id:"belleza", nombre:"Belleza", icono:"💅"},
  {id:"restaurante", nombre:"Comida", icono:"🍽️"},
  {id:"salud", nombre:"Salud", icono:"🩺"},
  {id:"servicios", nombre:"Servicios", icono:"🛠️"},
  {id:"otros", nombre:"Otros", icono:"📌"}
];

// =====================================================
// INICIO — Carga todo al abrir la app
// =====================================================
document.addEventListener("DOMContentLoaded", async () => {
  dibujarCategorias();
  rellenarFiltroCategorias();
  await cargarNegocios();
  dibujarDestacados();
  dibujarCerca();
  actualizarContadorNotif();
  
  // Verificar sesión activa
  const {data:{session}} = await supabase.auth.getSession();
  if(session) {
    App.usuario = session.user;
    await cargarDatosUsuario();
    actualizarPerfil();
  }
  
  // Escuchar cambios de sesión
  supabase.auth.onAuthStateChange(async (event) => {
    if(event === "SIGNED_IN") {
      const {data:{user}} = await supabase.auth.getUser();
      App.usuario = user;
      await cargarDatosUsuario();
      actualizarPerfil();
    }
    if(event === "SIGNED_OUT") {
      App.usuario = App.negocio = null;
      App.plan = "gratis";
      actualizarPerfil();
    }
  });
});

// =====================================================
// NAVEGACIÓN — Cambiar de vista
// =====================================================
function cambiarVista(nombre) {
  document.querySelectorAll(".vista").forEach(v => v.classList.remove("activa"));
  document.getElementById(`vista-${nombre}`).classList.add("activa");
  document.querySelectorAll(".navegacion button").forEach(b => {
    b.classList.toggle("activa", b.dataset.vista === nombre);
  });
  
  // Cargar datos según vista
  if(nombre === "favoritos") dibujarFavoritos();
  if(nombre === "reservas" && App.usuario) cargarReservas();
  if(nombre === "negocio") cargarPanelNegocio();
}

function irAInicio(){cambiarVista("inicio")}
function irABuscar(){cambiarVista("buscar");aplicarFiltros()}
function irAFavoritos(){cambiarVista("favoritos")}
function irAReservas(){App.usuario?cambiarVista("reservas"):abrirLogin()}
function irAPerfil(){cambiarVista("perfil")}
function irANegocio(){App.usuario?cambiarVista("negocio"):abrirLogin()}
function irAPlanes(){cambiarVista("planes")}

// =====================================================
// 🔍 DESCUBRIMIENTO — Categorías y Negocios
// =====================================================
function dibujarCategorias() {
  const cont = document.getElementById("categorias");
  cont.innerHTML = CATEGORIAS.map(cat => `
    <div class="categoria-tarjeta" onclick="filtrarPorCategoria('${cat.id}')">
      <span class="categoria-icono">${cat.icono}</span>
      <span>${cat.nombre}</span>
    </div>
  `).join("");
}

function rellenarFiltroCategorias() {
  const sel = document.getElementById("filtro-cat");
  CATEGORIAS.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat.id;
    opt.textContent = cat.nombre;
    sel.appendChild(opt);
  });
}

function filtrarPorCategoria(id) {
  document.getElementById("filtro-cat").value = id;
  cambiarVista("buscar");
  aplicarFiltros();
}

async function cargarNegocios() {
  try {
    const {data, error} = await supabase
      .from("Negocios")
      .select(`
        *,
        visibilidad_negocio(destacado, calificacion_promedio, cantidad_resenas),
        negocio_sucursales(id, nombre, direccion)
      `)
      .eq("publicado", true)
      .order("nombre");

    if(error) return console.error("Error cargando negocios:", error);
    App.negocios = (data || []).map(n => ({
      ...n,
      destacado: n.visibilidad_negocio?.destacado || false,
      rating: n.visibilidad_negocio?.calificacion_promedio || 0,
      sucursales: n.negocio_sucursales || []
    }));
    
    // Llenar filtro de sucursales
    const selSuc = document.getElementById("filtro-sucursal");
    selSuc.innerHTML = '<option value="">Todas las sucursales</option>';
    const todasSucursales = [];
    App.negocios.forEach(n => n.sucursales?.forEach(s => {
      if(!todasSucursales.find(x => x.id === s.id)) todasSucursales.push({...s, negocio: n.nombre});
    }));
    todasSucursales.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent = `${s.nombre} — ${s.negocio}`;
      selSuc.appendChild(opt);
    });
  } catch(e) {
    console.error("Error:", e);
  }
}

function crearTarjetaNegocio(n) {
  const esFav = App.favoritos.includes(n.id);
  const tieneMultiSuc = n.sucursales?.length > 1;
  return `
    <div class="negocio-tarjeta">
      <div class="negocio-portada">
        ${n.nombre.charAt(0).toUpperCase()}
        ${n.destacado?'<span class="etiqueta-destacado">✨ DESTACADO</span>':''}
      </div>
      <div class="negocio-cuerpo">
        <h3>${n.nombre}</h3>
        <p class="negocio-categoria">${CATEGORIAS.find(c => c.id === n.categoria_id)?.nombre || "General"}</p>
        <p class="negocio-ubicacion">${tieneMultiSuc?`🏬 ${n.sucursales.length} sucursales`:n.ciudad||"Colombia"} · ⭐ ${n.rating?.toFixed(1)||"0.0"}</p>
        <div class="negocio-pie">
          <button class="btn-secundario" onclick="alternarFavorito('${n.id}')">${esFav?"❤️":"🤍"}</button>
          <button class="btn-primario" onclick="abrirReserva('${n.id}','${n.nombre}')">Reservar</button>
        </div>
      </div>
    </div>
  `;
}

function dibujarDestacados() {
  const cont = document.getElementById("destacados");
  const lista = App.negocios.filter(n => n.destacado).slice(0, 4);
  cont.innerHTML = lista.length ? lista.map(crearTarjetaNegocio).join("") :
    `<div class="estado-vacio"><p>💎 Los negocios con plan Premium aparecen aquí primero.</p></div>`;
}

function dibujarCerca() {
  const cont = document.getElementById("cerca");
  cont.innerHTML = App.negocios.slice(0, 4).map(crearTarjetaNegocio).join("") ||
    `<div class="estado-vacio"><p>Cargando negocios cercanos...</p></div>`;
}

function buscar() {
  const texto = document.getElementById("buscador").value.trim().toLowerCase();
  document.getElementById("filtro-nombre").value = texto;
  cambiarVista("buscar");
  aplicarFiltros();
}

function aplicarFiltros() {
  const nombre = document.getElementById("filtro-nombre").value.toLowerCase();
  const cat = document.getElementById("filtro-cat").value;
  const suc = document.getElementById("filtro-sucursal").value;
  
  const resultado = App.negocios.filter(n => {
    const coincideNombre = !nombre || n.nombre.toLowerCase().includes(nombre) || (n.descripcion||"").toLowerCase().includes(nombre);
    const coincideCat = !cat || n.categoria_id === cat;
    const coincideSuc = !suc || n.sucursales?.some(s => s.id === suc);
    return coincideNombre && coincideCat && coincideSuc;
  });
  
  const cont = document.getElementById("resultados");
  cont.innerHTML = resultado.length ? resultado.map(crearTarjetaNegocio).join("") :
    `<div class="estado-vacio"><p>No se encontraron negocios con esos filtros.</p></div>`;
}

function usarUbicacion() {
  mostrarAviso("📍 Usando tu ubicación...");
  setTimeout(() => {
    document.getElementById("filtro-nombre").value = "";
    cambiarVista("buscar");
    aplicarFiltros();
    mostrarAviso("✅ Mostrando negocios cerca de ti");
  }, 800);
}

// =====================================================
// ❤️ FAVORITOS
// =====================================================
function alternarFavorito(id) {
  const pos = App.favoritos.indexOf(id);
  if(pos >= 0) App.favoritos.splice(pos, 1);
  else App.favoritos.push(id);
  localStorage.setItem("favoritos", JSON.stringify(App.favoritos));
  
  dibujarDestacados();
  dibujarCerca();
  aplicarFiltros();
  dibujarFavoritos();
  mostrarAviso(pos >= 0 ? "Quitado de favoritos" : "Guardado en favoritos ❤️");
}

function dibujarFavoritos() {
  const cont = document.getElementById("lista-favoritos");
  const misFavs = App.negocios.filter(n => App.favoritos.includes(n.id));
  cont.innerHTML = misFavs.length ? misFavs.map(crearTarjetaNegocio).join("") :
    `<div class="estado-vacio"><p>Toca el corazón 🤍 en cualquier negocio para guardarlo aquí.</p></div>`;
}

// =====================================================
// 📅 RESERVAS — Crear, ver, cancelar
// =====================================================
function abrirReserva(id, nombre) {
  if(!App.usuario) return abrirLogin();
  App.negocioSeleccionado = id;
  
  // Llenar sucursales si hay varias
  const negocio = App.negocios.find(n => n.id === id);
  const selSuc = document.getElementById("sucursal-reserva");
  if(negocio?.sucursales?.length > 1) {
    selSuc.classList.remove("oculto");
    selSuc.innerHTML = negocio.sucursales.map(s => `<option value="${s.id}">${s.nombre} — ${s.direccion}</option>`).join("");
  } else {
    selSuc.classList.add("oculto");
  }
  
  document.getElementById("titulo-negocio").textContent = `Reservar en ${nombre}`;
  document.getElementById("modal-reserva").classList.remove("oculto");
}

async function confirmarReserva() {
  const fecha = document.getElementById("fecha-reserva").value;
  const hora = document.getElementById("hora-reserva").value;
  const nombre = document.getElementById("nombre-reserva").value.trim();
  const telefono = document.getElementById("telefono-reserva").value.trim();
  const sucursal = document.getElementById("sucursal-reserva").value || null;

  if(!fecha || !hora || !nombre) return mostrarAviso("⚠️ Completa todos los datos obligatorios");

  const {error} = await supabase.from("Citas").insert({
    negocio_id: App.negocioSeleccionado,
    sucursal_id: sucursal,
    usuario: App.usuario.id,
    fecha: fecha,
    hora: hora,
    nombre_cliente: nombre,
    telefono_cliente: telefono,
    estado: "Pendiente"
  });

  if(error) return mostrarAviso("❌ Error: " + error.message);
  
  // Agregar notificación
  agregarNotificacion(`✅ Reserva confirmada para ${fecha} a las ${hora}`, "exito");
  
  cerrarModal();
  mostrarAviso("✅ ¡Reserva confirmada! Recibirás notificación de recordatorio.");
  setTimeout(() => irAReservas(), 800);
}

async function cargarReservas() {
  let consulta = supabase
    .from("Citas")
    .select("*, Negocios(nombre)")
    .eq("usuario", App.usuario.id)
    .order("fecha, hora", {ascending: true});
  
  if(App.filtroEstado !== "todas") {
    consulta = consulta.eq("estado", App.filtroEstado);
  }
  
  const {data, error} = await consulta;
  
  const cont = document.getElementById("lista-reservas");
  if(error || !data?.length) {
    cont.innerHTML = `<p style="text-align:center;color:var(--texto-claro);padding:40px">Aún no tienes reservas. ¡Reserva tu primera cita!</p>`;
    return;
  }

  cont.innerHTML = data.map(r => `
    <div class="reserva-tarjeta">
      <h3>${r.Negocios?.nombre || "Negocio"}</h3>
      <p><strong>📅 ${r.fecha}</strong> · ⏰ ${r.hora}</p>
      <p style="color:var(--texto-claro);font-size:14px">${r.nombre_cliente}</p>
      <span class="etiqueta-estado etiqueta-${r.estado}">${r.estado}</span>
      ${r.estado === "Pendiente" ? `<button class="btn-secundario" style="margin-top:10px" onclick="cancelarReserva('${r.id}')">❌ Cancelar Reserva</button>` : ""}
    </div>
  `).join("");
}

function filtrarReservas(estado) {
  App.filtroEstado = estado;
  document.querySelectorAll(".pestañas button").forEach(b => b.classList.remove("activa"));
  event.target.classList.add("activa");
  cargarReservas();
}

async function cancelarReserva(id) {
  if(!confirm("¿Seguro que quieres cancelar esta reserva?")) return;
  
  const {error} = await supabase.from("Citas").update({
    estado: "Cancelada",
    cancelado_en: new Date().toISOString()
  }).eq("id", id);
  
  if(error) return mostrarAviso("❌ Error al cancelar");
  
  agregarNotificacion("Reserva cancelada", "advertencia");
  mostrarAviso("✅ Reserva cancelada");
  cargarReservas();
}

// =====================================================
// 🔔 NOTIFICACIONES
// =====================================================
function agregarNotificacion(texto, tipo="info") {
  App.notificaciones.unshift({
    id: Date.now(),
    texto,
    tipo,
    fecha: new Date().toLocaleString("es-CO")
  });
  if(App.notificaciones.length > 20) App.notificaciones.pop();
  localStorage.setItem("notificaciones", JSON.stringify(App.notificaciones));
  actualizarContadorNotif();
}

function actualizarContadorNotif() {
  const cont = document.getElementById("cont-notif");
  if(App.notificaciones.length > 0) {
    cont.classList.remove("oculto");
    cont.textContent = App.notificaciones.length;
  } else {
    cont.classList.add("oculto");
  }
}

function abrirNotificaciones() {
  const cont = document.getElementById("lista-notificaciones");
  cont.innerHTML = App.notificaciones.length ? 
    App.notificaciones.map(n => `<p style="padding:10px 0;border-bottom:1px solid var(--borde)">${n.texto}<br><small style="color:var(--texto-claro)">${n.fecha}</small></p>`).join("") :
    "<p style='color:var(--texto-claro);text-align:center;padding:20px'>No tienes notificaciones</p>";
  document.getElementById("modal-notif").classList.remove("oculto");
}

// =====================================================
// 👤 PERFIL Y SESIÓN
// =====================================================
async function cargarDatosUsuario() {
  // Buscar si el usuario tiene un negocio registrado
  const {data} = await supabase
    .from("Negocios")
    .select("*, visibilidad_negocio(destacado), miembro_negocios(rol, activo)")
    .eq("usuario_id", App.usuario.id)
    .single();
  
  if(data) {
    App.negocio = data;
    // Determinar plan
    if(data.visibilidad_negocio?.destacado) {
      // Aquí podrías agregar lógica para detectar Business Pro
      App.plan = "premium";
    } else {
      App.plan = "gratis";
    }
  }
}

function actualizarPerfil() {
  if(App.usuario) {
    document.getElementById("nombre-usuario").textContent = (App.usuario.user_metadata?.nombre || App.usuario.email?.split("@")[0]);
    document.getElementById("correo-usuario").textContent = App.usuario.email;
    document.getElementById("avatar-usuario").textContent = (App.usuario.user_metadata?.nombre?.[0] || App.usuario.email[0]).toUpperCase();
    document.getElementById("btn-ingresar").classList.add("oculto");
    document.getElementById("btn-salir").classList.remove("oculto");
    if(App.negocio) document.getElementById("btn-negocio").classList.remove("oculto");
  } else {
    document.getElementById("nombre-usuario").textContent = "Invitado";
    document.getElementById("correo-usuario").textContent = "Inicia
      sesión</p>
    document.getElementById("avatar-usuario").textContent = "👤";
    document.getElementById("btn-salir").classList.add("oculto");
    document.getElementById("btn-negocio").classList.add("oculto");
    document.querySelector(".lista-opciones button:first-child").style.display = "block";
  }
  
  // Actualizar tarjeta de plan
  const tarjetaPlan = document.getElementById("nombre-plan");
  if(tarjetaPlan) {
    tarjetaPlan.textContent = App.plan === "premium" ? "💎 Premium" : 
                               App.plan === "pro" ? "🚀 Business Pro" : "Gratis";
  }
}

function abrirLogin() {
  document.getElementById("modal-login").classList.remove("oculto");
}

async function hacerLogin() {
  const correo = document.getElementById("correo").value.trim();
  const clave = document.getElementById("clave").value;
  if(!correo || clave.length < 6) 
    return mostrarAviso("⚠️ Escribe correo y contraseña (mínimo 6 caracteres)");
  
  const {error} = await supabase.auth.signInWithPassword({email: correo, password: clave});
  if(error) return mostrarAviso("❌ " + error.message);
  
  cerrarModal();
  mostrarAviso("✅ ¡Bienvenido de vuelta!");
}

async function hacerRegistro() {
  const correo = document.getElementById("correo").value.trim();
  const clave = document.getElementById("clave").value;
  if(!correo || clave.length < 6) 
    return mostrarAviso("⚠️ Completa los datos (contraseña mínima 6 caracteres)");
  
  const {error} = await supabase.auth.signUp({email: correo, password: clave});
  if(error) return mostrarAviso("❌ " + error.message);
  
  cerrarModal();
  mostrarAviso("✅ Cuenta creada. Revisa tu correo para confirmar.");
}

async function cerrarSesion() {
  await supabase.auth.signOut();
  App.usuario = App.negocio = null;
  App.plan = "gratis";
  mostrarAviso("Sesión cerrada correctamente");
  cambiarVista("inicio");
}

// =====================================================
// 🏢 PANEL DE NEGOCIO — TODO: Operaciones, Sucursales, Equipo, Promociones...
// =====================================================
async function cargarPanelNegocio() {
  if(!App.usuario) return abrirLogin();
  
  // Resaltar plan
  document.getElementById("nombre-plan").textContent = 
    App.plan === "premium" ? "💎 Premium" : 
    App.plan === "pro" ? "🚀 Business Pro" : "Gratis";
  
  // Cargar analítica
  const {data: todasLasReservas} = await supabase
    .from("Citas")
    .select("estado")
    .eq("negocio_id", App.negocio.id);
  
  if(todasLasReservas) {
    document.getElementById("dato-total").textContent = todasLasReservas.length;
    document.getElementById("dato-pendiente").textContent = todasLasReservas.filter(r => r.estado === "Pendiente").length;
    document.getElementById("dato-completada").textContent = todasLasReservas.filter(r => r.estado === "Completada").length;
    document.getElementById("dato-cancelada").textContent = todasLasReservas.filter(r => r.estado === "Cancelada").length;
  }
}

function cargarSeccion(nombre) {
  const cont = document.getElementById("contenido-negocio");
  
  switch(nombre) {
    // ⚙️ OPERACIONES
    case "operaciones":
      cont.innerHTML = `
        <h3>⚙️ Configuración Operativa</h3>
        <p style="color:var(--texto-claro);margin:8px 0">Horarios, disponibilidad, bloqueos y excepciones</p>
        <div style="background:var(--superficie);border:1px solid var(--borde);border-radius:12px;padding:16px;margin-top:12px">
          <h4>📅 Horarios de Atención</h4>
          <p style="margin:8px 0">Lunes a Viernes: 08:00 – 19:00</p>
          <p>Sábados: 09:00 – 14:00</p>
          <p>Domingos: Cerrado</p>
          <button class="btn-secundario" style="margin-top:10px">✏️ Editar Horarios</button>
        </div>
        <div style="background:var(--superficie);border:1px solid var(--borde);border-radius:12px;padding:16px;margin-top:12px">
          <h4>🔒 Bloqueos y Excepciones</h4>
          <p style="color:var(--texto-claro);font-size:13px;margin:4px 0">Días festivos, vacaciones o cierres especiales</p>
          <button class="btn-secundario" style="margin-top:8px" ${App.plan === "gratis" ? "disabled title='Solo Premium'" : ""}>➕ Agregar Bloqueo</button>
          ${App.plan === "gratis" ? '<p style="color:var(--premium);font-size:12px;margin-top:6px">💎 Disponible en Premium</p>' : ''}
        </div>
      `;
      break;
    
    // 🏬 SUCURSALES / MULTISEDE
    case "sucursales":
      cont.innerHTML = `
        <h3>🏬 Sucursales — Multisede</h3>
        <p style="color:var(--texto-claro);margin:8px 0">Administra todas tus sedes desde un solo lugar</p>
        <div style="background:var(--superficie);border:1px solid var(--borde);border-radius:12px;padding:16px;margin-top:12px">
          <p><strong>Sede Principal</strong><br>Dirección principal · Activada ✅</p>
          ${App.plan !== "gratis" ? `<button class="btn-primario" style="margin-top:10px">➕ Agregar Nueva Sucursal</button>` : 
            `<p style="color:var(--premium);margin-top:10px">💎 Hasta 5 sucursales con Premium · Ilimitadas con Business Pro</p>
             <button class="btn-premium" onclick="irAPlanes()" style="margin-top:8px">Desbloquear →</button>`}
        </div>
      `;
      break;
    
    // 👥 EQUIPO Y PERMISOS
    case "equipo":
      cont.innerHTML = `
        <h3>👥 Equipo y Permisos</h3>
        <p style="color:var(--texto-claro);margin:8px 0">Gestiona quién accede y qué puede hacer cada persona</p>
        <div style="background:var(--superficie);border:1px solid var(--borde);border-radius:12px;padding:16px;margin-top:12px">
          <p><strong>👑 Propietario</strong> — Tú · Control total</p>
          <p style="margin-top:8px">📋 Roles disponibles:</p>
          <ul style="margin:6px 0 6px 20px;color:var(--texto-claro)">
            <li>Administrador — Gestiona todo</li>
            <li>Empleado — Gestiona sus citas</li>
            <li>Recepcionista — Ver y confirmar</li>
          </ul>
          ${App.plan === "pro" ? `<button class="btn-primario" style="margin-top:10px">➕ Invitar Miembro</button>` : 
            `<p style="color:var(--pro);margin-top:10px">🚀 Roles personalizados con Business Pro</p>
             <button class="btn-pro" onclick="irAPlanes()" style="margin-top:8px">Mejorar Plan →</button>`}
        </div>
      `;
      break;
    
    // 🎁 PROMOCIONES
    case "promociones":
      cont.innerHTML = `
        <h3>🎁 Promociones y Descuentos</h3>
        <p style="color:var(--texto-claro);margin:8px 0">Crea ofertas, descuentos y campañas para atraer clientes</p>
        <div style="background:var(--superficie);border:1px solid var(--borde);border-radius:12px;padding:16px;margin-top:12px">
          <p>📊 <strong>Campañas Activas:</strong> 0</p>
          <p style="color:var(--texto-claro);font-size:13px;margin:4px 0">Descuentos, 2x1, primeros clientes, etc.</p>
          ${App.plan !== "gratis" ? `<button class="btn-primario" style="margin-top:10px">➕ Crear Promoción</button>` : 
            `<p style="color:var(--premium);margin-top:10px">💎 Promociones ilimitadas con Premium</p>
             <button class="btn-premium" onclick="irAPlanes()" style="margin-top:8px">Desbloquear →</button>`}
        </div>
      `;
      break;
    
    // 🔔 NOTIFICACIONES
    case "notificaciones":
      cont.innerHTML = `
        <h3>🔔 Notificaciones Automáticas</h3>
        <p style="color:var(--texto-claro);margin:8px 0">Confirma, recuerda y agradece a tus clientes</p>
        <div style="background:var(--superficie);border:1px solid var(--borde);border-radius:12px;padding:16px;margin-top:12px">
          <label style="display:flex;align-items:center;gap:8px;margin:8px 0">
            <input type="checkbox" checked> Confirmación al reservar
          </label>
          <label style="display:flex;align-items:center;gap:8px;margin:8px 0">
            <input type="checkbox" checked> Recordatorio 24h antes
          </label>
          <label style="display:flex;align-items:center;gap:8px;margin:8px 0">
            <input type="checkbox"> Mensaje de agradecimiento
          </label>
          <label style="display:flex;align-items:center;gap:8px;margin:8px 0">
            <input type="checkbox" ${App.plan === "gratis" ? "disabled" : ""}> Encuesta posterior
          </label>
          <button class="btn-primario" style="margin-top:12px">💾 Guardar Configuración</button>
        </div>
      `;
      break;
    
    // 📈 CRECIMIENTO
    case "crecimiento":
      cont.innerHTML = `
        <h3>📈 Crecimiento y Visibilidad</h3>
        <p style="color:var(--texto-claro);margin:8px 0">Aparece primero, consigue más clientes</p>
        <div style="background:var(--superficie);border:1px solid var(--premium);border-radius:12px;padding:16px;margin-top:12px">
          <h4>✨ Destacado en Búsqueda</h4>
          <p style="color:var(--texto-claro);font-size:13px;margin:4px 0">Tu negocio aparece arriba con sello especial</p>
          ${App.plan === "gratis" ? 
            `<button class="btn-premium" onclick="irAPlanes()" style="margin-top:8px">💎 Activar con Premium →</button>` :
            `<p style="color:var(--exito);margin-top:8px">✅ Ya estás destacado</p>`}
        </div>
        <div style="background:var(--superficie);border:1px solid var(--borde);border-radius:12px;padding:16px;margin-top:12px">
          <h4>📊 Reseñas y Calificación</h4>
          <p style="color:var(--texto-claro);font-size:13px;margin:4px 0">Solicita valoraciones automáticamente</p>
          <button class="btn-secundario" style="margin-top:8px">Configurar Reseñas</button>
        </div>
      `;
      break;
    
    // 🛠️ HERRAMIENTAS EMPRESARIALES
    case "herramientas":
      cont.innerHTML = `
        <h3>🛠️ Herramientas Empresariales Avanzadas</h3>
        <p style="color:var(--pro);margin:8px 0">🚀 Exclusivo Business Pro</p>
        <div style="background:var(--superficie);border:1px solid var(--pro);border-radius:12px;padding:16px;margin-top:12px">
          <ul style="margin:0 0 0 20px">
            <li style="margin:8px 0">📤 Exportación de datos (Excel, CSV)</li>
            <li style="margin:8px 0">📑 Reporte mensual automático</li>
            <li style="margin:8px 0">🔑 API para integración propia</li>
            <li style="margin:8px 0">🏷️ Marca personalizada en notificaciones</li>
            <li style="margin:8px 0">🎯 Análisis de ocupación y tendencias</li>
            <li style="margin:8px 0">📞 Soporte prioritario directo</li>
          </ul>
          ${App.plan !== "pro" ? 
            `<button class="btn-pro" onclick="irAPlanes()" style="margin-top:12px">🚀 Pasar a Business Pro →</button>` :
            `<p style="color:var(--exito);margin-top:12px">✅ Todas activadas</p>`}
        </div>
      `;
      break;
  }
}

// =====================================================
// 💎 PLANES Y SUSCRIPCIÓN
// =====================================================
function activarPlan(plan) {
  // Aquí conectarías con tu sistema de pagos
  App.plan = plan;
  localStorage.setItem("plan", plan);
  mostrarAviso(`✅ Plan ${plan === "premium" ? "💎 Premium" : "🚀 Business Pro"} activado`);
  setTimeout(() => cambiarVista("negocio"), 1000);
}

// =====================================================
// UTILIDADES GENERALES
// =====================================================
function cerrarModal() {
  document.querySelectorAll(".modal").forEach(m => m.classList.add("oculto"));
  App.negocioSeleccionado = null;
}

function mostrarAviso(texto) {
  const aviso = document.getElementById("aviso");
  aviso.textContent = texto;
  aviso.classList.remove("oculto");
  setTimeout(() => aviso.classList.add("oculto"), 3500);
}

// Cerrar modales al hacer clic por fuera
document.querySelectorAll(".modal").forEach(modal => {
  modal.addEventListener("click", e => {
    if(e.target === modal) cerrarModal();
  });
});
      
