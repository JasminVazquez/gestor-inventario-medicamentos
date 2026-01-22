const BASE_URL =
  "https://ubiquitous-enigma-xqpw5j5656j297qq-3000.app.github.dev/api";

const MedicamentosAPI = {
  obtenerTodos: function (callbackSuccess, callbackError) {
    $.ajax({
      url: `${BASE_URL}/medicamentos/`,
      method: "GET",
      success: callbackSuccess,
      error: callbackError,
    });
  },

  guardar: function (objetoMedicamento, callbackSuccess, callbackError) {
    $.ajax({
      url: `${BASE_URL}/medicamentos`,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(objetoMedicamento),
      success: callbackSuccess,
      error: callbackError,
    });
  },
  obtenerPorId: function (id, callbackSuccess, callbackError) {
    $.ajax({
      url: `${BASE_URL}/medicamentos/${id}`,
      method: "GET",
      success: callbackSuccess,
      error: callbackError,
    });
  },
  eliminar: function (id, callbackSuccess, callbackError) {
    $.ajax({
      url: `${BASE_URL}/medicamentos/id/${id}`,
      method: "DELETE",
      success: callbackSuccess,
      error: callbackError,
    });
  },
  actualizar: function (id, objetoMedicamento, callbackSuccess, callbackError) {
    $.ajax({
      url: `${BASE_URL}/medicamentos/id/${id}`,
      method: "PATCH",
      contentType: "application/json",
      data: JSON.stringify(objetoMedicamento),
      success: callbackSuccess,
      error: callbackError,
    });
  },

  obtenerCategorias: function (successCallback, errorCallback) {
    $.ajax({
      url: `${BASE_URL}/categorias`,
      method: "GET",
      success: successCallback,
      error: errorCallback,
    });
  },

  buscarConFiltros: function (filtros, callbackSuccess, callbackError) {
    $.ajax({
      url: `${BASE_URL}/medicamentos/buscar`,
      method: "GET",
      data: filtros,
      success: callbackSuccess,
      error: callbackError,
    });
  },
};
