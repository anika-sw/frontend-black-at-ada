import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const { login } = useAuth();
  return (
    <div>
      <button onClick={login}>Login</button>
    </div>
  );
};

export default Login;