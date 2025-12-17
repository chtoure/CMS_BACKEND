import express from "express";
import type { Express } from "express";
import dotenv from "dotenv";
import Routes from "./Routes/Routes.ts";

dotenv.config();

const port: number = parseInt(process.env.PORT || "3000", 10);
const app: Express = express();
   
app.use(express.json()); // Accepte les donnés du body



// Routes
Routes(app);
      
app.listen(port, "0.0.0.0", () => {
  console.log(`Server started on port ${port}`);
  console.log("Couper le serveur avec Ctrl+C");
});
 