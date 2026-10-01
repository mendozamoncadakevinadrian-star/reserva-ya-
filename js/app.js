// =====================================================
// RESERVAYA — V6.0 COMPLETA CON SUPABASE
// Conectada a todas las tablas creadas
// =====================================================

// CONFIGURACIÓN SUPABASE
const SUPABASE_URL = "https://mjxiyzapdybzckurootw.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ox1Wz7UT2Gw6uHOP6SncjQ_sGapEEB-";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ESTADO GLOBAL
const ReservaYa = {
  version: "6.0.0",
  usuario: null,
  negocioActual: null,
  negocios: [],
  favoritos: [],
  reservas: [],
  suscripcion: null,
  idioma: localStorage.getItem("reservaya_idioma") || "es",
  vistaActual: "home"
};

// CATEGORÍAS
const CATEGORIAS = [
  {id:"todos",nombre:"Todos",icono:"✨"},
  {id:"barberia",nombre:"Barbería",icono:"💈"},
  {id:"belleza",nombre:"Belleza",icono:"💅"},
  {id:"restaurante",nombre:"Restaurante",icono:"🍽️"},
  {id:"salud",nombre:"Salud",icono:"🩺"},
  {id:"fitness",nombre:"Fitness",icono:"🏋️"},
  {id:"spa",nombre:"Spa",icono:"🧖"},
  {id:"mascotas",nombre:"Mascotas",icono:"🐾"},
  {id:"automotriz",nombre:"Automotriz",icono:"🚗"},
  {id:"educacion",nombre:"Educación",icono:"📚"},
  {id:"profesional",nombre:"Profesional",icono:"💼"},
  {id:"otros",nombre:"Otros",icono:"📌"}
];

// IDIOMAS
const IDIOMAS = {
  es: {nombre:"Español",search:"Buscar negocios...",loading:"Cargando...",noResults:"No encontramos resultados",reserve:"Reservar",cancel:"Cancelar",confirm:"Confirmar",premium:"ReservaYa Premium",premiumDesc:"Destacado, reportes, WhatsApp y más"},
  en: {nombre:"English",search:"Search businesses...",loading:"Loading...",noResults:"No results found",reserve:"Book",cancel:"Cancel",confirm:"Confirm",premium:"ReservaYa Premium",premiumDesc:"Featured, reports, WhatsApp & more"}
};

function t(clave) {
  return IDIOMAS[ReservaYa.idioma]?.[clave] || IDIOMAS.es[clave] || clave;
}

// INICIO
document.addEventListener("DOMContentLoaded", iniciar);
async function iniciar() {
  console.log("🚀 ReservaYa V6.0 iniciando...");
  aplicarIdioma();
  cargarCategoriasEnUI();
  cargarFavoritos();
  
  // Verificar sesión
  const {data:{session}} = await supabase.auth.getSession();
  if(session) {
    ReservaYa.usuario = session.user;
    await cargarDatosUsuario();
  }
  
  // Escuchar cambios de sesión
  supabase.auth.onAuthStateChange(async (event) => {
    if(event === "SIGNED_IN") {
      ReservaYa.usuario = (await supabase.auth.getUser()).data.user;
      await cargarDatosUsuario();
    } else if(event === "SIGNED_OUT") {
      ReservaYa.usuario = null;
      actualizarUI();
    }
  });

  await cargarNegocios();
  actualizarUI();
}

// CARGAR NEGOCIOS
async function cargarNegocios() {
  const {data,error} = await supabase
    .from("Negocios")
    .select(`
      *,
      visibilidad_negocio(destacado, verificado),
      categoria_id(nombre)
    `)
    .eq("publicado", true)
    .order("nombre");

  if(error) {
    console.error("Error negocios:", error);
    return;
  }

  ReservaYa.negocios = (data || []).map(n => ({
    ...n,
    destacado: n.visibilidad_negocio?.destacado || false,
    rating: n.visibilidad_negocio?.calificacion_promedio || 0,
    reseñas: n.visibilidad_negocio?.cantidad_resenas || 0,
    categoria_obj: n.categoria_id
  }));

  renderizarDestacados();
  renderizarNegociosCercanos();
}

