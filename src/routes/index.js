const {Router} = require('express')
const ProductosRouter = require('./productos')


const rutaPrincipal = Router();


rutaPrincipal.use('/productos',ProductosRouter)
module.exports = rutaPrincipal;
