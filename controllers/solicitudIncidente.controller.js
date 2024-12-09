const { json } = require("sequelize");
const db = require("../models");
const { isRequestValid, sendError500 } = require("../utils/request.utils");
const path = require('path');
const fs = require('fs');
const solicitudIncidente = require("../models/solicitudIncidente");

// Estados del servidor
//200 -> ok
//201 -> creado
//400 -> validaciones
//401 -> no autorizado
//403 -> prohibido
//404 -> no encontrado
//500 -> errores del servidor
exports.listSolicitud = async (req, res) => {
    try {
        const solicitud= await db.solicitudIncidentes.findAll();
        res.json(solicitud);
    } catch (error) {
        res.status(500).json({
            msg: error
        });
    }
}

exports.getSolicitudById = async (req, res) => {
    const id = req.params.id;
    try {
        const solicitud = await getSolicitudOr404(id, res);
        if (!solicitud) {
            return;
        }
        res.json(solicitud);
    } catch (error) {
        res.status(500).json({
            msg: error
        });
    }
}
exports.createSolicitud = async (req, res) => {
    const requiredFields = ['detalle'];
    if (!isRequestValid(requiredFields, req.body, res)) {
        return;
    }
    try{
        const solicitud = {
            detalle: req.body.detalle
        };

        const solicitudCreada = await db.solicitudIncidentes.create(solicitud);
        res.status(201).json({ id: solicitudCreada.id });
    } catch (error) {
        res.status(500).json({
            msg: error
        });
    }
};

exports.updateSolicitudPatch = async (req, res) => {
    const id = req.params.id;
    try {
        const solicitud = await getSolicitudOr404(id, res);
        if (!solicitud) {
            return;
        }
        const {detalle } = req.body;

        solicitud.detalle = req.body.detalle || solicitud.detalle;

        await solicitud.save();
        res.json(solicitud);
    } catch (error) {
        res.status(500).json({
            msg: error
        });
    }
}
exports.updateSolicitudPut = async (req, res) => {
    const id = req.params.id;
    try {
        const solicitud = await getSolicitudOr404(id, res);
        if (!solicitud) {
            return;
        }
        const requiredFields = ['detalle'];
        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }
        const {detalle } = req.body;


        solicitud.detalle = req.body.detalle;
        await solicitud.save();

        res.json(solicitud);
    } catch (error) {
        res.status(500).json({
            msg: error
        });
    }
}
exports.deleteSolicitud = async (req, res) => {
    const id = req.params.id;
    try {
        const solicitud = await getSolicitudOr404(id, res);
        if (!solicitud) {
            return;
        }
        await solicitud.destroy();
        res.json({
            msg: 'solicitud eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            msg: error
        });
    }
}
async function getSolicitudOr404(id, res) {
    const solicitud = await db.solicitudIncidentes.findByPk(id);
    if (!solicitud) {
        res.status(404).json({
            msg: ' Solicitud de solicitud no encontrado'
        });
        return;
    }
    return solicitud;
}

exports.subirImagenBloqueo = async function (req, res) {
    const id = req.params.id;
    console.log("---"+id)
    if (!req.files?.imagen) {
        return res.status(400).json({ message: 'Debe seleccionar una imagen' });
    }

    const imagen = req.files.imagen;
    const imagenDir = path.join(__dirname, '/../public/imagenes/solicitudIncidente');

    if (!fs.existsSync(imagenDir)) {
        fs.mkdirSync(imagenDir, { recursive: true });
    }

    const filePath = path.join(imagenDir, `${id}.jpg`);

    imagen.mv(filePath, async function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error al subir la imagen' });
        }

        const pathRelativo = `/public/imagenes/solicitudIncidente/${id}.jpg`;

        res.json({ message: 'Imagen subida exitosamente', ruta: pathRelativo });
    });
};