// RENDERIZAR
function cargarCategoriasEnUI() {
  const grid = document.getElementById("categoryGrid");
  const filter = document.getElementById("categoryFilter");
  if(grid) {
    grid.innerHTML = CATEGORIAS.filter(c=>c.id!=='todos').map(c=>`
      <button class="category-card" onclick="filtrarPorCategoria('${c.id}')">
        <span style="font-size:24px;">${c.icono}</span>
        <strong>${c.nombre}</strong>
      </button>
    `).join("");
  }
  if(filter) {
    filter.innerHTML = `<option value="">Todas las categorías</option>` + 
      CATEGORIAS.filter(c=>c.id!=='todos').map(c=>`<option value="${c.id}">${c.nombre}</option>`).join("");
  }
}

function renderizarDestacados() {
  const cont = document.getElementById("featuredBusinesses");
  if(!cont) return;
  const destacados = ReservaYa.negocios.filter(n=>n.destacado).slice(0,6);
  cont.innerHTML = destacados.length 
    ? destacados.map(crearTarjetaNegocio).join("")
    : `<div class="empty-state" style="grid-column:1/-1;"><p>Los negocios Premium aparecen aquí primero 💎</p></div>`;
}

function renderizarNegociosCercanos() {
  const cont = document.getElementById("nearbyBusinesses");
  if(!cont) return;
  cont.innerHTML = ReservaYa.negocios.slice(0,6).map(crearTarjetaNegocio).join("");
}

function crearTarjetaNegocio(n) {
  const cat = CATEGORIAS.find(c=>c.id===n.categoria_id);
  const esFav = ReservaYa.favoritos.includes(n.id);
  return `
    <article class="business-card">
      <div class="business-cover">
        ${n.foto_portada 
          ? `<img src="${n.foto_portada}" alt="${n.nombre}" class="business-cover-image">`
          : `<div class="business-cover-placeholder"><span>${cat?.icono||'🏪'}</span><strong>${n.nombre}</strong></div>`
        }
        ${n.destacado ? `<span style="position:absolute;top:10px;right:10px;background:linear-gradient(135deg,#7c6cff,#21d4df);padding:4px 10px;border-radius:20px;font-size:10px;font-weight:800;">✨ DESTACADO</span>` : ''}
      </div>
      <div class="business-info">
        <h3>${n.nombre}</h3>
        <div class="business-category">${cat?.nombre||'Negocio'}</div>
        <div class="business-location">📍 ${n.ciudad||n.direccion||'Ubicación'}</div>
        <div class="business-rating">⭐ ${n.rating?.toFixed(1)||'0.0'} · ${n.reseñas||0} reseñas</div>
        <div class="business-footer">
          <button class="secondary-button" onclick="alternarFavorito('${n.id}')">${esFav?'♥':'♡'}</button>
          <button class="primary-button" onclick="abrirNegocio('${n.id}')">Ver →</button>
        </div>
      </div>
    </article>
  `;
}

// NAVEGACIÓN
function cambiarVista(nombre) {
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById(`view-${nombre}`)?.classList.add('active');
  document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===nombre));
  ReservaYa.vistaActual = nombre;
  if(nombre==='favorites') renderizarFavoritos();
  if(nombre==='reservations') cargarReservasUsuario();
}

