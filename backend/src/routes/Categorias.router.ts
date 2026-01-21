import { Router } from 'express';
import * as CategoriasController from '../controller/Categorias.controller';
const router = Router();

router.get('/', CategoriasController.getAllCategorias);
router.post('/', CategoriasController.createCategorias);
router.patch('/:id', CategoriasController.updateCategoria);

export default router;