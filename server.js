const http = require("http");
const pug = require("pug");
require("dotenv").config();
const fs = require("fs");
const { formatDate } = require("./utils"); 

const { APP_PORT, APP_LOCALHOST } = process.env;

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
            const [nameField, birthField] = body.split("&");
            const name = nameField.split("=")[1];
            const birth = birthField.split("=")[1];
  
           
            const errors = [];
            const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]([A-Za-zÀ-ÖØ-öø-ÿ\s'-]*[A-Za-zÀ-ÖØ-öø-ÿ])?$/;
  
            
            if (name.trim() === "") {
              errors.push("Le prénom ne peut pas être vide.");
            }
            if (!nameRegex.test(name)) {
              errors.push("Le prénom ne doit contenir que des lettres, des espaces, des apostrophes ou des tirets.");
            }
  
            
            if (errors.length > 0) {
              res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
              res.end("Erreur(s) de validation :\n" + errors.join("\n"));
              return;
            }
  
            fs.readFile("./Data/users.json", "utf-8", (err, data) => {
              if (err) {
                res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
                res.end("Erreur lors de la lecture du fichier users.json");
                return;
              }
  
              const users = JSON.parse(data);
              users.push({ name, birth });
  
              fs.writeFile("./Data/users.json", JSON.stringify(users, null, 2), err => {
                if (err) {
                  res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
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
            res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Erreur lors de la lecture du fichier users.json");
            return;
          }

          const users = JSON.parse(data);

          
          const formattedUsers = users.map(user => ({
            name: user.name,
            birth: formatDate(user.birth), 
          }));

          const usersHtml = pug.renderFile("./views/users.pug", {
            pageTitle: "Users",
            users: formattedUsers,
          });

          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end(usersHtml);
        });
      }
      break;

      case "/delete":
        if (req.method === "POST") {
          let body = "";
          req.on("data", chunk => {
            body += chunk.toString();
          });
  
          req.on("end", () => {
            const idField = body.split("=")[1]; 
            const index = parseInt(idField, 10); 
  
            fs.readFile("./Data/users.json", "utf-8", (err, data) => {
              if (err) {
                res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
                res.end("Erreur lors de la lecture du fichier users.json");
                return;
              }
  
              const users = JSON.parse(data);
  
              if (isNaN(index) || index < 0 || index >= users.length) {
                res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
                res.end("Index invalide");
                return;
              }
  
              users.splice(index, 1); 
  
              fs.writeFile("./Data/users.json", JSON.stringify(users, null, 2), err => {
                if (err) {
                  res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
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

    default:
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Page non trouvée");
      break;
  }
});

server.listen(APP_PORT, APP_LOCALHOST, () => {
  console.log(`Server is running at http://${APP_LOCALHOST}:${APP_PORT}`);
});