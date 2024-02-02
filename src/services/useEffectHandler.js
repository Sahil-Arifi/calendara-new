import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";

export const useMicrosoftToken = (setMicrosoftAccessToken) => {
    useEffect(() => {
        const microsoftAccessToken = localStorage.getItem("microsoftAccessToken");
        if (microsoftAccessToken) {
            setMicrosoftAccessToken(microsoftAccessToken);
        }
    }, [setMicrosoftAccessToken]);
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

export const useRetrieveOutlookEvents = (getAllOutlookEvents, microsoftAccessToken, setMicrosoftEvents) => {
    useEffect(() => {
        if (microsoftAccessToken) {
            getAllOutlookEvents(microsoftAccessToken)
                .then(res => {
                    setMicrosoftEvents(res);
                    console.log(res);
                })
                .catch(error => {
                    console.error("Error retrieving Outlook events:", error);
                    // Handle the error as needed
                });
        }
    }, [microsoftAccessToken, getAllOutlookEvents, setMicrosoftEvents]);
};

export const useRetrieveGoogleEventsOnChange = (googleAccessToken, getAllGoogleEvents, setGoogleEvents) => {
    useEffect(() => {
        if (googleAccessToken !== "") {
            getAllGoogleEvents(googleAccessToken)
                .then(res => {
                    setGoogleEvents(res);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, [googleAccessToken, getAllGoogleEvents, setGoogleEvents]);
};

export const useOutlookSignIn = () => {
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();

    useEffect(() => {
        if(!activeAccount) return;
        instance.acquireTokenSilent({
          scopes: ['user.read'],
          account: instance.getActiveAccount() 
        }).then((res) => {
          localStorage.setItem('microsoftAccessToken', res.accessToken)
        // console.log('Updated outlookUser:', outlookUser);
      }).catch((err) => {
          console.log('err:', err)
    
        })
        
      }, [instance, activeAccount]);
}

export const useGetOutlookUser = (setOutlookUser) => {
    const { instance } = useMsal();
  
    useEffect(() => {
      const activeAccount = instance.getActiveAccount();
  
      if (activeAccount) {
        // Avoid unnecessary state updates if the user is the same
        if (setOutlookUser && activeAccount !== setOutlookUser) {
          console.log(activeAccount);
          setOutlookUser(activeAccount);
        }
      }
    }, [instance, setOutlookUser]);
  };

    
    