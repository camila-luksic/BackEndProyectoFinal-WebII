const dbConfig=require("../config/db.config.js");
const Sequelize=require("sequelize");
const sequelize=new Sequelize(
    dbConfig.Db,
    dbConfig.User,
    dbConfig.Password,
    {
        host:dbConfig.Host,
        port:dbConfig.Port,
        dialect:"mysql",
    }
);

const db={};
db.Sequelize=Sequelize;
db.sequelize=sequelize;
db.municipios=require("./municipio.model.js")(sequelize,Sequelize);
db.puntos=require("./punto.model.js")(sequelize,Sequelize);
db.carreteras=require("./carretera.model.js")(sequelize,Sequelize);
db.puntos_carreteras=require("./puntos-carreteras.model.js")(sequelize,Sequelize);
db.usuario=require("./usuario.model.js")(sequelize,Sequelize);
db.tokens=require("./auth.token.model.js")(sequelize,Sequelize);
db.incidentes=require("./incidente.model.js")(sequelize,Sequelize);
db.solicitudIncidentes=require("./solicitudIncidente.js")(sequelize,Sequelize);

db.usuario.hasMany(db.tokens, { as: "tokens" });
db.tokens.belongsTo(db.usuario, {
    foreignKey: "usuarioId",
    as: "usuario",
});
db.carreteras.belongsTo(db.municipios, {
    as: 'Origen',
    foreignKey: 'municipioOrigenId'
    });
db.carreteras.belongsTo(db.municipios, {
    as: 'Destino',
    foreignKey: 'municipioDestinoId'
    });

db.carreteras.hasMany(db.incidentes, { foreignKey: 'carreteraIncidenteId' });

db.puntos.belongsToMany(db.carreteras, {
    through: 'puntos_carreteras',
    as: "carreteras",
    foreignKey: "puntoId"
});
db.carreteras.belongsToMany(db.puntos, {
    through: "puntos_carreteras",
    as: "puntos",
    foreignKey: "carreteraId"
});


db.municipios.belongsTo(db.usuario, { as: 'creador', foreignKey: 'createdBy' });
db.municipios.belongsTo(db.usuario, { as: 'editor', foreignKey: 'updatedBy' });

db.carreteras.belongsTo(db.usuario, { as: 'creador', foreignKey: 'createdBy' });
db.carreteras.belongsTo(db.usuario, { as: 'editor', foreignKey: 'updatedBy' });


db.puntos_carreteras.belongsTo(db.usuario, { as: 'creador', foreignKey: 'createdBy' });
db.puntos_carreteras.belongsTo(db.usuario, { as: 'editor', foreignKey: 'updatedBy' });


db.incidentes.belongsTo(db.usuario, { as: 'creador', foreignKey: 'createdBy' });
db.incidentes.belongsTo(db.usuario, { as: 'editor', foreignKey: 'updatedBy' });


db.puntos.belongsTo(db.usuario, { as: 'creador', foreignKey: 'createdBy' });
db.puntos.belongsTo(db.usuario, { as: 'editor', foreignKey: 'updatedBy' });


module.exports=db;
