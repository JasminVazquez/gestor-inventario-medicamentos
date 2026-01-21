$(document).ready(function () {
  const API_URL =
    "https://tu-url-de-codespaces-3000.app.github.dev/api/medicamentos";

  // Función principal para cargar datos
  function cargarMedicamentos(estado) {
    $("#tabla-medicamentos").html("<tr><td colspan='4'>Cargando...</td></tr>");

    // Consumo de API usando JQuery AJAX
    $.ajax({
      url: `${API_URL}/estado/${estado}`,
      method: "GET",
      success: function (response) {
        renderizarTabla(response.data);
      },
      error: function (err) {
        console.error("Error al obtener datos", err);
        $("#tabla-medicamentos").html(
          "<tr><td colspan='4' class='text-danger'>Error al conectar con el servidor</td></tr>",
        );
      },
    });
  }

  // Función para "Uso de Objetos" y renderizado
  function renderizarTabla(medicamentos) {
    let filas = "";

    // Recorremos el arreglo de objetos
    medicamentos.forEach((med) => {
      filas += `
                <tr>
                    <td><strong>${med.nombre}</strong></td>
                    <td>${med.categoria || "General"}</td>
                    <td>${new Date(med.fecha_expiracion).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-sm btn-info">Detalles</button>
                    </td>
                </tr>
            `;
    });

    $("#tabla-medicamentos").html(filas);
  }

  // Eventos de los botones
  $("#btn-vencidos").click(() => cargarMedicamentos("vencido"));
  $("#btn-proximos").click(() => cargarMedicamentos("proximo"));
  $("#btn-buenos").click(() => cargarMedicamentos("bueno"));
});
