const express = require("express");
const res = require("express/lib/response");
const app = express();
const sqlite = require("sqlite3").verbose();
const url = require("url");
const router = express.Router();
let sql;

let myArr = {};

//establishing a connection to the database CHANGE to ./music.db after tests
const db = new sqlite.Database("./music.db",sqlite.OPEN_READWRITE,(err)=>{
    if (err) return console.error(err);
})

//setup seving front-end code
app.use('/', express.static('static'));


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
        //we parse the URL to get the query params
         const queryObject = url.parse(req.url, true).query; // query paramaters grabbing
         //if query params exist
         if(queryObject.name) 
             {
                console.log("Searching based on query param: "+queryObject.name);
                //we search our SQLite database based on those query params, we want a match for album_title or track_title
                // n = 10, return first 10 results only
                sql = `SELECT * FROM 'tracks' WHERE album_title LIKE '%${queryObject.name}%' OR track_title LIKE '%${queryObject.name}%' LIMIT 0,10`;
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

//get genre info without specifying an id
router.route('/genres')
//get request for al lthe genre info
.get((req,res)=>{
    sql = `SELECT * FROM genres`;
    //if the user has included a query parameter for the artist name
    try{
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


router.route('/playlist')


//working to get all the playlists
.get((req,res)=>{
    sql = `SELECT name FROM sqlite_schema WHERE 
    type = 'table' AND name NOT LIKE 'genres'
    AND type = 'table' AND name NOT LIKE 'tracks'
    AND type = 'table' AND name NOT LIKE 'artists'`;
    //if the user has included a query parameter for the artist name
    try{
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
}) //ok this works we are able to a new create a specific playlist
//WORK
.put((req,res)=>{
    const {playlist_name} = req.body;
    console.log("we want to create playlist: "+playlist_name);
    //this will keep track of the total number of tracks, initially zero when we create the list
    myArr[playlist_name] = 0;
    //add the playlist to our data structure
    try{
        sql = `CREATE TABLE IF NOT EXISTS ${playlist_name} (track_id INT)`;
        db.run(sql, (err)=>{
            if(err) return res.json({status:300,success:false,error:err});

            console.log("successful created playlist: "+playlist_name);
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
//works to add new song to playlist
.post((req,res)=>{
    try{
        const {playlist_name,track_id} = req.body;
        sql = `INSERT INTO ${playlist_name} ( track_id) VALUES (?)`;
        db.run(sql,[track_id], (err)=>{
            if(err) return res.json({status:300,success:false,error:err});

            console.log("successful input track: "+track_id+ ` into list ${playlist_name}`);
            myArr[playlist_name] = ++myArr[playlist_name];
        })
        return res.json({
            status: 200,
            success: true,
            noOfTracks: myArr[playlist_name],
        });

    }catch (error){
        return res.json({
            status: 400,
            success:false,
        });

    }
})
//WORK
.delete((req,res)=>{
    const {playlist_name} = req.body;
    console.log("we want to delete playlist: "+playlist_name);
    //add the playlist to our data structure
    
    if(playlist_name == "genres" || playlist_name =="artists" || playlist_name == "tracks"){
        console.log("500 This database is protected and can't be deleted");
        return res.json({
            status: 500,
            success: false,
        });
    }
    try{
        const {playlist_name} = req.body;
        sql = `DROP TABLE IF EXISTS ${playlist_name}`;
        db.run(sql, (err)=>{
            if(err) return res.json({status:300,success:false,error:err});

            console.log("successful delete");
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
});

//get genre info with specifying a playlist name
router.route('/playlist/:name')
//get request for al lthe genre info

//No work anymore
.get((req,res)=>{
    sql = `SELECT * FROM ${(req.params.name)}`;
    console.log(`We are looking for playlist ${(req.params.name)}`);
    
    
    try{
        db.all(sql,[],(err,rows)=>{
            if (err) 
            return res.json({ status: 300, success: false, error: err});

            if(rows.length<1) 
            return res.json({ status: 300, success: false, error: "No match"});

            return res.json({ status:200, data: rows, success: true, noOfTracks: myArr[req.params.name]});
        });

    }catch (error){
        return res.json({
            status: 400,
            success:false,
        });

    }
})


//install the router at /api
app.use('/api',router)

app.listen(3000);
console.log("Listening on port 3000")