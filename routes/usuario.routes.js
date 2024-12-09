
const { userRequiredMiddleware } = require("../middlewares/userRequired.middleware.js");

module.exports = app => {
    let router = require("express").Router();
    const controller =
        require("../controllers/user.controller.js");

    router.get('/', controller.listUsuarios);
    router.get('/:id', controller.getUsuarioById);
    router.post('/', controller.createUsuario);
    
    router.put('/:id/cambiar-contrasena',controller.changePassword);
    router.put('/:id', controller.updateUsuarioPut);
    router.patch('/:id', controller.updateUsuarioPatch);
    router.delete('/:id', controller.deleteUsuario);
    app.use('/usuarios', router);

};