// FAVORITOS
function cargarFavoritos() {
  try {
    ReservaYa.favoritos = JSON.parse(localStorage.getItem('reservaya_favoritos')||'[]');
  } catch { ReservaYa.favoritos = []; }
}
function alternarFavorito(id) {
  const idx = ReservaYa.favoritos.indexOf(id);
  if(idx>=0) ReservaYa.favoritos.splice(idx,1);
  else ReservaYa.favoritos.push(id);
  localStorage.setItem('reservaya_favoritos', JSON.stringify(ReservaYa.favoritos));
  renderizarDestacados(); renderizarNegociosCercanos(); renderizarFavoritos();
  mostrarToast(idx>=0 ? 'Quitado de favoritos' : 'Guardado en favoritos ♥');
}
function renderizarFavoritos() {
  const cont = document.getElementById('favoritesList');
  if(!cont) return;
  const favs = ReservaYa.negocios.filter(n=>ReservaYa.favoritos.includes(n.id));
  cont.innerHTML = favs.length ? favs.map(crearTarjetaNegocio).join("") : `<div class="empty-state" style="grid-column:1/-1;"><h3>Sin favoritos</h3><p>Guarda tus negocios favoritos aquí ♥</p></div>`;
}

// ABRIR NEGOCIO Y RESERVA
async function abrirNegocio(id) {
  const negocio = ReservaYa.negocios.find(n=>n.id===id);
  if(!negocio) return;
  ReservaYa.negocioActual = negocio;

  // Cargar servicios
  const {data:servicios} = await supabase.from("servicios").select("*").eq("negocio_id",id).eq("activo",true);
  // Cargar horarios especiales de hoy
  const hoy = new Date().toISOString().split('T')[0];
  const {data:esp} = await supabase.from("horarios_especiales").select("*").eq("negocio_id",id).eq("fecha",hoy).eq("publicado",true).limit(1);
  const cerradoHoy = esp?.[0] && !esp[0].abierto;

  abrirModal(`
    <h2>${negocio.nombre}</h2>
    <p style="color:var(--muted);">📍 ${negocio.ciudad||negocio.direccion}</p>
    ${cerradoHoy ? `<div style="background:rgba(255,101,119,0.1);border:1px solid rgba(255,101,119,0.3);padding:10px;border-radius:10px;margin:10px 0;"><strong>❌ Cerrado hoy</strong><br><small>${esp[0].motivo||'Festivo/Vacaciones'}</small></div>` : ''}
    ${servicios?.length ? `
      <h3 style="margin-top:20px;">Servicios</h3>
      <div style="display:grid;gap:10px;margin-top:10px;">
        ${servicios.map(s=>`
          <div style="padding:14px;background:var(--surface);border-radius:12px;border:1px solid var(--border);">
            <strong>${s.nombre}</strong>
            <p style="margin:4px 0;color:var(--muted);font-size:12px;">⏱️ ${s.duracion_minutos} min · $${s.precio_base||'—'}</p>
            <button class="primary-button" style="margin-top:8px;width:100%;" onclick="iniciarReserva('${negocio.id}','${s.id}')">Reservar</button>
          </div>
        `).join("")}
      </div>
    ` : '<p style="margin-top:20px;color:var(--muted);">Sin servicios disponibles</p>'}
  `);
}

// INICIAR RESERVA
async function iniciarReserva(negocioId, servicioId=null) {
  if(!ReservaYa.usuario) { mostrarToast("Inicia sesión para reservar"); mostrarLogin(); return; }
  
  const {data:servicios} = await supabase.from("servicios").select("*").eq("negocio_id",negocioId).eq("activo",true);
  const selServ = servicioId ? servicios?.find(s=>s.id===servicioId) : null;

  abrirModal(`
    <h2>📅 Nueva Reserva</h2>
    <div style="margin-top:15px;">
      <label>Servicio</label>
      <select id="reservaServicio" style="width:100%;margin:6px 0;" onchange="actualizarDuracion()">
        ${(servicios||[]).map(s=>`<option value="${s.id}" ${s.id===servicioId?'selected':''}>${s.nombre} — ${s.duracion_minutos} min</option>`).join("")}
      </select>
    </div>
    <div style="margin-top:12px;">
      <label>Fecha</label>
      <input type="date" id="reservaFecha" style="width:100%;margin:6px 0;min-height:46px;">
    </div>
    <div style="margin-top:12px;">
      <label>Hora</label>
      <input type="time" id="reservaHora" style="width:100%;margin:6px 0;min-height:46px;">
    </div>
    <div style="margin-top:12px;">
      <label>Tu nombre</label>
      <input type="text" id="reservaNombre" style="width:100%;margin:6px 0;" placeholder="Tu nombre">
    </div>
    <div style="margin-top:12px;">
      <label>Teléfono</label>
      <input type="tel" id="reservaTelefono" style="width:100%;margin:6px 0;" placeholder="+57...">
    </div>
    <button class="primary-button" style="width:100%;margin-top:20px;" onclick="confirmarReserva('${negocioId}')">✅ Confirmar Reserva</button>
  `);
}

