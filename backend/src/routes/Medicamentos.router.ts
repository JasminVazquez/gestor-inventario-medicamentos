import { Router } from "express";
import * as MedicamentosController from "../controller/Medicamentos.controller";

const router = Router();

router.get("/", MedicamentosController.getAllMedicamentos);
router.get("/buscar", MedicamentosController.getFiltrados);

router.get("/:id", MedicamentosController.findById);

router.post("/", MedicamentosController.createMedicamento);
router.patch("/id/:id", MedicamentosController.updateMedicamento);
router.delete("/id/:id", MedicamentosController.deleteMedicamento);

export default router;
