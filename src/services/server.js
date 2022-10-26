const express = require ('express')
const MainRouter = require('../routes/index')
const path = require('path')
const fs = require('fs/promises');


const filePath  = path.resolve(__dirname, '../../productos.json')

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));


const viewsFolderPath = path.resolve(__dirname,'../../views');
app.set('view engine', 'ejs');
app.set('views', viewsFolderPath);


app.use('/api',MainRouter);

// app.use((err, req, res, next) => {

//     console.error(err.stack);
//     res.status(500).send({
//         msg: 'Se pudrio todo'
//     });
// });


const middleWareEndpointParticular = (req, res, next) => {
	console.log('ESTO SE EJECUTA SOLAMEMTE CON EL GET ALL')
	next();
}

app.get('/', (req, res) => {
  res.render('form'); // Se muestra la plantilla hello.pug
});

app.get('/', middleWareEndpointParticular, async (req, res) => {
	res.render('productos');
});


module.exports = app;

