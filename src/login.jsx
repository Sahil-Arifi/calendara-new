import React, { useEffect, useState } from "react";
import { useMsal } from '@azure/msal-react';
import { loginRequest } from "./auth";
import { googleSignIn } from "./services";
import {
  useSupabaseClient,
} from "@supabase/auth-helpers-react";


const SignIn = () => {
  const { instance } = useMsal();
  const supabase = useSupabaseClient();
  const activeAccount = instance.getActiveAccount();

  useEffect(() => {
    instance.acquireTokenSilent({
      scopes: ['user.read'],
      account: instance.getActiveAccount() 
    }).then((res) => {
      localStorage.setItem('microsoftAccessToken', res.accessToken)
    }).catch((err) => {
      console.log('err:', err)

    })
  }, [instance, activeAccount]);


  const handleMicrosoftLogin = async () => {
    await instance.loginPopup(loginRequest);
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <button onClick={handleMicrosoftLogin} >Login to Microsoft</button>
      <button onClick={() => googleSignIn(supabase)}>Sign In With Google</button>
    </div>
  )
}

export default SignIn