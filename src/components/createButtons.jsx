import React from 'react'
import { useSession } from '@supabase/auth-helpers-react';
import { useAppState } from '../services/state';
import { handleCreateEvent, handleClick, handleCreateGoogleEvent } from '../services/handler';

export default function CreateButtons() {
  const session = useSession();
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
    googleAccessToken,
    setGoogleAccessToken,
    microsoftEvents,
    setMicrosoftEvents,
    setGoogleEvents,
    setForceUpdate,
  } = useAppState();

  const handleCreateEventWrapper = async () => {
    await handleCreateEvent(microsoftAccessToken, eventName, start, end, setMicrosoftEvents, microsoftEvents);
  }
  const handleCreateGoogleEventWrapper = async () => {
    await handleCreateGoogleEvent(session, start, end, eventName, eventDescription, googleAccessToken, setGoogleEvents, setStart, setEnd, setEventName, setEventDescription);
  };   
  const handleClickWrapper = () => {
    handleClick(setForceUpdate);
  };

  return (
    <div className="flex gap-8 mb-4">
        <button 
        onClick={() => handleCreateEventWrapper()} 
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-4 rounded"
        >
        Create Outlook Calendar Event
        </button>
        <button 
        onClick={() => {
            setGoogleAccessToken(session.provider_token);
            handleCreateGoogleEventWrapper({ session, start, end, eventName, eventDescription });
            handleClickWrapper();
        }} 
        className="bg-green-500 text-white font-bold py-4 px-4 rounded hover:bg-green-600"
        >
        Create Google Calendar Event
        </button>
  </div>
  )
}
