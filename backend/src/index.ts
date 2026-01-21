import express from "express";
import morgan from "morgan";
import type { Request, Response } from "express";
import MedicamentosRoutes from "./routes/Medicamentos.router";
import CategoriasRoutes from "./routes/Categorias.router";

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.send("🚀 Servidor de Medicamentos funcionando");
});

app.use("/api/medicamentos", MedicamentosRoutes);
app.use("/api/categorias", CategoriasRoutes);

try {
} catch (err: unknown) {
  if (err instanceof Error) {
    console.error("❌ Error conectando a la base de datos:", err.message);
  } else {
    console.error("❌ Error inesperado:", err);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
