import React, { useEffect, useState } from "react";
import { useMsal } from '@azure/msal-react';
import { googleSignIn, handleMicrosoftLogin } from "./services";
import {
  useSupabaseClient,
} from "@supabase/auth-helpers-react";


const SignIn = () => {
  const { instance } = useMsal();
  const supabase = useSupabaseClient();
  const activeAccount = instance.getActiveAccount();

  useEffect(() => {
    if(!activeAccount) return;
    instance.acquireTokenSilent({
      scopes: ['user.read'],
      account: instance.getActiveAccount() 
    }).then((res) => {
      localStorage.setItem('microsoftAccessToken', res.accessToken)
    }).catch((err) => {
      console.log('err:', err)

    })
  }, [instance, activeAccount]);


  return (
    <div style={{display: 'flex', gap: 64}}>
      <button onClick={() =>handleMicrosoftLogin(instance)} >Login to Microsoft</button>
      <button onClick={() => googleSignIn(supabase)}>Sign In With Google</button>
    </div>
  )
}

export default SignIn