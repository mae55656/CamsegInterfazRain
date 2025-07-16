function abrirModalAgregarPedido() {
    document.getElementById('modalAgregarPedido').classList.remove('hidden');
  }

  function cerrarModalAgregarPedido() {
    document.getElementById('modalAgregarPedido').classList.add('hidden');
  }

  document.addEventListener('DOMContentLoaded', () => {
    const cliente = JSON.parse(localStorage.getItem('cliente'));
    if (!cliente || !cliente.id) return;

    const calcularBtn = document.getElementById('btnCalcularPrecioModal');
    const precioInput = document.getElementById('modalPrecio');

    calcularBtn.addEventListener('click', () => {
      const camExt = parseInt(document.getElementById('modalCamarasExteriores').value) || 0;
      const camInt = parseInt(document.getElementById('modalCamarasInteriores').value) || 0;
      const total = (camExt * 90) + (camInt * 40) + 200;
      precioInput.value = total;
    });

    document.getElementById('formularioAgregarPedido').addEventListener('submit', async (e) => {
      e.preventDefault();

      const lugar = document.getElementById('modalLugar').value;
      const camExt = parseInt(document.getElementById('modalCamarasExteriores').value) || 0;
      const camInt = parseInt(document.getElementById('modalCamarasInteriores').value) || 0;
      const tecnologia = document.querySelector('input[name="modalTecnologia"]:checked').value;
      const precio = parseFloat(document.getElementById('modalPrecio').value);

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
        const response = await fetch('https://camsegrender-production.up.railway.app/api/pedidos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datos)
        });

        if (response.ok) {
          document.getElementById('mensajeExitoModal').classList.remove('hidden');
          e.target.reset();
          precioInput.value = '';
          setTimeout(cerrarModalAgregarPedido, 1500);
        } else {
          alert('Hubo un error al enviar el pedido.');
        }
      } catch (error) {
        console.error('Error de red:', error);
        alert('No se pudo conectar con el servidor.');
      }
    });
  });


    const API_URL = 'https://camsegrender-production.up.railway.app/api/pedidos';

    document.addEventListener('DOMContentLoaded', cargarPedidos);
    document.getElementById('formEditar').addEventListener('submit', actualizarPedido);
    document.getElementById('calcularBtn').addEventListener('click', calcularPrecio);

    function cargarPedidos() {
      const cliente = JSON.parse(localStorage.getItem('cliente'));
      if (!cliente || !cliente.id) {
        alert('Debes iniciar sesión para ver tus pedidos.');
        return;
      }

      fetch(API_URL)
        .then(res => res.json())
        .then(data => {
          const cuerpo = document.getElementById('cuerpoTabla');
          cuerpo.innerHTML = '';

          const pedidosCliente = data.filter(p => p.cliente_id === cliente.id);

          pedidosCliente.forEach(pedido => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
              <td class="border px-4 py-2">${pedido.servicio}</td>
              <td class="border px-4 py-2">${pedido.detalles}</td>
              <td class="border px-4 py-2">${pedido.fecha_solicitud}</td>
              <td class="border px-4 py-2">${pedido.estado}</td>
              <td class="border px-4 py-2">s/${pedido.precio_estimado}</td>
              <td class="border px-4 py-2 space-x-2">
                <button onclick="abrirModalEditar(${pedido.pedido_id})"  class="text-blue-600 hover:text-blue-700" title="Editar">
                <i data-lucide="edit" class="w-5 h-5"></i>
            </button>
                <button onclick="eliminarPedido(${pedido.pedido_id})" class="text-red-600 hover:text-red-700" title="Eliminar">
              <i data-lucide="trash-2" class="w-5 h-5"></i>
            </button>
              </td>
            `;
            cuerpo.appendChild(fila);
          });
          lucide.createIcons();
        })
        .catch(err => {
          console.error('Error al cargar pedidos:', err);
          alert('No se pudieron cargar los pedidos.');
        });
        
    }

    async function eliminarPedido(id) {
      if (!confirm(`¿Estás seguro de eliminar el pedido ${id}?`)) return;

      try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (res.ok) {
          alert(`Pedido ${id} eliminado correctamente.`);
          cargarPedidos();
        } else {
          alert('Error al eliminar el pedido.');
        }
      } catch (err) {
        console.error(err);
        alert('Error de conexión.');
      }
    }

    async function abrirModalEditar(id) {
      try {
        const res = await fetch(`${API_URL}/${id}`);
        const pedido = await res.json();

        document.getElementById('editId').value = pedido.pedido_id;
        document.getElementById('lugar').value = pedido.servicio;
        document.getElementById('camarasExteriores').value = pedido.detalles.match(/exteriores: (\d+)/)?.[1] || 0;
        document.getElementById('camarasInteriores').value = pedido.detalles.match(/interiores: (\d+)/)?.[1] || 0;

        const tecnologia = pedido.detalles.includes('IP') ? 'IP' : 'Analoga';
        document.querySelector(`input[name="tecnologia"][value="${tecnologia}"]`).checked = true;

        document.getElementById('precio').value = pedido.precio_estimado;

        document.getElementById('modalEditar').classList.remove('hidden');
      } catch (err) {
        console.error(err);
        alert('No se pudo cargar el pedido.');
      }
    }

    function cerrarModal() {
      document.getElementById('modalEditar').classList.add('hidden');
    }

    function calcularPrecio() {
      const ext = parseInt(document.getElementById('camarasExteriores').value) || 0;
      const int = parseInt(document.getElementById('camarasInteriores').value) || 0;
      const tecnologia = document.querySelector('input[name="tecnologia"]:checked')?.value || '';
      let precioBase = tecnologia === 'IP' ? 50 : 30;
      const precioTotal = (ext + int) * precioBase;
      document.getElementById('precio').value = precioTotal.toFixed(2);
    }

    async function actualizarPedido(e) {
      e.preventDefault();
      const id = document.getElementById('editId').value;
      const servicio = "Instalación"; // Valor fijo y correcto
      const lugar = document.getElementById('lugar').value;
      const exteriores = document.getElementById('camarasExteriores').value;
      const interiores = document.getElementById('camarasInteriores').value;
      const tecnologia = document.querySelector('input[name="tecnologia"]:checked').value;
      const precio = document.getElementById('precio').value;

      const detalles = `Lugar: ${lugar}; Cámaras exteriores: ${exteriores}; Cámaras interiores: ${interiores}; Tecnología: ${tecnologia}`;


      try {
        const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          servicio, // "Instalación"
          detalles,
          precio_estimado: precio
        })
      });

        if (res.ok) {
          alert('Pedido actualizado');
          cerrarModal();
          cargarPedidos();
        } else {
          alert('Error al actualizar pedido.');
        }
      } catch (err) {
        console.error(err);
        alert('Error al conectar con el servidor.');
      }
    }

    function mostrarPerfil() {
  const cliente = JSON.parse(localStorage.getItem('cliente'));
  if (!cliente) {
    alert('Debes iniciar sesión');
    return;
  }

  const perfilDiv = document.getElementById('perfilContenido');
  perfilDiv.innerHTML = `
    <p><strong>Nombre:</strong> ${cliente.nombre}</p>
    <p><strong>Email:</strong> ${cliente.email}</p>
    <p><strong>DNI:</strong> ${cliente.dni}</p>
    <p><strong>Teléfono:</strong> ${cliente.telefono}</p>
    <p><strong>Dirección:</strong> ${cliente.direccion}</p>
  `;

  document.getElementById('perfilModal').classList.remove('hidden');
}

function cerrarPerfil() {
  document.getElementById('perfilModal').classList.add('hidden');
}
