import { useSession, useSessionContext } from "@supabase/auth-helpers-react";
import SignIn from "./login";
import { getAllGoogleEvents, getAllOutlookEvents } from "./services";
import {
  useRetrieveGoogleEvents,
  useMicrosoftToken,
  useRetrieveOutlookEvents,
  useRetrieveGoogleEventsOnChange,
  useGoogleAccessToken,
} from "./services/useEffectHandler";
import {
  handleCreateEvent,
  handleMicrosoftDeleteEvent,
  handleGoogleDeleteEvent,
  handleCreateGoogleEvent,
  handleOutlookUpdateForm,
  handleGoogleEventUpdate,
  handleGoogleUpdateForm,
  handleOutlookEventUpdate,
  handleClick,
} from "./services/handler.js";
import { useAppState } from "./services/state";
import DateTime from "./components/dateTime.component";
import "./css/tailwind.css";

function App() {
  // State
  const {
    start,
    setStart,
    end,
    setEnd,
    eventName,
    setEventName,
    eventDescription,
    setEventDescription,
    microsoftAccessToken,
    setMicrosoftAccessToken,
    googleAccessToken,
    setGoogleAccessToken,
    microsoftEvents,
    setMicrosoftEvents,
    googleEvents,
    setGoogleEvents,
    isEditing,
    setIsEditing,
    currentEventId,
    setCurrentEventId,
    setForceUpdate,
    isGoogle,
    setIsGoogle,
    setIsOutlook,
    outlookUser
  } = useAppState();
  const session = useSession();
  const { isLoading } = useSessionContext();

  // useEffects
  useMicrosoftToken(setMicrosoftAccessToken);
  useGoogleAccessToken(setGoogleAccessToken);
  useRetrieveGoogleEvents(setGoogleEvents);
  useRetrieveOutlookEvents(
    getAllOutlookEvents,
    microsoftAccessToken,
    setMicrosoftEvents,
  );
  useRetrieveGoogleEventsOnChange(
    googleAccessToken,
    getAllGoogleEvents,
    setGoogleEvents,
  );

  // Handlers
  const handleCreateEventWrapper = async () => {
    await handleCreateEvent(
      microsoftAccessToken,
      eventName,
      start,
      end,
      setMicrosoftEvents,
      microsoftEvents,
    );
  };
  const handleMicrosoftDeleteEventWrapper = async (eventId) => {
    await handleMicrosoftDeleteEvent(
      microsoftAccessToken,
      eventId,
      setMicrosoftEvents,
      microsoftEvents,
      setStart,
      setEnd,
      setEventName,
      setEventDescription
    );
  };
  const handleGoogleDeleteEventWrapper = async (eventId) => {
    await handleGoogleDeleteEvent(
      googleAccessToken,
      eventId,
      setGoogleEvents,
      googleEvents,
      setStart,
      setEnd,
      setEventName,
      setEventDescription
    );
  };
  const handleCreateGoogleEventWrapper = async () => {
    await handleCreateGoogleEvent(
      start,
      end,
      eventName,
      eventDescription,
      googleAccessToken,
      setGoogleEvents,
      setStart,
      setEnd,
      setEventName,
      setEventDescription,
    );
  };
  const handleGoogleUpdateEventWrapper = (eventId) => {
    handleGoogleEventUpdate(
      googleAccessToken,
      eventId,
      eventName,
      eventDescription,
      start,
      end,
      setGoogleEvents,
      googleEvents,
      setIsEditing,
      setCurrentEventId,
      setEventName,
      setEventDescription,
      setStart,
      setEnd,
    );
  };
  const handleGoogleUpdateFormWrapper = (event) => {
    handleGoogleUpdateForm(
      event,
      setEventName,
      setStart,
      setEnd,
      setEventDescription,
      setCurrentEventId,
      setIsEditing,
    );
  };
  const handleOutlookUpdateFormWrapper = (event) => {
    handleOutlookUpdateForm(
      event,
      setEventName,
      setStart,
      setEnd,
      setEventDescription,
      setCurrentEventId,
      setIsEditing,
    );
  };
  const handleOutlookUpdateEventWrapper = async (eventId) => {
    await handleOutlookEventUpdate(
      microsoftAccessToken,
      eventId,
      eventName,
      start,
      end,
      setMicrosoftEvents,
      microsoftEvents,
      setIsEditing,
      setCurrentEventId,
      setEventName,
      setStart,
      setEnd,
    );
  };
  const handleClickWrapper = () => {
    handleClick(setForceUpdate);
  };

  function formatDateTime(dateTimeString) {
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  }

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full max-w-screen-xl mx-auto space-y-8">
      {/* Login Section */}
      <div className="bg-gray-100 p-4 rounded-md w-full flex justify-center">
        <SignIn />
      </div>

      {/* Date Time Section */}
      <div className="bg-gray-100 pl-24 rounded-md w-full pb-10 flex items-center justify-center gap-24">
        <div>
          <DateTime
            setStart={setStart}
            start={start}
            setEnd={setEnd}
            end={end}
            eventName={eventName}
            setEventName={setEventName}
            eventDescription={eventDescription}
            setEventDescription={setEventDescription}
          />
        </div>
        <div className="flex gap-8 mt-8 flex-col">
          <button
            onClick={() => handleCreateEventWrapper()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-4 rounded transition-all"
          >
            Create Outlook Calendar Event
          </button>
          <button
            onClick={() => {
              setGoogleAccessToken(session.provider_token);
              handleCreateGoogleEventWrapper({
                session,
                start,
                end,
                eventName,
                eventDescription,
              });
              handleClickWrapper();
            }}
            className="bg-green-500 text-white font-bold py-4 px-4 rounded hover:bg-green-600 transition-all"
          >
            Create Google Calendar Event
          </button>
          <button
            onClick={() => {
              if (isEditing) {
                isGoogle
                  ? handleGoogleUpdateEventWrapper(currentEventId)
                  : handleOutlookUpdateEventWrapper(currentEventId);
              } else {
                alert("No event selected to edit!");
              }
            }}
            className="bg-orange-500 text-white font-bold py-4 px-4 rounded hover:bg-orange-600 transition-all"
          >
            Update Changes
          </button>
        </div>

        <hr className="my-4 border-t border-gray-300" />
      </div>

      {/* Event Display Section */}
      <div className="bg-gray-100 p-6 rounded-md w-full space-y-4 flex flex-col items-center justify-center">
        <div className="flex flex-wrap justify-center">
          { outlookUser !== [] ?
            microsoftEvents &&
            microsoftEvents.map((event, index) => (
              <div
                key={index}
                onClick={() => {
                  handleOutlookUpdateFormWrapper(event);
                  setIsGoogle(false);
                  setIsOutlook(true);
                }}
                className="border border-gray-600 mb-4 p-6 rounded cursor-pointer hover:bg-blue-100 transition-all m-10"
              >
                <div>
                  <p className="font-bold mb-2">{event?.subject}</p>
                  <p className="font-bold mb-2">From</p>
                  <p>{formatDateTime(event?.start.dateTime)}</p>
                  <p className="font-bold mb-2">To</p>
                  <p>{formatDateTime(event?.end.dateTime)}</p>
                </div>
                <div>
                  <button
                    onClick={() => handleMicrosoftDeleteEventWrapper(event.id)}
                    className="border border-gray-600 mt-5 py-1 px-2 rounded hover:bg-gray-700 hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )) : null
          }
          {googleEvents &&
            googleEvents.map((event, index) => (
              <div
                key={index}
                onClick={() => {
                  handleGoogleUpdateFormWrapper(event);
                  setIsGoogle(true);
                  setIsOutlook(false);
                }}
                className="border border-gray-600 mb-4 p-6 rounded cursor-pointer hover:bg-green-100 transition-all m-10"
              >
                <div>
                  <p className="font-bold mb-2">{event?.summary}: {event?.description}</p>
                  <p className="font-bold mb-2">From</p>
                  <p>{formatDateTime(event?.start.dateTime)}</p>
                  <p className="font-bold mb-2">To</p>
                  <p>{formatDateTime(event?.end.dateTime)}</p>
                </div>
                <div>
                  <button
                    onClick={() => handleGoogleDeleteEventWrapper(event.id)}
                    className="border border-gray-600 mt-5 py-1 px-2 rounded hover:bg-gray-700 hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
