import { useState } from "react";

export const useAppState = () => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [microsoftAccessToken, setMicrosoftAccessToken] = useState("");
  const [googleAccessToken, setGoogleAccessToken] = useState("");
  const [microsoftEvents, setMicrosoftEvents] = useState([]);
  const [googleEvents, setGoogleEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState("");
  const [forceUpdate, setForceUpdate] = useState(false);
  const [filterButtonState, setFilterButtonState] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [googleUser, setGoogleUser] = useState([]);
  const [outlookUser, setOutlookUser] = useState([]);
  const [isGoogle, setIsGoogle] = useState(false);
  const [isOutlook, setIsOutlook] = useState(false);

  return {
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
    forceUpdate,
    setForceUpdate,
    filterButtonState,
    setFilterButtonState,
    isLoading,
    setIsLoading,
    googleUser,
    setGoogleUser,
    outlookUser,
    setOutlookUser,
    isGoogle,
    setIsOutlook,
    isOutlook,
    setIsGoogle,
  };
};
