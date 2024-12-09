module.exports = (sequelize, Sequelize) => {
    const Municipio = sequelize.define("municipio", {
        nombre: {
            type: Sequelize.STRING,
            allowNull: false
        },
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
    return Municipio;
}