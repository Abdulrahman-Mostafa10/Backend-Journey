-- Write your PostgreSQL query statement below
SELECT DISTINCT
    (viewer_id) AS id
FROM
    Views
WHERE
    viewer_id = author_id
ORDER BY
    viewer_id