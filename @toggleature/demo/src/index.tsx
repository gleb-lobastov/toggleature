import "sanitize.css";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Iframe from "./Iframe";


let element = document.createElement("div") as HTMLDivElement;
element.setAttribute("id", "root");
document.body.append(element);

renderApp();

function renderApp() {
  const domContainer = window.document.getElementById("root");
  const iframeMode = window !== window.parent;

  if (iframeMode) {
    ReactDOM.render(<Iframe />, domContainer);
  } else {
    ReactDOM.render(<App/>, domContainer);
  }
}
