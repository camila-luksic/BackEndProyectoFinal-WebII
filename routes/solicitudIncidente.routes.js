
const { userRequiredMiddleware } = require("../middlewares/userRequired.middleware");

module.exports = app => {
    let router = require("express").Router();
    const controller =
        require("../controllers/solicitudIncidente.controller.js");

    router.get('/', controller.listSolicitud);
    router.get('/:id', controller.getSolicitudById);
    router.post('/', controller.createSolicitud);
    router.put('/:id', controller.updateSolicitudPut);
    router.patch('/:id', controller.updateSolicitudPatch);
    router.delete('/:id', controller.deleteSolicitud);
    router.post("/:id/imagen",controller.subirImagenBloqueo);
    app.use('/solicitudIncidente', router);

};
