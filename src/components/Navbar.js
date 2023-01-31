import { useAuth } from '../hooks/useAuth';
import "../styles/Navbar.css";

const Navbar = () => {
  const { logout, user } = useAuth();

  return (
    <div className="navbar">
      {/* <div class="fixed-top">
        <div class="collapse" id="navbarToggleExternalContent">
          <div class="bg-dark p-4">
            <h5 class="text-white h4">Collapsed content</h5>
            <span class="text-muted">Toggleable via the navbar brand.</span>
          </div>
        </div>
        <nav class="navbar navbar-dark bg-dark">
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
        </nav>
      </div> */}
      <header>
        <h2>Navigation</h2>
        <nav>
            <ul>
                <li>
                    <a href="/pages/about.html">About Me</a>
                </li>
                <li>
                    <a href="/pages/portfolio.html">Projects</a>
                </li>
            </ul>
        </nav>
      </header>
      {user && <button onClick={logout}>Logout</button>}
      <div>
        <span>Black@Ada</span>
      </div>
    </div>  
  )
};

export default Navbar;