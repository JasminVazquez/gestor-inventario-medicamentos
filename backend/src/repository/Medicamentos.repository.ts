import { IMedicamento } from "../interface/Medicamentos.interface";
import { pool } from "../config/db";

export const MedicamentosRepository = {
  findAll: async (): Promise<IMedicamento[]> => {
    const query = "SELECT * FROM medicamentos ORDER BY id ASC";
    const { rows } = await pool.query(query);
    return rows;
  },
  findByName: async (nombre: string): Promise<IMedicamento | null> => {
    const query =
      "SELECT * FROM medicamentos WHERE nombre ILIKE $1 AND activo = true;";
    const values = [nombre];
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  },

  create: async (medicamento: IMedicamento): Promise<IMedicamento> => {
    const { nombre, categoria_id, cantidad, fecha_expiracion, activo } =
      medicamento;
    const query = `
            INSERT INTO medicamentos (nombre, categoria_id, cantidad, fecha_expiracion, activo)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
    const values = [nombre, categoria_id, cantidad, fecha_expiracion, activo];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  delete: async (id: number): Promise<void> => {
    const query = "DELETE FROM medicamentos WHERE id = $1";
    const values = [id];
    await pool.query(query, values);
  },

  update: async (
    id: number,
    medicamento: Partial<IMedicamento>,
  ): Promise<IMedicamento> => {
    const { nombre, categoria_id, cantidad, fecha_expiracion, activo } =
      medicamento;

    const query = `
            UPDATE medicamentos 
            SET 
                nombre = COALESCE($1, nombre),
                categoria_id = COALESCE($2, categoria_id),
                cantidad = COALESCE($3, cantidad),
                fecha_expiracion = COALESCE($4, fecha_expiracion),
                activo = COALESCE($5, activo),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $6
            RETURNING *;
        `;

    // Es vital que el ID sea el quinto parámetro ($5)
    const values = [
      nombre || null,
      categoria_id || null,
      cantidad ?? null,
      fecha_expiracion || null,
      activo ?? null,
      id,
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  },
};
