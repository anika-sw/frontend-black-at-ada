import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Attestation = () => {

  const [ada, setAda] = useState(false);
  const [black, setBlack] = useState(false);

  const checkHandler = (event) => {
    if (event.target.id === 'ada') {
      setAda((ada) => !ada);
    } else if (event.target.id === 'black') {
      setBlack((black) => !black);
    }
  };

  const navigate = useNavigate();
  const routeChange = (event) => {
    navigate('/signup');
  };

  return (
    <div>
      <h1>Attestation</h1>
      <input 
        value={ada} 
        type="checkbox" 
        id="ada" 
        onChange={checkHandler}>
      </input>
      <label htmlFor="ada">
        I am an Ada Developers Academy student (classroom or internship) or alum.
      </label>
      <br />
      <input 
      value={black} 
      type="checkbox" 
      id="black" 
      onChange={checkHandler}/>
      <label htmlFor="checkbox">I identify as Black.</label>
      <br />
      <input
        type="submit"
        value="Confirm"
        className="button"
        disabled={!ada || !black}
        onClick={routeChange}
      ></input>
    </div>
  );
};

export default Attestation;