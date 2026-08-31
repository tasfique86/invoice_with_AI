import React, { useState } from "react";
import { FAQS } from "../../utils/data";
import { ChevronDown } from "lucide-react";

const FaqItem = ({ faq, isOpen, onClick }) => {
  return (
    <div className="border border-gray-200 overflow-hidden rounded-xl">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center p-6 bg-white hover:bg-gray-50 cursor-pointer transition-colors duration-300"
      >
        <span className="text-lg font-medium text-gray-900 pr-4m  text-left">
          {faq.question}
        </span>
        <ChevronDown
          className={`text-gray-400 w-6 h-6  transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <p className="pt-6 px-6 pb-6 text-gray-700 leading-relaxed border-t border-gray-100">
          {faq.answer}
        </p>
      )}
    </div>
  );
};

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <section id="faq" className="bg-white py-20 lg:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about our AI invoice generator
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <FaqItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onClick={() => handleClick(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faqs;
