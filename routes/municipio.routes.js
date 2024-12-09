
const { userRequiredMiddleware } = require("../middlewares/userRequired.middleware.js");

module.exports = app => {
    let router = require("express").Router();
    const controller =
        require("../controllers/municipio.controller.js");

    router.get('/', controller.listMunicipio);
    router.get("/buscar",controller.buscarMunicipio);
    router.get('/:id', controller.getMunicipioById);
    router.post('/', controller.createMunicipio);
    router.put('/:id', controller.updateMunicipioPut);
    router.patch('/:id', controller.updateMunicipioPatch);
    router.delete('/:id', controller.deleteMunicipio);
    app.use('/municipios', router);

};
