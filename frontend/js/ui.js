$(document).ready(function () {
  function ejecutarBusqueda() {
    const filtros = {
      nombre: $("#inputNombre").val().trim() || undefined,
      categoria_id: $("#filtroCategoria").val() || undefined,
      statusCaducidad:
        $("#filtroEstado").val() !== "todos"
          ? $("#filtroEstado").val()
          : undefined,
    };

    MedicamentosAPI.buscarConFiltros(
      filtros,
      function (response) {
        renderizarTabla(response.data);
      },
      function (err) {
        console.error("Error en la búsqueda combinada:", err);
        renderizarTabla([]);
      },
    );
  }

  let timeoutBusqueda = null;
  $("#inputNombre").on("input", function () {
    clearTimeout(timeoutBusqueda);
    timeoutBusqueda = setTimeout(ejecutarBusqueda, 300);
  });
  $("#btnBuscar").click(ejecutarBusqueda);

  $("#tablaCuerpo").on("click", ".btn-eliminar", function () {
    const id = $(this).data("id");

    Swal.fire({
      title: "¿Eliminar medicamento?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        MedicamentosAPI.eliminar(
          id,
          function () {
            Swal.fire("¡Eliminado!", "El registro ha sido borrado.", "success");
            ejecutarBusqueda();
          },
          function () {
            Swal.fire("Error", "No se pudo eliminar el medicamento", "error");
          },
        );
      }
    });
  });

  $("#tablaCuerpo").on("click", ".btn-editar", function () {
    const id = $(this).data("id");

    MedicamentosAPI.obtenerPorId(id, function (response) {
      const med = response.data;

      cargarCategoriasSelect(function () {
        setTimeout(function () {
          $("#nuevoNombre").val(med.nombre);
          $("#nuevoCategoria").val(med.categoria_id);
          $("#nuevoCantidad").val(med.cantidad);

          if (med.fecha_expiracion) {
            $("#nuevoFecha").val(med.fecha_expiracion.split("T")[0]);
          }
        }, 40);

        $("#modalLabel").text("Editar Medicamento");
        $("#btnGuardar").text("Actualizar Cambios");
        $("#formNuevoMedicamento").attr("data-modo", "editar");
        $("#formNuevoMedicamento").attr("data-id", med.id);

        const modalElement = document.getElementById("modalNuevo");
        const modalInstancia =
          bootstrap.Modal.getOrCreateInstance(modalElement);
        modalInstancia.show();
      });
    });
  });

  $("#modalNuevo").on("hidden.bs.modal", function () {
    $("#formNuevoMedicamento")[0].reset();
    $("#modalLabel").text("Registrar Nuevo Medicamento");
    $("#formNuevoMedicamento").removeAttr("data-modo").removeAttr("data-id");
  });

  $("#formNuevoMedicamento").on("submit", function (e) {
    e.preventDefault();

    if (cantidad < 0) {
      Swal.fire({
        icon: "error",
        title: "Cantidad no válida",
        text: "La cantidad no puede ser un número negativo.",
        confirmButtonColor: "#0d6efd",
      });
      return;
    }
    const modo = $(this).attr("data-modo");
    const id = $(this).attr("data-id");

    const datosMedicamento = {
      nombre: $("#nuevoNombre").val(),
      categoria_id: parseInt($("#nuevoCategoria").val()),
      cantidad: parseInt($("#nuevoCantidad").val()),
      fecha_expiracion: $("#nuevoFecha").val(),
      activo: true,
    };

    if (modo === "editar") {
      MedicamentosAPI.actualizar(
        id,
        datosMedicamento,
        function () {
          Swal.fire({
            icon: "success",
            title: "¡Actualizado!",
            text: "Los cambios se guardaron correctamente",
            showConfirmButton: false,
            timer: 1500, // Se cierra solo en 1.5 segundos
            timerProgressBar: true,
          });
          cerrarYRefrescar();
        },
        manejarError,
      );
    } else {
      MedicamentosAPI.guardar(
        datosMedicamento,
        function () {
          Swal.fire({
            icon: "success",
            title: "¡Guardado!",
            text: "El medicamento se agregó al inventario",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          });
          cerrarYRefrescar();
        },
        manejarError,
      );
    }
  });

  function cerrarYRefrescar() {
    bootstrap.Modal.getInstance(document.getElementById("modalNuevo")).hide();
    ejecutarBusqueda();
  }

  function manejarError(err) {
    alert(
      "Error: " +
        (err.responseJSON ? err.responseJSON.mensaje : "Operación fallida"),
    );
  }

  function cargarCategoriasSelect(callback) {
    const $select = $("#nuevoCategoria");
    $select.empty().append("<option selected disabled>Cargando...</option>");

    MedicamentosAPI.obtenerCategorias(
      function (response) {
        $select.empty();
        $select.append(
          '<option value="" selected disabled>Seleccione una categoría</option>',
        );

        response.data.forEach(function (cat) {
          $select.append(`<option value="${cat.id}">${cat.nombre}</option>`);
        });

        if (callback) callback();
      },
      function (err) {
        $select.html("<option disabled>Error al cargar categorías</option>");
      },
    );
  }
  $("#modalNuevo").on("show.bs.modal", function () {
    const modo = $("#formNuevoMedicamento").attr("data-modo");
    if (modo !== "editar") {
      cargarCategoriasSelect();
    }
  });

  function renderizarTabla(datosBrutos) {
    const cuerpoTabla = $("#tablaCuerpo");
    cuerpoTabla.empty();

    let datos = datosBrutos
      ? Array.isArray(datosBrutos)
        ? datosBrutos
        : [datosBrutos]
      : [];

    if (datos.length === 0) {
      cuerpoTabla.append(
        '<tr><td colspan="6" class="text-center">No hay medicamentos</td></tr>',
      );
      return;
    }

    datos.forEach((med) => {
      const hoy = new Date();
      const fechaExp = med.fecha_expiracion
        ? new Date(med.fecha_expiracion)
        : null;
      const esVencido = fechaExp && fechaExp < hoy;

      const fila = `
        <tr class="${esVencido ? "table-danger" : ""}">
          <td>${med.nombre} ${esVencido ? "⚠️" : ""}</td>
          <td>${med.categoria_nombre || "N/A"}</td>
          <td>${med.cantidad || 0}</td>
          <td>${med.fecha_expiracion ? new Date(med.fecha_expiracion).toLocaleDateString() : "S/F"}</td>
          <td>${med.activo ? "Sí" : "No"}</td>
          <td>
          <button class="btn-vivid btn-vivid-edit btn-editar" data-id="${med.id}">
    <i class="bi bi-pencil-square"></i> 
  </button>
  <button class="btn-vivid btn-vivid-delete btn-eliminar" data-id="${med.id}">
    <i class="bi bi-trash3-fill"></i> 
  </button>
        </tr>`;
      cuerpoTabla.append(fila);
    });
  }

  function cargarCategoriasFiltro() {
    MedicamentosAPI.obtenerCategorias(function (response) {
      const $filtroCat = $("#filtroCategoria");
      $filtroCat
        .empty()
        .append('<option value="">Todas las categorías</option>');

      response.data.forEach(function (cat) {
        $filtroCat.append(`<option value="${cat.id}">${cat.nombre}</option>`);
      });
    });
  }

  cargarCategoriasFiltro();

  $("#filtroCategoria, #filtroEstado").on("change", function () {
    ejecutarBusqueda();
  });
});
