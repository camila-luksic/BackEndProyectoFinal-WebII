const db = require("../models");
const { isRequestValid, sendError500 } = require("../utils/request.utils");
const sha1 = require('sha1');

exports.listUsuarios = async (req, res) => {
    try {
        const usuarios = await db.usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        sendError500(error);
    }
}

exports.getUsuarioById = async (req, res) => {
    const id = req.params.id;
    try {
        const usuario = await getUsuarioOr404(id, res);
        if (!usuario) {
            return;
        }
        res.json(usuario);
    } catch (error) {
        sendError500(error);
    }
}

exports.createUsuario = async (req, res) => {

    const requiredFields = ['email', 'password','rol'];
    if (!isRequestValid(requiredFields, req.body, res)) {
        return;
    }
    try {
        const email = req.body.email;
        const usuarioExistente = await db.usuario.findOne({
            where: {
                email: email
            }
        });
        if (usuarioExistente) {
            res.status(400).json({
                msg: 'El email ya está registrado'
            });
            return;
        }
        const usuario = {
            email: req.body.email,
            password: sha1(req.body.password),
            rol:req.body.rol
        }
        const usuarioCreada = await db.usuario.create(usuario);
        const usuarioRespuesta = await db.usuario.findByPk(usuarioCreada.id);

        res.status(201).json(usuarioRespuesta);
    } catch (error) {
        sendError500(error);
    }
}
exports.updateUsuarioPatch = async (req, res) => {
    const id = req.params.id;
    try {
        const usuario = await getUsuarioOr404(id, res);
        if (!usuario) {
            return;
        }
        const email = req.body.email;
        const usuarioExistente = await db.usuario.findOne(
            {
                where: {
                    email: email
                }
            }
        );
        if (usuarioExistente && usuarioExistente.id !== usuario.id) {
            res.status(400).json({
                msg: 'El email ya está registrado'
            });
            return;
        }
        usuario.email = req.body.email || usuario.email;

        await usuario.save();
        res.json(usuario);
    } catch (error) {
        sendError500(error);
    }
}
exports.updateUsuarioPut = async (req, res) => {
    const id = req.params.id;
    try {
        const usuario = await getUsuarioOr404(id, res);
        if (!usuario) {
            return;
        }
        const requiredFields = ['email','rol'];
        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }
        const email = req.body.email;
        const usuarioExistente = await db.usuario.findOne(
            {
                where: {
                    email: email
                }
            }
        );
        if (usuarioExistente && usuarioExistente.id !== usuario.id) {
            res.status(400).json({
                msg: 'El email ya está registrado'
            });
            return;
        }
        usuario.email = req.body.email;
        usuario.rol=req.body.rol;

        await usuario.save();

        res.json(usuario);
    } catch (error) {
        sendError500(error);
    }
}
exports.deleteUsuario = async (req, res) => {
    const id = req.params.id;
    try {
        const usuario = await getUsuarioOr404(id, res);
        if (!usuario) {
            return;
        }
        await usuario.destroy();
        res.json({
            msg: 'Usuario eliminada correctamente'
        });
    } catch (error) {
        sendError500(error);
    }
}
exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const id = req.params.id;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ msg: "Faltan datos en la solicitud" });
    }

    try {
        const usuario = await getUsuarioOr404(id, res);
        if (!usuario) {
            return;
        }
        const usuarioConPassword = await db.usuario.findByPk(id, {
            attributes: ['id', 'email', 'rol', 'password']
        });
        console.log("Contraseña almacenada en la base de datos:", usuarioConPassword.password);
        
        console.log("usuarioConPassword:", usuarioConPassword);
        if (!usuarioConPassword) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }
        console.log("Contraseña almacenada en la base de datos:", usuarioConPassword.password);

        const passwordHash = sha1(oldPassword);
        console.log("Hash de la contraseña antigua:", passwordHash);
        console.log("Comparando con la contraseña almacenada en la base de datos:", usuarioConPassword.password);

        if (usuarioConPassword.password !== passwordHash) {
            return res.status(400).json({ msg: "La contraseña antigua no es correcta" });
        }

        usuarioConPassword.password = sha1(newPassword);
        await usuarioConPassword.save();

        return res.json({ msg: "Contraseña cambiada correctamente" });
    } catch (error) {
        console.error("Error en el servidor:", error);
        return res.status(500).json({ msg: "Error en el servidor" });
    }
};

async function getUsuarioOr404(id, res) {
    const usuario = await db.usuario.findByPk(id);
    if (!usuario) {
        res.status(404).json({
            msg: 'Usuario no encontrado'
        });
        return;
    }
    return usuario;
}