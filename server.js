//pachetele folosite
const mysql = require('mysql');
const express = require("express");
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const uniqueFilename = require('unique-filename');
const shortid = require("shortid");
const dropbox = require("./dropbox");
const secret = require("./secret");

const upload = multer({
    dest: __dirname + '/images'
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

const handleError = (err, res) => {
    res
        .status(500)
        .contentType("text/plain")
        .end("Oops! Something went wrong!");
};

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({
    extended: true
}));

//initiem conexiunea la baza de date
let database = mysql.createConnection({
    host: secret.host,
    user: secret.user,
    password: secret.password,
    database: secret.database
});
//console.log(database.connect());

//definim rutele de root+login
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/uid', function(req, res) {
	res.send(shortid.generate().toString());
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
                    res.sendFile(path.join(__dirname + '/photo.html'));
                    amTrimis = true;
                }
            }

        }
        if (!amTrimis) res.sendFile(path.join(__dirname + '/index.html'));
    });
});

app.post('/create', function(req, res) {
    let amTrimis = false;

    database.query("SELECT * FROM `users`", (error, results, fields) => {
        if (error) throw error;

        for (let i = 0; i < results.length && !amTrimis; i++) {
            if (req.body.uname == results[i].uname) {
                res.send("Username already exists!");
                amTrimis = true;
            }
        }
        if (!amTrimis) {

            let query = "INSERT INTO `photoWebApp`.`users` (`userid`, `uname`, `passwd`) VALUES ('" + shortid.generate().toString() + "', '" + req.body.uname + "', '" + req.body.psw + "')";
            database.query(query, (error, results, fields) => {

            });
            res.sendFile(path.join(__dirname + '/index.html'));
        }
    });
});

app.get('/databaseNames', function(req, res) {
    database.query("SELECT table_name FROM information_schema.tables where table_schema='photoWebApp'", (error, results, fields) => {
        ///console.log(results)
        let resultArray = [];
        results.forEach(function(element) { resultArray.push(element.table_name) })
        //console.log(resultArray);
        res.send(resultArray);
    });
})

//face un anumit query pe tabela, fara sa intoarca tabela rezultat
app.get('/query', function(req, res) {

    let tableName = req.query.name;
    //let query = "INSERT INTO `photoWebApp`.`salarii` (`codSalariu`, `valoare`) VALUES ('1000', '34567');"
    console.log(req.query);
    res.send("okay chef");
    database.query(req.query.query, (error, results, fields) => {
        console.log(results)
        if (error) {
            console.log(error)
        }
    })


})

app.get('/customquery', function(req, res) {

    let tableName = req.query.name;
    let query = req.query.query;

    database.query(query, (error, results, fields) => {
        let resultTable = {};
       	let resultArray;
       		try {
	            resultTable.data = [];
	            resultArray = results;
	            if(resultArray[0]){
		            let obj = JSON.stringify(resultArray[0]);
		            let obj1 = JSON.parse(obj);
		            resultTable.columns = Object.keys(obj1)
		            resultTable.name = query;
		            resultTable.rows = resultArray.length;
	            }
       		} catch(err){
       			console.log(err);
       		}

            resultArray.forEach(function(rowObj) {
                resultTable.data.push(Object.values(rowObj))
            })
        
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            res.send(resultTable);
        }
    })


})

//intoarce tabela cu un anumit nume
app.get('/table', function(req, res) {

    let tableName = req.query.name;
    let responseTable = {};
    database.query("SELECT count(*) AS rows FROM `" + tableName + "`", (error, results, fields) => {
        responseTable.name = req.query.name;
        responseTable.rows = results[0].rows;

        database.query("SHOW COLUMNS FROM " + tableName, (error, results, fields) => {
            responseTable.columns = [];
            results.forEach(function(dataPack) {
                responseTable.columns.push(dataPack.Field);
            })

            database.query("SELECT * FROM " + tableName, (error, results, fields) => {
                responseTable.data = [];
                results.forEach(function(line) {
                    responseTable.data.push(Object.values(line))
                })

                // array.forEach(function(line){
                // 	console.log(line.values)
                // })
                res.send(responseTable);
            })

        })
    })
})


app.post("/upload", upload.single("image_uploads"), async(req, res) => {
    //console.log(req.body);
    const tempPath = req.file.path;
    const fileName = uniqueFilename("").toString() + ".png";

    const targetPath = path.join(__dirname, "uploads", fileName).toString();
    //const targetPath = path.join(__dirname, "./uploads/image.png");

    if (path.extname(req.file.originalname).toLowerCase() === ".png") {
        //console.log(targetPath)
        fs.rename(tempPath, targetPath, async err => {
            if (err) { console.log(err) }
            let query = "INSERT INTO `photoWebApp`.`poze` (`pozaid`, `userid`, `data`, `calepoza`, `titlu`) VALUES ('" + shortid.generate().toString() + "', '" + req.body.userId.toString() + "', CURRENT_TIMESTAMP, '" + fileName + "', '" + req.body.image_text.toString() + "');"
            console.log(query);
            database.query(query, (error, results, fields) => {
                if (error) { console.log(error); }
                res.sendFile(path.join(__dirname + '/photo.html'));
            })
        });

        //for dropbox
        try{
    		await dropbox.uploadFile( '/' + fileName, targetPath, req.body.image_text.toString())
    	}catch(err){
    		console.log(err);
    	}
    	fs.unlink(targetPath, console.log);

    } else {
        fs.unlink(tempPath, err => {
            if (err) return handleError(err, res);

            res
                .status(403)
                .contentType("text/plain")
                .end("Only .png files are allowed!");
        });
    }
});

app.get("/image", async(req, res) => {
	console.log("path:" + req.query.path);
	await dropbox.downloadFile('uploads', "/" + req.query.path, req.query.path);
    //res.sendFile(path.join(__dirname, "./uploads/photo.png"));
    res.sendFile(path.join(__dirname, "uploads", req.query.path));
});

app.listen(9000);