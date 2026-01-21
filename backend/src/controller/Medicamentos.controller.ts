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
export const findByName = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const nombre = req.params.nombre;
    if (!nombre) {
      res.status(400).json({
        mensaje: "El nombre del medicamento es necesario para la búsqueda.",
      });
      
    }
    const medicamento = await MedicamentosService.findByName(nombre);
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
      stack: error.stack, // Esto te dirá la línea exacta del error
      detalle: error.detail, // Detalles específicos de Postgres (como llaves duplicadas)
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
      stack: error.stack, // Esto te dirá la línea exacta del error
      detalle: error.detail, // Detalles específicos de Postgres (como llaves duplicadas)
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
