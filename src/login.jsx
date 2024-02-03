import React from "react";
import { useMsal } from "@azure/msal-react";
import { googleSignIn, microsoftSignIn } from "./services";
import {
  useSupabaseClient,
  useSession,
  useSessionContext,
} from "@supabase/auth-helpers-react";
import { useAppState } from "./services/state";
import { googleSignOut, microsoftSignOut } from "./services";
import { useOutlookSignIn, useGoogleSignIn } from "./services/useEffectHandler";
import "./css/tailwind.css";

const SignIn = () => {
  const {setOutlookUser} = useAppState();
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const supabase = useSupabaseClient();
  const { isLoading } = useSessionContext();
  const session = useSession();

  useOutlookSignIn(setOutlookUser);
  useGoogleSignIn();

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
            className="bg-blue-500 text-white py-2 px-2 rounded hover:bg-blue-600 transition-all"
          >
            Login to Microsoft
          </button>
        ) : (
          <div>
            <button
              onClick={() => microsoftSignOut(instance)}
              className="bg-red-500 text-white py-2 px-2 rounded hover:bg-red-600 transition-all"
            >
              Sign out of Microsoft
            </button>
          </div>
        )}

        {session == null ? (
          <button
            onClick={() => googleSignIn(supabase)}
            className="bg-green-500 text-white py-2 px-2 rounded hover:bg-green-600 transition-all"
          >
            Sign In With Google
          </button>
        ) : (
          <div>
            <button
              onClick={() => googleSignOut(supabase)}
              className="bg-red-500 text-white py-2 px-2 rounded hover:bg-red-600 transition-all"
            >
              Sign out of Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignIn;
