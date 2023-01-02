const express = require('express')
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server)
const { engine } = require('express-handlebars')
const Contenedor = require("./Contenedor.js")
const mensajes = new Contenedor("mensajes")


app.use(express.static('public'))
app.engine("handlebars", engine())
app.set("views", "./views") //declarar extension y ubicacion
app.set("view engine", "handlebars") //declarar el motor y extension
app.use(express.urlencoded({ extended: true }))

//Carga de productos
let products = [];

io.on('connection', function (socket) {
    console.log('Un cliente se ha conectado');
    socket.emit('products', products);

    socket.on("newProduct", function (data) {
        products.push(data)
        io.sockets.emit("products", products)
    })
});

//Web Chat
let messages = [];

io.on('connection', function (socket) {
    socket.emit('messages', messages);
    socket.on("newMessage", function (data) {
        messages.push(data)
        io.sockets.emit("messages", messages)
        messages.map((elem) => {
            mensajes
                .save(elem)
                // .then((data) => res.send(data))
                .then(elem)
                .catch((error) => {
                    // res.send({ error: error.message })
                    console.log(error)
                })
        })
    })
});

//Ruta para cargar nuestro archivo index.html en la raiz de la misma
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname + "/views" })
})

const PORT = 8080
const srv = server.listen(PORT, () => console.log(`Servidor http con WebSocket escuchando el puerto ${srv.address().port}`))
srv.on("error", error => console.log(`Error en servidor ${server}`))