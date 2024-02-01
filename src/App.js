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
import SignIn from "./login";
import { createGoogleEvent, googleSignOut, createOutlookEvent } from "./services";

function App() {
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [microsoftAccessToken, setMicrosoftAccessToken] = useState("");
  // const [isSignedIn] = useIsSignedIn();

  const session = useSession(); // tokens, when session exists we have a user
  const supabase = useSupabaseClient(); // talk to supabase!
  const { isLoading } = useSessionContext();

  useEffect(() => {
    const microsoftAccessToken = localStorage.getItem("microsoftAccessToken")
    if (microsoftAccessToken) {
      setMicrosoftAccessToken(microsoftAccessToken)
    }
  }, []);

  if (isLoading) {
    return <></>;
  }

  return (
    <div className="App">
      <div style={{ width: "400px", margin: "30px auto" }}>
        {microsoftAccessToken ? (
          <>
            {/* <h2>Hey there {session.user.email}</h2> */}
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
            <button onClick={() => createGoogleEvent({ session, start, end, eventName, eventDescription })}>
              Create Google Calendar Event
            </button>
            <button onClick={() => createOutlookEvent(microsoftAccessToken, eventName, start, end,)}>
              Create Outlook Calendar Event
            </button>
            <p></p>
            <button onClick={() => googleSignOut(supabase)}>Sign Out</button>
          </>
        ) : (
          <>
            <SignIn />
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