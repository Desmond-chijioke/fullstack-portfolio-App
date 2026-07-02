
import { Link } from "react-router-dom";
import img2 from "../image/img-2.jpeg"

export const Header = () => {
  return (
    <header className="site-header">
      <div className="header">
        <Link className="brand" to="/">
          <img src={img2} alt="Osita Kingsley Odo" />
          <div className="brand-copy">
            <strong>Osita Kingsley Odo</strong>
            <span>Cybersecurity Analyst • Risk & Privacy</span>
          </div>
        </Link>

        <nav className="navbar">
          <Link className="nav-link" to="/">
            Home
          </Link>

          <Link className="nav-link" to="/experience">
            Experience
          </Link>

          <Link className="nav-link" to="/education">
            Education
          </Link>

          <Link className="nav-link" to="/skills">
            Skills
          </Link>

          <Link className="nav-link primary" to="/contact">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  )
}