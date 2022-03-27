const opcua = require("node-opcua");
const endpointUrl = "opc.tcp://127.0.0.1:53530";
const async = require("async");

const options = {
  endpointMustExist: false,
  // requestedSessionTimeout: 30 * 60 * 1000,
  // connectionStrategy: { maxRetry: 1 },
  keepSessionAlive: true,
};
let theSession;
const client = opcua.OPCUAClient.create(options);

class OPCUAClientHeandler {
  start() {
    async.series(
      [
        // step 1 : connect to
        function (callback) {
          client.connect(endpointUrl, function (err) {
            if (err) {
              console.log(" cannot connect to endpoint :", endpointUrl);
            } else {
              console.log("OPC UA CLIENT connected !", endpointUrl);
            }
            callback(err);
          });
        },
        // step 2 : createSession
        function (callback) {
          client.createSession(function (err, session) {
            if (!err) {
              theSession = session;
              console.log("session created!");
            }
            callback(err);
          });
        },
      ],
      function (err) {
        if (err) {
          console.log(" failure ", err);
          process.exit(0);
        } else {
          console.log("...await for signals...");
        }
        //client.disconnect(function () {});
        //console.log("done!");
      }
    );
  }
  browseNode(nodeId) {
    // const nodeId = _nodeId ? _nodeId : opcua.resolveNodeId("RootFolder");
    return new Promise(function (resolve, reject) {
      theSession.browse(
        opcua.resolveNodeId(nodeId),
        function (err, browseResult) {
          if (!err) {
            let opcNodes = [];
            browseResult.references.forEach(function (reference) {
              //console.log(reference.browseName.toString());
              let node = new OpcNode(reference.browseName.toString());
              node.id = reference.nodeId;
              node.key = reference.nodeId;
              node.class = reference.nodeClass;

              if (!node) {
                return;
              }
              console.log(reference);

              opcNodes.push(node);
            });
            resolve(opcNodes);
            console.log("_______________________");
          } else {
            reject(err);
          }
        }
      );
    });
  }
}

class OpcNode {
  constructor(title) {
    this.title = title;
    this.id = "";
    this.class = "";
    this.type = "";
    this.value = "";
    this.timestamp = "";
    this.attribute;
    this.children = [];
    this.isLeaf = false;
  }
}

module.exports = OPCUAClientHeandler;
