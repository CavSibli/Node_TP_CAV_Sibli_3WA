const http = require("http");
const pug = require("pug");
require("dotenv").config();

const { PORT, LOCALHOST } = process.env;

const server = http.createServer((req, res) => {
  if (req.url === "/" ) {
    const html = pug.renderFile("./views/home.pug", {
      pageTitle: "Home"
    });
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Page non trouvée");
  }
});

server.listen(PORT || 8000, LOCALHOST, () => {
  console.log(`Server is running at http://${LOCALHOST}:${PORT || 8000}`);
});