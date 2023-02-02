import { useAuth } from '../hooks/useAuth';
import { useNavigate } from "react-router-dom";


const Login = () => {

  const navigate = useNavigate();
  const routeChange = (event) => {
    navigate('/attest');
  }


  const { login } = useAuth();
  return (
    <div>
      <button onClick={login}>Log In</button>
      <button onClick={routeChange}>Sign Up</button>
    </div>
  );
};

export default Login;