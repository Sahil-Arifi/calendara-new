import "./App.css";
import {
  useSession,
  useSupabaseClient,
  useSessionContext,
} from "@supabase/auth-helpers-react";
import * as Msal from 'msal';
import { Agenda, Login } from '@microsoft/mgt-react';
import { Providers, ProviderState } from '@microsoft/mgt-element';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Client } from '@microsoft/microsoft-graph-client';
import DateTimePicker from "react-datetime-picker";
import 'react-datetime-picker/dist/DateTimePicker.css';
import { useState, useEffect } from "react";
import LoginContainer from "./login";

function App() {
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  // const [isSignedIn] = useIsSignedIn();

  const session = useSession(); // tokens, when session exists we have a user
  const supabase = useSupabaseClient(); // talk to supabase!
  const { isLoading } = useSessionContext();

  if (isLoading) {
    return <></>;
  }

  // Initialize the Graph client
  const msalConfig = {
    auth: {
      clientId: '72a676c1-2c77-4f07-ad57-417b17e33305',
      authority: 'https://login.microsoftonline.com/deabab6c-14e3-4d8b-95c3-94dae6f4c432',
      redirectUri: 'http://localhost:3000',
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: true,
    },
  };

  const myMSALObj = new Msal.UserAgentApplication(msalConfig);

  myMSALObj.loginPopup()
    .then(response => {
      const accessToken = response.accessToken;
      console.log('Access token:', accessToken);
      console.log(response);

      // Use the access token to make requests to Microsoft Graph API
      // For example, update a user's calendar event
    })
    .catch(error => {
      console.error('Error during login:', error);
    });


  // function useIsSignedIn() {
  //   const [isSignedIn, setIsSignedIn] = useState(false);

  //   useEffect(() => {
  //     const updateState = () => {
  //       const provider = Providers.globalProvider;
  //       setIsSignedIn(provider && provider.state === ProviderState.SignedIn);
  //     };

  //     Providers.onProviderUpdated(updateState);
  //     updateState();

  //     return () => {
  //       Providers.removeProviderUpdatedListener(updateState);
  //     }
  //   }, []);

  //   return [isSignedIn];
  // }

  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "https://www.googleapis.com/auth/calendar",
      },
    });
    if (error) {
      alert("Error logging in to Google provider with Supabase");
      console.log(error);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function createCalendarEvent() {
    console.log("Creating calendar event");
    const event = {
      summary: eventName,
      description: eventDescription,
      start: {
        dateTime: start.toISOString(), // Date.toISOString() ->
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // America/Los_Angeles
      },
      end: {
        dateTime: end.toISOString(), // Date.toISOString() ->
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // America/Los_Angeles
      },
    };
    await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + session.provider_token, // Access token for google
        },
        body: JSON.stringify(event),
      }
    )
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        alert("Event created, check your Google Calendar!");
      });
  }

  console.log(session);
  console.log(start);
  console.log(eventName);
  console.log(eventDescription);
  return (
    <div className="App">
      <div style={{ width: "400px", margin: "30px auto" }}>
        {/* <Login /> */}
        <LoginContainer />
        {session ? (
          <>
            <h2>Hey there {session.user.email}</h2>
            <p>Start of your event</p>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              onChange={setStart}
              value={start}
            >
              <DatePicker />
            </LocalizationProvider>
            <DateTimePicker
              onChange={setStart}
              value={start}
              style={{ width: "30px" }}
            />
            <p>End of your event</p>
            <DateTimePicker
              onChange={setEnd}
              value={end}
              style={{ width: "30px" }}
            />
            <p>Event name</p>
            <input type="text" onChange={(e) => setEventName(e.target.value)} />
            <p>Event description</p>
            <input
              type="text"
              onChange={(e) => setEventDescription(e.target.value)}
            />
            <hr />
            <button onClick={() => createCalendarEvent()}>
              Create Calendar Event
            </button>
            <p></p>
            <button onClick={() => signOut()}>Sign Out</button>
          </>
        ) : (
          <>
            <button onClick={() => googleSignIn()}>Sign In With Google</button>
          </>
        )}
        <div className="row">
          <div className="column">
            {/* {isSignedIn &&
              <Agenda />} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;