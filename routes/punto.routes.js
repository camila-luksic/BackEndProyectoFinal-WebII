
const { userRequiredMiddleware } = require("../middlewares/userRequired.middleware.js");

module.exports = app => {
    let router = require("express").Router();
    const controller =
        require("../controllers/punto.controller.js");

    router.get('/', controller.listPunto);
    router.get('/:id', controller.getPuntoById);
    router.post('/', controller.createPuntos);
    router.put('/:id', controller.updatePuntoPut);
    router.patch('/:id', controller.updatePuntoPatch);
    router.delete('/:id', controller.deletePunto);
    app.use('/puntos', router);

};
