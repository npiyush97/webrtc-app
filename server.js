const express = require("express");
const path = require("path");
const http = require("http");
const app = express();
const server = http.createServer(app);
const { ExpressPeerServer } = require("peer");
const port = process.env.PORT || 3000;

const peerServer = ExpressPeerServer(server, {
  port: 4043,
  proxied: true,
  debug: true,
  path: "/myapp",
  ssl: {},
});

app.use(peerServer);
app.use(express.static(path.join(__dirname)));

app.use("/", (request, response) => {
  response.sendFile(`${__dirname}/index.html`);
});

server.listen(port);
console.log(`Server is listening at port:${port}`);
