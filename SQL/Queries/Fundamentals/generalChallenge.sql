-- Challenge-1:
SELECT
    COUNT(*)
FROM
    payment
WHERE
    amount > 5;

-- Challenge-2:
SELECT
    COUNT(*)
FROM
    actor
WHERE
    first_name LIKE 'P%';

-- Challenge-3:
SELECT
    COUNT(DISTINCT (district))
from
    address;

-- Challenge-4:
SELECT
    COUNT(*)
FROM
    film
WHERE
    rating = 'R'
    AND replacement_cost BETWEEN 5 AND 15;

-- Challenge-5:
SELECT
    COUNT(*)
FROM
    film
WHERE
    title LIKE '%Truman%';

-- Challenge-6:
