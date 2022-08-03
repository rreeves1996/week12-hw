const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

var deptNames = [];
var roleNames = [];
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


// ----------------
// MAIN MENU PROMPTS
// ----------------

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
            addDeptPrompt();
            break;
        case 'Add a role':
            getAddRoleData();
            break;
        case 'Add an employee':
            getAddEmpData();
            break;
        case 'Update employee role':
            getUpdateEmpData();
            break;
        case 'Exit':
            console.log("Goodbye!");
            db.exit();
            break;
        default:
            break;
        };
    });
};

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
                db.end();
                break;
            default: break;
        }
    })
};


// ----------------
// QUERY PROMPTS
// ----------------

const addDeptPrompt = async () => {
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

const addRolePrompt = async () => {
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

const addEmpPrompt = async () => {
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

const updateEmpPrompt = async () => {
    await inquirer.prompt([
        {
        type: 'list',
        message: 'Please select employee to update: ',
        name: 'name',
        choices: empNames
        },
        {
        type: 'list',
        message: "Please select employee's new role: ",
        name: 'role',
        choices: roleNames
        }
    ]).then(response => {
        updateEmployee(response);
        console.log(`\nEmployee successfully updated!\n`);
    });
};


// ----------------
// VIEW
// ----------------

const viewDepartments = () => {
    db.query(`SELECT * FROM department`, (err, res) => {
        if (err) {
          console.log(err);
        };
        console.table(res);
    });

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

// ----------------
// ADD/UPDATE
// ----------------

const addDepartment = (department) => {
    // Insert inputted department name in to "department" table
    db.query(`INSERT INTO department (name) VALUES ("${department.name}")`, (err, res) => {
        if (err) {
            console.log(err)
        };
    });

    setTimeout(() => {
        contOrExitPrompt();
    }, 100);
};

const addRole = (role) => {
    // Pull department id from name of inputted department
    db.promise().query(`SELECT id FROM department WHERE name = ?`, role.department, (err, res) => {
        if (err) {
          console.log(err);
        };
    }).then(([res]) => {
        // Add role in to "role" table
        db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${role.role}", "${role.salary}", "${res[0].id}")`, (err, res) => {
            if (err) {
                console.log(err)
            };
        });
    });

    setTimeout(() => {
        contOrExitPrompt();
    }, 100);
};

const addEmployee = (employee) => {
    // Function to update global "managerID" variable that stores the current ID we need to use
    getManagerIDs();

    // Pull role id from selected role title
    db.promise().query(`SELECT id FROM role WHERE title = ?`, employee.role, (err, res) => {
        if (err) {
          console.log(err);
        };
    }).then(([res]) => {
        // Insert new employee in to "employee" table
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${employee.first_name}", "${employee.last_name}", "${res[0].id}", "${managerID[0]}")`, (err, res) => {
            if (err) {
                console.log(err)
            };
        });
    });
    
    setTimeout(() => {
        contOrExitPrompt();
    }, 100);
};

const updateEmployee = (employee) => {
    // Pull role id from selected role title
    db.promise().query(`SELECT id FROM role WHERE title = ?`, employee.role, (err, res) => {
        if (err) {
          console.log(err);
        };
    }).then(([res]) => {
        // Split first and last name of selected employee in order to parse database
        let empName = employee.name.split(" ");

        // Update employee role based on selected new role
        db.query(`UPDATE employee SET role_id = "${res[0].id}" WHERE first_name = "${empName[0]}" AND last_name = "${empName[1]}"`, (err, res) => {
            if (err) {
                console.log(err)
            }
        })});
    
    setTimeout(() => {
        contOrExitPrompt();
    }, 100);
};


// ----------------
// QUERY REFERENCES
// ----------------

function getManagerIDs() {
    // Get manager IDs and add them to var managerID
    db.query(`SELECT * FROM employee WHERE role_id = ?`, 4, (err, res) => {
        if (err) {
          console.log(err);
        };

        for(var i = 0; i < res.length; i++) {
            managerID[i] = res[i].id;
        };
    });
};

function getAddRoleData() {
    // Get department names and add them to var deptNames
    db.query(`SELECT * FROM department`, (err, res) => {
        if (err) {
          console.log(err);
        };

        for(var i = 0; i < res.length; i++) {
            deptNames[i] = res[i].name;
        };

        // Begin prompt for adding a new role
        addRolePrompt();
    });
};

function getAddEmpData() {
    // Get role names and add them to var roleNames
    db.query(`SELECT * FROM role`, (err, res) => {
        if (err) {
          console.log(err);
        };

        for(var i = 1; i < res.length; i++) {
            roleNames[i] = res[i].title;
        };

        // Get manager names and add them to var managerNames
        db.query(`SELECT * FROM employee WHERE role_id = ?`, 1, (err, res) => {
            if (err) {
              console.log(err);
            };

            for(var i = 0; i < res.length; i++) {
                managerNames[i] = res[i].first_name + " " + res[i].last_name;
            };

            // Begin prompt for adding a new employee
            addEmpPrompt();
        });
    });
};

function getUpdateEmpData() {
    // Get employee names and add them to var empNames
    db.query(`SELECT * FROM employee`, (err, res) => {
        if (err) {
          console.log(err);
        };

        for(var i = 0; i < res.length; i++) {
            empNames[i] = res[i].first_name + " " + res[i].last_name;
        };

        // Get role names and add them to var roleNames
        db.query(`SELECT * FROM role`, (err, res) => {
            if (err) {
              console.log(err);
            };

            for(var i = 1; i < res.length; i++) {
                roleNames[i] = res[i].title;
            };

            // Begin prompt for updating an employee
            updateEmpPrompt();
        });
    });
};


// ----------------
// INIT
// ----------------

function init() {
    initPrompt();
};

init();