import express from "express";
import type { Express } from "express";
import dotenv from "dotenv";
import Routes from "./Routes/Routes.ts";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {corsOptions} from "./Utils/Constantes/CorsOptions.ts";
import path from "path";



dotenv.config();

const port: number = parseInt(process.env.PORT || "3000", 10);
const app: Express = express();

// Accepte les donnés du body   
app.use(express.json()); 

// Implementation de cors
app.use(cors(corsOptions)); 

// Indispensable pour détecter le HTTPS derrière un proxy/load-balancer
app.set('trust proxy', 1);

//lire les cookies 
app.use(cookieParser());

// Rendre le dossier media public 
app.use('/media', express.static(path.join(process.cwd(), 'media')))


// Routes

Routes(app);
      
app.listen(port, "0.0.0.0", () => {
  console.log(`Server started on port ${port}`);
  console.log("Couper le serveur avec Ctrl+C");
});
