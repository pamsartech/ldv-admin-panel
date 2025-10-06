// function FAQ() {
//   return (
//     <div className="mt-10">

//       <div className="text-center">
//         <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
//             Frequently Asked
//           <span className="text-[#B21E1E]"> Questions </span>
//         </h2>
//         <p className="text-gray-600 mt-3 max-w-3xl mx-auto">
//           Everything you need to know about La Dolce Vita’s authentic Italian shopping experience
//         </p>
//       </div>


//       {/* faq section */}
//         <div className="max-w-3xl mx-auto text-center mb-10">
//         <h2 className="text-2xl md:text-3xl font-semibold">
//           Frequently Asked <span className="text-red-600">Questions</span>
//         </h2>
//         <p className="text-gray-600 mt-2">
//           Find answers to common questions below.
//         </p>
//       </div>

//       {/* FAQ List */}
//       <div className="max-w-3xl mx-auto space-y-4">
//         {faqs.map((faq, index) => (
//           <div
//             key={index}
//             className="bg-white rounded-lg shadow-md overflow-hidden"
//           >
//             <button
//               onClick={() => toggleFAQ(index)}
//               className="w-full flex justify-between items-center px-6 py-4 text-left focus:outline-none"
//             >
//               <span className="font-medium text-gray-800">
//                 {faq.question}
//               </span>
//               <span className="text-red-600 text-xl">
//                 {openIndex === index ? "−" : "+"}
//               </span>
//             </button>

//             {/* Answer */}
//             {openIndex === index && (
//               <div className="px-6 pb-4 text-gray-600 text-sm">
//                 {faq.answer}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//     </div>
//   );
// }

// export default FAQ;


import React, { useState } from "react";

const faqs = [
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy on most items. Products must be in original condition with packaging. Please contact our support team to initiate a return.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Shipping usually takes 3–7 business days depending on your location. Express delivery options are also available at checkout.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship to most countries worldwide. International shipping rates and times vary depending on the destination.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order has shipped, you’ll receive a tracking link via email. You can also check your order status in your account dashboard.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, Google Pay, and Apple Pay. For some regions, Cash on Delivery (COD) is also available.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-50 py-12 mt-5 px-6">
      {/* Heading */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-semibold">
          Frequently Asked <span className="text-[#B21E1E]">Questions</span>
        </h2>
        <p className="text-gray-600 mt-2">
          Everything you need to know about La Dolce Vita’s authentic Italian shopping experience
        </p>
      </div>

      {/* FAQ List */}
      
        <div className="max-w-4xl mx-auto rounded-2xl px-5 py-5 shadow-md bg-white">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white border-b   overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center px-6 py-4 text-left focus:outline-none"
            >
              <span className="font-medium text-gray-800">
                {faq.question}
              </span>
              <span className="text-black text-xl">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>

            {/* Answer */}
            {openIndex === index && (
              <div className="px-6 pb-4 text-gray-600 text-sm">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
     
      
    </section>
  );
}

