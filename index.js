
const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const fileUpload = require('express-fileupload');
const path = require('path');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const corsOptions = {
    origin: 'http://localhost:5173',
}
app.use(cors(corsOptions))
app.use('/public', express.static(path.join(__dirname, 'public')));



app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

const db = require("./models");

db.sequelize.sync({
     //force: true // drop tables and recreate
}).then(() => {
    console.log("db resync");
});


// middleware para validación de errores en JSON
app.use(function (error, req, res, next) {
    if (error instanceof SyntaxError) {
        res.status(400).json({
            msg: 'Error en el JSON'
        });
    } else {
        next();
    }
});

require('./routes')(app);

app.listen(3025, function () {
    console.log('Ingrese a http://localhost:3025')
})
//**Hecho**
//modelos
//relaciones
//controllers
//por postman
//Crea, muestra,edita, y elimina bien los municipios
//crea,muestra ,edita y elimina bien carreteras
//crea,muestra,edita y elimina  bien los puntos
//crea bien puntos-carreteras
//crea ,muestra,edita y elimina bien usuario con password  cifrada
//hace login y logout
//**Falta**

