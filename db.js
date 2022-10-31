//this js script will be used for creating the db initially
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const filepath = "./albums.db";

//the function we use to connect to the database
function connectToDatabase() {
  if (fs.existsSync(filepath)) {
    return new sqlite3.Database(filepath);
  } else {
    const db = new sqlite3.Database(filepath, (error) => {
      if (error) {
        return console.error(error.message);
      }
      createTable(db);
      console.log("Connected to the database successfully");
    });
    return db;
  }
}
//this is the function used to create the tables in the database
function createTable(db) {
  db.exec(`
  CREATE TABLE albums
  (
    album_id                VARCHAR(10),
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
//we connect to the database after creating it
module.exports = connectToDatabase();
