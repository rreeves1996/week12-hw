class Employee {
    constructor(employee_id, first_name, last_name, manager_id, department_id, role_id) {
        this.employee_id = employee_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.manager_id = manager_id;
        this.department_id = department_id;
        this.role_id = role_id;
    }
}

module.exports = Employee;