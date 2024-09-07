SELECT
    *
FROM
    cd.facilities;

SELECT
    name,
    memebercost
FROM
    cd.facilities;

------------------
SELECT
    *
FROM
    cd.facilities
WHERE
    membercost != 0;

-------------------
SELECT
    facid,
    name,
    membercost,
    monthlymaintenance
FROM
    cd.facilities
WHERE
    membercost != 0
    AND membercost < monthlymaintenance / 50;

-------------------
SELECT
    *
FROM
    cd.facilities
WHERE
    name LIKE '%Tennis%';

-------------------
SELECT
    *
FROM
    cd.facilities
WHERE
    facid IN (1, 5);

-------------------
SELECT
    memid,
    surname,
    firstname,
    joindate
FROM
    CD.MEMBERS
WHERE
    joindate >= ('2012-09-1');

-------------------
SELECT DISTINCT
    (surname)
FROM
    cd.members
ORDER BY
    surname
LIMIT
    10;

-------------------
SELECT
    joindate
FROM
    cd.members
ORDER BY
    memid DESC
LIMIT
    1;

-------------------
SELECT
    COUNT(*)
FROM
    cd.facilities
WHERE
    guestcost >= 10;

-------------------
SELECT
    cd.facilities.facid,
    SUM(slots)
FROM
    cd.bookings
    JOIN cd.facilities ON cd.facilities.facid = cd.bookings.facid
WHERE
    EXTRACT(
        MONTH
        FROM
            starttime
    ) = 9
GROUP BY
    cd.facilities.facid
ORDER BY
    sum(slots);

-------------------
SELECT
    cd.facilities.facid,
    SUM(slots)
FROM
    cd.bookings
    JOIN cd.facilities ON cd.facilities.facid = cd.bookings.facid
GROUP BY
    cd.facilities.facid
HAVING
    SUM(slots) > 1000
ORDER BY
    cd.facilities.facid;

-------------------
SELECT
    starttime,
    name
FROM
    cd.bookings
    JOIN cd.facilities ON cd.facilities.facid = cd.bookings.facid
WHERE
    starttime > '2012-09-21'
    AND starttime < '2012-09-22'
    AND name LIKE 'Tennis Court%'
ORDER BY
    starttime;

-------------------
SELECT
    starttime
FROM
    cd.bookings
    JOIN cd.members ON cd.members.memid = cd.bookings.memid
WHERE
    firstname = 'David'
    AND surname = 'Farrell'
GROUP BY
    cd.bookings.starttime;