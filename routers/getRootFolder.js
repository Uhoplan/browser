const { Router } = require("express");
const router = new Router();
const OPCUAClientHeandler = require("../source/browseOPC");

const browseNodes = new OPCUAClientHeandler();
browseNodes.start();

router.get("/", (req, res) => {
  browseNodes.browseNode("RootFolder").then((result) => res.send(result));
});
router.post("/", (req, res) => {
  browseNodes.browseNode(req.body.nodeName).then((result) => res.send(result));
});
module.exports = router;
