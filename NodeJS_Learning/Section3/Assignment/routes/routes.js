const fs = require("fs");

const serverHandler = (req, res) => {
  const url = req.url,
    method = req.method;
  res.setHeader(`Content-Type`, `text/html`);
  console.log(`Server is listening on port 3000`);
  if (url === "/") {
    res.write(
      `<!DOCTYPE html><html><head><title>Assignment of Section Three</title></head>`
    );
    res.write(
      `<body><h1>Welcome to our form</h1><div><p>Add a novel user</p><form action="/create-user" method="POST"><input type="text" name="textArea"><button type="submit">Submit</button></form></div></body></html>`
    );

    return res.end();
  } else if (url === `/create-user` && method === `POST`) {
    const body = [];

    req.on(`data`, (chunk) => {
      body.push(chunk);
    });

    return req.on(`end`, () => {
      const userName = decodeURIComponent(
        Buffer.concat(body).toString().split("=")[1]
      ).replace(/\+/g, ` `);

      fs.appendFile(`user.txt`, userName + "\n", (err) => {
        if (err) {
          console.log(err);
          res.writeHead(500, { Location: "/", "Content-Type": "text/plain" });
          res.write(`An error occurred while appending the file`);
        } else {
          res.writeHead(302, { Location: "/" });
        }

        res.end();
      });
    });
  } else if (url === `/users` && method === `GET`) {
    return fs.readFile(`user.txt`, (err, data) => {
      if (err) {
        console.log(err);
        res.writeHead(500, { Location: "/", "Content-Type": "text/plain" });
        res.write(`An error occurred while reading from the file`);
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(
          `<!DOCTYPE html><html><head><title>Assignment of Section Three</title></head>`
        );
        res.write(`<body><h1>Users</h1><ul>`);
        const users = data.toString().split(`\n`);
        users.forEach((user) => {
          if (user) {
            res.write(`<li>${user}</li>`);
          }
        });
        res.write(`</ul></body></html>`);
      }
      res.end();
    });
  }
  res.write(
    `<!DOCTYPE html><html><head><title>Assignment of Section Three</title></head>`
  );
  res.write(
    `<body><h1><b>404</b> Page Not Found</h1><p>Sorry, the page you are looking for is not found.</p></body></html>`
  );
  res.end();
};
module.exports = serverHandler;
