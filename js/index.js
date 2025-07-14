function openModal() {
  document.getElementById('loginModal').style.display = 'flex';
  showLogin();
}

function closeModal() {
  document.getElementById('loginModal').style.display = 'none';
}

function showRegister() {
  document.getElementById('loginForm').classList.add('hidden');
  document.getElementById('registerForm').classList.remove('hidden');
}

function showLogin() {
  document.getElementById('registerForm').classList.add('hidden');
  document.getElementById('loginForm').classList.remove('hidden');
}

function mostrarNombreCliente() {
  const clienteGuardado = localStorage.getItem('cliente');
  const nombreCliente = document.getElementById('nombreCliente');
  const cerrarSesionBtn = document.getElementById('cerrarSesion');

  if (clienteGuardado) {
    const cliente = JSON.parse(clienteGuardado);
    nombreCliente.textContent = 'Hola, ' + cliente.nombre;
    nombreCliente.classList.remove('hidden');
    cerrarSesionBtn.classList.remove('hidden');
  } else {
    nombreCliente.classList.add('hidden');
    cerrarSesionBtn.classList.add('hidden');
  }
}

function cerrarSesion() {
  localStorage.removeItem('cliente');
  mostrarNombreCliente();
  alert('Sesión cerrada.');
}

document.addEventListener('DOMContentLoaded', function () {
  const registrarBtn = document.getElementById('btnRegistrar');
registrarBtn.addEventListener('click', async function () {
  const nombre = document.querySelector('#registerForm input[placeholder="Nombre"]').value;
  const dni = document.querySelector('#registerForm input[placeholder="DNI"]').value;
  const telefono = document.querySelector('#registerForm input[placeholder="Teléfono"]').value;
  const email = document.querySelector('#registerForm input[placeholder="Email"]').value;
  const direccion = document.querySelector('#registerForm input[placeholder="Dirección"]').value;
  const password = document.querySelector('#registerForm input[placeholder="Contraseña"]').value;

  if (!nombre || !dni || !telefono || !email || !direccion || !password) {
    alert('Todos los campos son obligatorios.');
    return;
  }

  try {
    const response = await fetch('https://camsegrender-production.up.railway.app/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        dni,
        telefono,
        email,
        direccion,
        password
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      showLogin();
    } else {
      alert(data.mensaje || 'Error en el registro.');
    }
  } catch (error) {
    console.error('Error al conectar con el servidor:', error);
    alert('Fallo de conexión al registrar.');
  }
});

  const loginBtn = document.querySelector('#loginForm button');
  loginBtn.addEventListener('click', async function () {
    const email = document.querySelector('#loginForm input[type="text"]').value;
    const password = document.querySelector('#loginForm input[type="password"]').value;

    try {
      const response = await fetch('https://camsegrender-production.up.railway.app/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('cliente', JSON.stringify(data.cliente));
        closeModal();
        mostrarNombreCliente();
      } else {
        alert(data.mensaje || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      alert('Fallo de conexión');
    }
  });

  mostrarNombreCliente();
});

function seleccionarServicio(servicio) {
  localStorage.setItem('servicioSeleccionado', servicio);
  window.location.href = 'dashboard_pedidos.html';
}