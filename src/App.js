import logo from "./logo.svg";
import "./App.css";
import {
  useSession,
  useSupabaseClient,
  useSessionContext,
} from "@supabase/auth-helpers-react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DateTimePicker from "react-datetime-picker";
import { useState } from "react";

function App() {
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  const session = useSession(); // tokens, when session exists we have a user
  const supabase = useSupabaseClient(); // talk to supabase!
  const { isLoading } = useSessionContext();

  if (isLoading) {
    return <></>;
  }

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
      </div>
    </div>
  );
}

export default App;

// const [events, setEvents] = useState([]);

// const calendarID = "sahil.arifi2006@gmail.com";
// const apiKey = "AIzaSyCMpTYfylzghT5HwPIqvmkY-Mn03Q5GTKM";
// const accessToken =
//   "ya29.a0AfB_byCwkLUhgrAHUTRDKrc3Zf5_VM6veCQFDoMUDCIibVI4ukmE9tSI0EElkMmUZLifpUTsBmqfktnOjL6DNmUbKEhzuzwtz1VWnRVPIpsFrxhgQQrm904O0xBOXNm3LHtGrVoJHBbXTD4VjT1be_Eg8fwd0qLYE6Z4aCgYKAUcSARISFQHGX2MiY_tnHvMSuIE81aAwuyfgPA0171";

// const getEvents = (calendarID, apiKey) => {
//   function initiate() {
//     gapi.client
//       .init({
//         apiKey: apiKey,
//       })
//       .then(function () {
//         return gapi.client.request({
//           path: `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`,
//         });
//       })
//       .then(
//         (response) => {
//           let events = response.result.items;
//           setEvents(events);
//         },
//         function (err) {
//           return [false, err];
//         }
//       )
//       .then(console.log(events));
//   }
//   gapi.load("client", initiate);
// };

// useEffect(() => {
//   getEvents(calendarID, apiKey);
// }, []);

// return (
//   <div className="App py-8 flex flex-col justify-center">
//     <h1 className="text-2xl font-bold mb-4">
//       React App with Google Calendar API!
//       // <ul>
//       //   {events?.map((event) => (
//       //     <li key={event.id} className="flex justify-center">
//       //       <Event description={event.summary} />
//       //     </li>
//       //   ))}
//       // </ul>
//     </h1>
//   </div>
// );
