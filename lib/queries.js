const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "",
        database: "employee_db"
    },
    console.log("Connected to the database")
);

const viewDepartments = () => {
    db.query(`SELECT * FROM department`, (err, res) => {
        console.log(res);
    })
};

const viewRoles = () => {
    db.query(`SELECT * FROM role`, (err, res) => {
        console.log(res);
    })
};

const viewEmployees = () => {
    db.query(`SELECT * FROM employee`, (err, res) => {
        console.log(res);
    })
};

const addDepartment = (department) => {
    db.query(`INSERT INTO department (name) VALUES (${department.name})`, (err, res) => {
        if (err) {
            console.log(err)
        }
        console.log(res);
    })
};

const addRole = (role) => {
    db.query(`INSERT INTO role (title, salary, department_id) VALUES (${role.title}, ${role.salary}, ${role.department_id})`, (err, res) => {
        if (err) {
            console.log(err)
        }
        console.log(res);
    })
};

const addEmployee = (employee) => {
    db.query(`INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (${employee.id}, ${employee.first_name}, ${employee.last_name}, ${employee.role_id}, ${employee.manager_id})`, (err, res) => {
        if (err) {
            console.log(err)
        }
        console.log(res);
    })
};

const updateEmployee = (employee, newRole) => {
    db.query(`UPDATE employee SET role_id = "${newRole}" WHERE id = ${employee.id}`, (err, res) => {
        if (err) {
            console.log(err)
        }
        console.log(res);
    })
};
