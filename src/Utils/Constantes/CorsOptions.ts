import dotenv from "dotenv";
dotenv.config();

const front_url = process.env.FRONT_APP_URL


export const corsOptions = {
    origin: front_url, 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 204 
};