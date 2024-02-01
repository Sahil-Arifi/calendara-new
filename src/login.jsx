import React, { useEffect, useState } from "react";
import { useMsal } from '@azure/msal-react';
import { loginRequest } from "./auth";
import axios from "axios";


const LoginContainer = () => {
  const { instance } = useMsal();
  const [microSoftAccessToken, setMicroSoftAccessToken] = useState('')

  const activeAccount = instance.getActiveAccount();

  console.log('accessToken:', microSoftAccessToken)

  useEffect(() => {
    instance.acquireTokenSilent({
      scopes: ['user.read'],
      account: instance.getActiveAccount() 
    }).then((res) => {
      setMicroSoftAccessToken(res.accessToken)
    }).catch((err) => {
      console.log('err:', err)

    })
  }, [instance, activeAccount]);


  const handleMicrosoftLogin = async () => {
    await instance.loginPopup(loginRequest);
  }

  const createOutlookEvent = async (accessToken) => {
    try {
      const apiUrl = 'https://graph.microsoft.com/v1.0/me/events';
  
      const eventPayload = {
        subject: 'Sample Event',
        start: {
          dateTime: '2024-01-31T08:00:00',
          timeZone: 'UTC',
        },
        end: {
          dateTime: '2024-01-31T09:00:00',
          timeZone: 'UTC',
        },
      };
  
      const response = await axios.post(apiUrl, eventPayload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Event created:', response.data);
    } catch (error) {
      console.error('Error creating event:', error.response ? error.response.data : error.message);
    }
  };
  
  // Example usage with an access token
  const accessToken = microSoftAccessToken;
  createOutlookEvent(accessToken);


  return (
    <div>
      <button onClick={handleMicrosoftLogin} >Login to Microsoft</button>
    </div>
  )
}

export default LoginContainer