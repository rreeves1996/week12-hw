INSERT INTO department (name)
VALUES  ("Management"),
        ("Quality control department"),
        ("Customer relations department"),
        ("HR department");

INSERT INTO role (title, salary, department_id)
VALUES  ("Team Lead", "500000", 1),
        ("QC Tester", "70000", 2),
        ("Customer Service Specialist", "55000", 3),
        ("HR Specialist", "75000", 4);
        

INSERT INTO employee (first_name, last_name, role_id)
VALUES  ("Ryan", "Reeves", 1),
        ("Man", "Ejherr", 1),
        ("Jim", "Johnson", 2),
        ("Victoria", "Antonelli", 2),
        ("Daniel", "Tompkins", 4),
        ("Spencer", "Sotello", 4),
        ("Bartholomule", "Smith", 3);