-- Challenge:1
SELECT
    customer_id,
    COUNT(*)
FROM
    payment
GROUP BY
    customer_id
HAVING
    COUNT(*) >= 40;

-- Challenge:2
SELECT
    customer_id,
    SUM(amount)
FROM
    payment
WHERE
    staff_id = 2
GROUP BY
    customer_id
HAVING
    SUM(amount) > 100;

-- Challenge:3
