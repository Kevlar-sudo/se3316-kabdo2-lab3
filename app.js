const express = require("express");
const res = require("express/lib/response");
const app = express();
const sqlite = require("sqlite3").verbose();
const url = require("url");
const router = express.Router();
let sql;
//establishing a connection to the database
const db = new sqlite.Database("./music.db",sqlite.OPEN_READWRITE,(err)=>{
    if (err) return console.error(err);
})




//setup middleware to do logging
app.use((req,res,next) =>{ //for all routes
    console.log(`${req.method} request for ${req.url}`);
    next();//keep going
});

router.use(express.json());

//Routes for /api/albums
router.route('/') //all the routes to the base prefix
    //get list of albums
    
//post req
.post((req,res)=>{
    try{
        const {album_comments,album_date_created,album_date_released,album_engineer} = req.body;
        sql = "INSERT INTO albums(album_comments,album_date_created,album_date_released,album_engineer) VALUES (?,?,?,?)";
        db.run(sql,[album_comments,album_date_created,album_date_released,album_engineer], (err)=>{
            if(err) return res.json({status:300,success:false,error:err});

            console.log("successful input",album_comments,album_date_created,album_date_released,album_engineer);
        })
        return res.json({
            status: 200,
            success: true,
        });

    }catch (error){
        return res.json({
            status: 400,
            success:false,
        });

    }
})

//get request
.get((req,res)=>{
    sql = "SELECT * FROM albums";
    try{
        // const queryObject = url.parse(req.url, true).query; // query paramaters grabbing
        // if(queryObject.field && queryObject.type) 
        //     sql += `WHERE ${queryObject.field} LIKE '%${queryObject.type}%'`;
        db.all(sql,[],(err,rows)=>{
            if (err) 
            return res.json({ status: 300, success: false, error: err});

            if(rows.length<1) 
            return res.json({ status: 300, success: false, error: "No match"});

            return res.json({ status:200, data: rows, success: true});
        });

    }catch (error){
        return res.json({
            status: 400,
            success:false,
        });

    }
})

router.route('/:album_id') //all routes with specified album_id

//Get details of a specific album (THIS NOW WORKS!!!)
.get((req,res) =>{
    sql = `SELECT * FROM albums WHERE album_id = ${parseInt(req.params.album_id)}`;
    console.log(`We are looking for album ${parseInt(req.params.album_id)}`)
    try{
        db.all(sql,[],(err,rows)=>{
            if (err) 
            return res.json({ status: 300, success: false, error: err});

            if(rows.length<1) 
            return res.json({ status: 300, success: false, error: "No match"});

            return res.json({ status:200, data: rows, success: true}); //if match is found
        });

    }catch (error){ //if some client side error occurs
        return res.json({
            status: 400,
            success:false,
        });
    }
})//FROM THIS POINT FORWARD I havent reviewed what I have
//create/replace album data for a given id
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
app.use('/api/albums',router)

app.listen(3000);
console.log("Listening on port 3000")