async function confirmarReserva(negocioId) {
  const servicio_id = document.getElementById('reservaServicio').value;
  const fecha = document.getElementById('reservaFecha').value;
  const hora = document.getElementById('reservaHora').value;
  const nombre = document.getElementById('reservaNombre').value;
  const telefono = document.getElementById('reservaTelefono').value;

  if(!fecha || !hora || !nombre) { mostrarToast("Completa todos los datos"); return; }

  const {data:servicio} = await supabase.from("servicios").select("duracion_minutos").eq("id",servicio_id).single();
  const duracion = servicio?.duracion_minutos || 30;
  const [h,m] = hora.split(':');
  const fin = new Date(`2000-01-01T${hora}`);
  fin.setMinutes(fin.getMinutes() + duracion);
  const hora_fin = `${String(fin.getHours()).padStart(2,'0')}:${String(fin.getMinutes()).padStart(2,'0')}`;

  const {error} = await supabase.from("Citas").insert({
    negocio_id,
    servicio_id,
    usuario: ReservaYa.usuario.id,
    fecha,
    hora_inicio: hora,
    hora_fin,
    nombre_cliente: nombre,
    telefono_cliente: telefono,
    estado: 'Pendiente'
  });

  if(error) { mostrarToast("Error: " + error.message); return; }
  
  cerrarModal('generalModal');
  mostrarToast("✅ Reserva creada con éxito");
  cambiarVista('reservations');
}

// CARGAR RESERVAS DEL USUARIO
async function cargarReservasUsuario() {
  if(!ReservaYa.usuario) return;
  const {data,error} = await supabase
    .from("Citas")
    .select("*,Negocios(nombre)")
    .eq("usuario", ReservaYa.usuario.id)
    .order("fecha,hora_inicio", {ascending:false});

  if(error) return;
  ReservaYa.reservas = data || [];
  const cont = document.getElementById('reservationsList');
  cont.innerHTML = ReservaYa.reservas.length ? ReservaYa.reservas.map(r=>`
    <div class="reservation-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <h3 style="margin:0;">${r.Negocios?.nombre||'Negocio'}</h3>
          <p style="margin:4px 0;">📅 ${r.fecha} · ⏰ ${r.hora_inicio}</p>
        </div>
        <span class="reservation-status ${r.estado==='Cancelada'?'cancelled':'pending'}">${r.estado}</span>
      </div>
      ${r.estado==='Pendiente' ? `<button class="secondary-button" style="margin-top:10px;" onclick="cancelarReserva('${r.id}')">❌ Cancelar</button>` : ''}
    </div>
  `).join("") : `<div class="empty-state"><h3>Sin reservas</h3><p>Tus citas aparecerán aquí</p></div>`;
}

async function cancelarReserva(id) {
  if(!confirm("¿Cancelar esta reserva?")) return;
  const {error} = await supabase.from("Citas").update({
    estado: 'Cancelada',
    cancelado_en: new Date().toISOString(),
    cancelado_por: ReservaYa.usuario.id
  }).eq("id",id);
  
  if(error) { mostrarToast("Error al cancelar"); return; }
  mostrarToast("Reserva cancelada");
  cargarReservasUsuario();
}

