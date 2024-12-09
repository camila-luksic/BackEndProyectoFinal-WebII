const sha1 = require('sha1');
const db = require('../models');
const { generateToken } = require('../utils/token.utils');
const { isRequestValid } = require('../utils/request.utils');

exports.login = async (req, res) => {
    const requiredFields = ['email', 'password'];
    if (!isRequestValid(requiredFields, req.body, res)) {
        return;
    }
    const email = req.body.email;
    const password = req.body.password;
    const usuario = await db.usuario.findOne({
        where: {
            email: email,
            password: sha1(password)
        }
    });

    if (!usuario) {
        res.status(401).json({
            msg: 'Unauthorized'
        });
        return;
    }

    const token = generateToken();
    await db.tokens.create({
        token: token,
        usuarioId: usuario.id
    });
    res.json({
        token: token
    });
}
exports.logout = async (req, res) => {
    const token = req.headers.authorization;
    console.log("----"+token)
    const splitToken = token.split(' ');
    await db.tokens.destroy({
        where: {
            token: splitToken[1]
        }
    });
    res.json({
        msg: 'Logout'
    });
}
exports.me = async (req, res) => {
    const token = req.headers.authorization;
    const splitToken = token.split(' ');

    const tokenObj = await db.tokens.findOne({
        where: {
            token: splitToken[1]
        }
    });
    if (!tokenObj) {
        res.status(401).json({
            msg: 'Unauthorized'
        });
        return;
    }
    const usuario = await db.usuario.findByPk(tokenObj.usuarioId);
    res.json(usuario);
}