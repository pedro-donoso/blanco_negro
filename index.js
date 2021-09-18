const http = require('http');
const fs = require('fs');
const url = require('url');
const yargs = require('yargs');
const jimp = require('jimp');

const key = 123;

const argv = yargs
    .command(
        'levantar_servidor',
        'Comando para levantar servidor',
        {
            key: {
                describe: 'Argumento para validar la clave de acceso',
                demand: true,
                alias: 'k',
            },
        },

        (args) => {
            args.key == key
                ?
                http.createServer((req, res) => {

                    if (req.url == '/') {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        fs.readFile('index.html', 'utf8', (err, html) => {
                            res.end(html);
                        })
                    }

                    if (req.url == '/estilos') {
                        res.writeHead(200, { 'Content-Type': 'text/css' });
                        fs.readFile('estilos.css', (err, css) => {
                            res.end(css);
                        })
                    }

                    const params = url.parse(req.url, true).query;
                    const url_imagen = params.rutaImagen;

                    if (req.url.includes('/imagen')) {

                        jimp.read(url_imagen,
                            (err, imagen) => {
                                imagen
                                    .resize(150, 150, jimp.AUTO)
                                    .grayscale()
                                    .quality(60)
                                    .writeAsync('newImg.jpg')
                                    .then(() => {
                                        fs.readFile('newImg.jpg', (err, Imagen) => {
                                            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                                            res.end(Imagen);
                                        })
                                    })
                            })
                    }
                })
                    .listen(8080, () => console.log('Escuchando el puerto 8080'))
                :
                console.log('Key incorrecta, intente nuevamente.')
        }
    )
    .help().argv
