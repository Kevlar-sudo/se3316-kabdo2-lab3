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

//Routes for /api/tracks
router.route('/tracks/') //all the routes to the tracks
   
    
//post req we can use this later for adding songs to the playlist (it worked for album before)
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

//get request we want to limit it to only the first 30 tracks not to overload insomnia
.get((req,res)=>{
    sql = "SELECT * FROM tracks LIMIT 0,30";
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

router.route('/tracks/:track_id') //all routes with specified track_id

//Get details of a specific album (THIS NOW WORKS!!!)
.get((req,res) =>{
    sql = `SELECT * FROM tracks WHERE track_id = ${parseInt(req.params.track_id)}`;
    console.log(`We are looking for track ${parseInt(req.params.track_id)}`)
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
});

//Getting artist info with a given artist_id
router.route('/artists/:artist_id') //all routes with specified artist_id

//Get details of a specific artist (THIS NOW WORKS!!!)
.get((req,res) =>{
    sql = `SELECT * FROM artists WHERE artist_id = ${parseInt(req.params.artist_id)}`;
    console.log(`We are looking for artist ${parseInt(req.params.artist_id)}`)
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
})

//get artist info without specifiying an id
router.route('/artists')
//get request we want to limit it to only the first 30 tracks not to overload insomnia
.get((req,res)=>{
    sql = `SELECT * FROM artists LIMIT 0,30`;
    //if the user has included a query parameter for the artist name
    try{
        //we parse the URL to get the query params
         const queryObject = url.parse(req.url, true).query; // query paramaters grabbing
         //if query params exist
         if(queryObject.name) 
             {
                console.log(queryObject.name);
                //we search our SQLite database based on those query params
                sql = `SELECT * FROM 'artists' WHERE artist_handle LIKE '%${queryObject.name}%'`;
            }
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



//install the router at /api/albums
app.use('/api',router)

app.listen(3000);
console.log("Listening on port 3000")