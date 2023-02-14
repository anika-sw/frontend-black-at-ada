import { useAuth } from '../hooks/useAuth';
import "../styles/Navbar.css";

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <nav className="navbar fixed-top navbar-expand-lg justify-content-end">
      <span className="navbar-brand mb-0 h1">Black<span className="at">@</span>Ada</span>
      <div className="ml-auto">
        <div className="dropdown">
          <button className="btn btn-nav dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Site Navigation
          </button>
          <div className="dropdown-menu dropdown-menu-right">
            <a className="dropdown-item" href="/home">Home</a>
            <a className="dropdown-item" href="/profile">My Profile</a>
            <a className="dropdown-item" href="/directory">Directory</a>
            <a className="dropdown-item" href="/events">Events</a>
            <a className="dropdown-item" href="/salaries">Salaries</a>
            <a className="dropdown-item" href="https://drive.google.com/drive/folders/1yh8ynUL9_izYYc4UKLrgrNpwaE2hk2Dp?usp=sharing">Black@Ada Google Drive</a>
            <span className="dropdown-item" onClick={logout}>Logout</span>
          </div>
        </div>
      </div>
    </nav>
  )
};

export default Navbar;