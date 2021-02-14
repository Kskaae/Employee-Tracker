const mysql = require("mysql");
const inquirer = require("inquirer");
// const consoleTable = require("console.table");

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
    startPrompt()
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
                "Add Department?",
                "View All Employees?",
                "View All Roles?",
                "View All Departments?",
                "Update Employee Role"
            ],
        },
    ]).then(function (val) {
        switch (val.choice) {
            case "View All Employees?":
                viewAllEmployees();
                break;
            case "View All Departments?":
                viewAllDepartments();
                break;
            case "View All Roles?":
                viewAllEmployeeRoles();
                break;
            case "Add Employee?":
                addEmployee();
                break;
            case "Update Employee Information":
                updateEmployeeInformation();
                break;
            case "Add Role?":
                addRole();
                break;
            case "Add Department?":
                addDepartment();
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;

            default:
                console.log("err")
        }
    })
}
function viewAllEmployees() {
    connection.query("SELECT * FROM employee",
        function (err, res) {
            if (err) throw err
            console.table(res)
            startPrompt()
        })
}
function viewAllEmployeeRoles() {
    connection.query("SELECT * FROM role",
        function (err, res) {
            if (err) throw err
            console.table(res)
            startPrompt()
        })
}
function viewAllDepartments() {
    connection.query("SELECT * FROM department",
        function (err, res) {
            if (err) throw err
            console.table(res)
            startPrompt()
        })
}
function addDepartment() {
    inquirer.prompt(
        {
            type: "input",
            message: "What is the name of your department?",
            name: "addDepartment"

        }
    ).then(function (answer) {
        connection.query("INSERT INTO department (name) VALUES (?)", [answer.addDepartment],
            function (err, res) {
                if (err) throw err
                console.table(res)
                startPrompt()
            })
    })

}
function addRole() {
    connection.query("SELECT * FROM department",
        function (err, res) {
            if (err) throw err
            let allDepartments = res.map(function (dept) {
                return {
                    name: dept.name,
                    value: dept.id
                }
            })
            console.log(allDepartments)
            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the title?",
                    name: "addTitle"

                },
                {
                    type: "input",
                    message: "What is the salary?",
                    name: "addSalary"

                },
                {
                    type: "list",
                    choices: allDepartments,
                    message: "Which department does this role belong to?",
                    name: "chooseDepartment"

                }
            ]

            ).then(function (answer) {
                connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answer.addTitle, answer.addSalary, answer.chooseDepartment],
                    function (err, res) {
                        if (err) throw err
                        console.table(res)
                        startPrompt()
                    })
            })

        })


}

function addEmployee() {
    connection.query("SELECT * FROM role",
        function (err, res) {
            if (err) throw err
            let allRoles = res.map(function (role) {
                return {
                    name: role.name,
                    value: role.id
                }
            })
            console.log(allRoles)
            inquirer.prompt([
                {
                    type: "input",
                    message: "First name?",
                    name: "addFirstName"

                },
                {
                    type: "input",
                    message: "Last Name?",
                    name: "addLastName"

                },
                {
                    type: "list",
                    choices: allRoles,
                    message: "Assigned Role?",
                    name: "chooseRole"

                }
            ]

            ).then(function (answer) {
                connection.query("INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)", [answer.addFirstName, answer.addLastName, answer.chooseRole],
                    function (err, res) {
                        if (err) throw err
                        console.table(res)
                        startPrompt()
                    })
            })

        })


}


function updateEmployeeRole() {
    connection.query("SELECT * FROM employee",
        function (err, res) {
            if (err) throw err
            let employeeInfo = res.map(function (info) {
                return {
                    name: info.first_name + " " + info.last_name,
                    value: info.id
                }

            })
            connection.query("SELECT * FROM role",
                function (err, res) {
                    if (err) throw err
                    let roleInfo = res.map(function (role) {
                        return {
                            name: role.title,
                            value: role.id
                        }
                    })

                    inquirer.prompt([
                        {
                            type: "list",
                            name: "chooseEmployee",
                            message: "choose an employee",
                            choices: employeeInfo



                        },
                        {
                            type: "list",
                            name: "chooseRole",
                            message: "choose a new role",
                            choices: roleInfo
                        }
                    ]).then(function (answer) {
                        connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [answer.chooseEmployee, answer.chooseRole], function (err, res) {
                            if (err) throw err

                        })
                    })

                })
        })
        startPrompt()
};