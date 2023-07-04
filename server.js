const express = require("express");
require("dotenv").config();
const app = express();
const port = 4000;
const http = require("http");
const server = http.createServer(app);
const passwordVerification = require("./src/hiportal/passwordVerification.js");
const generateIntance = require("./src/hiportal/generateIntance.js");
const variables = require("./src/variables.js");

app.get("/", async (req, res) => {
  while (!variables.lastResult.total_kwh) {
    console.log("Waiting for first result");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  res.send(variables.lastResult);
});

(async () => {
  variables.instance = await generateIntance();
  const result = await passwordVerification(
    variables.instance.page,
    variables.instance.browser
  );
  if (result == false) {
    console.log("Password verification failed");
    process.exit(1);
  } else {
    console.log("Password verification success");
    variables.renewing = false;
    console.log("Starting cron...");
    await require("./src/cron/index.js")();
    server.listen(port, () => console.log(`Server is running on port ${port}`));
  }
})();
