const http = require("http");
const pug = require("pug");
require("dotenv").config();
const fs = require("fs");

const { PORT, LOCALHOST } = process.env;

const server = http.createServer((req, res) => {
  switch (req.url) {
    case "/":
      if (req.method === "GET") {
        const homeHtml = pug.renderFile("./views/home.pug", {
          pageTitle: "Home",
        });
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(homeHtml);
      }
      break;

    case "/add":
      if (req.method === "POST") {
        let body = "";
        req.on("data", chunk => {
          body += chunk.toString();
        });

        req.on("end", () => {
          //console.log(body);
          const [nameField, birthField] = body.split("&");
          //console.log(nameField, birthField);
          const name = nameField.split("=")[1];
          //console.log(name);
          const birth = birthField.split("=")[1];
          //console.log(birth);


          fs.readFile("./Data/users.json", "utf-8", (err, data) => {
            if (err) {
              res.writeHead(500, { "Content-Type": "text/plain" });
              res.end("Erreur lors de la lecture du fichier users.json");
              return;
            }

            const users = JSON.parse(data);
            users.push({ name, birth });

            fs.writeFile("./Data/users.json", JSON.stringify(users, null, 2), err => {
              if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Erreur lors de l'écriture dans le fichier users.json");
                return;
              }

              res.writeHead(302, { Location: "/users" });
              res.end();
            });
          });
        });
      }
      break;

    case "/users":
      if (req.method === "GET") {

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
      }
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