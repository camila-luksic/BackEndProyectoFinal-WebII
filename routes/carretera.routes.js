
const { userRequiredMiddleware } = require("../middlewares/userRequired.middleware.js");

module.exports = app => {
    let router = require("express").Router();
    const controller =
        require("../controllers/carretera.controller.js");

    router.get('/', controller.listCarretera);
    router.get('/:id', controller.getCarreteraById);
    router.post('/', controller.createCarretera);
    router.put('/:id', controller.updateCarreteraPut);
    router.patch('/:id', controller.updateCarreteraPatch);
    router.delete('/:id', controller.deleteCarretera);
    router.post("/:id/punto",controller.insertPuntos);
    app.use('/carreteras', router);

};
