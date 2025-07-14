document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  if (!form) {
    console.error('Formulario no encontrado');
    return;
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('https://camsegrender-production.up.railway.app/api/loginadmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar al admin en localStorage
        localStorage.setItem('admin', JSON.stringify(data.administrativo || data.admin || data));
        
        // Redirigir al panel
        window.location.href = 'paneladmin.html';
      } else {
        document.getElementById('error').textContent = data.mensaje || 'Error en el inicio de sesión';
        document.getElementById('error').classList.remove('hidden');
      }

    } catch (error) {
      console.error('Error de conexión:', error);
      document.getElementById('error').textContent = 'Error al conectar con el servidor.';
      document.getElementById('error').classList.remove('hidden');
    }
  });
});
