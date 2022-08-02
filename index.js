const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

var deptNames = [];
var roleNames = [];
var roleIDs = [];
var managerNames = [];
var managerID = [];
var empNames = [];

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
            'Update employee role',
            'Exit'
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
            getRoleNames();
            getManagerNames();
            employeeQueryPrompt();
            break;
        case 'Update employee role':
            // getRoleNames();
            // getEmployeeNames();
            updateQueryPrompt();
            break;
        case 'Exit':
            console.log("Goodbye!");
            break;
        default:
            break;
        };
    });
};
const getData = () => {
    getRoleNames();
    getEmployeeNames();
    getManagerNames();
}
const contOrExitPrompt = async () => {
    await inquirer.prompt([
        {
        type: 'list',
        message: 'Please select an option:',
        name: 'option',
        choices: [
            'Main Menu', 
            'Exit'
        ]}
    ]).then(response => {
        switch (response.option) {
            case 'Main Menu':
                setTimeout(() => {
                    initPrompt();
                }, 100);
                break;
            case 'Exit':
                console.log("Goodbye!");
                console.log(response.name);
                break;
            default: break;
        }
    })
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
        addDepartment(response);
        console.log(`\nDepartment successfully added!\n`);
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
        message: 'Please select new role department: ',
        name: 'department',
        choices: deptNames
        }
    ]).then(response => {
        addRole(response);
        console.log(`\nRole successfully added!\n`);
    });
};

const employeeQueryPrompt = async () => {
    await inquirer.prompt([
        {
        type: 'input',
        message: 'Please input employee first name: ',
        name: 'first_name'
        },
        {
        type: 'input',
        message: 'Please input employee last name: ',
        name: 'last_name'
        },
        {
        type: 'list',
        message: 'Please input employee role: ',
        name: 'role',
        choices: roleNames
        },
        {
        type: 'list',
        message: 'Please select employee manager: ',
        name: 'manager_id',
        choices: managerNames
        }
    ]).then(response => {
        addEmployee(response);
        console.log(`\nEmployee successfully added!\n`);
    });
};

const updateQueryPrompt = async () => {
    await inquirer.prompt([
        {
        type: 'list',
        message: 'Please input new employee role: ',
        name: 'role',
        choices: ['a', 'b']
        },
        {
        type: 'input',
        message: 'Please select employee to update: ',
        name: 'name',
        choices: empNames
        }
    ]).then(response => {
        updateEmployee(response);
        console.log(`\nEmployee successfully updated!\n`);
    });
};


// VIEW x

const viewDepartments = async() => {
    db.query(`SELECT * FROM department`, (err, res) => {
        if (err) {
          console.log(err);
        };
        console.table(res);
    })
    setTimeout(() => {
        contOrExitPrompt();
    }, 1000);
};

const viewRoles = () => {
    db.query(`SELECT * FROM role`, (err, res) => {
        if (err) {
          console.log(err);
        };
        console.table(res);
    });
    setTimeout(() => {
        contOrExitPrompt();
    }, 1000);
};

const viewEmployees = () => {
    db.query(`SELECT * FROM employee`, (err, res) => {
        if (err) {
          console.log(err);
        };
        console.table(res);
    });
    setTimeout(() => {
        contOrExitPrompt();
    }, 1000);
};


// ADD x

const addDepartment = (department) => {
    db.query(`INSERT INTO department (name) VALUES (${department.name})`, (err, res) => {
        if (err) {
            console.log(err)
        }
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
    getManagerIDs();
    db.promise().query(`SELECT id FROM role WHERE title = ?`, employee.role, (err, res) => {
        if (err) {
          console.log(err);
        };
    }).then(([res]) => {
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${employee.first_name}", "${employee.last_name}", "${res[0].id}", "${managerID}")`, (err, res) => {
            if (err) {
                console.log(err)
            }
        })});
    setTimeout(() => {
        initPrompt();
    }, 100);
};

const updateEmployee = (employee) => {
    getRoleIDs();
    db.promise().query(`SELECT id FROM role WHERE title = ?`, employee.role, (err, res) => {
        if (err) {
          console.log(err);
        };
    }).then(([res]) => {
        db.query(`UPDATE employee SET role_id = "${res[0].id}" WHERE name = ${employee.name}`, (err, res) => {
            if (err) {
                console.log(err)
            }
        })});
    setTimeout(() => {
        initPrompt();
    }, 100);
};


// Transmute names from queries

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

const getRoleNames = () => {
    db.query(`SELECT * FROM role`, (err, res) => {
        if (err) {
          console.log(err);
        };
        for(var i = 1; i < res.length; i++) {
            roleNames[i] = res[i].title;
        };
    });
};

const getRoleIDs = (id) => {
    db.query(`SELECT id FROM role WHERE name = ?`, id, (err, res) => {
        if (err) {
          console.log(err);
        };
        for(var i = 0; i < res.length; i++) {
            roleNames[i] = res[i].title;
        };
    });
};

const getManagerNames = () => {
    db.query(`SELECT * FROM employee WHERE role_id = ?`, 1, (err, res) => {
        if (err) {
          console.log(err);
        };
        for(var i = 0; i < res.length; i++) {
            managerNames[i] = res[i].first_name + " " + res[i].last_name;
            console.log(managerNames[i]);
            console.log(res);
        };
    });
};

const getManagerIDs = () => {
    db.query(`SELECT * FROM employee WHERE role_id = ?`, 4, (err, res) => {
        if (err) {
          console.log(err);
        };
        for(var i = 0; i < res.length; i++) {
            managerID[i] = res[i].id;
        };
    });
};

const getEmployeeNames = () => {
    db.query(`SELECT * FROM employee`, (err, res) => {
        if (err) {
          console.log(err);
        };
        for(var i = 0; i < res.length; i++) {
            empNames[i] = res[i].first_name + " " + res[i].last_name;
            console.log(empNames[i]);
            
        };
        console.log(res);
    });
};

// INIT

function init() {
    initPrompt();
};

init();