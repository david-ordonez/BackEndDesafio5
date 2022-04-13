const express = require('express');
const handlebars = require('express-handlebars');
const ProductosApi = require('../api/productos');


const PORT = 8080;
const app = express();
const productosApi = new ProductosApi();

app.engine(
    'hbs',
    handlebars({
        extname: '.hbs',
        defaultLayout: 'index.hbs',
        layoutsDir: '../views/layouts',
        partialsDir: '../views/partials',
        helpers: { 
            currencyFormat(price) {
                return new Intl.NumberFormat('es-MX',{ style: 'currency', currency: 'MXN' }).format(price);
            }
        }
    })
);

app.set('view engine', 'hbs');
app.set('views', '../views');
app.use(express.static('../public'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.sendFile('index');
});

app.post('/api/productos',(req,res) => {
    const newProducto = req.body;
    if (newProducto)
        productosApi.guardar(newProducto);
    return res.redirect('/listaproductos')
});

app.get('/listaproductos',(req,res) => {
    const listaProductos = productosApi.listarAll();
    const productosExists = listaProductos.length > 0;
    res.render('listaProductos', { productos: listaProductos, productosExists: productosExists });
});

app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${PORT}`);
});

app.on('error', error => console.log(`Error en servidor ${error}`));