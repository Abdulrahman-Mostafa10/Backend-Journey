-- Challenge: 1
SELECT
    customer_id
FROM
    payment
WHERE
    staff_id = 2
GROUP BY
    customer_id
HAVING
    SUM(amount) >= 110;

-- Challenge: 2
SELECT
    COUNT(*)
FROM
    film
WHERE
    title LIKE 'J%';

-- Challenge: 3
SELECT
    first_name,
    last_name
FROM
    customer
WHERE
    first_name LIKE 'E%'
    AND address_id < 500
ORDER BY
    customer_id DESC
LIMIT
    1;