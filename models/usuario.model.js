module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define("usuario", {
        email: {
            type: Sequelize.STRING,
            unique: true
        },
        rol: {
            type: Sequelize.STRING
        },

        password: {
            type: Sequelize.STRING
        }
    }, {
        defaultScope: {
            attributes: { exclude: ['password'] },
        },
    });
    return Usuario;
}