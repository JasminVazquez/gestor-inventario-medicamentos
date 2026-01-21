export interface IMedicamento {
    id?: number;
    nombre: string;
    categoria_id: string;
    cantidad: number;
    fecha_expiracion: string;
    activo?: boolean;
    updated_at?: string;
    created_at?: string;
}
