const http = require("http");

const routes = require("./routes/routes");
const server = http.createServer(routes);

server.listen(3000);
