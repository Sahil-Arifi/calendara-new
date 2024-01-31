import { EventType, PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./auth";


const msalInstance= new PublicClientApplication(msalConfig);
msalInstance.addEventCallback((event) => {
  try {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
      msalInstance.setActiveAccount(event.payload.account);
    }
  } catch (error) {
    console.error("Something wrong in msalInstance.addEventCallback - ", error);
  }
});

export default function CustomMsalProvider({ children }) {
  return <MsalProvider instance={msalInstance}>
    {children}
  </MsalProvider>
}