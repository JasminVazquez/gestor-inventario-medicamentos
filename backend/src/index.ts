import express from 'express';
import morgan from 'morgan';
import type { Request, Response } from 'express';
import MedicamentosRoutes from './routes/Medicamentos.router';
import CategoriasRoutes from './routes/Categorias.router';  


const app = express();
app.use(express.json());
app.use(morgan('dev'));

// Ruta inicial tipada correctamente
app.get('/', (req: Request, res: Response) => {
    res.send('🚀 Servidor de Medicamentos funcionando');
});


app.use('/api/medicamentos', MedicamentosRoutes);
app.use('/api/categorias', CategoriasRoutes);

// Ejemplo del bloque donde conectas a la base de datos o manejas errores
try {
    // Tu lógica de inicio de servidor o DB
} catch (err: unknown) {
    // Corrección para el error 'err is of type unknown'
    if (err instanceof Error) {
        console.error('❌ Error conectando a la base de datos:', err.message);
    } else {
        console.error('❌ Error inesperado:', err);
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});