const opcua = require("node-opcua");
const endpointUrl = "opc.tcp://192.168.0.120:4840";
const async = require("async");

const options = {
  endpointMustExist: false,
  requestedSessionTimeout: 30 * 60 * 1000,
  // connectionStrategy: { maxRetry: 1 },
  keepSessionAlive: true,
};
const auth = {
  userName: "user3",
  password: "12345678",
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
          client.createSession(auth, function (err, session) {
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
    const opcNodes = [];
    return new Promise(function (resolve, reject) {
      theSession.browse(
        opcua.resolveNodeId(nodeId),
        function (err, browseResult) {
          if (!err) {
            browseResult.references.forEach(function (reference) {
              let node = new OpcNode(reference.browseName.toString());
              node.id = reference.nodeId.toString();
              node.key = reference.nodeId;
              node.class = reference.nodeClass;
              node.value = reference.nodeId.value;
              console.log(reference);

              opcNodes.push(node);
            });

            if (browseResult.continuationPoint) {
              _browseNext(browseResult.continuationPoint).then((nodes) => {
                resolve([...opcNodes, ...nodes]);
              });
            } else {
              resolve(opcNodes);
            }

            console.log("______________________");
          } else {
            reject(err);
          }
        }
      );
    });
  }
}
async function stopOPCUAClient() {
  if (theSession) await session.close();
  if (client) await client.disconnect();
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
const _browseNext2 = async function (contipoint) {
  try {
    const opcNodes = [];
    const browseNextRequest = new opcua.BrowseNextRequest({
      continuationPoints: [contipoint],
    });
    await theSession.performMessageTransaction(
      browseNextRequest,
      (err, res) => {
        res.results[0].references.forEach(function (reference) {
          let node = new OpcNode(reference.browseName.toString());
          node.id = reference.nodeId.toString();
          node.key = reference.nodeId;
          node.class = reference.nodeClass;
          node.value = reference.nodeId.value;

          opcNodes.push(node);
        });
      }
    );
    return opcNodes;
  } catch (error) {
    console.log(error);
  }
};

const _browseNext = function (contipoint) {
  const opcNodes = [];
  const browseNextRequest = new opcua.BrowseNextRequest({
    continuationPoints: [contipoint],
  });
  return new Promise(function (resolve, reject) {
    theSession.performMessageTransaction(
      browseNextRequest,
      function (err, response) {
        if (err) {
          reject(err);
        } else {
          if (response.results && response.results[0]) {
            let browseResult = response.results[0];
            browseResult.references.forEach(function (reference) {
              let node = new OpcNode(reference.browseName.toString());
              node.id = reference.nodeId.toString();
              node.key = reference.nodeId;
              node.class = reference.nodeClass;
              node.value = reference.nodeId.value;
              console.log(reference);
              opcNodes.push(node);
            });
            if (browseResult.continuationPoint) {
              _browseNext(browseResult.continuationPoint).then((nodes) => {
                resolve([...opcNodes, ...nodes]);
              });
            } else {
              return resolve(opcNodes);
            }
            return resolve(opcNodes);
          } else {
            return resolve(opcNodes);
          }
        }
      }
    );
  });
};
function isEmpty(obj) {
  for (let key in obj) {
    return false;
  }
  return true;
}
(module.exports = OPCUAClientHeandler), stopOPCUAClient;
