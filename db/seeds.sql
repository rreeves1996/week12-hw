INSERT INTO department (name)
VALUES  ("Quality control department"),
        ("Customer relations department"),
        ("HR department"),
        ("Management");

INSERT INTO role (title, salary, department_id)
VALUES  ("QC Tester", "70000", 1),
        ("Customer Service Specialist", "55000", 2),
        ("HR Specialist", "75000", 3),
        ("Team Lead", "500000", 4);
        

INSERT INTO employee (first_name, last_name, role_id)
VALUES  ("Ryan", "Reeves", 4),
        ("Jim", "Johnson", 2),
        ("Victoria", "Antonelli", 2),
        ("Daniel", "Tompkins", 1),
        ("Spencer", "Sotello", 1),
        ("Bartholomule", "Smith", 3);