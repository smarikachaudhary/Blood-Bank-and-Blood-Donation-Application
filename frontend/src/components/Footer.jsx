import { Link } from "react-scroll";

const Footer = () => {
  return (
     <div className="bg-gray-100 px-[200px] h-[60vh] mt-[50px]">
      <div className="flex justify-between py-[5%]">
      <div>
        <img src="Logo.png" alt="" height={200} width={200} />
        <span>Saving lives, one donation at a time.</span>
      </div>

      <div>
        <h3 className="text-xl font-semibold">Quick Links</h3>
        <ul className="mt-2 space-y-2">
          <Link to="top">
            <li className="hover:underline">Home</li>
          </Link>
          <Link to="about">
            <li className="hover:underline">About Us</li>
          </Link>
          <Link to="contact">
            <li className="hover:underline">Contact</li>
          </Link>  
        </ul>
      </div>

      <div className="w-full md:w-1/3">
      <h3 className="text-xl font-semibold">Contact Us</h3>
      <p className="mt-2">Kathmandu, Nepal</p>
      <p className="mt-2">Phone: 9845101848</p>
      <p className="mt-2">Email: smarikachaudhary10Agmail.com</p>

      </div>
      </div>
      <div className="mt-8 border-t border-red-800 pt-4 text-center">
        <p>&copy; 2024 DonateHope. All rights reserved</p>
        <div className="flex justify-center space-x-4 mt-4">
        <a href="https://github.com/smarikachaudhary" className="hover:text-red-400">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12.08c0-5.522-4.477-10-10-10S2 6.558 2 12.08c0 4.411 3.07 8.083 7.305 9.27.535.098.73-.233.73-.518 0-.255-.009-.933-.014-1.832-2.97.647-3.595-1.433-3.595-1.433-.486-1.235-1.187-1.564-1.187-1.564-.97-.663.073-.65.073-.65 1.07.074 1.635 1.106 1.635 1.106.953 1.634 2.502 1.162 3.113.889.098-.695.373-1.163.68-1.43-2.373-.271-4.868-1.188-4.868-5.288 0-1.168.417-2.124 1.1-2.874-.111-.271-.478-1.363.104-2.842 0 0 .9-.288 2.95 1.095.856-.241 1.774-.36 2.688-.364.914.004 1.832.123 2.688.364 2.047-1.384 2.946-1.095 2.946-1.095.584 1.48.217 2.572.106 2.842.685.75 1.1 1.706 1.1 2.874 0 4.111-2.498 5.014-4.878 5.281.384.33.726.983.726 1.98 0 1.429-.013 2.583-.013 2.933 0 .287.193.62.735.515C18.93 20.16 22 16.491 22 12.08z" />
            </svg>
          </a>
          <a href="#" className="hover:text-red-400">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.23 5.924c-.813.36-1.684.603-2.598.711a4.517 4.517 0 001.984-2.486c-.867.514-1.826.888-2.847 1.09a4.503 4.503 0 00-7.673 4.106 12.78 12.78 0 01-9.292-4.71 4.501 4.501 0 001.392 6.008 4.482 4.482 0 01-2.044-.563v.057a4.504 4.504 0 003.605 4.416 4.515 4.515 0 01-2.036.077 4.506 4.506 0 004.205 3.127 9.034 9.034 0 01-5.602 1.932c-.363 0-.722-.021-1.079-.064a12.765 12.765 0 006.917 2.027c8.304 0 12.847-6.878 12.847-12.847 0-.195-.004-.39-.014-.583a9.183 9.183 0 002.252-2.343c-.825.367-1.71.614-2.63.723a4.518 4.518 0 001.979-2.495z" />
            </svg>
          </a>
          <a href="#" className="hover:text-red-400">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
             <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.34 3.608 1.314.975.975 1.252 2.242 1.314 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.34 2.633-1.314 3.608-.975.975-2.242 1.252-3.608 1.314-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.34-3.608-1.314-.975-.975-1.252-2.242-1.314-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.34-2.633 1.314-3.608.975-.975 2.242-1.252 3.608-1.314C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.735 0 8.332.015 7.053.072 5.775.129 4.608.352 3.515 1.446 2.422 2.54 2.199 3.707 2.142 4.985.015 8.333 0 8.735 0 12s.015 3.667.072 4.947c.057 1.278.28 2.445 1.374 3.538 1.093 1.093 2.26 1.316 3.538 1.374C8.333 23.985 8.735 24 12 24s3.667-.015 4.947-.072c1.278-.057 2.445-.28 3.538-1.374 1.093-1.093 1.316-2.26 1.374-3.538.057-1.28.072-1.683.072-4.947s-.015-3.667-.072-4.947c-.057-1.278-.28-2.445-1.374-3.538-1.093-1.093-2.26-1.316-3.538-1.374C15.667.015 15.265 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.881 0 1.44 1.44 0 012.881 0z" />
            </svg>
          </a>

        </div>
      </div>
    </div>
  )
}

export default Footer