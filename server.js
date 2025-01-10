const http = require("http");
const pug = require("pug");
require("dotenv").config();
const fs = require("fs");


const { PORT, LOCALHOST } = process.env;

const server = http.createServer((req, res) => {
  switch (req.url) {
    
    case "/":
      const homeHtml = pug.renderFile("./views/home.pug", {
        pageTitle: "Home",
      });
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(homeHtml);
      break;

    case "/users":
    fs.readFile("./Data/users.json", "utf-8", (err, data) => {
        if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Erreur lors de la lecture du fichier users.json");
        return;
        }
    
        const users = JSON.parse(data);
        const usersHtml = pug.renderFile("./views/users.pug", {
        pageTitle: "Users",
        users: users, 
        });
    
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(usersHtml);
    });
    break;

    default:
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Page non trouvée");
      break;
  }
});

server.listen(PORT || 8000, LOCALHOST || "localhost", () => {
  console.log(`Server is running at http://${LOCALHOST || "localhost"}:${PORT || 8000}`);
});