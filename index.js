const mysql = require('mysql2');
const inquirer = require('inquirer');
const table = require('console.table');
const { restoreDefaultPrompts } = require('inquirer');
var deptNames = [];

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
            getDeptNames();
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
    });
};


// QUERY PROMPTS

const departmentQueryPrompt = async () => {
    await inquirer.prompt([
        {
        type: 'input',
        message: 'Please input new department name: ',
        name: 'name'
        }
    ]).then(response => {
        addDepartment(response.name);
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
        type: 'list',
        message: 'Please input new role department: ',
        name: 'department',
        choices: deptNames
        }
    ]).then(response => {
        addRole(response);
        console.log(`\nRole successfully added!\n`);
    });
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
    setTimeout(() => {
        initPrompt();
    }, 100);
};

const viewRoles = () => {
    var title = [];
    var roleID = [];
    var salary = [];
    db.query(`SELECT * FROM role`, (err, res) => {
        if (err) {
          console.log(err);
        };
        for(let i = 0; i < res.length; i++) {
            title.push(res[i].title);
            roleID.push(res[i].id);
            salary.push(res[i].salary);
            
            db.promise().query(`SELECT name FROM department WHERE id = ?`, res[i].department_id, (err, name) => {
            if (err) {
                console.log(err);
            };
            }).then(([deptName]) => {
                console.log(`\n${deptName[0].name.toUpperCase()}\n${title[i]} (Role ID: ${roleID[i]}) - $${salary[i]}`);
            });
        };
    });
    setTimeout(() => {
        initPrompt();
    }, 100);
};

const viewEmployees = () => {
    db.query(`SELECT * FROM employee`, (err, res) => {
        console.log(res);
    })
    setTimeout(() => {
        initPrompt();
    }, 100);
};

const addDepartment = (department) => {
    db.query(`INSERT INTO department (name) VALUES (${department.name})`, (err, res) => {
        if (err) {
            console.log(err)
        }
        console.log(res);
    })
    setTimeout(() => {
        initPrompt();
    }, 100);
};

const addRole = (role) => {
    // Pull department id from name of inputted department
    db.promise().query(`SELECT id FROM department WHERE name = ?`, role.department, (err, res) => {
        if (err) {
          console.log(err);
        };
    }).then(([res]) => {
    // Add role in to role table
    db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${role.role}", "${role.salary}", "${res[0].id}")`, (err, res) => {
        if (err) {
            console.log(err)
        };
    })});
    setTimeout(() => {
        initPrompt();
    }, 100);
};

const addEmployee = (employee) => {
    db.query(`INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (${employee.id}, ${employee.first_name}, ${employee.last_name}, ${employee.role_id}, ${employee.manager_id})`, (err, res) => {
        if (err) {
            console.log(err)
        }
        console.log(res);
    })
    setTimeout(() => {
        initPrompt();
    }, 100);
};

const updateEmployee = (employee, newRole) => {
    db.query(`UPDATE employee SET role_id = "${newRole}" WHERE id = ${employee.id}`, (err, res) => {
        if (err) {
            console.log(err)
        }
        console.log(res);
    })
    setTimeout(() => {
        initPrompt();
    }, 100);
};


const getDeptNames = () => {
    db.query(`SELECT * FROM department`, (err, res) => {
        if (err) {
          console.log(err);
        };
        for(var i = 0; i < res.length; i++) {
            deptNames[i] = res[i].name;
        };
    });
};


function init() {
    initPrompt();
};

init();