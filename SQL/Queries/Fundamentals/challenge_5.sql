-- Challenge:1
SELECT
    staff_id,
    COUNT(payment_id)
FROM
    payment
GROUP BY
    staff_id;

-- Challenge:2
SELECT
    rating,
    ROUND(AVG(replacement_cost), 3)
FROM
    film
GROUP BY
    rating;

-- Challenge:3
SELECT
    customer_id,
    SUM(amount)
FROM
    payment
GROUP BY
    customer_id
ORDER BY
    SUM(amount) DESC
LIMIT
    5;

-- Challenge:4