const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url,
    method = req.method;
  if (url === "/") {
    res.write("<!DOCTYPE HTML><html><head><title>Enter Message</title></head>");
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="textArea"><button type="submit">Send</button></form></body></html>'
    );
    return res.end();
  } else if (url === "/message" && method === "POST") {
    const body = []; // For storing the chunks of the request being sent
    req.on("data", (chunk) => {
      // Event listener for every arrived chunk of data in the request
      body.push(chunk);
    });

    return req.on("end", () => {
      // Event listener for the end of the request being sent
      const parsedData = Buffer.concat(body).toString();
      const message = parsedData.split("=")[1]; // The message being sent is (key=value) which is (textArea=message)
      fs.writeFile("message.txt", message, (err) => {
        console.log(err);
        res.writeHead(302, { Location: "/" }); // Redirecting the user to the home page and updating the status code to 302 to know whether the redirection is successful or not
        res.end();
      });
    });
  }
  res.write(
    "<!DOCTYPE HTML><html><head><title>My First Response</title></head>"
  );
  res.write(
    "<body><h1>Hello World!</h1><p>This is my first response to a request.</p></body></html>"
  );
  res.end();
};

module.exports = requestHandler;
