//llamamos a express
const express = require('express');

const fs = require('fs');
//creamos una instancia de express
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//crear y definir el servidor que va a escuchar en el puerto 3000   
app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});

//metodo get. Implementa end points. El primer parametro es la ruta, el segundo es una funcion que recibe dos parametros, request y response. Request es la informacion que se envia desde el cliente, response es la respuesta que se envia al cliente. En este caso, se envia un mensaje de texto 'Hola mundo' al cliente.    
//Cada end point es una ruta que se puede acceder desde el cliente. En este caso, la ruta es '/' que es la raiz del servidor. Cuando el cliente accede a esta ruta, se ejecuta la funcion que envia el mensaje 'Hola mundo' al cliente. 
app.get('/', function (request, response) {
    response.send('Hola mundo');
});

app.get('/movies',(req,res)=>{
    fs.readFile('./movies.json', (error,file)=>{
        if(error){
            console.log('No se puede leer el archivo', error);
            return;
        }    

        const movies = JSON.parse(file);
        res.json(movies);
    });

});

//metodo POST. Que se acepten los objetos de pelicula que se envien desde el cliente. El cliente envia un objeto de pelicula en formato JSON, el servidor lo recibe y lo agrega al archivo movies.json. El servidor responde con el objeto de pelicula que se envio desde el cliente.   
app.post('/movies',(req,res)=>{

    fs.readFile('./movies.json', (err,data)=>{
        if(err){
            console.log('No se puede leer el archivo', err);
        }

        const movies = JSON.parse(data);
        const newMovieID = movies.length + 1;
        req.body.id = newMovieID;

        movies.push(req.body);

        //el array movies ahora tiene la nueva peli
        const newMovie = JSON.stringify(movies,null,2);

        fs.writeFile('./movies.json', newMovie, (error)=>{
            if(error){
                console.log('No se puede escribir en el archivo', error);
            }
            return res.status(200).send("new movie added");
        });
    });
});

//metodo PATCH
app.patch('/movies/:id',(req,res)=>{

    const mid = req.params.id; //rescatamos el id del endpoint => localhost
    const {name,year} = req.body; //rescatamos el nombre y el año de la pelicula que se envia desde el cliente

    fs.readFile('movies.json', (err,data)=>{
        if(err){
            console.log('No se puede leer el archivo', err);
        }  

        const movies = JSON.parse(data);//rescatamos las pelis de mi movie

        movies.forEach(movie => {
            if(movie.id == Number(mid)){
                if(name !== undefined){ //si name no tiene valor
                    movie.name = name;
                }
                if(year !== undefined){ //si year no tiene valor
                    movie.year = year;
                }
                //tengo mi peli actualizada
                const movieUpdated = JSON.stringify(movies,null,2); //convierto el array de pelis a formato JSON

                fs.writeFile('movies.json', movieUpdated, (error)=>{
                    if(error){
                        console.log('No se puede escribir en el archivo', error);
                    }
                    return res.status(200).send("movie updated");
                });
            }
        });
    });
});

//metodo DELETE. borra las pelis
app.delete('/movies/:id', (req, res) => {

    const mid = req.params.id;

    fs.readFile('movies.json', (err, data) => {

        if (err) {
            console.log('No se puede leer el archivo', err);
            return;
        }

        const movies = JSON.parse(data);

        movies.forEach(movie => {

            if (movie.id == Number(mid)) {

                movies.splice(movies.indexOf(movie), 1);
                const moviesDeleted = JSON.stringify(movies, null, 2);

                fs.writeFile('movies.json', moviesDeleted, (error) => {

                    if (error) {
                        console.log('No se puede escribir en el archivo', error);
                        return;
                    }
                    return res.status(200).send("movie deleted");

                });
            }

        });

    });

});