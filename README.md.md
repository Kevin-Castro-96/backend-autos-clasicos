# Classic Cars Backend 🚗🚀

Backend en **Node.js + TypeScript + Express + TypeORM** para una aplicación de autos clásicos (60s, 70s, 80s), con autenticación de usuarios y documentación Swagger.  

El backend se conecta a **Supabase (PostgreSQL)** y puede desplegarse en **Vercel** con deploy automático desde GitHub.

---

## 📂 Estructura del proyecto

```
src/
├─ config/           # Configuración de TypeORM y variables de entorno
├─ controllers/      # Lógica de los endpoints
├─ entities/         # Entidades TypeORM (User, Car)
├─ middleware/       # JWT auth y otros middlewares
├─ routes/           # Definición de rutas
├─ services/         # Servicios (lógica de negocio)
index.ts             # Entry point
```

---

## ⚙️ Instalación y ejecución local

1. Clonar el repo:

```bash
git clone https://github.com/TU-USUARIO/classic-cars-backend.git
cd classic-cars-backend
```

2. Instalar dependencias:

```bash
npm install
```

3. Crear archivo `.env`:

```
DATABASE_URL=postgres://usuario:contraseña@host:puerto/nombre_db
JWT_SECRET=una_clave_secreta
JWT_EXPIRES=7d
PORT=3000
```

4. Levantar servidor en modo desarrollo:

```bash
npm run dev
```

- Servidor en: `http://localhost:3000/`
- Swagger: `http://localhost:3000/docs`

---

## 🛠 Scripts

```json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js",
  "seed": "ts-node src/seed.ts"
}
```

---

## 🔑 Autenticación y endpoints

| Método | Endpoint | Descripción | Autenticación |
|--------|---------|-------------|---------------|
| POST   | `/api/auth/register` | Registrar usuario | ❌ |
| POST   | `/api/auth/login` | Iniciar sesión | ❌ |
| GET    | `/api/cars` | Listar autos | ❌ |
| POST   | `/api/cars` | Crear auto | ✅ |
| PUT    | `/api/cars/:id` | Editar auto | ✅ |
| DELETE | `/api/cars/:id` | Eliminar auto | ✅ |

> ✅ Requiere JWT en header: `Authorization: Bearer <TOKEN>`

---

## 🌐 Deploy en Vercel

1. Conectar proyecto a GitHub y seleccionar el repo en Vercel.
2. Configurar **Environment Variables** en Vercel idénticas a `.env`.
3. Activar **Auto Deploy** → cada push a `main` redeploya automáticamente.
4. URL pública: `https://TU-PROYECTO.vercel.app`

---

## 📄 Ruta raíz y documentación

- Ruta raíz `/` → mensaje:

```json
{ "message": "Servidor funcionando ✅. Para documentación visita /docs" }
```

- Swagger UI: `/docs` con todos los endpoints y ejemplos de request/response.

---

## 🚀 Prueba con Postman

- Registrar usuario: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- Listar autos: `GET /api/cars`
- Crear/editar/eliminar auto: requerirá JWT en `Authorization` header

