document.addEventListener('DOMContentLoaded', () => {
  const cliente = JSON.parse(localStorage.getItem('cliente'));

  if (!cliente || !cliente.id) {
    alert('Debes iniciar sesión para hacer un pedido.');
    window.location.href = 'login.html';
    return;
  }

  const calcularBtn = document.getElementById('calcularBtn');
  const precioInput = document.getElementById('precio');

  calcularBtn.addEventListener('click', () => {
    const camExt = parseInt(document.getElementById('camarasExteriores').value) || 0;
    const camInt = parseInt(document.getElementById('camarasInteriores').value) || 0;
    const total = (camExt * 90) + (camInt * 40) + 200;
    precioInput.value = total;
  });

  document.getElementById('pedidoForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const lugar = document.getElementById('lugar').value;
    const camExt = parseInt(document.getElementById('camarasExteriores').value) || 0;
    const camInt = parseInt(document.getElementById('camarasInteriores').value) || 0;
    const tecnologia = document.querySelector('input[name="tecnologia"]:checked').value;
    const precio = parseFloat(precioInput.value);

    if (isNaN(precio) || precio <= 0) {
      alert('Primero debes calcular el precio.');
      return;
    }

    const hoy = new Date().toISOString().split('T')[0];

    const detalles = `Lugar: ${lugar}; Cámaras exteriores: ${camExt}; Cámaras interiores: ${camInt}; Tecnología: ${tecnologia}`;

    const datos = {
      cliente_id: cliente.id,
      servicio: "Instalación",
      detalles: detalles,
      precio_estimado: precio,
      fecha_solicitud: hoy,
      estado: "pendiente"
    };

    try {
      const response = await fetch('http://192.168.1.5:8000/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      });

      if (response.ok) {
        document.getElementById('mensaje').classList.remove('hidden');
        e.target.reset();
        precioInput.value = '';
      } else {
        alert('Hubo un error al enviar el pedido.');
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('No se pudo conectar con el servidor.');
    }
  });
});