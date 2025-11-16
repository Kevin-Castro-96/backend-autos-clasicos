import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import carRoutes from "./routes/carRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

// Import CommonJS compatible (para evitar import.meta)
const swaggerDist = require("swagger-ui-dist");

import { initDataSource } from "./config/data-source";

const app = express();
app.use(cors());
app.use(express.json());

// Ruta raíz
app.get("/", (req, res) => {
  res.json({
    message: "Servidor funcionando ✅. Para documentación visita /docs",
  });
});

// Servir assets de Swagger manualmente (solución para Vercel)
app.use("/swagger-ui", express.static(swaggerDist.absolutePath()));

// Swagger setup
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Classic Cars API",
      version: "1.0.0",
      description:
        "API para autos clásicos (60s, 70s, 80s) con autenticación y gestión de autos.",
    },
    servers: [
      {
        url: "https://back-autos-clasicos.vercel.app",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./dist/routes/*.js", "./dist/controllers/*.js"],
});

// Ruta Swagger con assets correctos
app.use(
  "/docs",
  swaggerUi.serveFiles(swaggerSpec),
  swaggerUi.setup(swaggerSpec, {
    customCssUrl: "/swagger-ui/swagger-ui.css",
    customJs: "/swagger-ui/swagger-ui-bundle.js",
    explorer: true,
  })
);

// Rutas API
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);

const PORT = process.env.PORT || 3000;

initDataSource()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Local server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("DB init error", err);
  });
