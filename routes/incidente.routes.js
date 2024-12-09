
const { userRequiredMiddleware } = require("../middlewares/userRequired.middleware.js");

module.exports = app => {
    let router = require("express").Router();
    const controller =
        require("../controllers/incidente.controller");

    router.get('/', controller.listIncidente);
    router.get('/:id', controller.getIncidenteById);
    router.post('/', controller.createIncidente);
    router.put('/:id', controller.updateIncidentePut);
    router.patch('/:id', controller.updateIncidentePatch);
    router.delete('/:id', controller.deleteIncidente);
    router.post("/:id/imagen",controller.subirImagenBloqueo);
    app.use('/incidentes', router);

};
