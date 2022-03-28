const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const router = require("./routers/index");
const stopOPCUAClient = require("./source/browseOPC");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// Основной роутер
app.use("/", router);

app.listen(3000, () => {
  console.log("Express WEB server started listening");
});

process.once("SIGINT", async () => {
  console.log("shutting down client");

  await stopOPCUAClient();
  console.log("Done");
  process.exit(0);
});
