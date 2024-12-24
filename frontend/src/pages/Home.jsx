import About from "../components/About"
import Contact from "../components/Contact"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import Top from "../components/Top"
import { Element } from "react-scroll"

const Home = () => {
  return (
    <div>
      <Navbar />
      <Element name="top">
        <Top />
      </Element>
      <Element name="about">
        <About />
      </Element>
      <Element name="contact">
        <Contact />
      </Element>
      <Footer />
    </div>
  )
}

export default Home