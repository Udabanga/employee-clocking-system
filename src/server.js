var express = require("express");
var cors = require("cors");
var app = express();
var mysql = require("mysql");
var bodyParser = require('body-parser')

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employee_clocking",
});

con.connect(function (err) {
  if (err) throw err;
  con.query("SELECT * FROM employee", function (err, result, fields) {
    if (err) throw err;
  });
});

app.get("/api/getEmployees", (req, res) => {
  var sqlStatement = "SELECT * FROM employee";
  con.query(sqlStatement, function (error, result, fields) {
    // if (result) throw result
    if (error) throw error
    // console.log(error);
    res.send(result);
  });
});

app.post("/api/setEmployees", (req, res) => {
  var sqlStatement = "INSERT INTO employee(emp_fname, emp_lname) VALUES (?,?)";
  var fName= req.body.fName
  var lName= req.body.lName
  con.query(sqlStatement, [fName,lName], function(error,result) {
    console.log(result);
    console.log(error);
});
});

app.post("/api/deleteEmployees", (req, res) => {
  var sqlStatement = "DELETE FROM employee(emp_fname, emp_lname) WHERE emp_id=?";
  var id= req.body.id
  con.query(sqlStatement, id, function(error,result) {
    console.log(result);
    console.log(error);
});
});

app.get("/hey", (req, res) => res.send("ho!"));

app.listen(8080);
