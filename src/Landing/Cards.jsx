import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCode,
  faCertificate,
  faStar,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";

function Cards () {

  return (

    <section className="bg-white px-6 lg:px-20 py-16 text-center">
      {/* Heading */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
        Experience the Difference with 
        <span className="text-[#B21E1E]"> La Dolce Vita</span>
      </h2>
      <p className="text-gray-600 mt-3 max-w-3xl mx-auto">
        Bringing the art of Italian shopping to the digital world. Discover
        elegance, quality, and Italian passion through our innovative and secure
        live experiences.
      </p>

      {/* Grid cards*/}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        {/* Card 1 */}
        <div className="border-l-2 border-red-600 rounded-xl p-8 shadow-xl hover:shadow-2xl transition">
          <img className="mx-auto py-4" src="/icons/material-symbols_code-rounded.svg" alt="icon" />
          <h3 className="font-medium text-lg text-gray-900 mb-2">
            Advanced Live Streaming
          </h3>
          <p className="text-gray-600 text-sm">
            Cutting-edge streaming technology with real-time product showcases,
            interactive demos, and instant Q&A capabilities.
          </p>
        </div>

        {/* Card 2 */}
        <div className="border-l-2 border-green-700 rounded-xl p-8 shadow-xl hover:shadow-2xl transition">
          <img className="mx-auto py-4" src="/icons/carbon_badge.svg" alt="icon" />
          <h3 className="font-medium text-lg text-gray-900 mb-2">
            Authentic Italian Products
          </h3>
          <p className="text-gray-600 text-sm">
            Verified authentic Italian products sourced directly from artisans
            and trusted Italian brands.
          </p>
        </div>

        {/* Card 3 */}
        <div className="border-l-2 border-red-600 rounded-xl p-8 shadow-xl hover:shadow-2xl transition">
          {/* <FontAwesomeIcon icon={faStar} className="text-red-600 text-3xl py-4" /> */}
          <img className="mx-auto py-4" src="/icons/hugeicons_ai-magic.svg" alt="icon" />
          <h3 className="font-medium text-lg text-gray-900 mb-2">
            Smart Recommendations
          </h3>
          <p className="text-gray-600 text-sm">
            AI-powered recommendations and personalized shopping experiences
            tailored to your Italian lifestyle preferences.
          </p>
        </div>

        {/* Card 4 */}
        <div className="border-l-2 border-green-800 rounded-xl p-8 shadow-xl hover:shadow-2xl transition">
          <img className="mx-auto py-4" src="/icons/tabler_shopping-cart-heart.svg" alt="icon" />
          <h3 className="font-medium text-lg text-gray-900 mb-2">
            Seamless Experience
          </h3>
          <p className="text-gray-600 text-sm">
            Innovative e-commerce technology, from live product previews to
            instant purchase and fast Italian delivery.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Cards;

