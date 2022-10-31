//this is a test js file to try out parsing csv data
//This works!, now to figure out how to use it in the context of the lab...
const express = require('express')
const {parse} = require('csv-parse')
const fs = require('fs')
const app = express()
const db = require("./db");

fs.createReadStream("./raw_albums.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
    db.serialize(function () {
        db.run(
          `INSERT INTO albums VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [row[0], row[1], row[2], row[3], row[4], row[5], row[6],row[7],row[8],row[9],row[10],row[11],row[12],row[13],row[14],row[15],row[16],row[17]],
          function (error) {
            if (error) {
              return console.log(error.message);
            }
            console.log(`Inserted a row with the id: ${this.lastID}`);
          }
        );
      });
  });

// //setup
app.use(express.json());

app.listen(3000, () => console.log('server started'));

//checking to see if worked
