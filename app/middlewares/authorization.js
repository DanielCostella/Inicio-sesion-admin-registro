import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { usuarios } from "./../controllers/authentication.controller.js";

dotenv.config();

function soloAdmin(req, res, next) {
    const logueado = revisarCookie(req);
    if (logueado) return next();
    return res.redirect("/");
}

function soloPublico(req, res, next) {
    const logueado = revisarCookie(req);
    if (!logueado) return next();
    return res.redirect("/admin");
}

let errorLogged = false;

function revisarCookie(req) {
    try {
        if (!req.headers.cookie) {
            if (!errorLogged) {
                console.error("Error al revisar la cookie: No se encontraron cookies en la solicitud.");
                errorLogged = true;
            }
            return false;
        }

        const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt="));
        if (!cookieJWT) {
            if (!errorLogged) {
                console.error("Error al revisar la cookie: Cookie JWT no encontrada.");
                errorLogged = true;
            }
            return false;
        }

        const token = cookieJWT.slice(4);
        const decodificada = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decodificada);

        const usuarioARevisar = usuarios.find(usuario => usuario.user === decodificada.user);
        console.log(usuarioARevisar);

        if (!usuarioARevisar) {
            return false;
        }
        return true;
    } catch (error) {
        if (!errorLogged) {
            console.error("Error al revisar la cookie:", error);
            errorLogged = true;
        }
        return false;
    }
}

export const methods = {
    soloAdmin,
    soloPublico,
};