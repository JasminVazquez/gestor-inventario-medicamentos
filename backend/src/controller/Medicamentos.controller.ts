import { Request, Response } from "express";
import { MedicamentosService } from "../service/Medicamentos.service";

export const getAllMedicamentos = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const medicamentos = await MedicamentosService.getAllMedicamentos();
    res.status(200).json({
      success: true,
      data: medicamentos,
      message: "Medicamentos obtenidos exitosamente",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      success: false,
      error: `Error en el controlador: ${message}`,
    });
  }
};
export const findById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        mensaje: "El ID del medicamento es necesario para la búsqueda.",
      });
      return;
    }
    const medicamento = await MedicamentosService.findById(id);
    if (medicamento) {
      res.status(200).json({
        success: true,
        data: medicamento,
        message: "Medicamento encontrado",
      });
    } else {
      res.status(404).json({
        success: false,
        error: "Medicamento no encontrado",
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      success: false,
      error: `Error en el controlador: ${message}`,
    });
  }
};


export const createMedicamento = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const medicamento = await MedicamentosService.createMedicamento(req.body);
    res.status(201).json({
      success: true,
      data: medicamento,
      message: "Medicamento creado exitosamente",
    });
  } catch (error: any) {
    console.error({
      mensaje: error.message,
      stack: error.stack,
      detalle: error.detail,
    });

    res.status(500).json({
      success: false,
      error: "Error interno",
      message: error.message,
    });
  }
};
export const updateMedicamento = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const medicamento = await MedicamentosService.updateMedicamento(
      id,
      req.body,
    );
    res.status(200).json({
      success: true,
      data: medicamento,
      message: "Medicamento actualizado exitosamente",
    });
  } catch (error: any) {
    console.error({
      mensaje: error.message,
      stack: error.stack,
      detalle: error.detail,
    });

    res.status(500).json({
      success: false,
      error: "Error interno",
      message: error.message,
    });
  }
};
export const deleteMedicamento = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const resultado = await MedicamentosService.deleteMedicamento(id);
    res.status(200).json({
      success: true,
      data: resultado,
      message: "Medicamento eliminado exitosamente",
    });
  } catch (error: any) {
    console.error({
      mensaje: error.message,
      stack: error.stack,
      detalle: error.detail,
    });
  }
};

export const getFiltrados = async (req: Request, res: Response) => {
  try {
    const { nombre, categoria_id, statusCaducidad } = req.query;

    const filtros = {
      nombre: nombre ? (nombre as string) : undefined,
      categoria_id:
        categoria_id && categoria_id !== "" ? Number(categoria_id) : undefined,
      statusCaducidad: statusCaducidad
        ? (statusCaducidad as string)
        : undefined,
    };

    const medicamentos = await MedicamentosService.findByFiltros(filtros);
    res.json({ success: true, data: medicamentos });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      mensaje: "Petición incorrecta",
      error: error.message,
    });
  }
};

