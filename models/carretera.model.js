module.exports = (sequelize, Sequelize) => {
    const Carretera = sequelize.define("carretera", {
        nombre: {
            type: Sequelize.STRING,
            allowNull: false
        },
        estado: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        idTipoBloqueo: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        createdBy: {
            type: Sequelize.INTEGER,
            references: {
              model: 'usuarios',
              key: 'id',
            },
          },
          updatedBy: {
            type: Sequelize.INTEGER,
            references: {
              model: 'usuarios',
              key: 'id',
            },
          },
        


    });
    return Carretera;
}