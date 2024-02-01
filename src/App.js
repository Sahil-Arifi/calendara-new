import "./App.css";
import {
  useSession, 
  useSessionContext,
} from "@supabase/auth-helpers-react";
import DateTimePicker from "react-datetime-picker";
import 'react-datetime-picker/dist/DateTimePicker.css';
import { useState, useEffect } from "react";
import SignIn from "./login";
import { createGoogleEvent, createOutlookEvent, deleteGoogleEvent, deleteOutlookEvent, getAllGoogleEvents, getAllOutlookEvents, updateOutlookEvent } from "./services";
import SignOut from "./logout";

function App() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [microsoftAccessToken, setMicrosoftAccessToken] = useState("");
  const [googleAccessToken, setGoogleAccessToken] = useState("");
  const [microsoftEvents, setMicrosoftEvents] = useState([]);
  const [googleEvents, setGoogleEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState("");
  const [forceUpdate, setForceUpdate] = useState(false);


  const session = useSession(); // tokens, when session exists we have a user
  const { isLoading } = useSessionContext();

  useEffect(() => {
    const microsoftAccessToken = localStorage.getItem("microsoftAccessToken")
    if (microsoftAccessToken) {
      setMicrosoftAccessToken(microsoftAccessToken)
    }
  }, []);


  useEffect(() => {
    if (microsoftAccessToken) {
      getAllOutlookEvents(microsoftAccessToken)
        .then(res => {
          setMicrosoftEvents(res);
        })
    }
  }, [microsoftAccessToken]);

  useEffect(() => {
    if (googleAccessToken !== "") {
      getAllGoogleEvents(googleAccessToken)
        .then(res => {
          setGoogleEvents(res);
        })
        .catch(error => {
          // Handle error
        });
    }
  }, [googleAccessToken]);

 


  const handleCreateEvent = async () => {
    const newEvent = await createOutlookEvent(microsoftAccessToken, eventName, start, end);
    setMicrosoftEvents([newEvent, ...microsoftEvents,]);
  }


  const handleMicrosoftDeleteEvent = async (eventId) => {
    await deleteOutlookEvent(microsoftAccessToken, eventId);
    // update the microsoftEvents state
    setMicrosoftEvents(microsoftEvents.filter(event => event.id !== eventId));
  }

  const handleGoogleDeleteEvent = async (eventId) => {
    await deleteGoogleEvent(googleAccessToken, eventId);
    console.log(googleAccessToken)
    // update the googleEvents state
    setGoogleEvents(googleEvents.filter(event => event.id !== eventId));
  }

  const handleUpdateForm = (event) => {
    setEventName(event.subject)
    setStart(new Date(event.start.dateTime));
    setEnd(new Date(event.end.dateTime));
    setEventDescription(event.bodyPreview);
    setCurrentEventId(event.id);
    setIsEditing(true);
  }

  const handleEventUpdate = async (eventId) => {
    const eventToUpdate = {
      subject: eventName,
      start: {
        dateTime: start.toISOString(),
        timeZone: "UTC"
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: "UTC"
      },
    }
    const response = await updateOutlookEvent(microsoftAccessToken, eventId, eventToUpdate);
    setMicrosoftEvents(microsoftEvents.map(event => event.id === eventId ? response : event));
    setIsEditing(false);
    setCurrentEventId("");
    setEventName("");
    setStart('');
    setEnd('');
  }

  const handleClick = () => {
    // Toggle the state to force a re-render
    setForceUpdate(prevState => !prevState);
  };

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <div className="App">
      <div style={{ width: "400px", margin: "30px auto" }}>
        <SignIn />

        <>
          {/* <h2>Hey there {session.user.email}</h2> */}
          <h1>Start of your event</h1>
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
          <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} />
          <p>Event description</p>
          <input
            type="text"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          />
          {isEditing ? <button onClick={() => handleEventUpdate(currentEventId)}>Update Changes</button> : null}
          <hr />
          <button onClick={() => {
              setGoogleAccessToken(session.provider_token)
              createGoogleEvent({ session, start, end, eventName, eventDescription })
          }}>
            Create Google Calendar Event
          </button>
          <button onClick={() => handleCreateEvent()}>
            Create Outlook Calendar Event
          </button>
          {
            microsoftEvents.map((event, index) => {
              return (
                <div key={index} onClick={() => handleUpdateForm(event)} style={{ border: '1px solid red', marginBottom: '10px', padding: '10px', cursor: 'pointer' }}>
                  <p>{event?.subject}</p>
                  <p>{event?.start.dateTime}</p>
                  <p>{event?.end.dateTime}</p>
                  <button onClick={() => handleMicrosoftDeleteEvent(event.id)}>Cancel</button>
                </div>
              )
            })
          }
          {googleEvents ?
            googleEvents.map((event, index) => {
              return (
                <div key={index} onClick={() => handleUpdateForm(event)} style={{ border: '1px solid blue', marginBottom: '10px', padding: '10px', cursor: 'pointer' }}>
                  <p>{event?.summary}</p>
                  <p>{event?.start.dateTime}</p>
                  <p>{event?.end.dateTime}</p>
                  <button onClick={() => handleGoogleDeleteEvent(event.id)}>Cancel</button>
                </div>
              )
            }) : null
          }
          <SignOut />
          </>
        <div className="row">
          <div className="column">
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;