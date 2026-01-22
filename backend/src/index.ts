// import express from "express";
// import morgan from "morgan";
// import cors from "cors";
// import type { Request, Response } from "express";
// import MedicamentosRoutes from "./routes/Medicamentos.router";
// import CategoriasRoutes from "./routes/Categorias.router";
// import { pool } from "./config/db";

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(morgan("dev"));

// app.use("/api/medicamentos", MedicamentosRoutes);
// app.use("/api/categorias", CategoriasRoutes);

// const startServer = async () => {
//   try {
//     await pool.query("SELECT NOW()");
//     console.log("Conexión exitosa a PostgreSQL");

//     const PORT = process.env.PORT || 3000;
//     app.listen(PORT, () => {
//       console.log(`Servidor corriendo en el puerto ${PORT}`);
//     });
//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       console.error("Error conectando a la base de datos:", err.message);
//     } else {
//       console.error("Error inesperado:", err);
//     }
//     process.exit(1);
//   }
// };

// startServer();

import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import type { Request, Response } from "express";
import MedicamentosRoutes from "./routes/Medicamentos.router";
import CategoriasRoutes from "./routes/Categorias.router";
import { pool } from "./config/db";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use(express.static(path.join(__dirname, "../../frontend")));

app.use("/api/medicamentos", MedicamentosRoutes);
app.use("/api/categorias", CategoriasRoutes);

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/index.html"));
});

const startServer = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("✅ Conexión exitosa a PostgreSQL (Neon)");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ Error conectando a la base de datos:", err.message);
    } else {
      console.error("❌ Error inesperado:", err);
    }
    process.exit(1);
  }
};

startServer();
