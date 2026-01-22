#Medigroup del Pacífico - Gestor de Inventario

**Ejercicio Técnico para Desarrollador FullStack**

Este proyecto es una aplicación web integral diseñada para la gestión de inventario de medicamentos. Permite realizar operaciones CRUD completas, con una arquitectura moderna que separa el frontend del backend y utiliza una base de datos relacional en la nube.

---

## 🚀 Demo y Repositorio

- **URL del Proyecto:** [https://gestor-inventario-medicamentos.onrender.com](https://gestor-inventario-medicamentos.onrender.com)
- **Repositorio GIT:** [https://github.com/JasminVazquez/gestor-inventario-medicamentos](https://github.com/JasminVazquez/gestor-inventario-medicamentos)

---

## Tecnologías Utilizadas

### **Frontend**

- **JavaScript (Vanilla) & jQuery:** Gestión de lógica y manipulación del DOM.
- **CSS3 & Bootstrap 5:** Diseño responsivo y estética **Vivid UI**.
- **SweetAlert2:** Para notificaciones y confirmaciones de usuario profesionales.

### **Backend**

- **Node.js & Express:** Servidor de API REST.
- **TypeScript:** Garantiza la robustez del código mediante tipado estático.
- **CORS & Dotenv:** Seguridad y manejo de variables de entorno.

### **Base de Datos**

- **PostgreSQL:** Motor relacional alojado en **Neon.tech**.
- **SSL:** Conexión segura habilitada para entornos de producción.

---

## Funcionalidades Implementadas

### **CRUD Básico**

- [x] **Crear:** Formulario modal para registro de nuevos medicamentos con validación de datos.
- [x] **Leer:** Tabla dinámica que consume la API de medicamentos en tiempo real.
- [x] **Actualizar:** Edición completa de registros existentes.
- [x] **Eliminar:** Borrado de registros con ventana de confirmación previa.

### **Búsqueda y Filtros**

- [x] **Búsqueda por nombre:** Filtro de texto con _debounce_ para optimizar peticiones.
- [x] **Filtro por Categoría:** Selector dinámico alimentado desde la base de datos.
- [x] **Filtro por Estado:** Identificación visual de medicamentos próximos a caducar o vencidos (filas resaltadas en rojo).

### **Validaciones**

- [x] Campos obligatorios validados en el frontend y backend.
- [x] Cantidades restringidas a números positivos.
- [x] Formato de fecha estándar (YYYY-MM-DD).

---

## Estructura de la Base de Datos (Scripts)

Para inicializar la base de datos, ejecuta los siguientes scripts en tu instancia de PostgreSQL:

```sql
CREATE TABLE Categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Medicamentos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria_id INTEGER REFERENCES Categorias(id),
    cantidad INTEGER DEFAULT 0,
    fecha_expiracion DATE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar categorías base
INSERT INTO Categorias (nombre) VALUES
('Analgésicos'), ('Antibióticos'), ('Antiinflamatorios'), ('Antihistamínicos');

```

---

## Instrucciones de Ejecución Local

1. **Clonar:** `git clone https://github.com/JasminVazquez/gestor-inventario-medicamentos.git`
2. **Configurar Variables:** Crea un archivo `.env` dentro de la carpeta `/backend`:

```env
DATABASE_URL=tu_url_de_conexion_postgresql
PORT=3000

```

3. **Instalar Dependencias:**

```bash
cd backend
npm install

```

4. **Compilar y Ejecutar:**

```bash
npm run build
npm start

```

5. **Acceder:** Abre `http://localhost:3000` en tu navegador.

---

## Autor

- **Ana Jasmin Vazquez Torres** - _Ingeniería en Sistemas Computacionales_ - Instituto Tecnológico de México, Campus Culiacán.

---
