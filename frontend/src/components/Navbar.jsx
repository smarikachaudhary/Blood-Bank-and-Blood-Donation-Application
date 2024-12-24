import { Link as ScrollLink } from "react-scroll";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
      <div className="flex items-center justify-between h-[100px] px-[100px]">
          <img src="/Logo.png" alt="" height={100} width={130} className="cursor-pointer" />
          <div className="flex items-center justify-evenly cursor-pointer">
              <ScrollLink to = "top" smooth={true} duration={1000} className="mr-3 text-[18px] font-medium">Home</ScrollLink>
              <ScrollLink to = "about" smooth={true} duration={1000} className="mr-3 text-[18px] font-medium">About Us</ScrollLink>
              <ScrollLink to = "contact" smooth={true} duration={1000} className="mr-3 text-[18px] font-medium">Contact Us</ScrollLink>
              <Link to ="/login" smooth={true} duration={1000} className ="mr-3 text-[18px] font-medium ">Login/Signup</Link>
          </div>
      </div>
  )
}

export default Navbar