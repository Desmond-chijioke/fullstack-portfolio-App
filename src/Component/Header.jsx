import img2 from "../image/img-2.jpeg"

export const Header = () => {
  return (
    <header className="site-header">
      <div className="header">
        <a className="brand" href="#home">
          <img src={img2} alt="Osita Kingsley Odo" />
          <div>
            <strong>Osita Kingsley Odo</strong>
            <span>Cybersecurity Analyst</span>
          </div>
        </a>

        <nav className="navbar" aria-label="Primary navigation">
          <a className="nav-link" href="#experience">Experience</a>
          <a className="nav-link" href="#education">Education</a>
          <a className="nav-link" href="#skills">Skills</a>
          <a className="nav-link primary" href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  )
}