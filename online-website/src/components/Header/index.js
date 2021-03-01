import React from "react";
import "./index.less";
import { GithubOutlined } from "@ant-design/icons";
export default function Header() {
  return (
    <div className="top-header">
      <div className="left-container"></div>
      <div className="right-container">
        <GithubOutlined />
      </div>
    </div>
  );
}
