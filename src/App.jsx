import { Header } from "./Component/Header";
import { Home } from "./Component/Home";
import { Experience } from "./Component/Experience";
import { Education } from "./Component/Education";
import { Skill } from "./Component/Skill";
import { Contact } from "./Component/Contact";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/education" element={<Education />} />
        <Route path="/skills" element={<Skill />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;