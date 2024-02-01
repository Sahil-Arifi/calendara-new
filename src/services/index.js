import axios from 'axios';
import { loginRequest } from "../auth";

export const createOutlookEvent = async (accessToken, eventName, start, end) => {
  try {
    const apiUrl = 'https://graph.microsoft.com/v1.0/me/events';

    const event = {
      subject: eventName,
      start: {
        dateTime: start.toISOString(), // Date.toISOString() ->
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // America/Los_Angeles
      },
      end: {
        dateTime: end.toISOString(), // Date.toISOString() ->
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // America/Los_Angeles
      },
    };

    const response = await axios.post(apiUrl, event, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Event created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error.response ? error.response.data : error.message);
  }
};

export const getAllOutlookEvents = async (accessToken) => {
  try {
    const apiUrl = 'https://graph.microsoft.com/v1.0/me/events';

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.value;
  } catch (error) {
    console.error('Error getting events:', error.response ? error.response.data : error.message);
  }
}

export const updateOutlookEvent = async (accessToken, eventId, updatedEvent) => {
  // updatedEvent should be an object with the properties to update
  const apiUrl = `https://graph.microsoft.com/v1.0/me/events/${eventId}`;
  const response = await axios.patch(apiUrl, updatedEvent, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;

}

export const deleteOutlookEvent = async (accessToken, eventId) => {
  try {
    const apiUrl = `https://graph.microsoft.com/v1.0/me/events/${eventId}`;

    const response = await axios.delete(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('Event deleted:', response.data);
  } catch (error) {
    console.error('Error deleting event:', error.response ? error.response.data : error.message);
  }
}

export async function createGoogleEvent({ session, start, end, eventName, eventDescription }) {
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
      alert("Event created, check your Google Calendar!");
    });
}

export const getAllGoogleEvents = async (googleAccessToken) => {
  try {
    const apiUrl = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${googleAccessToken}`,
      },
    });
    return response.data.items;
  } catch (error) {
    console.error('Error getting events:', error.response ? error.response.data : error.message);
  }
}

export const deleteGoogleEvent = async (googleAccessToken, eventId) => {
  try {
    const apiUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`;

    const response = await axios.delete(apiUrl, {
      headers: {
        Authorization: `Bearer ${googleAccessToken}`,
      },
    });

    console.log('Event deleted:', response.data);
  } catch (error) {
    console.error('Error deleting event:', error.response ? error.response.data : error.message);
  }
};


export const handleMicrosoftLogin = async (instance) => {
  await instance.loginPopup(loginRequest);
}

export const microsoftSignOut = async (instance) => {
  await instance.logout();
}

export async function googleSignIn(supabase) {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      scopes: "https://www.googleapis.com/auth/calendar",
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
  }});
  // Check if the user is authenticated and has a provider token
  if (supabase.session && supabase.session.provider_token) {
    // Assuming "google" is the provider you are interested in
    const googleAccessToken = supabase.session.provider_token;

    // Store the Google access token in localStorage
    localStorage.setItem("googleAccessToken", googleAccessToken);
  } else {
    console.error("User is not authenticated or no Google access token available.");
  }
  if (error) {
    alert("Error logging in to Google provider with Supabase");
    console.log(error);
  }
}

export async function googleSignOut(supabase) {
  await supabase.auth.signOut();
}

