//this is a test js file to try out parsing csv data
//This works!, now to figure out how to use it in the context of the lab...
const {parse} = require('csv-parse')
const fs = require('fs')
const db = require("./db");

//here we parse the csv data for tracks
fs.createReadStream("./raw_tracks.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
    //we make the data fit to be added into our sqlite database
    db.serialize(function () {
        db.run(
          //inserting the data into appropriate columns 
          `INSERT INTO tracks VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [row[0], row[1], row[2], row[4], row[5], row[13], row[19],row[20],row[22],row[27],row[35],row[37]],
          function (error) {
            if (error) {
              return console.log(error.message);
            }
            //this will return the id of the last inserted data item to keep track of where we are
            console.log(`Inserted a row into tracks with the id: ${this.lastID}`);
          }
        );
      });
  });

  //here we parse the csv data for artists
fs.createReadStream("./raw_artists.csv")
.pipe(parse({ delimiter: ",", from_line: 2 }))
.on("data", function (row) {
  //we make the data fit to be added into our sqlite database
  db.serialize(function () {
      db.run(
        //inserting the data into appropriate columns 
        `INSERT INTO artists VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [row[0], row[1], row[2], row[3], row[6], row[7], row[11]],
        function (error) {
          if (error) {
            return console.log(error.message);
          }
          //this will return the id of the last inserted data item to keep track of where we are
          console.log(`Inserted a row into artists with the id: ${this.lastID}`);
        }
      );
    });
});

 //here we parse the csv data for genres
 fs.createReadStream("./genres.csv")
 .pipe(parse({ delimiter: ",", from_line: 2 }))
 .on("data", function (row) {
   //we make the data fit to be added into our sqlite database
   db.serialize(function () {
       db.run(
         //inserting the data into appropriate columns 
         `INSERT INTO genres VALUES (?, ?, ?)`,
         [row[0], row[3], row[2]],
         function (error) {
           if (error) {
             return console.log(error.message);
           }
           //this will return the id of the last inserted data item to keep track of where we are
           console.log(`Inserted a row into genres with the id: ${this.lastID}`);
         }
       );
     });
 });




