import React, { useEffect, useState } from "react";
import axios from "axios";
import User from  "../components/User";
import EventEntry from  "../components/EventEntry";
import { Outlet, Link } from "react-router-dom";


const Home = () => {

  const [usersData, setUsersData] = useState([])
  const [eventsData, setEventsData] = useState([])

  useEffect(() => {
    axios
      .get("http://localhost:5000/users", {})
      .then((response) => {
        setUsersData(response.data);
      });
  }, []);
  
  useEffect(() => {
    axios
      .get("http://localhost:5000/events", {})
      .then((response) => {
        setEventsData(response.data);
    });
  }, []);

  const eventsList = eventsData.map((event) => {
    return (
      <div key={event.id}>
        <EventEntry
        event={event}
        ></EventEntry>
      </div>
    );
  });

  const usersList = usersData.map((user) => {
    return (
      <div key={user.id}>
        <User
        user={user}
        ></User>
      </div>
    );
  });

  return (
    <main className="App">
      <h1 className="header">
        Welcome
      </h1>
      <section>
        <h2>Recently Added Events</h2>
        {/* <ul>{eventsList}</ul> */}
      </section>
      <section>
        <h2>My Events</h2>
      </section>
      <section>
        <h2>All Events</h2>
      </section>
      <section>
        <button id="directory"><span>Black Adie Directory</span></button>
      </section>
    </main>
  );
};

export default Home;