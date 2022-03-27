import Tree from "rc-tree";
import React from "react";
import { useState, useEffect } from "react";
import "rc-tree/assets/index.css";
const url = "http://localhost:3000/";

const ObjectTree = () => {
  const [treeData, setTreeData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);

  useEffect(
    () =>
      fetch("http://localhost:3000/")
        .then((res) => res.json())
        .then((data) => setTreeData(data)),
    []
  );

  const updateTreeData = (list, key, children) =>
    list.map((node) => {
      if (node.key === key) {
        return { ...node, children };
      }
      if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children),
        };
      }
      return node;
    });

  const onExpand = async (_, { node }) => {
    const { key, children } = node;
    if (!children.length) {
      const data = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ nodeName: node.key }),
      }).then((res) => res.json());

      setTreeData((origin) => updateTreeData(origin, key, data));
    }
  };
  const onSelect = (_, { node }) => {
    onExpand(null, { node });
    setExpandedKeys((origin) =>
      node.expanded
        ? origin.filter((key) => key !== node.key)
        : [...origin, node.key]
    );
  };

  return (
    <div
      style={{
        padding: "0px 10px",
        height: 400,
        width: 400,
        userSelect: "none",
      }}
    >
      <Tree
        virtual
        itemHeight={24}
        treeData={treeData}
        selectedKeys={[]}
        expandedKeys={expandedKeys}
        onExpand={onExpand}
        onSelect={onSelect}
        height={400}
        switcherIcon={false}
      />
    </div>
  );
};

const noDataNode = (key, next) => [
  {
    key: key + "_noData",
    title: noDataMap[next],
    isLeaf: true,
    disabled: true,
  },
];
const noDataMap = { pads: "Нет кустов", wells: "Нет скважин" };

export default ObjectTree;
