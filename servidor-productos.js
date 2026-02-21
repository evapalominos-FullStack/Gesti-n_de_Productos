
const http = require('http');           
const fs = require('fs').promises;      
const fsSync = require('fs');           

const PORT = 3000;                      
const ARCHIVO_PRODUCTOS = 'productos.txt';  

async function leerProductos() {
    try {
        const contenido = await fs.readFile(ARCHIVO_PRODUCTOS, 'utf8');
        
        const lineas = contenido.split('\n').filter(linea => linea.trim() !== '');
        
        const productos = lineas.map(linea => {
            const [nombre, precio] = linea.split(',').map(item => item.trim());
            return {
                nombre: nombre,
                precio: parseInt(precio)
            };
        });
        
        return productos;
    } catch (error) {
        console.error('Error leyendo productos:', error);
        return [];
    }
}

async function agregarProducto(nombre, precio) {
    try {
        const nuevaLinea = `\n${nombre}, ${precio}`;
        
        await fs.appendFile(ARCHIVO_PRODUCTOS, nuevaLinea, 'utf8');
        
        return true;
    } catch (error) {
        console.error('Error agregando producto:', error);
        return false;
    }
}

function leerBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            resolve(body);
        });
        
        req.on('error', error => {
            reject(error);
        });
    });
}


const servidor = http.createServer(async (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    console.log(`📨 Petición recibida: ${req.method} ${req.url}`);
    
    if (req.method === 'GET' && req.url === '/productos') {
        try {
            const productos = await leerProductos();
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                exito: true,
                cantidad: productos.length,
                productos: productos
            }));
            
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                exito: false,
                mensaje: 'Error al leer productos'
            }));
        }
    }
    
    else if (req.method === 'POST' && req.url === '/productos') {
        try {
            const body = await leerBody(req);
            
            let datos;
            try {
                datos = JSON.parse(body);
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    exito: false,
                    mensaje: 'JSON inválido'
                }));
                return;
            }
            
            if (!datos.nombre || !datos.precio) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    exito: false,
                    mensaje: 'Faltan campos: nombre y/o precio'
                }));
                return;
            }
            
            const precio = parseInt(datos.precio);
            if (isNaN(precio) || precio <= 0) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    exito: false,
                    mensaje: 'El precio debe ser un número positivo'
                }));
                return;
            }
            
            const agregado = await agregarProducto(datos.nombre, precio);
            
            if (agregado) {
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    exito: true,
                    mensaje: 'Producto agregado exitosamente',
                    producto: {
                        nombre: datos.nombre,
                        precio: precio
                    }
                }));
            } else {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    exito: false,
                    mensaje: 'Error al agregar producto'
                }));
            }
            
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                exito: false,
                mensaje: 'Error en el servidor'
            }));
        }
    }
    
    else {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            exito: false,
            mensaje: `Método ${req.method} no permitido. Solo GET y POST`
        }));
    }
});

servidor.listen(PORT, () => {
    console.log('\n🚀 Servidor corriendo en http://localhost:' + PORT);
    console.log('📦 Endpoints disponibles:');
    console.log('   GET  http://localhost:' + PORT + '/productos');
    console.log('   POST http://localhost:' + PORT + '/productos');
    console.log('\n💡 Para detener el servidor: Ctrl + C\n');
});

if (!fsSync.existsSync(ARCHIVO_PRODUCTOS)) {
    console.log('⚠️  El archivo productos.txt no existe. Créalo primero.');
}
