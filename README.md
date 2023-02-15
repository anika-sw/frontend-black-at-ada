# Black@Ada web app

Black@Ada is a member-only web application fostering community by creating a digital space just for Black Adies. It's dynamic and can grow as the number of Black Adies increases, and it's virtual nature means that it can be used by any Black Adie anywhere.

[Capstone Presentation](https://youtu.be/kOpsiBWTm48)
[Backend Repository](https://github.com/anika-sw/backend-black-at-ada)

## Application Features

### Technologies

This project is a React application that utilizes Google Maps API for location autocomplete and, dynamic and static mapping features, Google Cloud Storage for image storage, and Flask-Bcrypt for password hashing on the backend.

### Create New User & Login

Users must enter required information to create a profile and gain access to the application. A user's email and hashed password is used to login to the app on subsquent visits to the site.

### Create & View Events

Any user can create an event, specifiying whether the event is online or in-person. All users can view events, opting to RSVP for an event on its details page. 

### View Salaries

Information optionally collected from users at sign-up (and updated at their discretion via their profile page) is displayed on the salary page. Salary entries can be sorted low to high, high to low, or by company.

### View User Directory

User information, including a picture, is displayed in the directory. Each entry includes an email for direct contact and an option link to the user's LinkedIn profile. Directory entries can be sorted by last name, company, or by users' Ada cohort; default view for the directory is alpha order by first name.

## Dependencies

In addition to React app, this web app relies on the following:

*Axios for API calls
*React Router (react-router-dom)
*@react-google-maps/api
*react-places-autocomplete
*react-static-google-map
*react-datetime-picker
*luxon
*moment
*dotenv-webpack