// AUTENTICACIÓN
function mostrarLogin() { abrirModal(`
  <h2>Iniciar Sesión</h2>
  <input type="email" id="authEmail" placeholder="Correo electrónico" style="width:100%;margin:10px 0;">
  <input type="password" id="authPassword" placeholder="Contraseña" style="width:100%;margin:6px 0;">
  <button class="primary-button" style="width:100%;margin-top:12px;" onclick="iniciarSesion()">Entrar</button>
  <p style="text-align:center;margin-top:16px;">¿No tienes cuenta? <a href="#" onclick="mostrarRegistro()">Registrarme</a></p>
`);}

async function iniciarSesion() {
  const email = document.getElementById('authEmail').value;
  const pass = document.getElementById('authPassword').value;
  const {error} = await supabase.auth.signInWithPassword({email,password});
  if(error) { mostrarToast(error.message); return; }
  cerrarModal('generalModal');
  mostrarToast("✅ Bienvenido de nuevo");
}

function mostrarRegistro() { abrirModal(`
  <h2>Crear Cuenta</h2>
  <input type="email" id="regEmail" placeholder="Correo" style="width:100%;margin:10px 0;">
  <input type="password" id="regPass" placeholder="Contraseña" style="width:100%;margin:6px 0;">
  <button class="primary-button" style="width:100%;margin-top:12px;" onclick="registrarse()">Registrarme</button>
`);}

async function registrarse() {
  const email = document.getElementById('regEmail').value;
  const pass = document.getElementById('regPass').value;
  const {error} = await supabase.auth.signUp({email,password:pass});
  if(error) { mostrarToast(error.message); return; }
  cerrarModal('generalModal');
  mostrarToast("✅ Cuenta creada. Revisa tu correo.");
}

async function cerrarSesion() {
  await supabase.auth.signOut();
  ReservaYa.usuario = null;
  actualizarUI();
  mostrarToast("Sesión cerrada");
}

async function cargarDatosUsuario() {
  const uid = ReservaYa.usuario.id;
  // Verificar si es dueño de algún negocio
  const {data:miembro} = await supabase.from("miembro_negocios").select("negocio_id,cargo,activo").eq("miembro_id",uid).eq("activo",true).limit(1);
  const esDueno = miembro?.some(m=>['propietario','administrador'].includes(m.cargo));
  
  // Verificar suscripción Premium
  const {data:sus} = await supabase.from("suscripciones").select("estado,fecha_vencimiento").eq("negocio_id",miembro?.[0]?.negocio_id).eq("estado","Activa").limit(1);
  const esPremium = sus?.length>0 && new Date(sus[0].fecha_vencimiento) > new Date();

  ReservaYa.suscripcion = {premium:esPremium};
  actualizarUI(esDueno,esPremium);
}

function actualizarUI(esDueno=false,esPremium=false) {
  const u = ReservaYa.usuario;
  document.getElementById('loginBtn').style.display = u ? 'none' : 'grid';
  document.getElementById('logoutBtn').classList.toggle('hidden',!u);
  document.getElementById('businessDashboardBtn').classList.toggle('hidden',!esDueno);
  document.getElementById('premiumBtn').classList.toggle('hidden',!u);
  document.getElementById('premiumFeatureBtn').classList.toggle('hidden',esPremium);
  
  if(u) {
    document.getElementById('profileName').textContent = u.user_metadata?.name || u.email?.split('@')[0];
    document.getElementById('profileEmail').textContent = u.email;
    document.getElementById('profileAvatar').textContent = (u.user_metadata?.name||'U')[0].toUpperCase();
  }
}

// PREMIUM
function abrirPremium() {
  abrirModal(`
    <div style="text-align:center;">
      <div style="font-size:48px;">💎</div>
      <h2>ReservaYa Premium</h2>
      <p style="color:var(--muted);">Lleva tu negocio al siguiente nivel</p>
      <ul style="text-align:left;margin:20px 0;padding:0;list-style:none;">
        <li style="padding:10px 0;border-bottom:1px solid var(--border);">✅ Aparece primero en búsqueda</li>
        <li style="padding:10px 0;border-bottom:1px solid var(--border);">✅ Sello "Verificado" y destacado</li>
        <li style="padding:10px 0;border-bottom:1px solid var(--border);">✅ Notificaciones automáticas por WhatsApp</li>
        <li style="padding:10px 0;border-bottom:1px solid var(--border);">✅ Reportes y estadísticas avanzadas</li>
        <li style="padding:10px 0;">✅ Soporte prioritario</li>
      </ul>
      <button class="primary-button" style="width:100%;margin-top:10px;">💎 Activar Premium — $19.900/mes</button>
      <p style="font-size:11px;color:var(--muted);margin-top:10px;">Al pagar, se activa automáticamente ✅</p>
    </div>
  `);
}

