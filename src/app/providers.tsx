"use client";

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, useMsal } from "@azure/msal-react";

const msalConfig = {
  auth: {
    clientId: "your-azure-client-id", // Replace with your Azure AD App client ID
    authority: "https://login.microsoftonline.com/your-tenant-id", // Replace with your tenant ID
    redirectUri: "http://localhost:3000",
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}
