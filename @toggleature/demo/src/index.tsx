import "sanitize.css";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Iframe from "./Iframe";

const iframeMode = window !== window.parent;
const rootId = iframeMode ? "frame" : "root"; // has different styling
let element = document.createElement("div") as HTMLDivElement;
element.setAttribute("id", rootId);
document.body.append(element);

renderApp();

function renderApp() {
  const domContainer = window.document.getElementById(rootId);

  if (iframeMode) {
    ReactDOM.render(<Iframe />, domContainer);
  } else {
    ReactDOM.render(<App />, domContainer);
  }
}
