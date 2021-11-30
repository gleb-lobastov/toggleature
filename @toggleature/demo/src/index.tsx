import "sanitize.css";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

let element = document.createElement("div") as HTMLDivElement;
element.setAttribute("id", "root");
document.body.append(element);

renderApp();

function renderApp() {
  const domContainer = window.document.getElementById("root");
  ReactDOM.render(<App />, domContainer);
}
