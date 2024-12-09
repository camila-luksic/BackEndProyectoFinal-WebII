module.exports = (sequelize, Sequelize) => {
    const Puntos_carreteras = sequelize.define("puntos_carreteras", {
        puntoId: {
            type: Sequelize.INTEGER,
            primaryKey:true,
            references: {
                model: 'puntos',
                key: 'id'
            },
            onUpdate: 'CASCADE',  
            onDelete: 'CASCADE' 
        },
        carreteraId: {
            type: Sequelize.INTEGER,
            primaryKey:true,
            references: {
                model: 'carretera',
                key: 'id'
            },
            onUpdate: 'CASCADE', 
            onDelete: 'CASCADE' 
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
    

    return Puntos_carreteras;
}
