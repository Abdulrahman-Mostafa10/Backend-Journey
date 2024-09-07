--Challenge:1
SELECT DISTINCT
    (TO_CHAR (payment_date, 'Month'))
FROM
    payment;

--Challenge:2
SELECT
    COUNT(*)
FROM
    payment
WHERE
    EXTRACT(
        DOW
        FROM
            payment_date
    ) = 1;

--Challenge:3
