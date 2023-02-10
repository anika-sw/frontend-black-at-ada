import React, { useEffect, useState } from "react";
import axios from "axios";
import EventEntry from  "../components/EventEntry";
import { Outlet, Link, useNavigate } from "react-router-dom";
import "../styles/Home.css";

const kBaseUrl = 'http://localhost:5000';

const Home = () => {

  // axios calls from flasky-front-end updated for user and event

  const convertFromApi = (apiUser) => {
    // const {id, name, color, personality, pet_count, caretaker} = apiCat;
    const {first_name, ...rest} = apiUser;

    // const newCat = {id, name, color, personality, petCount: pet_count, caretaker};
    const newUser = {firstName: first_name, ...rest};
    return newUser;
  };

  const [eventsData, setEventsData] = useState([])

  const getAllUsersApi = () => {
    return axios.get(`${kBaseUrl}/users`)
    .then(response => {
      return response.data.map(convertFromApi);
    })
    .catch(err => {
      console.log(err);
    })
  };

  // const petCatApi = (id) => {
  //   return axios.patch(`${kBaseUrl}/cats/${id}/pet`)
  //   .then(response => {
  //     return convertFromApi(response.data);
  //   })
  //   .catch(error => {
  //     console.log(error);
  //   });
  // };

  const deleteUserApi = (id) => {
    return axios.delete(`${kBaseUrl}/users/${id}`)
    .then(response => {
      return convertFromApi(response.data);
    })
    .catch(error => {
      console.log(error);
    });
  };

  const addNewUserApi = (userData) => {
    const requestBody = {...userData, first_name: "",};
  
    return axios.post(`${kBaseUrl}/users`, requestBody)
      .then(response => {
        return convertFromApi(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  // const handleUserSubmit = (data) => {
  //   addNewUserApi(data)
  //     .then(newUser => {
  //       setUserData([...userData, newUser])
  //     })
  //     .catch(e => console.log(e));
  // }
  
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