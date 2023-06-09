
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require('mysql');

const app = express();
const port = 8089;
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your MySQL username',
    password: 'your MySQL password',
    database: 'devices'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("Connected to database");
});
global.db = db;

app.use(bodyParser.urlencoded({ extended: true }));

require("./routes/main")(app);

app.set("views", __dirname + "/views");
app.set("view engin", "ejs");
app.engine("html", require("ejs").renderFile);
app.listen(port, () => console.log(`Mid Term app listening on port ${port}!`));
