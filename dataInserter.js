//this is a test js file to try out parsing csv data
//This works!, now to figure out how to use it in the context of the lab...
const {parse} = require('csv-parse')
const fs = require('fs')
const db = require("./db");

//here we parse the csv data
fs.createReadStream("./raw_albums.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
    //we make the data fit to be added into our sqlite database
    db.serialize(function () {
        db.run(
          //inserting the data into appropriate columns 
          `INSERT INTO albums VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
          [row[0], row[1], row[2], row[3], row[4], row[5], row[6],row[7],row[8],row[9],row[10],row[11],row[12],row[13],row[14],row[15],row[16],row[17],row[18]],
          function (error) {
            if (error) {
              return console.log(error.message);
            }
            //this will return the id of the last inserted data item to keep track of where we are
            console.log(`Inserted a row with the id: ${this.lastID}`);
          }
        );
      });
  });




