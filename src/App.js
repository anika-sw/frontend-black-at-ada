// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Event from  "./components/Event";
// import User from  "./components/User";

// function App() {

//   const [eventsData, setEventsData] = useState([])
//   const [usersData, setUsersData] = useState([])

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/events", {})
//       .then((response) => {
//         setEventsData(response.data);
//     });
//   }, []);

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/users", {})
//       .then((response) => {
//         setUsersData(response.data);
//       });
//   }, []);
  
//   const eventsList = eventsData.map((event) => {
//     return (
//       <div key={event.id}>
//         <Event
//         event={event}
//         ></Event>
//       </div>
//     );
//   });

//   const usersList = usersData.map((user) => {
//     return (
//       <div key={user.id}>
//         <User
//         user={user}
//         ></User>
//       </div>
//     );
//   });

//   return (
//     <main className="App">
//       <h1 className="header">
//         Black@Ada
//       </h1>
//       <section>
//         <h2>Recently Added Events</h2>
//         <ul>{eventsList}</ul>
//       </section>
//       <section>
//         <h2>My Events</h2>
//       </section>
//       <section>
//         <h2>All Events</h2>
//       </section>
//       <section>
//         <h2>Black Adie Directory</h2>
//         <ul>{usersList}</ul>
//       </section>
//       <footer>
//         <h2>About</h2>
//         <h2>Contact</h2>
//       </footer>
//     </main>
//   );
// };

// export default App;
