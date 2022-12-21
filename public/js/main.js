const socket = io.connect()
// const Contenedor = require(".../Contenedor.js")
// const producto = new Contenedor("producto")

// Escucho los mensajes enviados por el servidor
socket.on("products", function (data) {
    console.log(data);
    renderizar(data)

});

function renderizar(data) {
    let html = data.map(function(prod, index){
        return (`<div>
        <strong>${prod.title}</strong>
        <strong>${prod.price}</strong>
        <strong>${prod.image}</strong>
        </div>
        `)
    }).join(" ");

    document.getElementById("productos").innerHTML = html
}

function addProducts(e) {
    let producto = {
        title: document.getElementById("title").value,
        price: document.getElementById("price").value,
        image: document.getElementById("image").value
    }
    socket.emit("newProduct", producto)
    document.getElementById("title").value = ""
    document.getElementById("price").value = ""
    document.getElementById("image").value = ""

    return false;
}