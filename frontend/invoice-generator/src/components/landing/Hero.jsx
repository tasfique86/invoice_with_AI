import { Link } from "react-router-dom";
import HERO_IMG from "../../assets/hero_img.png";

const Hero = () => {
  const isAuthenticated = false;
  return (
    <section className="relative bg-[#fbfbfb] overflow-hidden ">
      <div className="absolute inset-0 bg-grid-white/[0.5] bg-[size:60px_60px]"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg-px-8 py-24 lg:py-32">
        <div className="text-center max-w-4xl mx-auto ">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-blue-950 leading-tight mb-6 ">
            AI-Powered Invoice, Made Efforless
          </h1>
          <p className="text-base sm:text-xl text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
            Let our AI create invoices from simple, genetate payment reminder,
            and provide smart insight to help your finance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {isAuthenticated ? (
              <Link className="bg-gradient-to-r from-blue-950 to-blue-900 hover:bg-gray-800 sm:text-lg text-base font-bold text-white px-8 py-4  rounded-lg  transition-all duration-200 hover:scale-105 hover:shadow-lg">
                {" "}
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-950 to-blue-900 hover:bg-gray-800 sm:text-lg text-base text-white px-6 py-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                Get Started for Free
              </Link>
            )}
            <a
              href="#features"
              className="border-2 border-black px-8 py-4 rounded-xl font-bold sm:text-lg text-base hover:bg-white hover:text-black transition-all duration-200 hover:scale-105 "
            >
              Learn More
            </a>
          </div>
        </div>
        <div className="mt-12 sm:mt-16 relative max-w-5xl mx-auto">
          <img
            src={HERO_IMG}
            alt="Invoice Image"
            className="rounded-2xl shadow-2xl shadow-gray-300 border-4  border-gray-200/20"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
