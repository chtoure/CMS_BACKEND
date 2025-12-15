import express from "express";
import dotenv from "dotenv";
dotenv.config();
const port = parseInt(process.env.PORT || "3000", 10);
const app = express();
app.use(express.json()); // Accepte les donnés du body
app.listen(port, "0.0.0.0", () => {
    console.log(`Server started on port ${port}`);
    console.log("Couper le serveur avec Ctrl+C");
});
//# sourceMappingURL=index.js.map