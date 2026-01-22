import { IMedicamento } from "../interface/Medicamentos.interface";
import { pool } from "../config/db";

export const MedicamentosRepository = {
  findAll: async (): Promise<IMedicamento[]> => {
    const query = `
      SELECT m.*, c.nombre AS categoria_nombre 
      FROM medicamentos m
      LEFT JOIN categorias c ON m.categoria_id = c.id
      ORDER BY m.id ASC`;
    const { rows } = await pool.query(query);
    return rows;
  },
  findByFiltros: async (
    categoria_id?: number,
    estado?: string,
    nombre?: string,
  ): Promise<IMedicamento[]> => {
    let query = `
    SELECT m.*, c.nombre AS categoria_nombre 
    FROM medicamentos m
    LEFT JOIN categorias c ON m.categoria_id = c.id
    WHERE m.activo = true`;

    const values: any[] = [];
    const hoy = new Date().toISOString().split("T")[0];

    if (nombre && nombre.trim() !== "") {
      values.push(`${nombre.trim()}%`);
      query += ` AND m.nombre ILIKE $${values.length}`;
    }

    if (categoria_id && !isNaN(categoria_id)) {
      values.push(categoria_id);
      query += ` AND m.categoria_id = $${values.length}`;
    }

    if (estado === "vencido") {
      values.push(hoy);
      query += ` AND m.fecha_expiracion < $${values.length}`;
    } else if (estado === "proximo") {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      const dentroDe30Dias = d.toISOString().split("T")[0];

      values.push(hoy, dentroDe30Dias);
      query += ` AND m.fecha_expiracion BETWEEN $${values.length - 1} AND $${values.length}`;
    } else if (estado === "bueno" || estado === "vigente") {
      values.push(hoy);
      query += ` AND m.fecha_expiracion > $${values.length}`;
    }

    query += " ORDER BY m.nombre ASC";

    const { rows } = await pool.query(query, values);
    return rows;
  },
  findByCategoria: async (categoria_id: number): Promise<IMedicamento[]> => {
    const query = `
      SELECT m.*, c.nombre AS categoria_nombre
      FROM medicamentos m
      LEFT JOIN categorias c ON m.categoria_id = c.id
      WHERE m.categoria_id = $1 AND m.activo = true;`;
    const values = [categoria_id];
    const { rows } = await pool.query(query, values);
    return rows;
  },

  findByCaducidad: async (status: string): Promise<IMedicamento[]> => {
    let query = `
      SELECT m.*, c.nombre AS categoria_nombre
      FROM medicamentos m
      LEFT JOIN categorias c ON m.categoria_id = c.id
      WHERE m.activo = true`;

    const values: any[] = [];
    const currentDate = new Date();

    // 2. Lógica de filtrado según el parámetro de la URL
    // Ajustamos los nombres ("vencido", "proximo") para que coincidan con tu frontend
    if (status === "vencido" || status === "caducados") {
      query += ` AND m.fecha_expiracion < $1`;
      values.push(currentDate);
    } else if (status === "proximo" || status === "por_caducar") {
      const next30Days = new Date();
      next30Days.setDate(currentDate.getDate() + 30);

      query += ` AND m.fecha_expiracion BETWEEN $1 AND $2`;
      values.push(currentDate, next30Days);
    } else if (status === "bueno" || status === "vigentes") {
      query += ` AND m.fecha_expiracion > $1`;
      values.push(currentDate);
    }

    query += " ORDER BY m.fecha_expiracion ASC";

    const { rows } = await pool.query(query, values);
    return rows;
  },

  findById: async (id: number): Promise<IMedicamento | null> => {
    const query = `
      SELECT m.*, c.nombre AS categoria_nombre 
      FROM medicamentos m
      LEFT JOIN categorias c ON m.categoria_id = c.id
      WHERE m.id = $1;`;
    const values = [id];
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
    const values = [
      nombre,
      categoria_id,
      cantidad,
      fecha_expiracion,
      activo ?? true,
    ];

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