// UTILIDADES
function abrirModal(contenido) {
  document.getElementById('modalContent').innerHTML = contenido;
  document.getElementById('generalModal').classList.remove('hidden');
}
function cerrarModal(id) {
  document.getElementById(id).classList.add('hidden');
}
function mostrarToast(texto) {
  const t = document.getElementById('toast');
  t.textContent = texto;
  t.classList.remove('hidden');
  setTimeout(()=>t.classList.add('hidden'),3000);
}
function aplicarIdioma() {
  const input = document.getElementById('globalSearch');
  if(input) input.placeholder = t('search');
  const langName = IDIOMAS[ReservaYa.idioma]?.nombre || 'Español';
  const curLang = document.getElementById('currentLang');
  if(curLang) curLang.textContent = langName;
  document.documentElement.lang = ReservaYa.idioma;
}
function cambiarIdioma(id) {
  ReservaYa.idioma = id;
  localStorage.setItem('reservaya_idioma',id);
  aplicarIdioma();
  mostrarToast(IDIOMAS[id]?.bandera+' '+IDIOMAS[id]?.nombre);
}
function filtrarPorCategoria(id) {
  cambiarVista('search');
  document.getElementById('categoryFilter').value = id;
  filtrarNegocios();
}
function filtrarNegocios() {
  const cat = document.getElementById('categoryFilter')?.value;
  const texto = (document.getElementById('searchInput')?.value||'').toLowerCase();
  const res = ReservaYa.negocios.filter(n=>{
    const coincideCat = !cat || n.categoria_id === cat;
    const coincideTexto = !texto || [n.nombre,n.ciudad,n.descripcion].some(x=>x?.toLowerCase().includes(texto));
    return coincideCat && coincideTexto;
  });
  const cont = document.getElementById('searchResults');
  cont.innerHTML = res.length ? res.map(crearTarjetaNegocio).join("") : `<div class="empty-state" style="grid-column:1/-1;"><h3>${t('noResults')}</h3></div>`;
}
function buscarGlobal(t) {
  const sug = document.getElementById('searchSuggestions');
  if(!t.trim()) { sug.classList.add('hidden'); return; }
  const res = ReservaYa.negocios.filter(n=>n.nombre.toLowerCase().includes(t.toLowerCase())).slice(0,5);
  sug.innerHTML = res.map(n=>`<button style="width:100%;padding:12px;text-align:left;background:var(--surface);border:0;border-bottom:1px solid var(--border);color:inherit;cursor:pointer;" onclick="cerrarModal('searchSuggestions');abrirNegocio('${n.id}')">🔎 ${n.nombre}</button>`).join("");
  sug.classList.remove('hidden');
}
function ejecutarBusqueda() {
  const t = document.getElementById('globalSearch').value;
  document.getElementById('searchInput').value = t;
  cambiarVista('search');
  filtrarNegocios();
  document.getElementById('searchSuggestions').classList.add('hidden');
}
function usarUbicacion() {
  if(!navigator.geolocation) { mostrarToast("Tu navegador no soporta ubicación"); return; }
  navigator.geolocation.getCurrentPosition(
    ()=>{ mostrarToast("📍 Ubicación activada — mostrando negocios cercanos"); cambiarVista('search'); },
    ()=>{ mostrarToast("No se pudo obtener tu ubicación"); }
  );
}
function escaparHTML(texto) {
  if(!texto) return '';
  return texto.replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
