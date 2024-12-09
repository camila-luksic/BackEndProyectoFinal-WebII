module.exports = (sequelize, Sequelize) => {
    const solicitudIncidente = sequelize.define("solicitudincidente", {
        detalle: {
            type: Sequelize.STRING
        }
    });
    return solicitudIncidente;
}