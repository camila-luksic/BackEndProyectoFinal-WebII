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
exports.listCarretera = async (req, res) => {
    try {
        const carreteras = await db.carreteras.findAll({
            include: [
              {
                model: db.puntos,
                as:"puntos"
              },
              {
                model: db.usuario,
                as: "creador", 
                attributes: [ "email"],
            },
              {
                model: db.usuario,
                as: "editor", 
                attributes: [ "email"],
            },
            ],
          });
        res.json(carreteras);
    } catch (error) {
        sendError500(error);
    }
}

exports.getCarreteraById = async (req, res) => {
    const id = req.params.id;
    try {
        const carretera = await getCarreteraOr404(id, res);
        if (!carretera) {
            return;
        }
        res.json(carretera);
    } catch (error) {
        sendError500(error);
    }
}
exports.createCarretera = async (req, res) => {
    const requiredFields = ['nombre', 'municipioOrigen', 'municipioDestino', 'estado',"idTipoBloqueo"];
    if (!isRequestValid(requiredFields, req.body, res)) {
        return;
    }

    const { municipioOrigen, municipioDestino } = req.body;

    try {
        const municipioOrigenEncontrado = await db.municipios.findByPk(municipioOrigen);
        if (!municipioOrigenEncontrado) {
            return res.status(404).json({ message: "Municipio de origen no encontrado." });
        }

        const municipioDestinoEncontrado = await db.municipios.findByPk(municipioDestino);
        if (!municipioDestinoEncontrado) {
            return res.status(404).json({ message: "Municipio de destino no encontrado." });
        }

        const carretera = {
            nombre: req.body.nombre,
            municipioOrigenId: municipioOrigen,
            municipioDestinoId: municipioDestino,
            estado: req.body.estado,
            idTipoBloqueo:req.body.idTipoBloqueo,
            createdBy:req.body.userId
        };

        const carreteraCreada = await db.carreteras.create(carretera);
        res.status(201).json(carreteraCreada);
    } catch (error) {
        sendError500(error);
    }
};

exports.updateCarreteraPatch = async (req, res) => {
    const id = req.params.id;
    try {
        const carretera = await getCarreteraOr404(id, res);
        if (!carretera) {
            return;
        }
        const { municipioOrigen, municipioDestino } = req.body;
            const municipioOrigenEncontrado = await db.municipios.findByPk(municipioOrigen);
            if (!municipioOrigenEncontrado) {
                return res.status(404).json({ message: "Municipio de origen no encontrado." });
            }
    
            const municipioDestinoEncontrado = await db.municipios.findByPk(municipioDestino);
            if (!municipioDestinoEncontrado) {
                return res.status(404).json({ message: "Municipio de destino no encontrado." });
            }
        carretera.nombre = req.body.nombre || carretera.nombre;
        carretera.municipioOrigen=req.body.municipioOrigen || carretera.municipioOrigen;
        carretera.municipioDestino=req.body.municipioDestino || carretera.municipioDestino;
        carretera.estado=req.body.estado || carretera.estado;
        carretera.idTipoBloqueo=req.body.idTipoBloqueo || carretera.idTipoBloqueo;

        await carretera.save();
        res.json(carretera);
    } catch (error) {
        return res.status(500).json(error);
    }
}
exports.updateCarreteraPut = async (req, res) => {
    const id = req.params.id;
    try {
        const carretera = await getCarreteraOr404(id, res);
        if (!carretera) {
            return;
        }
        const requiredFields = ['nombre','municipioOrigen','municipioDestino','estado','idTipoBloqueo'];
        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }
        const { municipioOrigen, municipioDestino } = req.body;
            const municipioOrigenEncontrado = await db.municipios.findByPk(municipioOrigen);
            if (!municipioOrigenEncontrado) {
                return res.status(404).json({ message: "Municipio de origen no encontrado." });
            }
    
            const municipioDestinoEncontrado = await db.municipios.findByPk(municipioDestino);
            if (!municipioDestinoEncontrado) {
                return res.status(404).json({ message: "Municipio de destino no encontrado." });
            }
        carretera.nombre = req.body.nombre;
        carretera.municipioOrigen=req.body.municipioOrigen;
        carretera.municipioDestinoId = req.body.municipioDestino;


        carretera.estado=req.body.estado;
        carretera.idTipoBloqueo = req.body.idTipoBloqueo;
        

        await carretera.save();

        res.json(carretera);
    } catch (error) {
        sendError500(error);
    }
}
exports.deleteCarretera = async (req, res) => {
    const id = req.params.id;
    try {
        const carretera = await getCarreteraOr404(id, res);
        if (!carretera) {
            return;
        }
        await carretera.destroy();
        res.json({
            msg: 'Carretera eliminado correctamente'
        });
    } catch (error) {
        sendError500(error);
    }
}
async function getCarreteraOr404(id, res) {
    const carretera = await db.carreteras.findByPk(id);
    if (!carretera) {
        res.status(404).json({
            msg: 'Carretera no encontrado'
        });
        return;
    }
    return carretera;
}

exports.insertPuntos = async (req, res) => {
    const carreteraId = req.params.id;
    const { puntosIds } = req.body;

    if (!Array.isArray(puntosIds) || puntosIds.length === 0) {
        return res.status(400).json({ message: "puntosIds debe ser un array y no puede estar vacío." });
    }

    try {
        const carretera = await db.carreteras.findByPk(carreteraId);
        if (!carretera) {
            return res.status(404).json({ message: "Carretera no encontrada." });
        }

        const promesas = puntosIds.map(async (puntoId) => {
            const punto = await db.puntos.findByPk(puntoId);
            if (!punto) {
                return res.status(404).json({ message: `Punto con ID ${puntoId} no encontrado.` });
            }

            const existeRelacion = await db.puntos_carreteras.findOne({
                where: { carreteraId, puntoId }
            });

            if (!existeRelacion) {
                return db.puntos_carreteras.create({ carreteraId, puntoId });
            }
        });

        await Promise.all(promesas);

        return res.status(200).json({ message: "Puntos agregados correctamente." });
    } catch (error) {
        console.error('Error al agregar puntos a la carretera:', error);
        return res.status(500).json({ message: "Error al agregar puntos." });
    }
};
