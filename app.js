const express = require("express");
const bodyParser = require("body-parser");
const res = require("express/lib/response");
const app = express();
const sqlite = require("sqlite3").verbose();
const url = require("url");
let sql;
const db = new sqlite.Database("./albums.db",sqlite.OPEN_READWRITE,(err)=>{
    if (err) return console.error(err);
})

app.use(bodyParser.json());



//post req
app.post('/albums',(req,res)=>{
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
});

//get request
app.get("/albums",(req,res)=>{
    sql = "SELECT * FROM albums";
    try{
        const queryObject = url.parse(req.url, true).query; // query paramaters grabbing
        if(queryObject.field && queryObject.type) 
            sql += `WHERE ${queryObject.field} LIKE '%${queryObject.type}%'`;
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

app.listen(3000);
console.log("Listening on port 3000")