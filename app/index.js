import express from "express";
import cookieParser from "cookie-parser";
import path from 'path';
import { fileURLToPath } from "url";
import { methods as authentication } from "./controllers/authentication.controller.js";
import { methods as authorization } from "./middlewares/authorization.js"; 

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.set("port", 7000);

// Configuración
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());

// Rutas
app.get("/",authorization.soloPublico, (req, res) => res.sendFile(path.join(__dirname, "pages/login.html")));
app.get("/register",authorization.soloPublico, (req, res) => res.sendFile(path.join(__dirname, "pages/register.html")));
app.get("/admin",authorization.soloAdmin, (req, res) => res.sendFile(path.join(__dirname, "pages/admin/admin.html")));
app.post("/api/login", authentication.login);
app.post("/api/register", authentication.register);

app.listen(app.get("port"), () => {
    console.log("Servidor corriendo en puerto", app.get("port"));
});