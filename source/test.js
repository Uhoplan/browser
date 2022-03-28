async function browseNodes() {
    const opcNodes = [];
    theSession.browse(
        opcua.resolveNodeId(nodeId),
        function (err, browseResult) {
          if (!err) {
            //console.log("Я ПОказал из browse:", browseResult);
            browseResult.references.forEach(function (reference) {
              let node = new OpcNode(reference.browseName.toString());
              node.id = reference.nodeId;
              node.key = reference.nodeId;
              node.class = reference.nodeClass;
              opcNodes.push(node);
            });
            if (browseResult.continuationPoint) {
              _browseNext(browseResult.continuationPoint).then((nodes) => {
                // console.log("Ноды из Contypoint browse:", nodes);
                for (let i = 0; i < nodes.length; i++) {
                  opcNodes.push(nodes[i]);
                }
                return  [...opcNodes, ...nodes];
              });
            }
}
        }