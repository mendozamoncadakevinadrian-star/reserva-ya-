// ================= CONFIGURACIÓN =================
const SUPABASE_URL = 'TU_URL_DE_SUPABASE'; // Ej: https://xyz.supabase.co
const SUPABASE_ANON_KEY = 'TU_ANON_KEY';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let modoAuth = 'login';

// ================= AUTENTICACIÓN =================
function cambiarTabAuth(modo) {
    modoAuth = modo;
    document.getElementById('btn-tab-login').classList.toggle('active', modo === 'login');
    document.getElementById('btn-tab-reg').classList.toggle('active', modo === 'register');
    document.getElementById('auth-btn-submit').textContent = modo === 'login' ? 'Iniciar Sesión' : 'Registrarse';
}

async function ejecutarAutenticacion(e) {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const errorBox = document.getElementById('auth-mensaje-error');
    errorBox.textContent = '';

    if (modoAuth === 'login') {
        const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) errorBox.textContent = error.message;
        else verificarSesion();
    } else {
        const { error } = await supabaseClient.auth.signUp({ email, password });
        if (error) errorBox.textContent = error.message;
        else {
            alert('¡Registro exitoso! Ya puedes iniciar sesión.');
            cambiarTabAuth('login');
        }
    }
}

async function verificarSesion() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        document.getElementById('auth-view').classList.add('hidden');
        document.getElementById('app-view').classList.remove('hidden');
        document.getElementById('label-user-email').textContent = session.user.email;
        cargarNegocios();
    } else {
        document.getElementById('auth-view').classList.remove('hidden');
        document.getElementById('app-view').classList.add('hidden');
    }
}

async function cerrarSesion() {
    await supabaseClient.auth.signOut();
    verificarSesion();
}

// ================= NAVEGACIÓN ENTRE PESTAÑAS =================
function cambiarSeccion(seccion) {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-section').forEach(s => s.classList.add('hidden'));

    if (seccion === 'negocios') {
        document.querySelector('.nav-tab:nth-child(1)').classList.add('active');
        document.getElementById('seccion-negocios').classList.remove('hidden');
        cargarNegocios();
    } else if (seccion === 'citas') {
        document.querySelector('.nav-tab:nth-child(2)').classList.add('active');
        document.getElementById('seccion-citas').classList.remove('hidden');
        cargarCitas();
    } else if (seccion === 'servicios') {
        document.querySelector('.nav-tab:nth-child(3)').classList.add('active');
        document.getElementById('seccion-servicios').classList.remove('hidden');
        cargarServicios();
    }
}

// ================= LÓGICA DE DATOS (SUPABASE) =================

// 1. Negocios (Tabla: negocios)
async function cargarNegocios() {
    const grid = document.getElementById('grid-negocios');
    grid.innerHTML = '<p class="txt-loading">Cargando negocios...</p>';

    const { data, error } = await supabaseClient.from('negocios').select('*');
    if (error) { grid.innerHTML = `<p class="error-text">Error: ${error.message}</p>`; return; }

    if (data.length === 0) { grid.innerHTML = '<p>No hay negocios registrados.</p>'; return; }

    grid.innerHTML = data.map(n => `
        <div class="card">
            <h4>${n.nombre}</h4>
            <p><strong>ID:</strong> ${n.id}</p>
            <p>${n.descripcion || 'Sin descripción'}</p>
            <p>📍 ${n.direccion || 'Sin dirección'}</p>
        </div>
    `).join('');
}

async function guardarNegocio(e) {
    e.preventDefault();
    const nombre = document.getElementById('negocio-nombre').value;
    const direccion = document.getElementById('negocio-direccion').value;
    const descripcion = document.getElementById('negocio-desc').value;

    const { error } = await supabaseClient.from('negocios').insert([{ nombre, direccion, descripcion }]);
    if (error) alert('Error: ' + error.message);
    else { cerrarModales(); cargarNegocios(); }
}

