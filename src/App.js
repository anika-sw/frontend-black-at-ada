import React, { useEffect, useState } from "react";
import axios from "axios";
import Event from  "./components/Event"


function App() {

  const [eventsData, setEventsData] = useState([])

  useEffect(() => {
    axios
      .get("http://localhost:5000/events", {})
      .then((response) => {
        console.log(response.data)
        setEventsData(response.data);
    });
  }, []);
  
  const eventsList = eventsData.map((event, index) => {
    return (
      <div key={index}>
        <Event
        event={event}
        ></Event>
      </div>
    );
  });


  return (
    <main className="App">
      <h1 className="header">
        Black@Ada
      </h1>
      <section>
        <h2>Recently Added Events</h2>
        <ol>{eventsList}</ol>
      </section>
      <section>
        <h2>My Events</h2>
      </section>
      <section>
        <h2>All Events</h2>
      </section>
      <section>
        <h2>Black Adie Directory</h2>
      </section>
      <footer>
        <h2>About</h2>
        <h2>Contact</h2>
      </footer>
    </main>
  );
};

export default App;
