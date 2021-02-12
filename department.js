const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "yourRootPassword",
    database: "department_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    connection.query("SELECT * FROM department", function (err, res) {
        console.log(res)
    });
    connection.end();
});

function startPrompt() {
    inquirer.prompt([
    {
    type: "list",
    message: "What would you like to do?",
    name: "choice",
    choices: [
              "Add Employee?",
              "Add Role?",
              "Add Department?"
            ],
    },
]).then(function(val) {
    switch (val.choice) {
        case "View All Employees?":
          viewAllEmployees();