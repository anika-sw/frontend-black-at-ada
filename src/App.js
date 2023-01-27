import React, { useState } from "react";
import Event from  "./components/Event"


function App() {

  const [eventsData, setEventsData] = useState({})
  
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
      <sectiom>
        <h2>My Events</h2>
      </sectiom>
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
