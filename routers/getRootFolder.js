const { Router } = require("express");
const router = new Router();
const OPCUAClientHeandler = require("../source/browseOPC");

const browseNodes = new OPCUAClientHeandler();
browseNodes.start();

router.get("/", (req, res) => {
  browseNodes.browseNode("RootFolder").then((result) => res.send(result));
});
router.post("/", (req, res) => {
  // console.log(req.body.nodeName);
  browseNodes.browseNode(req.body.nodeName).then((result) => res.send(result));
});
module.exports = router;
