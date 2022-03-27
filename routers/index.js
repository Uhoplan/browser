const { Router } = require("express");
const router = new Router();
const RootFolder = require("./getRootFolder");

router.use("/", RootFolder);

module.exports = router;
