const express = require('express');
const { engine } = require('express-handlebars');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const app = express();
const httpServer = new HttpServer(app);
const ioServer = new IOServer(httpServer);

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
app.get('/productos', (req, res) => {
    const getProducts = async () => {
        const products = await fileName.getAll();
        res.render('main', {products})
    };
    getProducts();
});

/* const obtenerLista = async () => { */
/*     const response = await fetch(fileName,{ */
/*         method: "GET", */
/*     }); */
/*     const data = await response.json(); */
/*     console.log(data) */
/* } */
/*  */
/* obtenerLista(); */

/* document.getElementById("listaProductos").innerHTML = ` */
/* app.get('/productos', (req, res) => { */
/*     const getProducts = async () => { */
/*         const products = await fileName.getAll(); */
/*         res.render('main', {products}) */
/*     }; */
/*     getProducts(); */
/* }); */
/*  */
/* ` */

//Para redirigir al formulario de carga de productos
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/input.html');
})


//Para agregar un producto
app.post('/productos', (req, res) => {
    const newProduct = req.body;
    const getProducts = async () => {
        const newId = await fileName.save(newProduct);
        /* res.sendFile(__dirname + '/public/input.html'); */
    };
    getProducts();
});

httpServer.listen(3000, () => {
    console.log("escuchando desafio 12");
});

ioServer.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    const getProducts = async () => {
        const products = await fileName.getAll();
        ioServer.sockets.emit('lista', products);
    };
    getProducts();

    /* app.get('/', (req, res) => { */
    /*     const getProducts = async () => { */
    /*         const products = await fileName.getAll() */;
    /*         ioServer.sockets.emit('lista', products) */;
    /*     }; */
    /*     getProducts(); */
    /* }); */



    socket.on('message', (newProduct) => {
        const saveProduct = async () => {
            const newId = await fileName.save(newProduct);
        };
        saveProduct();
    });
    
    
    
    
    /* fetch(fileName) */
    /*     .then(res => res.json()) */
    /*     .then(res => console.log(data.title)) */
    
})



