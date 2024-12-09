module.exports = (sequelize, Sequelize) => {
    const Incidente = sequelize.define("incidente", {
        latitud: {
            type: Sequelize.STRING,
            allowNull: false
        },
        longitud: {
            type: Sequelize.STRING,
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
    return Incidente;
}