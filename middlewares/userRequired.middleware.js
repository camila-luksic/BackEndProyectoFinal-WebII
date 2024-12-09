const db = require("../models");

exports.userRequiredMiddleware = async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const bearer = authorization.split(' ')[0];
    if (bearer !== 'Bearer') {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    authToken = await db.tokens.findOne({
        where: { token },
        include: ['usuario']
    });
    if (!authToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = authToken.usuario;
    next();
}