import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';

const About = () => {
  const carouselItems = [
    {
      image: '/img1.jpg',
      alt: 'Mission Statement',
      caption: "Our mission: To connect donors and recipients, saving lives one drop at a time.",
    },
    {
      image: '/img2.gif',
      alt: 'Blood Donation Statistics',
      caption: "Every 2 seconds, someone needs blood. Be the difference!",
    },
    {
      image: '/banner4.jpg',
      alt: 'Donor Spotlight',
      caption: "Meet our heroes! Thank you to our 10,000+ donors for saving lives worldwide.",
    },
    {
      image: '/banner6.jpg',
      alt: 'How It Works',
      caption: "It's easy to save lives! Register, donate, and make a difference.",
    },
    {
      image: '/banner1.jpg',
      alt: 'Testimonials',
      caption: "John says: 'DonateHope helped me save a life—quickly and seamlessly.'",
    },
    {
      image: '/banner8.jpg',
      alt: 'Call to Action',
      caption: "Join us today. Donate blood, save lives. Your kindness matters.",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="px-10 py-16">
      {/* About Section */}
      <div className="flex flex-col items-center">
      </div>
       <div className="mt-16">
        <h1 className="text-4xl font-bold text-center mb-8">About DonateHope</h1>
        <hr className="bg-[#800000] w-1/3 h-1 mb-4 mx-auto" />
        <p className="text-lg text-center mb-12 text-gray-600 max-w-3xl mx-auto">
          DonateHope is a platform dedicated to making blood donation seamless and accessible. Join us in saving lives and making a difference.
        </p>
      </div>
      {/* Carousel Section */}
<div className="mt-12">
  <Slider {...settings}>
    {carouselItems.map((item, index) => (
      <div key={index} className="text-center">
        <img
          src={item.image}
          alt={item.alt}
          className="w-full h-[600px] object-cover rounded-lg" // Increased height
        />
        <p className="mt-4 text-xl font-medium text-gray-800">{item.caption}</p>
      </div>
    ))}
  </Slider>
</div>


      {/* Stats Section */}
      <div className="mt-16">
        <h1 className="text-4xl font-bold text-center mb-8">What We Do?</h1>
        <hr className="bg-[#800000] w-1/3 h-1 mb-4 mx-auto" />
        <p className="text-lg text-center mb-12 text-gray-600 max-w-3xl mx-auto">
          With the right donor data management and blood stock management, HLB works closely
          with blood banks to maintain their information and also recruit, engage, and retain
          donors as per demand. Folks in search of blood can get access to blood availability
          info.
        </p>
       
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-red-50 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-3xl font-bold text-red-600 mb-2">124</h3>
            <p className="text-gray-700">Blood events organized</p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-3xl font-bold text-red-600 mb-2">9,683</h3>
            <p className="text-gray-700">Blood search managed</p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-3xl font-bold text-red-600 mb-2">27,210</h3>
            <p className="text-gray-700">Lives saved</p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-3xl font-bold text-red-600 mb-2">63,499</h3>
            <p className="text-gray-700">Total data digitized</p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-3xl font-bold text-red-600 mb-2">5,908</h3>
            <p className="text-gray-700">Total blood collected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
