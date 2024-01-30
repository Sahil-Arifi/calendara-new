import React, { useEffect } from 'react';

const authEndpoint = 'https://login.microsoftonline.com/deabab6c-14e3-4d8b-95c3-94dae6f4c432/oauth2/v2.0/authorize';
const tokenEndpoint = 'https://login.microsoftonline.com/deabab6c-14e3-4d8b-95c3-94dae6f4c432/oauth2/v2.0/token';
const clientId = '72a676c1-2c77-4f07-ad57-417b17e33305';
const redirectUri = 'http://localhost:3000/';
const responseType = 'code';
const responseMode = 'query';
const scope = 'offline_access user.read mail.read';
const state = '12345';

// Function to generate a random string for PKCE
const generateRandomString = (length) => {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, (dec) => ('0' + dec.toString(16)).slice(-2)).join('');
  };
  
  // Generate a random code verifier and corresponding code challenge for PKCE
  const codeVerifier = generateRandomString(32);
  const codeChallenge = (() => {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hashed = window.crypto.subtle.digest('SHA-256', data);
    return new Promise((resolve) => {
      hashed.then((hashedArrayBuffer) => {
        const base64encoded = btoa(String.fromCharCode.apply(null, new Uint8Array(hashedArrayBuffer)))
          .replace(/=/g, '')
          .replace(/\+/g, '-')
          .replace(/\//g, '_');
        resolve(base64encoded);
      });
    });
  })();
  


const authorizeUrl = `${authEndpoint}?client_id=${clientId}&response_type=${responseType}&redirect_uri=${encodeURIComponent(redirectUri)}&response_mode=${responseMode}&scope=${encodeURIComponent(scope)}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

const authenticateWithMicrosoft = () => {
  window.location.href = authorizeUrl;
};

const MicrosoftAuthComponent = () => {
  useEffect(() => {
    // Handle the response after redirection from Microsoft login
    const handleAuthResponse = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const receivedState = urlParams.get('state');

      // Validate the state to prevent CSRF attacks
      if (receivedState === state) {
        // Exchange the authorization code for tokens using PKCE
        const tokenRequest = new Request(tokenEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: clientId,
            code: code,
            redirect_uri: redirectUri,
            // code_verifier: codeVerifier,
            grant_type: 'authorization_code',
            client_secret: 'bS~8Q~ZV-dWE7SVoQBJZgrCgkP19iwQ5CXKxidob'
          }),
        });

        try {
          const tokenResponse = await fetch(tokenRequest);
          const tokenData = await tokenResponse.json();
          console.log('Received Token Data:', tokenData);
        } catch (error) {
          console.error('Error exchanging code for tokens:', error);
        }
      } else {
        console.error('Invalid state parameter in the response.');
      }
    };

    // Check if the URL contains the authorization code
    if (window.location.search.includes('code')) {
      handleAuthResponse();
    }
  }, []);

  return (
    <div>
      <button onClick={authenticateWithMicrosoft}>Authenticate with Microsoft</button>
    </div>
  );
};

export default MicrosoftAuthComponent;