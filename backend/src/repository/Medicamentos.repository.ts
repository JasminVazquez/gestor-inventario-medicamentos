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
    const values = [`%${nombre}%` || nombre];
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  },
  findByCategoria: async (
    categoria_id: number,
  ): Promise<IMedicamento[] | null> => {
    const query =
      "SELECT * FROM medicamentos WHERE categoria_id = $1 AND activo = true;";
    const values = [categoria_id];
    const { rows } = await pool.query(query, values);
    return rows || null;
  },

  findByStatus: async (
    status: "vencido" | "proximo" | "bueno",
  ): Promise<IMedicamento[]> => {
    let query = "SELECT * FROM medicamentos WHERE activo = true";

    if (status === "vencido") {
      query += " AND fecha_expiracion < CURRENT_DATE";
    } else if (status === "proximo") {
      query +=
        " AND fecha_expiracion BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'";
    } else if (status === "bueno") {
      query += " AND fecha_expiracion > CURRENT_DATE + INTERVAL '30 days'";
    }

    query += " ORDER BY fecha_expiracion ASC";
    const { rows } = await pool.query(query);
    return rows;
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
