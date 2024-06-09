import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const usuarios = [{
    user: "a",
    email: "a@a.com",
    password: "$2a$05$XtjiFGOF/R4kryiLBrqwrOJeriZXFR01Z8kvWLnv.ZGBWZg9CC4H2"
}];

async function login(req, res) {
    console.log(req.body);
    const { user, password } = req.body;
    if (!user || !password) {
        return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
    }
    const usuarioARevisar = usuarios.find(usuario => usuario.user === user);
    if (!usuarioARevisar) {
        return res.status(400).send({ status: "Error", message: "Error durante login" });
    }
    const loginCorrecto = await bcryptjs.compare(password, usuarioARevisar.password);
    if (!loginCorrecto) {
        return res.status(400).send({ status: "Error", message: "Error durante login" });
    }
    const token = jwt.sign(
        { user: usuarioARevisar.user },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
    );

    const cookieExpires = new Date(Date.now() + parseInt(process.env.JWT_COOKIES_EXPIRES) * 24 * 60 * 60 * 1000);
    const cookieOption = {
        expires: cookieExpires,
        path: "/"
    };
    res.cookie('jwt', token, cookieOption);
    res.send({ status: "ok", message: "Usuario logeado", redirect: "/admin" });
}

async function register(req, res) {
    console.log(req.body);
    const { user, password, email } = req.body;
    if (!user || !password || !email) {
        return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
    }
    const usuarioARevisar = usuarios.find(usuario => usuario.user === user);
    if (usuarioARevisar) {
        return res.status(400).send({ status: "Error", message: "Este usuario ya existe" });
    }
    const salt = await bcryptjs.genSalt(5);
    const hashPassword = await bcryptjs.hash(password, salt);
    const nuevoUsuario = {
        user, email, password: hashPassword
    };
    usuarios.push(nuevoUsuario);
    console.log(usuarios);
    return res.status(201).send({ status: "ok", message: `Usuario ${nuevoUsuario.user} agregado`, redirect: "/" });
}

export const methods = {
    login,
    register
};