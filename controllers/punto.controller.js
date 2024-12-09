const db = require("../models");
const { isRequestValid, sendError500 } = require("../utils/request.utils");
// Estados del servidor
//200 -> ok
//201 -> creado
//400 -> validaciones
//401 -> no autorizado
//403 -> prohibido
//404 -> no encontrado
//500 -> errores del servidor
exports.listPunto = async (req, res) => {
    try {
        const puntos = await db.puntos.findAll();
        res.json(puntos);
    } catch (error) {
        sendError500(error);
    }
}

exports.getPuntoById = async (req, res) => {
    const id = req.params.id;
    try {
        const punto = await getPuntoOr404(id, res);
        if (!punto) {
            return;
        }
        res.json(punto);
    } catch (error) {
        sendError500(error);
    }
}
exports.createPuntos = async (req, res) => {
    const { puntos } = req.body;

    if (!Array.isArray(puntos) || puntos.length === 0) {
        return res.status(400).json({ message: "puntos debe ser un array y no puede estar vacío." });
    }

    try {
        const promesas = puntos.map(async (puntoData) => {
            const punto = await db.puntos.create(puntoData);
            return punto;
        });

        const puntosCreados = await Promise.all(promesas);

        return res.status(201).json({ message: "Puntos creados correctamente.", puntos: puntosCreados });
    } catch (error) {
        console.error('Error al crear puntos:', error);
        return res.status(500).json({ message: "Error al crear puntos." });
    }
};


exports.updatePuntoPatch = async (req, res) => {
    const id = req.params.id;
    try {
        const punto = await getPuntoOr404(id, res);
        if (!punto) {
            return;
        }
        punto.latitud = req.body.latitud || punto.latitud;
        punto.longitud=req.body.longitud || punto.longitud;

        await punto.save();
        res.json(punto);
    } catch (error) {
        sendError500(error);
    }
}
exports.updatePuntoPut = async (req, res) => {
    const id = req.params.id;
    try {
        const punto = await getPuntoOr404(id, res);
        if (!punto) {
            return;
        }
        const requiredFields = ['latitud','longitud'];
        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }
        punto.latitud = req.body.latitud;
        punto.longitud=req.body.longitud;
        

        await punto.save();

        res.json(punto);
    } catch (error) {
        sendError500(error);
    }
}
exports.deletePunto = async (req, res) => {
    const id = req.params.id;
    try {
        const punto = await getPuntoOr404(id, res);
        if (!punto) {
            return;
        }
        await punto.destroy();
        res.json({
            msg: 'Punto eliminado correctamente'
        });
    } catch (error) {
        sendError500(error);
    }
}
async function getPuntoOr404(id, res) {
    const punto = await db.puntos.findByPk(id);
    if (!punto) {
        res.status(404).json({
            msg: 'Punto no encontrado'
        });
        return;
    }
    return punto;
}