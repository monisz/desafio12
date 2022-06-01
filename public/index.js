const socket = io();

socket.on('lista', (products) => {
    console.log("productos en cliente", products )
    const obtenerDatos = async () => {
        const response = await fetch('/views/layouts/index.hbs')
            .then(res => res.text())
            .then(res => console.log(res))
        
        console.log("respuesta del fetch", response)
        document.getElementById('listaProductos').innerHTML = products;
    }
    obtenerDatos()
});

document.getElementById('send').addEventListener('click', () => {
    const title = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const thumbnail = document.getElementById('image').value;
    const product = {title, price, thumbnail};
    socket.emit('message', product);
    document.getElementById('form').reset();
})