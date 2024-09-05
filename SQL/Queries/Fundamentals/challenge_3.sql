-- Requirement-1 --
SELECT
    email
FROM
    customer
WHERE
    first_name = 'Nancy'
    AND last_name = 'Thomas';

-- Requirement-2 --
SELECT
    description
FROM
    film
WHERE
    title = 'Outlaw Hanky';

-- Requirement-3 --
SELECT
    phone
FROM
    address
WHERE
    address = '259 Ipoh Drive';