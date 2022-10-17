const {Router}  = require('express')
const fs = require('fs/promises');
const path = require('path');

const filePath  = path.resolve(__dirname, '../../productos.json')

const rutaProducto = Router()

const middleWareEndpointParticular = (req, res, next) => {
	console.log('ESTO SE EJECUTA SOLAMEMTE CON EL GET ALL')
	next();
}


rutaProducto.get('/', middleWareEndpointParticular, async (req, res) => {
	const fileData = await fs.readFile(filePath, 'utf-8');
	const productos = JSON.parse(fileData);
	res.json({
		data: productos,
	});
});

rutaProducto.get('/:id', async (req, res) => {
	const id = req.params.id
	const fileData = await fs.readFile(filePath, 'utf-8');
	const productos = JSON.parse(fileData);

	const indice = productos.findIndex(unProducto => unProducto.id == id);

	if(indice < 0){
		return res.status(404).json({
			msg: "El productos no existe"
		})
	}

	res.json({
		msg: `devolviendo el productos con id ${id}`,
		data: productos[indice]
	});
});


rutaProducto.post('/', async (req, res) => {
	const data = req.body;
	console.log(req.body);

	const { titulo, precio, thubnail } = data;

	if(!titulo || !precio || !thubnail) {
        console.log({ titulo, precio, thubnail })
		return res.status(400).json({
			// msg: "Campos invalidos :( "
			msg: `Campos invalidos :( `
		})
	}

	const fileData = await fs.readFile(filePath, 'utf-8');
	const productos = JSON.parse(fileData);
    
    let id 
    
    if (!productos) {
        id = 1
    } 
    else{
        id = productos[productos.length-1].id + 1
    }
    
    const nuevoProduccto = {titulo,precio,thubnail,id}

	productos.push(nuevoProduccto);

	await fs.writeFile(filePath, JSON.stringify(productos, null, '\t'));

	res.json({
		msg: 'ok',
		data: nuevoProduccto
	})
});

rutaProducto.put('/:id', async (req, res) => {
	const id = req.params.id;
    const data = req.body;
	const { titulo, precio, thubnail} = data;

	const fileData = await fs.readFile(filePath, 'utf-8');
	const productos = JSON.parse(fileData);

	const indice = productos.findIndex(unProducto => unProducto.id == id);

	if(indice < 0){
		return res.status(404).json({
			msg: "el usuario no existe"
		})
	}

	if(!titulo || !precio || !thubnail) {
		return res.status(400).json({
			msg: "Campos invalidos :( "
		})
	}

	const productoActualizado = {
		id: productos[indice].id,
		titulo,
		precio,
		thubnail
	}

	productos.splice(indice, 1, productoActualizado);

	await fs.writeFile(filePath, JSON.stringify(productos, null, '\t'));

	//actualizar
	res.json({
		msg: `Modificando objet con id ${id}`,
		data: productoActualizado,
	})
});

rutaProducto.delete('/:id', async (req, res) => {
	const id = req.params.id;
	const fileData = await fs.readFile(filePath, 'utf-8');
	const productos = JSON.parse(fileData);

	const indice = productos.findIndex(unProducto => unProducto.id == id);

	if(indice < 0){
		return res.json({
			msg: "ok"
		})
	}

	productos.splice(indice, 1);
	await fs.writeFile(filePath, JSON.stringify(productos, null, '\t'));

	//borrar
	res.json({
		msg: `Borrando producto con id ${id}`,
	})
})




module.exports = rutaProducto;