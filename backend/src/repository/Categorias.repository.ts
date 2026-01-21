import { ICategorias } from "../interface/Categorias.interface";
import { pool } from "../config/db";

export const CategoriasRepository = {
  findAll: async (): Promise<ICategorias[]> => {
    const query = "SELECT * FROM categorias ORDER BY id ASC";
    const { rows } = await pool.query(query);
    return rows;
  },

  create: async (categoria: ICategorias): Promise<ICategorias> => {
    const { nombre } = categoria;
    const query = `
            INSERT INTO categorias (nombre)
            VALUES ($1)
            RETURNING *;
        `;

    const values = [nombre];
    const { rows } = await pool.query(query, values);

    return rows[0];
  },

  update: async (
    id: number,
    categoria: Partial<ICategorias>,
  ): Promise<ICategorias> => {
    const { nombre } = categoria;

    const query = `
                UPDATE categorias 
                SET 
                    nombre = COALESCE($1, nombre),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $2
                RETURNING *;
            `;
    const values = [nombre || null, id];

    const { rows } = await pool.query(query, values);
    return rows[0];
  },
};
