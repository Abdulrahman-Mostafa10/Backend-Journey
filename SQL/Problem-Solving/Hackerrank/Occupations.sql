WITH
    RankedOccupations AS (
        SELECT
            Name,
            Occupation,
            ROW_NUMBER() OVER (
                PARTITION BY
                    Occupation
                ORDER BY
                    Name
            ) AS row_num
        FROM
            OCCUPATIONS
    )
SELECT
    MAX(
        CASE
            WHEN Occupation = 'Doctor' THEN Name
        END
    ),
    MAX(
        CASE
            WHEN Occupation = 'Professor' THEN Name
        END
    ),
    MAX(
        CASE
            WHEN Occupation = 'Singer' THEN Name
        END
    ),
    MAX(
        CASE
            WHEN Occupation = 'Actor' THEN Name
        END
    )
FROM
    RankedOccupations
GROUP BY
    row_num
ORDER BY
    row_num;