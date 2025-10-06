import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import carRoutes from "./routes/carRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiAssetPath from "swagger-ui-dist";
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

// Swagger setup con opciones para mostrar ejemplos
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
        description: "Servidor en vercel",
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
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: { urls: [] },
  customCssUrl: `${swaggerUiAssetPath.getAbsoluteFSPath()}/swagger-ui.css`,
}));
// routes
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);

const PORT = process.env.PORT || 3000;
initDataSource()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("DB init error", err);
  });
