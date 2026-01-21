import { Request, Response } from 'express';
import { CategoriasService } from '../service/Categorias.service';

// GET /categorias - Obtener todas las categorias
export const getAllCategorias = async (req: Request, res: Response): Promise<void> => {
    try {
        const categorias = await CategoriasService.getAllCategorias();
        res.status(200).json({
            success: true,
            data: categorias,
            message: 'Categorias obtenidas exitosamente'
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({
            success: false,
            error: `Error en el controlador: ${message}`
        });
    }
};

// POST /categorias - Crear una nueva categoria
export const createCategorias = async (req: Request, res: Response): Promise<void> => {
    try {
        const categoria = await CategoriasService.createCategoria(req.body);
        res.status(201).json({
            success: true,
            data: categoria,
            message: 'Categoria creada exitosamente'
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(400).json({
            success: false,
            error: `Error al crear: ${message}`
        });
    }
};

export const updateCategoria = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);
        const categoria = await CategoriasService.updateCategoria(id, req.body);
        res.status(200).json({
            success: true,
            data: categoria,
            message: 'Categoria actualizada exitosamente'
        });
    }
    catch (error : any) {
        console.error({
            mensaje: error.message,
            stack: error.stack, 
            detalle: error.detail 
        });

        res.status(500).json({ 
            success: false, 
            error: "Error interno", 
            message: error.message 
        });
    }
    
};

