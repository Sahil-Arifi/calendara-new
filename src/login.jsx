import React from "react";
import { useMsal } from "@azure/msal-react";
import { googleSignIn, microsoftSignIn } from "./services";
import { useSupabaseClient, useSession, useSessionContext } from "@supabase/auth-helpers-react";
import { googleSignOut, microsoftSignOut } from "./services";
import { useOutlookSignIn } from "./services/useEffectHandler";
import "./css/tailwind.css";

const SignIn = () => {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const supabase = useSupabaseClient();
  const { isLoading } = useSessionContext();
  const session = useSession;

  useOutlookSignIn();
  
  if (isLoading) {
    return <>Loading...</>;
  }
  
  return (
    <div className="flex items-start gap-8">
      <div>
        <h1 className="text-3xl mr-24 p-2 justify-center">CALENDARA</h1>
      </div>
      <div className="flex gap-8 mt-2">
        {activeAccount == null ? (
          <button
          onClick={() => microsoftSignIn(instance)}
          className="bg-blue-500 text-white py-2 px-2 rounded hover:bg-blue-600"
          >
            Login to Microsoft
          </button>
        ) : (
          <div>
            <button onClick={() => microsoftSignOut(instance)}>
              Sign out of Microsoft
            </button>
          </div>
        )}

        {session == null ? console.log(session)(
          
          <button
          onClick={() => googleSignIn(supabase)}
          className="bg-green-500 text-white py-2 px-2 rounded hover:bg-red-600"
          >
            Sign In With Google
          </button>
        ) : (
          <div>
            <button onClick={() => microsoftSignOut(instance)}>
              Sign out of Microsoft
            </button>
            <button onClick={() => googleSignOut(supabase)}>
              Sign out of Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignIn;
