import React, { useEffect, useState } from "react";
import axios from "axios";
import UserEntry from  "../components/UserEntry";

const Directory = () => {
  const [usersData, setUsersData] = useState([])

  useEffect(() => {
    axios
      .get("http://localhost:5000/users", {})
      .then((response) => {
        setUsersData(response.data);
      });
  }, []);

  const usersList = usersData.map((user) => {
    return (
      <div key={user.id}>
        <UserEntry
        user={user}
        ></UserEntry>
      </div>
    );
  });

  return (
    <div>
      <h1 className="header">
        Black Adie Directory
      </h1>
      <section>
        <h2>Alphabet Nav Here</h2>
        <label htmlFor="sort">Sort by:
            <select className="sort">
                <option value="lastName">Last Name</option>
                <option value="cohort">Cohort</option>
                <option value="location">Near me</option>
            </select>
        </label>
        <ul>{usersList}</ul>
      </section> 
    </div>
  )
};  

export default Directory;