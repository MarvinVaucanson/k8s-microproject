const express = require("express");
const fs = require("node:fs");
const https = require("https");

const app = express();
const port = 8080;  

const privateKey = fs.readFileSync("tls.key", "utf8");
const certificate = fs.readFileSync("tls.crt", "utf8");
const credentials = { key: privateKey, cert: certificate };

const logPath = "/app/logs/out.log";
if (!fs.existsSync("/app/logs")) {
  fs.mkdirSync("/app/logs", { recursive: true });
}

// Route HTTP
app.get("/", (req, res) => {
  res.send("Hello, Kubernetes!");
  const name = process.env.USER_NAME || "name unset";
  const content = `Hello, ${name}! \n`;
  fs.writeFile(logPath, content, (err) => {
    if (err) {
      console.error("Error while logging :", err);
    } else {
      console.log("File written successfully");
    }
  });
});

https.createServer(credentials, app).listen(port, () => {
  console.log(`App listening at https://localhost:${port}`);
});
