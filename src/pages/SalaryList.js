import React, { useState, useEffect } from 'react';
import axios from "axios";
import SalaryEntry from '../components/SalaryEntry';


const SalaryList = () => {
  const [salaryData, setSalaryData] = useState([])

  useEffect(() => {
    axios
      .get("http://localhost:5000/salaries", {})
      .then((response) => {
        setSalaryData(response.data);
    });
  }, []);

  const salaryList = salaryData.map((salary) => {
    return (
      <li key={salary.id}>
        <SalaryEntry
        salary={salary}
        ></SalaryEntry>
      </li>
    );
  });

  return (
    <div>
      <h1 className="header">
        Salaries
      </h1>
      <section>
        <ul>{salaryList}</ul>
      </section>
    </div>
  )
};

export default SalaryList;