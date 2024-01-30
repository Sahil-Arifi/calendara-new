import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Providers } from "@microsoft/mgt-element";
import { Msal2Provider } from "@microsoft/mgt-msal2-provider";
import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

Providers.globalProvider = new Msal2Provider({
  clientId: "72a676c1-2c77-4f07-ad57-417b17e33305",
  scopes: ['calendars.read', 'user.read', 'openid', 'profile', 'people.read', 'user.readbasic.all']
});

const supabase = createClient(
  "https://lvhzrguxehlcogmzzgff.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2aHpyZ3V4ZWhsY29nbXp6Z2ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUzNjEyNDYsImV4cCI6MjAyMDkzNzI0Nn0.mRbz3mp1iFP_rsmQvnHKPrEmFLVPd1VvuiBBVCD1oXg"
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <App />
    </SessionContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
