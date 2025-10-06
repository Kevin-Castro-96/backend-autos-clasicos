import "reflect-metadata";

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import carRoutes from "./routes/carRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiAssetPath from "swagger-ui-dist";
import { initDataSource } from "./config/data-source";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

// Ruta raíz
app.get("/", (req, res) => {
  res.json({
    message: "Servidor funcionando ✅. Para documentación visita /docs",
  });
});

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
        url: process.env.BASE_URL || "http://localhost:3000",
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
  // ⚠️ Apuntar a los archivos .js compilados en producción
  apis: [
    path.join(__dirname, "routes/*.js"),
    path.join(__dirname, "controllers/*.js"),
  ],
});

// Swagger UI con assets locales de swagger-ui-dist
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCssUrl: `${swaggerUiAssetPath}/swagger-ui.css`,
    customJs: `${swaggerUiAssetPath}/swagger-ui-bundle.js`,
  })
);

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);

const PORT = process.env.PORT || 3000;

initDataSource()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Servidor corriendo en http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Error inicializando DB:", err);
  });
