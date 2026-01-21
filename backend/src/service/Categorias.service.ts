import { CategoriasRepository } from "../repository/Categorias.repository";
import { ICategorias } from "../interface/Categorias.interface";

export const CategoriasService = {
    // GET all categorias
    // CAMBIO: Se usa ":" en lugar de "=" dentro del objeto
    getAllCategorias: async (): Promise<ICategorias[]> => {
        try {
            const categorias = await CategoriasRepository.findAll();
            
            if (!categorias || categorias.length === 0) {
                console.log('No se encontraron categorias.');
            }
            return categorias;
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Error al obtener categorias: ${message}`);
        }
    },

    // Create a new categoria
    // CAMBIO: Se usa ":" en lugar de "=" dentro del objeto
    createCategoria: async (categoriaData: ICategorias): Promise<ICategorias> => {
        try {
            // Validar datos de la categoria
            if (!categoriaData.nombre) {
                throw new Error('Datos incompletos para crear la categoria  .');
            }

            const newCategoria = await CategoriasRepository.create(categoriaData);
            return newCategoria;
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Error al crear categoria: ${message}`);
        }
    },

    updateCategoria: async (id: number, datos: Partial<ICategorias>) => {
            if (!id) {
                throw new Error("El ID es necesario para actualizar.");
            }            
            try {
                const resultado = await CategoriasRepository.update(id, datos);
                return resultado;
            } catch (error: any) {
                throw new Error(`Error al actualizar categoria: ${error.message}`);
            }
        }
};