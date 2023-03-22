import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Auth0Provider } from "@auth0/auth0-react";
// import { MantineProvider } from "@mantine/core";
// import { testTheme } from "./common/theme";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const domain: string = process.env.REACT_APP_AUTH0_DOMAIN as string;
const clientId: string = process.env.REACT_APP_AUTH0_CLIENT_ID as string;
const audience: string = process.env.REACT_APP_AUTH0_AUDIENCE as string;

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: "http://localhost:3000/tracker",
        audience,
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
