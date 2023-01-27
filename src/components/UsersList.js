import React from "react";

const UsersList = (props) => {

  const usersList = props.users.map((user, index) => {
    return (
      <div key={index}>
        <User
        user={user}
        ></User>
      </div>
    );
  });

  return (
    <section className="lowerGrid">
      <h2 className="directoryHeader">
      Black Adie Directory
      </h2>
      <div className="directory">
        {usersList}
      </div>
    </section>
    );
  };

// UsersList.propTypes


export default UsersList;