//pachetele folosite
const mysql = require('mysql');
const express = require("express");
const app = express();
const path = require('path');
const bodyParser = require("body-parser");

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({
    extended: true
}));

//initiem conexiunea la baza de date
let database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'photoWebApp'
});
console.log(database.connect());

//definim rutele de root+login
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/login', function(req, res) {
    let amTrimis = false;
    
    database.query("SELECT * FROM `users`", (error, results, fields) => {
        if (error) throw error;

        //verificam daca e admin
        if (req.body.uname == "administrator" && req.body.psw == "administrator") {
            res.sendFile(path.join(__dirname + '/admin.html'));
            amTrimis = true;
        } else {
            for (let i = 0; i < results.length && !amTrimis; i++) {
                if (req.body.uname == results[i].uname && req.body.psw == results[i].passwd) {
                    res.send("user");
                    amTrimis = true;
                }
            }

        }
        if(!amTrimis) res.sendFile(path.join(__dirname + '/index.html'));
    });
});



app.listen(9000);