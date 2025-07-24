import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import swaggerSpec from "./swaggerSpec";

const swaggerDocs = (app: Express, port: number | string) => {
 
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
  console.log(`Swagger JSON available at http://localhost:${port}/api-docs.json`);
};

export default swaggerDocs;