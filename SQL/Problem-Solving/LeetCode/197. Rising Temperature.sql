SELECT
    f.id
FROM
    Weather AS f
    JOIN Weather AS s ON f.recordDate = s.recordDate + INTERVAL '1 day'
WHERE
    f.temperature > s.temperature