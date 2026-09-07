import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

const FooteLink = ({ href, to, children }) => {
  const className =
    "block text-gray-400 hover:text-white transition-colors duration-300";
  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
};

const SocialLink = ({ href, children }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 bg-blue-950 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors duration-300"
    >
      {children}
    </a>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ">
          <div className="space-y-4 md:col-span-2 lg:col-span-1 ">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-blue-950 rounded-md flex items-center justify-center ">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold">AI Invoices App</span>
            </Link>
            <p className="text-gray-400 leading-relaxed max-w-sm">
              This simplest way to create and send professional Invoices.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold mb-6">Product</h3>
            <ul className="space-y-2">
              <li>
                <FooteLink href="#features">Features</FooteLink>
              </li>
              <li>
                <FooteLink href="#testimonials">Testimonials</FooteLink>
              </li>
              <li>
                <FooteLink href="#faq">FAQ</FooteLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <FooteLink to="/about">About</FooteLink>
              </li>
              <li>
                <FooteLink to="/contact">Contact</FooteLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <FooteLink to="/privacy">Privacy Policy</FooteLink>
              </li>
              <li>
                <FooteLink to="/terms">Terms of Service</FooteLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 py-8 mt-16">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400">
              &copy; 2026 AI Invoices App. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#">
                <FaTwitter className="w-4 h-4" />
              </SocialLink>
              <SocialLink href="#">
                <FaGithub className="w-4 h-4" />
              </SocialLink>
              <SocialLink href="#">
                <FaLinkedin className="w-4 h-4" />
              </SocialLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
