-- Requirement: 1
SELECT
    customer_id
FROM
    payment
ORDER BY
    payment_date ASC
LIMIT
    10;

-- Requirement: 2
SELECT
    title,
    length
FROM
    film
ORDER BY
    length ASC
LIMIT
    5;

-- Bonus Requirement    
SELECT
    COUNT(*)
FROM
    film
WHERE
    length <= 50;