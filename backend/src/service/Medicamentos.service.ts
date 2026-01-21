import { IMedicamento } from "../interface/Medicamentos.interface";
import { MedicamentosRepository } from "../repository/Medicamentos.repository";

export const MedicamentosService = {
  getAllMedicamentos: async (): Promise<IMedicamento[]> => {
    try {
      const medicamentos = await MedicamentosRepository.findAll();

      if (!medicamentos || medicamentos.length === 0) {
        console.log("No se encontraron medicamentos.");
      }
      return medicamentos;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Error al obtener medicamentos: ${message}`);
    }
  },
  createMedicamento: async (medicamentoData: IMedicamento,): Promise<IMedicamento> => {
    try {
      if (
        !medicamentoData.nombre ||
        !medicamentoData.categoria_id ||
        medicamentoData.cantidad == null ||
        !medicamentoData.fecha_expiracion
      ) {
        throw new Error("Datos incompletos para crear el medicamento.");
      }
      const newMedicamento =
        await MedicamentosRepository.create(medicamentoData);
      return newMedicamento;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Error al crear medicamento: ${message}`);
    }
  },
  deleteMedicamento: async (id: number) => {
    try {
      const resultado = await MedicamentosRepository.delete(id);
      return resultado;
    } catch (error: any) {
      throw new Error(`Error al eliminar medicamento: ${error.message}`);
    }
  },
  findByName: async (nombre: string ): Promise<IMedicamento | null> => {
    try {
      const medicamento = await MedicamentosRepository.findByName(nombre);
      return medicamento;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Error al buscar medicamento por nombre: ${message}`);
    }
  },
  updateMedicamento: async (id: number, datos: Partial<IMedicamento>) => {
    // Solo validamos que el ID esté presente
    if (!id) {
      throw new Error("El ID es necesario para actualizar.");
    }

    // ELIMINA EL IF QUE CHECA (nombre, cantidad, etc.) AQUÍ

    try {
      const resultado = await MedicamentosRepository.update(id, datos);
      return resultado;
    } catch (error: any) {
      throw new Error(`Error al actualizar medicamento: ${error.message}`);
    }
  },
};
