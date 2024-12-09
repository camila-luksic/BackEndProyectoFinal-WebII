module.exports=app=>{

    require("./aut.routes.js")(app);
    require("./carretera.routes.js")(app);
    require("./municipio.routes.js")(app);
    require("./punto.routes.js")(app);
    require("./usuario.routes.js")(app)
    require("./incidente.routes.js")(app);
    require("./solicitudIncidente.routes.js")(app);
    
}