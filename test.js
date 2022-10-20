//this is a test js file to try out parsing csv data
//This works!, now to figure out how to use it in the context of the lab...
const express = require('express')
const {parse} = require('csv-parse')
const fs = require('fs')
const app = express()

const parser = parse({columns: true}, function (err,records){
    console.log(records);
});

fs.createReadStream(__dirname+'/raw_artists.csv').pipe(parser);

app.use(express.json());

app.listen(3000, () => console.log('server started'));