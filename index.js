const express = require('express');
const app = express();
const port = 3000;
const router = express.Router();

//dependencies needed for parsing the csv files
const {parse} = require('csv-parse')
const fs = require('fs')

//the parser function
const parser = parse({columns: true}, function (err,records){
    console.log(records);
});

fs.createReadStream(__dirname+'/raw_albums.csv').pipe(parser);

//setup


//albums store
const albums =[
    {album_id: 100,album_title:'Nicki Minaj 1',colour:'brown', plays: 0},
    {album_id: 101,album_title:'Nicki Minaj 2',colour:'brown',plays: 0},
    {album_id: 102,album_title:'Kanye Album',colour:'red',plays: 0},
    {album_id: 103,album_title:'Drake Album',colour:'purple',plays: 0},
];

//setup seving front-end code
app.use('/', express.static('static'));

//setup middleware to do logging
app.use((req,res,next) =>{ //for all routes
    console.log(`${req.method} request for ${req.url}`);
    next();//keep going
});

//parse data in body as JSON
router.use(express.json());

//Routes for /api/albums
router.route('/') //all the routes to the base prefix
    //get list of albums
    .get((req,res)=>{
        res.send(albums);
    })

    //create a part
    .post((req,res)=>{
        const newalbum = req.body;
        newalbum.album_id = 100 + albums.length;
        if(newalbum.album_title){
            albums.push(newalbum);
            res.send(newalbum);
        }
        else{
            res.status(400).send("missing name");
        }
    })

router.route('/:album_id') //All routes with a part ID

    //Get details of a part
    .get((req,res) =>{
        const part = albums.find(p => p.album_id === parseInt(req.params.album_id));
        if(part){
            res.send(part);
        }
        else{
            res.status(404).send(`Part ${req.params.album_id} was not found!`);
        }
    

    })
    //create/replace part data for a given id
    .put((req,res) =>{
        const newalbum = req.body;
        console.log("Part: ",newalbum);
        
        //add id field
        newalbum.album_id = parseInt(req.params.album_id);
    
        //replace part with new one
        const part = albums.findIndex(p => p.album_id === parseInt(newalbum.album_id));
        if(part <0 ){
        console.log('Creating new part');
        albums.push(newalbum);
        }
        else{
            console.log('Modifying part ',req.params.album_id);
            albums[part] = newalbum;
        }
        res.send(newalbum);

    })
    //update plays level
    .post((req,res) =>{
        const newalbum = req.body;
        console.log("Part: ",newalbum);
        
        
        //find the album
        const album = albums.findIndex(p => p.album_id === parseInt(req.params.album_id));
        if(part <0 ){//not dound
        res.status(404).send(`Album ${req.params.album_id} not found`);
        }
        else{
            console.log('changing plays for ',req.params.album_id);
            albums[album].plays += parseInt(req.body.plays); //plays property must exist
            res.send(albums[album]);
        }    

    })
    

//install the router at /api/albums
app.use('/api/albums',router);

app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});