// 2. Citas (Tabla: Citas)
async function cargarCitas() {
    const tbody = document.getElementById('tabla-citas-body');
    tbody.innerHTML = '<tr><td colspan="5" class="txt-loading">Cargando citas...</td></tr>';

    const { data, error } = await supabaseClient.from('Citas').select('*').order('fecha', { ascending: false });
    if (error) { tbody.innerHTML = `<tr><td colspan="5" class="error-text">Error: ${error.message}</td></tr>`; return; }

    if (data.length === 0) { tbody.innerHTML = '<tr><td colspan="5" class="txt-loading">No hay citas registradas.</td></tr>'; return; }

    tbody.innerHTML = data.map(c => `
        <tr>
            <td>${c.nombre_cliente || 'Sin nombre'}</td>
            <td>${c.fecha || '-'}</td>
            <td>${c.hora || '-'}</td>
            <td>${c.estado || 'pendiente'}</td>
            <td><button onclick="eliminarCita('${c.id}')" class="btn-logout" style="padding:0.2rem 0.5rem;">Eliminar</button></td>
        </tr>
    `).join('');
}

async function guardarCita(e) {
    e.preventDefault();
    const negocio_id = document.getElementById('cita-negocio-id').value;
    const nombre_cliente = document.getElementById('cita-cliente-nombre').value;
    const fecha = document.getElementById('cita-fecha').value;
    const hora = document.getElementById('cita-hora').value;

    const { error } = await supabaseClient.from('Citas').insert([{ negocio_id, nombre_cliente, fecha, hora, estado: 'pendiente' }]);
    if (error) alert('Error: ' + error.message);
    else { cerrarModales(); cargarCitas(); }
}

async function eliminarCita(id) {
    if (!confirm('¿Seguro que deseas eliminar esta cita?')) return;
    const { error } = await supabaseClient.from('Citas').delete().eq('id', id);
    if (error) alert('Error: ' + error.message);
    else cargarCitas();
}

// 3. Servicios (Tabla: servicios)
async function cargarServicios() {
    const grid = document.getElementById('grid-servicios');
    grid.innerHTML = '<p class="txt-loading">Cargando servicios...</p>';

    const { data, error } = await supabaseClient.from('servicios').select('*');
    if (error) { grid.innerHTML = `<p class="error-text">Error: ${error.message}</p>`; return; }

    if (data.length === 0) { grid.innerHTML = '<p>No hay servicios registrados.</p>'; return; }

    grid.innerHTML = data.map(s => `
        <div class="card">
            <h4>${s.nombre}</h4>
            <p><strong>Precio:</strong> $${s.precio}</p>
            <p>⏱ Duración: ${s.duracion} mins</p>
            <p>Activo: ${s.activo ? 'Sí' : 'No'}</p>
        </div>
    `).join('');
}

async function guardarServicio(e) {
    e.preventDefault();
    const negocio_id = document.getElementById('serv-negocio-id').value;
    const nombre = document.getElementById('serv-nombre').value;
    const precio = parseFloat(document.getElementById('serv-precio').value);
    const duracion = parseInt(document.getElementById('serv-duracion').value);

    const { error } = await supabaseClient.from('servicios').insert([{ negocio_id, nombre, precio, duracion, activo: true }]);
    if (error) alert('Error: ' + error.message);
    else { cerrarModales(); cargarServicios(); }
}

// ================= MODALES =================
function abrirModalNegocio() { document.getElementById('modal-negocio').classList.remove('hidden'); }
function abrirModalCita() { document.getElementById('modal-cita').classList.remove('hidden'); }
function abrirModalServicio() { document.getElementById('modal-servicio').classList.remove('hidden'); }
function cerrarModales() {
    document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
}

// Inicializar sesión al cargar
window.addEventListener('DOMContentLoaded', () => {
    verificarSesion();
});
