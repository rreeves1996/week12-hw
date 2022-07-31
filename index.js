const mysql = require('mysql2');
const inquirer = require('inquirer');
const table = require('console.table');
const Department = require('./lib/classes/Department');
const Role = require('./lib/classes/Role');
const Employee = require('./lib/classes/Employee');


const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "root",
        database: "employee_db"
    },
    console.log("Connected to the database")
);

const initPrompt = async () => {
    await inquirer.prompt([
        {
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
        ]}
    ]).then(response => {
        switch(response.option) {
        case 'View all departments':
            viewDepartments();

            break;
        case 'View all roles':
            viewRoles();
            break;
        case 'View all employees':
            viewEmployees();
            break;
        case 'Add a department':
            departmentQueryPrompt();
            break;
        case 'Add a role':
            roleQueryPrompt();
            break;
        case 'Add an employee':
            employeeQueryPrompt();
            break;
        case 'Update employee role':
            updateQueryPrompt();
            break;
        default:
            break;
        };
        console.log(response);
    });
};


const departmentQueryPrompt = async () => {
    await inquirer.prompt([
        {
        type: 'input',
        message: 'Please input new department name: ',
        name: 'name'
        }
    ]).then(response => {
        addDepartment(response.name);
        const newDepartment = new Department(response.name);
    })
};

const roleQueryPrompt = async () => {
    await inquirer.prompt([
        {
        type: 'input',
        message: 'Please input new role name: ',
        name: 'role'
        },
        {
        type: 'input',
        message: 'Please input new role salary: ',
        name: 'salary'
        },
        {
        type: 'input',
        message: 'Please input new role department: ',
        name: 'department'
        }
    ]).then(response => {
        addRole(response);
        console.log("Role successfully added!");
    }).catch(err => {
        console.log(err);
    })
};

const employeeQueryPrompt = async () => {

};

const updateQueryPrompt = async () => {

};


// QUERIES

const viewDepartments = () => {
    db.query(`SELECT * FROM department`, (err, res) => {
        console.log(res);
    })
    init();
};

const viewRoles = () => {
    db.query(`SELECT * FROM role`, (err, res) => {
        console.log(res);
    })
    init();
};

const viewEmployees = () => {
    db.query(`SELECT * FROM employee`, (err, res) => {
        console.log(res);
    })
    init();
};

const addDepartment = (department) => {
    db.query(`INSERT INTO department (name) VALUES (${department.name})`, (err, res) => {
        if (err) {
            console.log(err)
        }
        console.log(res);
    })
    init();
};

const addRole = (role) => {
    db.query(`SELECT * FROM department WHERE name = ?`, role.department, (err, res) => {
        if (err) {
          console.log(err);
        }
        role.department_id = res.department_id;
    });
    db.query(`INSERT INTO role (title, salary, department_id) VALUES (${role.title}, ${role.salary}, ${role.department_id})`, (err, res) => {
        if (err) {
            console.log(err)
        }
        console.log(res);
    })
    init();
};

const addEmployee = (employee) => {
    db.query(`INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (${employee.id}, ${employee.first_name}, ${employee.last_name}, ${employee.role_id}, ${employee.manager_id})`, (err, res) => {
        if (err) {
            console.log(err)
        }
        console.log(res);
    })
    init();
};

const updateEmployee = (employee, newRole) => {
    db.query(`UPDATE employee SET role_id = "${newRole}" WHERE id = ${employee.id}`, (err, res) => {
        if (err) {
            console.log(err)
        }
        console.log(res);
    })
    init();
};

function init() {
    initPrompt();
};

init();