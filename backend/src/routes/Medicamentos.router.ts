import { Router } from 'express';
import * as MedicamentosController from '../controller/Medicamentos.controller';

const router = Router();

router.get('/', MedicamentosController.getAllMedicamentos);
router.get('/nombre', MedicamentosController.findByName);
router.post('/', MedicamentosController.createMedicamento);
router.patch('/:id', MedicamentosController.updateMedicamento);
router.delete('/:id', MedicamentosController.deleteMedicamento);

export default router;