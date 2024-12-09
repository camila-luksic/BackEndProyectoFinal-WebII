const db = require("../models");
const { isRequestValid, sendError500 } = require("../utils/request.utils");
const { Op } = require('sequelize');
// Estados del servidor
//200 -> ok
//201 -> creado
//400 -> validaciones
//401 -> no autorizado
//403 -> prohibido
//404 -> no encontrado
//500 -> errores del servidor
exports.listMunicipio = async (req, res) => {
    try {
        const municipios = await db.municipios.findAll( {include: [
          {
            model: db.usuario,
            as: "creador", 
            attributes: [ "email"],
        },{
            model: db.usuario,
            as: "editor",
            attributes: [ "email"],
        },
          ],});
        res.json(municipios);
    } catch (error) {
        sendError500(error);
    }
}

exports.getMunicipioById = async (req, res) => {
    const id = req.params.id;
    try {
        const municipio = await getMunicipioOr404(id, res);
        if (!municipio) {
            return;
        }
        res.json(municipio);
    } catch (error) {
        sendError500(error);
    }
}

exports.buscarMunicipio = async (req, res) => {
    console.log(req.query);
    try {
        const { q } = req.query;
        console.log("Q:", q);

        if (!q) {
            return res.status(400).json({ error: 'Debe proporcionar un término de búsqueda.' });
        }

        const resultados = await db.municipios.findAll({
            where: {
                [Op.or]: [
                    { nombre: { [Op.like]: `%${q}%` } }
                ]
            }

        });
        console.log("R--" + resultados);
        if (resultados.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron pokémones.' });
        }

        res.status(200).json(resultados);
        return resultados;

    } catch (error) {
        console.error('Error al buscar Municipio:', error);
        res.status(500).json({ error: 'Error al buscar Municipio' });
    }
};


exports.createMunicipio = async (req, res) => {
    const requiredFields = ['nombre','latitud','longitud'];
    console.log("---"+req.body);
    if (!isRequestValid(requiredFields, req.body, res)) {
        return;
    }
    try {

        const municipio = {
            nombre:req.body.nombre,
            latitud: req.body.latitud,
            longitud:req.body.longitud,
            createdBy: req.body.userId
        }
        console.log("--"+req.body);

        const municipioCreada = await db.municipios.create(municipio);

        res.status(201).json(municipioCreada);
    } catch (error) {
        sendError500(error);
    }
}
exports.updateMunicipioPatch = async (req, res) => {

    const id = req.params.id;
    try {
        const municipio = await getMunicipioOr404(id, res);
        if (!municipio) {
            return;
        }
        municipio.nombre=req.body.nombre ||municipio.nombre;
        municipio.latitud = req.body.latitud || municipio.latitud;
        municipio.longitud=req.body.longitud || municipio.longitud;

        await municipio.save();
        res.json(municipio);
    } catch (error) {
        sendError500(error);
    }
}
exports.updateMunicipioPut = async (req, res) => {
    const id = req.params.id;
    try {
        const municipio = await getMunicipioOr404(id, res);
        if (!municipio) {
            return;
        }
        const requiredFields = ['nombre','latitud','longitud'];
        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }
        municipio.nombre=req.body.nombre;
        municipio.latitud = req.body.latitud;
        municipio.longitud=req.body.longitud;
        municipio.updatedBy= req.body.userId;

        await municipio.save();

        res.json(municipio);
    } catch (error) {
        sendError500(error);
    }
}
exports.deleteMunicipio = async (req, res) => {
    const id = req.params.id;
    try {
        const municipio = await getMunicipioOr404(id, res);
        if (!municipio) {
            return;
        }
        await municipio.destroy();
        res.json({
            msg: 'Municipio eliminado correctamente'
        });
    } catch (error) {
        sendError500(error);
    }
}
async function getMunicipioOr404(id, res) {
    const municipio = await db.municipios.findByPk(id);
    if (!municipio) {
        res.status(404).json({
            msg: 'Municipio no encontrado'
        });
        return;
    }
    return municipio;
}