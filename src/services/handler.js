import {
  createOutlookEvent,
  deleteOutlookEvent,
  deleteGoogleEvent,
  createGoogleEvent,
  getAllGoogleEvents,
  updateOutlookEvent,
  updateGoogleEvent,
} from "./index";

export const handleCreateEvent = async (
  microsoftAccessToken,
  eventName,
  start,
  end,
  setMicrosoftEvents,
  microsoftEvents,
) => {
  const newEvent = await createOutlookEvent(
    microsoftAccessToken,
    eventName,
    start,
    end,
  );
  setMicrosoftEvents([newEvent, ...microsoftEvents]);
};

export const handleMicrosoftDeleteEvent = async (
  microsoftAccessToken,
  eventId,
  setMicrosoftEvents,
  microsoftEvents,
  setStart,
  setEnd,
  setEventName,
  setEventDescription
) => {
  await deleteOutlookEvent(microsoftAccessToken, eventId);
  setMicrosoftEvents(microsoftEvents.filter((event) => event.id !== eventId));
  setStart(null);
  setEnd(null);
  setEventName("");
  setEventDescription("");
};

export const handleGoogleDeleteEvent = async (
  googleAccessToken,
  eventId,
  setGoogleEvents,
  googleEvents,
  setStart,
  setEnd,
  setEventName,
  setEventDescription
) => {
  try {
    // Delete the event
    await deleteGoogleEvent(googleAccessToken, eventId);

    // Update the local storage immediately
    localStorage.setItem(
      "googleEvents",
      JSON.stringify(googleEvents.filter((event) => event.id !== eventId)),
    );

    // Update the state to reflect the deletion
    setGoogleEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId),
    );
  } catch (error) {
    console.error("Error deleting Google event:", error);
  }
  setStart(null);
  setEnd(null);
  setEventName("");
  setEventDescription("");
};

export const handleCreateGoogleEvent = async (
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
) => {
  try {
    // Create the event
    await createGoogleEvent({
      start,
      end,
      eventName,
      eventDescription,
      setStart,
      setEnd,
      setEventName,
      setEventDescription,
    });

    // Fetch the updated events immediately
    const updatedGoogleEvents = await getAllGoogleEvents(googleAccessToken);

    // Update the local storage with the latest events
    localStorage.setItem("googleEvents", JSON.stringify(updatedGoogleEvents));

    // Update the state to reflect the new events
    setGoogleEvents(updatedGoogleEvents);

    // Clear the form input values
    setStart(null);
    setEnd(null);
    setEventName("");
    setEventDescription("");
  } catch (error) {
    console.error("Error creating Google event:", error);
    // Handle error gracefully, show a message, etc.
  }
};

export const handleOutlookUpdateForm = (
  event,
  setEventName,
  setStart,
  setEnd,
  setEventDescription,
  setCurrentEventId,
  setIsEditing,
) => {
  setEventName(event.subject);
  setStart(new Date(event.start.dateTime));
  setEnd(new Date(event.end.dateTime));
  setEventDescription(event.bodyPreview);
  setCurrentEventId(event.id);
  setIsEditing(true);
};

export const handleGoogleUpdateForm = (
  event,
  setEventName,
  setStart,
  setEnd,
  setEventDescription,
  setCurrentEventId,
  setIsEditing,
) => {
  setEventName(event.summary);
  setStart(new Date(event.start.dateTime));
  setEnd(new Date(event.end.dateTime));
  setEventDescription(event.description);
  setCurrentEventId(event.id);
  setIsEditing(true);
};

export const handleOutlookEventUpdate = async (
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
) => {
  const eventToUpdate = {
    subject: eventName,
    start: {
      dateTime: start.toISOString(),
      timeZone: "UTC",
    },
    end: {
      dateTime: end.toISOString(),
      timeZone: "UTC",
    },
  };
  const response = await updateOutlookEvent(
    microsoftAccessToken,
    eventId,
    eventToUpdate,
  );
  setMicrosoftEvents(
    microsoftEvents.map((event) => (event.id === eventId ? response : event)),
  );
  setIsEditing(false);
  setCurrentEventId("");
  setEventName("");
  setStart(null);
  setEnd(null);
};

export const handleGoogleEventUpdate = async (
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
) => {
  const eventToUpdate = {
    summary: eventName,
    description: eventDescription,
    start: {
      dateTime: start.toISOString(),
      timeZone: "UTC",
    },
    end: {
      dateTime: end.toISOString(),
      timeZone: "UTC",
    },
  };
  const response = await updateGoogleEvent(
    googleAccessToken,
    eventId,
    eventToUpdate,
  );
  setGoogleEvents(
    googleEvents.map((event) => (event.id === eventId ? response : event)),
  );
  setIsEditing(false);
  setCurrentEventId("");
  setEventName("");
  setEventDescription("");
  setStart(null);
  setEnd(null);
};

export const handleClick = (setForceUpdate) => {
  // Toggle the state to force a re-render
  setForceUpdate((prevState) => !prevState);
};
