import React from 'react'
import DateTimePicker from "react-datetime-picker";
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import "../css/tailwind.css"

const DateTime = ({
    setStart,
    start,
    setEnd,
    end,
    eventName,
    setEventName,
    eventDescription,
    setEventDescription,
  }) => {
  return (
    <div>
      <p className="font-bold mt-8">Start of your event</p>
      <DateTimePicker
        onChange={setStart}
        value={start}
      />
      <p className="font-bold mt-8">End of your event</p>
      <DateTimePicker
        onChange={setEnd}
        value={end}
        style={{ width: "30px" }}
      />
      <p className="font-bold mt-8">Event name</p>
      <input 
        type="text" 
        value={eventName} 
        onChange={(e) => setEventName(e.target.value)}        
        placeholder='Event Name' 
        className="border rounded w-full p-2 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
      />
      <p className="font-bold mt-2">Event description</p>
      <input
        type="text"
        value={eventDescription}
        onChange={(e) => setEventDescription(e.target.value)}
        placeholder='Event Description' 
        className="border rounded w-full p-2 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
      />
    </div>
  )
}

export default DateTime;
