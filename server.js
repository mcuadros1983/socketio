const express = require('express')
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server)
const { engine } = require('express-handlebars')
const Contenedor = require("./Contenedor.js")
const mensajes = new Contenedor("mensajes")
const productos = new Contenedor("productos")


app.use(express.static('public'))
app.engine("handlebars", engine())
app.set("views", "./views") //declarar extension y ubicacion
app.set("view engine", "handlebars") //declarar el motor y extension
app.use(express.urlencoded({ extended: true }))

//Carga de productos
io.on('connection', async function (socket) {
    console.log('Un cliente se ha conectado');
    socket.emit('products',  await productos.getAll());
    socket.on("newProduct", async (data) => {
        await productos.save(data)
        io.sockets.emit("products", await productos.getAll())
    })
});

//Web Chat
io.on('connection', async function (socket) {
    socket.emit('messages',  await mensajes.getAll());
    socket.on("newMessage", async (data) => {
        await mensajes.save(data)
        io.sockets.emit("messages", await mensajes.getAll())
    })
});


//Ruta para cargar nuestro archivo index.html en la raiz de la misma
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname + "/views" })
})

const PORT = 8080
const srv = server.listen(PORT, () => console.log(`Servidor http con WebSocket escuchando el puerto ${srv.address().port}`))
srv.on("error", error => console.log(`Error en servidor ${server}`))