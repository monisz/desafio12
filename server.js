const express = require('express');
const { engine } = require('express-handlebars');
const { Server: HttpServer } = require('http');
const { Server: SocketServer } = require('socket.io');
const fs = require('fs');

const messages = [];
const fileMessages = "mensajes.txt";
fs.writeFileSync(fileMessages, "[]");

const app = express();
const httpServer = new HttpServer(app);
const ioServer = new SocketServer(httpServer);

const Container = require('./container');
const fileName = new Container ("productos.txt");

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
    'hbs',
    engine({
      extname: '.hbs',
      defaultLayout: 'index.hbs',
    })
);

app.set('views', './public/views');
app.set('view engine', 'hbs');

//Vista de todos los productos
app.get('/', (req, res) => {
    const getProducts = async () => {
        const products = await fileName.getAll();
        res.render('main', {products});
    };
    getProducts();
});


//Para agregar un producto
app.post('/productos', (req, res) => {
    const newProduct = req.body;
    const getProducts = async () => {
        const newId = await fileName.save(newProduct);
    };
    getProducts();
    res.redirect('/');
});


//Para guardar el nuevo mensaje en el archivo de mensajes
const saveMessage = (message) => {
    const content = fs.readFileSync(fileMessages, 'utf-8');
    const contentParse = JSON.parse(content);
    contentParse.push(message);
    fs.writeFileSync(fileMessages, JSON.stringify(contentParse, null, 2));
}


httpServer.listen(8080, () => {
    console.log("escuchando desafio 12");
});


ioServer.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    socket.emit('messages', messages);

    socket.on("newMessage", (message) => {
        messages.push(message);
        ioServer.sockets.emit("messages", messages);
        saveMessage(message);
    })    
})
