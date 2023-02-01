import React, { useEffect, useState } from "react";
import axios from "axios";
import EventEntry from  "../components/EventEntry";
import { Outlet, Link, useNavigate } from "react-router-dom";


const Home = () => {

  const [eventsData, setEventsData] = useState([])
  
  useEffect(() => {
    axios
      .get("http://localhost:5000/events", {})
      .then((response) => {
        setEventsData(response.data);
    });
  }, []);

  const recentEventsList = eventsData.map((event) => {
    return (
      <div key={event.id}>
        <EventEntry
        event={event}
        ></EventEntry>
      </div>
    );
  });

  const navigate = useNavigate();
  const routeChange = (event) => {
    navigate('/directory');
  }

  return (
    <main className="App">
      <h1 className="header">
        Welcome
      </h1>
      <section>
        <h2>Announcements</h2>
      </section>
      <section>
        <h2>Recently Added Events</h2>
        {/* <ul>{recentEventsList}</ul> */}
      </section>
      <section>
        <h2>My Events</h2>
      </section>
      <section>
        <h2>All Events</h2>
      </section>
      <section>
        <button id="directory" onClick={routeChange}><span>Black Adie Directory</span></button>
      </section>
    </main>
  );
};

export default Home;