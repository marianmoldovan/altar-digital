// importar paquete de npm express
const express = require("express");
// y crear una nueva aplicación dentro de la variable app
const app = express();



// compartir acceso a todos los archivos dentro del directorio "public"
// más información en documentación: https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// crear una ruta para servir el documento HTML principal de la página
// más información en documentación: https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/index.html");
});

// // array con datos de prueba
// const data = [1934, 232, 57.54];
// mandar array con datos de prueba a página
// app.get("/data", (request, response) => {
//   // express helps us take JS objects and send them as JSON
//   response.json(data);
// });

// escuchar solicitudes de conexión (clientes en browser)
const listener = app.listen(process.env.PORT, () => {
  console.log("Conectando por puerto: " + listener.address().port);
});
