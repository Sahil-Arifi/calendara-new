

import React, { useEffect, useState } from "react";
import { useMsal } from '@azure/msal-react';
import { loginRequest } from "./auth";


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


  return (
    <div>
      <button onClick={handleMicrosoftLogin} >Login to Microsoft</button>
    </div>
  )
}

export default LoginContainer