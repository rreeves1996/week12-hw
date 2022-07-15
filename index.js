const mysql = require('mysql2');
const inquirer = require('inquirer');
const table = require('console.table');

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "",
        database: "employee_db"
    },
    console.log("Connected to the database")
);

const initPrompt = async () => {
    await inquirer.prompt [{
        type: 'list',
        message: 'Please select an option:',
        name: 'option',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update employee role'
        ]
    }].then(response => {

    })
};

function init() {
    initPrompt();
}

init();