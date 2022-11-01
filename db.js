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
      console.log("Connected to the new database successfully");
    });
    return db;
  }
}
//this is the function used to create the tables in the database
function createTable(db) {
  db.exec(`
  CREATE TABLE albums
  (
    album_id                INT,
    album_comments          VARCHAR(10),
    album_date_created      VARCHAR(50),
    album_date_released     VARCHAR(50),
    album_engineer          VARCHAR(20),
    album_favorites         VARCHAR(10),
    album_handle            VARCHAR(50),
    album_image_file        VARCHAR(50),
    album_images            VARCHAR(50),
    album_information       VARCHAR(50),
    album_listens           VARCHAR(50),
    album_producer          VARCHAR(50),
    album_title             VARCHAR(50),
    album_tracks            VARCHAR(50),
    album_type              VARCHAR(50),
    album_url               VARCHAR(50),
    artist_name             VARCHAR(50),
    artist_url              VARCHAR(50),
    tags                    VARCHAR(50)
  )
  
`);
}

function createTable2(db){
  db.exec(`
  CREATE TABLE artists
  (
  artist_id                 INT,
  artist_active_year_begin  VARCHAR(10),
  artist_active_year_end    VARCHAR(50),
  artist_associated_labels  VARCHAR(50),
  artist_contact            VARCHAR(50),
  artist_date_created       VARCHAR(50)
  )
  `
  );
}
//we connect to the database after creating it
module.exports = connectToDatabase();
