const { json } = require("sequelize");
const db = require("../models");
const { isRequestValid, sendError500 } = require("../utils/request.utils");
const path = require('path');
const fs = require('fs');

// Estados del servidor
//200 -> ok
//201 -> creado
//400 -> validaciones
//401 -> no autorizado
//403 -> prohibido
//404 -> no encontrado
//500 -> errores del servidor
exports.listIncidente = async (req, res) => {
    try {
        const incidentes = await db.incidentes.findAll();
        res.json(incidentes);
    } catch (error) {
        sendError500(error);
    }
}

exports.getIncidenteById = async (req, res) => {
    const id = req.params.id;
    try {
        const incidente = await getIncidenteOr404(id, res);
        if (!incidente) {
            return;
        }
        res.json(incidente);
    } catch (error) {
        sendError500(error);
    }
}
exports.createIncidente = async (req, res) => {
    const requiredFields = ['carreteraIncidenteId','latitud','longitud'];
    if (!isRequestValid(requiredFields, req.body, res)) {
        return;
    }

    const { carreteraIncidenteId,latitud,longitud } = req.body;
    console.log("body"+req.body)
    try {
        console.log("///"+carreteraIncidenteId)
        const carreteraIncidenteIdEncontrado = await db.carreteras.findByPk(carreteraIncidenteId);
        console.log("----"+carreteraIncidenteIdEncontrado)
        if (!carreteraIncidenteIdEncontrado) {
            return res.status(404).json({ message: "Carretera no encontrada." });
        }

        const incidente = {
            latitud: req.body.latitud,
            longitud:req.body.longitud,
            carreteraIncidenteId: carreteraIncidenteId,

        };

        const incidenteCreada = await db.incidentes.create(incidente);
        res.status(201).json(incidenteCreada);
    } catch (error) {
        sendError500(error);
    }
};

exports.updateIncidentePatch = async (req, res) => {
    const id = req.params.id;
    try {
        const incidente = await getIncidenteOr404(id, res);
        if (!incidente) {
            return;
        }
        const { carreteraInicidenteId,latitud,longitud } = req.body;

        const carreteraIncidenteIdEncontrado = await db.carreteras.findByPk(carreteraInicidenteId);
        if (!carreteraIncidenteIdEncontrado) {
            return res.status(404).json({ message: "Carretera no encontrada." });
        }

        incidente.latitud = req.body.latitud || incidente.latitud;
        incidente.longitud=req.body.longitud||incidente.longitud;
        incidente.carreteraInicidenteId=req.body.carreteraInicidenteId || incidente.carreteraInicidenteId;

        await incidente.save();
        res.json(incidente);
    } catch (error) {
        return res.status(500).json(error);
    }
}
exports.updateIncidentePut = async (req, res) => {
    const id = req.params.id;
    try {
        const incidente = await getincidenteOr404(id, res);
        if (!incidente) {
            return;
        }
        const requiredFields = ['latitd','longitud','carreteraIncidenteId'];
        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }
        const { carreteraInicidenteId,latitud,longitud } = req.body;

        const carreteraIncidenteIdEncontrado = await db.carreteras.findByPk(carreteraInicidenteId);
        if (!carreteraIncidenteIdEncontrado) {
            return res.status(404).json({ message: "Carretera no encontrada." });
        }
        incidente.latitud = req.body.latitud;
        incidente.longitud=req.body.longitud;
        incidente.carreteraInicidenteId=req.body.carreteraInicidenteId;

        await incidente.save();

        res.json(incidente);
    } catch (error) {
        sendError500(error);
    }
}
exports.deleteIncidente = async (req, res) => {
    const id = req.params.id;
    try {
        const incidente = await getIncidenteOr404(id, res);
        if (!incidente) {
            return;
        }
        await incidente.destroy();
        res.json({
            msg: 'Incidente eliminado correctamente'
        });
    } catch (error) {
        sendError500(error);
    }
}
async function getIncidenteOr404(id, res) {
    const incidente = await db.incidentes.findByPk(id);
    if (!incidente) {
        res.status(404).json({
            msg: 'Incidente no encontrado'
        });
        return;
    }
    return incidente;
}

exports.subirImagenBloqueo = async function (req, res) {
    const id = req.params.id;
    const carretera = await db.carreteras.findByPk(id);
    if (!carretera) {
        return res.status(404).json({ message: 'Carretera no encontrada' });
    }
    if (!req.files?.imagen) {
        return res.status(400).json({ message: 'Debe seleccionar una imagen' });
    }

    const imagen = req.files.imagen;
    const imagenDir = path.join(__dirname, '/../public/imagenes/carreterasBloqueadas');

    if (!fs.existsSync(imagenDir)) {
        fs.mkdirSync(imagenDir, { recursive: true });
    }

    const filePath = path.join(imagenDir, `${carretera.id}.jpg`);

    imagen.mv(filePath, async function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error al subir la imagen' });
        }

        const pathRelativo = `/public/imagenes/carreterasBloqueadas/${carretera.id}.jpg`;

        res.json({ message: 'Imagen subida exitosamente', ruta: pathRelativo });
    });
};