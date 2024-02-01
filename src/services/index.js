import axios from 'axios';

export const createOutlookEvent = async (accessToken, eventName, start, end) => {
  console.log(accessToken)
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

    const eventPayload = {
      subject: 'Sample Event',
      start: {
        dateTime: '2024-01-31T08:00:00',
        timeZone: 'UTC',
      },
      end: {
        dateTime: '2024-01-31T09:00:00',
        timeZone: 'UTC',
      },
    };

    const response = await axios.post(apiUrl, eventPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Event created:', response.data);
  } catch (error) {
    console.error('Error creating event:', error.response ? error.response.data : error.message);
  }
};

export async function createGoogleEvent({ session, start, end, eventName, eventDescription }) {
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

export async function googleSignIn(supabase) {
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

export async function googleSignOut(supabase) {
  await supabase.auth.signOut();
}
