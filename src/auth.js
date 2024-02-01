
// Config object to be passed to Msal on creation
export const msalConfig = {
  auth: {
    clientId: "72a676c1-2c77-4f07-ad57-417b17e33305",
    authority: `https://login.microsoftonline.com/common`,
    redirectUri: 'http://localhost:3000/',
    postLogoutRedirectUri: "/"
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: true,
  }
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest = {
  scopes: ['calendars.read', 'user.read', 'openid', 'profile', 'people.read', 'user.readbasic.all']
};

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft-ppe.com/v1.0/me"
};

export const signInWithMicrosoft = async () => {
}
