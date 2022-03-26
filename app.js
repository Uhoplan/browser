const express = require("express");
const path = require("path");
const opcua = require("node-opcua");
//const Tree = require("./tree.min");
const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "./views"));

let fields = [
  { name: "Technology" },
  { name: "News" },
  { name: "Sports" },
  { name: "Travel" },
];

app.get("/", (req, res) => {
  const username = req.query.username;
  res.render("index", { user: username, fields: fields });
});

app.listen(3000, () => {
  console.log("Server started listening");
});
