require("dotenv").config();
const port = 4000;
const { createServer } = require("http");
const express = require("express");
const app = express();
const httpServer = createServer(app);
const { Server } = require("socket.io");
const io = new Server(httpServer, {
  cors: {
    withCredentials: false,
    cors: { origin: "*" },
    methods: ["GET", "POST"],
    allowedHeaders: ["Access-Control-Allow-Origin"],
  },
});
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const passwordVerification = require("./src/hiportal/passwordVerification.js");
const generateIntance = require("./src/hiportal/generateIntance.js");
const variables = require("./src/variables.js");

app.use(helmet());
app.use(cors());
app.set("trust proxy", 1);
app.use(morgan("combined"));

io.on("connection", async (socket) => {
  const req = socket.request;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  console.log("New connection from " + ip);
  while (!variables.lastResult.total_kwh) {
    console.log("Waiting for first result");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  socket.emit("data", variables.lastResult);
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

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
    httpServer.listen(port, () => {
      console.log(
        `⚡️[server]: Express server is running at http://localhost:${port}`
      );
    });
  }
})();
