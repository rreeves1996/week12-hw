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

const addDepartment = (name) => {
    db.query(`INSERT INTO department (name) VALUES (${name})`, (err, res) => {
        if (err) {
            console.log(err)
        }
        console.log(res);
    })
};

const addRole = (title, salary, department_id) => {
    db.query(`INSERT INTO role (title, salary, department_id) VALUES (${title}, ${salary}, ${department_id})`, (err, res) => {
        if (err) {
            console.log(err)
        }
        console.log(res);
    })
};

const addEmployee = (first_name, last_name, role_id, manager_id) => {
    db.query(`INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (${id}, ${first_name}, ${last_name}, ${role_id}, ${manager_id})`, (err, res) => {
        if (err) {
            console.log(err)
        }
        console.log(res);
    })
};

const updateEmployee = (employee_id, role_id) => {
    db.query(`UPDATE employee SET role_id = "${role_id}" WHERE id = ${employee_id}`, (err, res) => {
        if (err) {
            console.log(err)
        }
        console.log(res);
    })
};
