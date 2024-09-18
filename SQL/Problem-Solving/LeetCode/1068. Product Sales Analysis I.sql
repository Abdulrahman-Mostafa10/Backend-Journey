-- Write your PostgreSQL query statement below
SELECT
    product_name,
    year,
    price
FROM
    Sales
    NATURAL JOIN Product