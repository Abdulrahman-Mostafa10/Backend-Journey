-- Challenge: 1
SELECT
    email
FROM
    customer
    JOIN address ON customer.address_id = address.address_id
WHERE
    district = 'California';

-- Challenge: 2
SELECT
    title
FROM
    film
    JOIN film_actor ON film.film_id = film_actor.film_id
    JOIN actor ON film_actor.actor_id = actor.actor_id
WHERE
    first_name = 'Nick'
    AND last_name = 'Wahlberg';