import React, { useEffect } from "react";
import { useMsal } from '@azure/msal-react';
import { googleSignOut, microsoftSignOut } from "./services";
import {
  useSupabaseClient,
} from "@supabase/auth-helpers-react";


const SignOut = () => {
  const { instance } = useMsal();
  const supabase = useSupabaseClient();

  return (
    <div style={{display: 'flex', gap: 64}}>
      <button onClick={() => microsoftSignOut(instance)} >Sign out of Microsoft</button>
      <button onClick={() => googleSignOut(supabase)}>Sign out of Google</button>
    </div>
  )
}

export default SignOut;