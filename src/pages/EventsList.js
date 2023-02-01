import React, { useEffect, useState } from "react";
import axios from "axios";
import EventEntry from  "../components/EventEntry";


const EventsList = () => {

  const [eventsData, setEventsData] = useState([])

  useEffect(() => {
    axios
      .get("http://localhost:5000/events", {})
      .then((response) => {
        setEventsData(response.data);
    });
  }, []);

  const eventsList = eventsData.map((event) => {
    return (
      <li key={event.id}>
        <EventEntry
        event={event}
        ></EventEntry>
      </li>
    );
  });

  return (
    <div>
      <h1 className="header">
        Upcoming Events
      </h1>
      <section>
        <h2>My Events</h2>
        <ul>{eventsList}</ul>
      </section>
      <section>
        <h2>Recently Added Events</h2>
      </section>
      <section>
        <h2>All Events</h2>
        <br />
        <br />
        <br />
        <br />
        <br />
        <input type="checkbox" /><label htmlFor="checkbox">Near Me</label>
        <input type="checkbox" /><label htmlFor="checkbox">Online</label>
        <input type="checkbox" /><label htmlFor="checkbox">Anyone</label>
        <input type="checkbox" /><label htmlFor="checkbox">Classroom Adies</label>
        <input type="checkbox" /><label htmlFor="checkbox">Internship Adies</label>
        <input type="checkbox" /><label htmlFor="checkbox">Adie Alum</label>
        <input type="checkbox" /><label htmlFor="checkbox">Show All Past Events</label>
        <input type="checkbox" /><label htmlFor="checkbox">Show My Past Events</label>
      </section>
    </div>
  )
};  

export default EventsList;