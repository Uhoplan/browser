const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const router = require("./routers/index");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// Основной роутер
app.use("/", router);

app.listen(3000, () => {
  console.log("Express WEB server started listening");
});
