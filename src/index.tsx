import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "./index.css";
import "semantic-ui-css/semantic.min.css";
import "./Styles/style.css"

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
