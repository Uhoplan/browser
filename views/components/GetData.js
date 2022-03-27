import React from "react";
import { useState, useEffect } from "react";

const url = "http://localhost:3000/";

function insertNodes(origin, targetId, insertArr) {
  return origin.map((node) => {
    if (node.id === targetId) {
      console.log("insertNodes:", insertArr);
      return {
        ...node,
        children: insertArr,
      };
    }
    if (node.children) {
      return insertNodes(node.children, targetId, insertArr);
    }
    return node;
  });
}

function GetData() {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        return setNodes(data);
      });
  }, []);

  async function handleClick(nodeId) {
    const result = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ nodeName: nodeId }),
    }).then((res) => res.json());
    setNodes((origin) => insertNodes(origin, nodeId, result));
  }
  const renderTree = (node) => (
    console.log("NODE -:", node),
    (
      <TreeItem
        key={node.id}
        nodeId={node.id}
        label={node.name}
        onClick={() => {
          handleClick(node.id);
        }}
      >
        {node.children ? node.children.map((node) => renderTree(node)) : null}

        {/* {Array.isArray(node.children)
          ? node.children.map((node) => renderTree(node))
          : null} */}
      </TreeItem>
    )
  );
  return (
    <TreeView
      aria-label="file system navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
    >
      <TreeItem key="root" nodeId="root" label="root">
        {nodes.map((node) => renderTree(node))}
      </TreeItem>
    </TreeView>
  );
}

export default GetData;
