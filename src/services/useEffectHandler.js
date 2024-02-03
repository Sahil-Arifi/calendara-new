import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { useSession } from "@supabase/auth-helpers-react";

export const useMicrosoftToken = (setMicrosoftAccessToken) => {
  useEffect(() => {
    const microsoftAccessToken = localStorage.getItem("microsoftAccessToken");
    if (microsoftAccessToken) {
      setMicrosoftAccessToken(microsoftAccessToken);
    }
  }, [setMicrosoftAccessToken]);
};

export const useGoogleAccessToken = (setGoogleAccessToken) => {
  useEffect(() => {
    const googleAccessToken = localStorage.getItem("googleAccessToken");
    if (googleAccessToken) {
      setGoogleAccessToken(googleAccessToken);
    }
  }, [setGoogleAccessToken]);
};

export const useRetrieveGoogleEvents = (setGoogleEvents) => {
  useEffect(() => {
    // Retrieve Google events from local storage on component mount
    const storedGoogleEvents = localStorage.getItem("googleEvents");
    if (storedGoogleEvents) {
      try {
        const parsedEvents = JSON.parse(storedGoogleEvents);
        setGoogleEvents(parsedEvents);
      } catch (error) {
        console.error("Error parsing stored Google events:", error);
        // Handle the error as needed
      }
    } else {
      setGoogleEvents([]);
    }
  }, [setGoogleEvents]);
};

export const useRetrieveOutlookEvents = (
  getAllOutlookEvents,
  microsoftAccessToken,
  setMicrosoftEvents,
) => {
  useEffect(() => {
    if (microsoftAccessToken) {
      getAllOutlookEvents(microsoftAccessToken)
        .then((res) => {
          setMicrosoftEvents(res);
        })
        .catch((error) => {
          console.error("Error retrieving Outlook events:", error);
          // Handle the error as needed
        });
    }
  }, [microsoftAccessToken, getAllOutlookEvents, setMicrosoftEvents]);
};

export const useRetrieveGoogleEventsOnChange = (
  googleAccessToken,
  getAllGoogleEvents,
  setGoogleEvents,
) => {
  useEffect(() => {
    if (googleAccessToken !== "") {
      getAllGoogleEvents(googleAccessToken)
        .then((res) => {
          setGoogleEvents(res);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [googleAccessToken, getAllGoogleEvents, setGoogleEvents]);
};

export const useOutlookSignIn = (setOutlookUser) => {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();

  useEffect(() => {
    if (!activeAccount) {
      setOutlookUser([]);
    } else {
      instance
        .acquireTokenSilent({
          scopes: ["user.read"],
          account: instance.getActiveAccount(),
        })
        .then((res) => {
          localStorage.setItem("microsoftAccessToken", res.accessToken);
        });
    }
  }, [instance, activeAccount, setOutlookUser]);
};

export const useGoogleSignIn = () => {
  const session = useSession();

  useEffect(() => {
    if (session !== null) {
      localStorage.setItem("googleAccessToken", session.provider_token);
    }
  }, [session]);
};