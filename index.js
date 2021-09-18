// agrego constantes
const http = require('http');
const fs = require('fs');
const url = require('url');
const yargs = require('yargs');
const jimp = require('jimp');

// agrego key
const key = 123;

// agrego yargs
const argv = yargs
    
    //comando para levantar servidor
    .command(
        'server_up',
        'Comando que levanta el servidor',
        {

            // argumento de validacin de la clave para acceder
            key: {
                describe: 'Argumento que permite validar clave de acceso',
                demand: true,
                alias: 'k',
            },
        },

        (args) => {
            args.key == key
                ?

                // crear servidor
                http.createServer((req, res) => {

                    if (req.url == '/') {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        fs.readFile('index.html', 'utf8', (err, html) => {
                            res.end(html);
                        })
                    }

                    // asignar estilos
                    if (req.url == '/estilos') {
                        res.writeHead(200, { 'Content-Type': 'text/css' });
                        fs.readFile('estilos.css', (err, css) => {
                            res.end(css);
                        })
                    }

                    // url imagen
                    const params = url.parse(req.url, true).query;
                    const url_imagen = params.rutaImagen;

                    if (req.url.includes('/imagen')) {

                        // jimp
                        jimp.read(url_imagen,
                            (err, imagen) => {
                                imagen
                                    
                                    // nuevas propiedades imagen
                                    .resize(150, 150, jimp.AUTO)
                                    .grayscale()
                                    .quality(50)
                                    .writeAsync('newPhoto.jpg')
                                    .then(() => {
                                        fs.readFile('newPhoto.jpg', (err, Imagen) => {
                                            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                                            res.end(Imagen);
                                        })
                                    })
                            })
                    }
                })
                    
                    // puerto
                    .listen(8080, () => console.log('Actualmente escucho el puerto 8080'))
                :
                console.log('La Key ingresada es incorrecta, escribe por terminal: node index.js server_up -k=123')
        }
    )
    .help().argv
