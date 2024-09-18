-- Write your PostgreSQL query statement below
SELECT
    E.name,
    UE.unique_id
FROM
    Employees AS E
    LEFT JOIN EmployeeUNI AS UE ON E.id = UE.id