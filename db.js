//this js script will be used for creating the db initially
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const filepath = "./music.db";

//the function we use to connect to the database
function connectToDatabase() {
  if (fs.existsSync(filepath)) {
    console.log("connected to existing database");
    return new sqlite3.Database(filepath);
  } else {
    const db = new sqlite3.Database(filepath, (error) => {
      if (error) {
        return console.error(error.message);
      }
      createTable(db);
      createTable2(db);
      createTable3(db);
      console.log("Connected to the new database successfully");
    });
    return db;
  }
}
//this is the function used to create the tables in the database
function createTable(db) {
  db.exec(`
  CREATE TABLE tracks
  (
    track_id               INT,
    album_id               INT,
    album_title            VARCHAR(20),
    artist_id              INT,
    artist_name            VARCHAR(15),
    tags                   VARCHAR(20),
    track_date_created     VARCHAR(20),
    track_date_recorded    VARCHAR(20),
    track_duration         VARCHAR(20),
    track_genres           VARCHAR(50),
    track_number           INT,
    track_title            VARCHAR(15)

  )
  
`);
}

function createTable2(db){
  db.exec(`
  CREATE TABLE artists
  (
  artist_id                 INT,
  artist_active_year_begin  VARCHAR(10),
  artist_active_year_end    VARCHAR(20),
  artist_associated_labels  VARCHAR(20),
  artist_contact            VARCHAR(20),
  artist_date_created       VARCHAR(20),
  artist_handle             VARCHAR(20)
  )
  `
  );
}

function createTable3(db){
  db.exec(`
  CREATE TABLE genres
  (
  genre_id                 INT,
  genre_title              VARCHAR(10),
  genre_parent_id          INT
  )
  `
  );
}
//we connect to the database after creating it
module.exports = connectToDatabase();
