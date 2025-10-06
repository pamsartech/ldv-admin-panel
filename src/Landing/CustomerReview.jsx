// import React, { useState , useEffect } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faStar,
//   faBox,
//   faClock,
//   faArrowLeft,
//   faArrowRight,
//   faAngleRight,
//   faAngleLeft,
// } from "@fortawesome/free-solid-svg-icons";

// const testimonials = [
//   {
//     name: "Lisa Thompson",
//     country: "Italy",
//     image: "https://randomuser.me/api/portraits/women/44.jpg",
//     rating: 5,
//     review:
//       "Love the home decor sessions! The hosts have great taste and the products transform my space. Customer service is outstanding too.",
//     items: "15 items",
//     delivery: "1 Day Delivery",
//     category: "Fashion",
//   },
//   {
//     name: "Sarah Johnson",
//     country: "Italy",
//     image: "https://randomuser.me/api/portraits/women/68.jpg",
//     rating: 5,
//     review:
//       "Amazing experience! The live shopping sessions are so engaging and the hosts really know their products. I've bought 8 items so far and love every single one.",
//     items: "15 items",
//     delivery: "1 Day Delivery",
//     category: "Fashion",
//   },
//   {
//     name: "Emily Chen",
//     country: "Italy",
//     image: "https://randomuser.me/api/portraits/women/22.jpg",
//     rating: 5,
//     review:
//       "Love the home decor sessions! The hosts have great taste and the products transform my space. Customer service is outstanding too.",
//     items: "15 items",
//     delivery: "3 Day Delivery",
//     category: "Fashion",
//   },
//   {
//     name: "Michael Brown",
//     country: "Italy",
//     image: "https://randomuser.me/api/portraits/men/45.jpg",
//     rating: 5,
//     review:
//       "The shopping experience is seamless and the delivery is super fast. I’ll definitely keep buying here!",
//     items: "20 items",
//     delivery: "2 Day Delivery",
//     category: "Home Decor",
//   },
//   {
//     name: "Sophia Lee",
//     country: "Italy",
//     image: "https://randomuser.me/api/portraits/women/29.jpg",
//     rating: 5,
//     review:
//       "Absolutely love the unique product collections. Each live session feels special and interactive.",
//     items: "10 items",
//     delivery: "1 Day Delivery",
//     category: "Lifestyle",
//   },
//   {
//     name: "Michael Brown",
//     country: "Italy",
//     image: "https://randomuser.me/api/portraits/men/45.jpg",
//     rating: 5,
//     review:
//       "The shopping experience is seamless and the delivery is super fast. I’ll definitely keep buying here!",
//     items: "20 items",
//     delivery: "2 Day Delivery",
//     category: "Home Decor",
//   },
//    {
//     name: "Michael Brown",
//     country: "Italy",
//     image: "https://randomuser.me/api/portraits/men/45.jpg",
//     rating: 5,
//     review:
//       "The shopping experience is seamless and the delivery is super fast. I’ll definitely keep buying here!",
//     items: "20 items",
//     delivery: "2 Day Delivery",
//     category: "Home Decor",
//   },
//    {
//     name: "Michael Brown",
//     country: "Italy",
//     image: "https://randomuser.me/api/portraits/men/45.jpg",
//     rating: 5,
//     review:
//       "The shopping experience is seamless and the delivery is super fast. I’ll definitely keep buying here!",
//     items: "20 items",
//     delivery: "2 Day Delivery",
//     category: "Home Decor",
//   },
//    {
//     name: "Michael Brown",
//     country: "Italy",
//     image: "https://randomuser.me/api/portraits/men/45.jpg",
//     rating: 5,
//     review:
//       "The shopping experience is seamless and the delivery is super fast. I’ll definitely keep buying here!",
//     items: "20 items",
//     delivery: "2 Day Delivery",
//     category: "Home Decor",
//   },
//    {
//     name: "Michael Brown",
//     country: "Italy",
//     image: "https://randomuser.me/api/portraits/men/45.jpg",
//     rating: 5,
//     review:
//       "The shopping experience is seamless and the delivery is super fast. I’ll definitely keep buying here!",
//     items: "20 items",
//     delivery: "2 Day Delivery",
//     category: "Home Decor",
//   },
 
 
// ];

// export default function CustomerReview() {

//  const [currentIndex, setCurrentIndex] = useState(0);
//   const [visibleCards, setVisibleCards] = useState(3);

//   // Handle responsiveness
//   useEffect(() => {
//     const updateCards = () => {
//       if (window.innerWidth < 640) {
//         setVisibleCards(1); // Mobile
//       } else if (window.innerWidth < 1024) {
//         setVisibleCards(2); // Tablet
//       } else {
//         setVisibleCards(3); // Laptop/Desktop
//       }
//     };

//     updateCards();
//     window.addEventListener("resize", updateCards);
//     return () => window.removeEventListener("resize", updateCards);
//   }, []);

//   const prevSlide = () => {
//     setCurrentIndex((prev) =>
//       prev === 0 ? testimonials.length - visibleCards : prev - 1
//     );
//   };

//   const nextSlide = () => {
//     setCurrentIndex((prev) =>
//       prev >= testimonials.length - visibleCards ? 0 : prev + 1
//     );
//   };

//   return (
//     <section className="bg-gray-50 my-12 px-6 overflow-hidden">
//       {/* Heading */}
//       <div className="text-center mb-10">
//         <h2 className="text-2xl md:text-3xl font-semibold">
//           What Our <span className="text-[#B21E1E]">Customers</span> Say
//         </h2>
//         <p className="text-lg mt-2">
//           <img className="inline-block" src="/icons/Star.svg" alt="" /> 4.9/5
//           (2,000+ customers)
//         </p>
//       </div>

//       {/* Carousel */}
//       <div className="max-w-6xl py-2 mx-auto overflow-hidden relative ">
//   {/* Track */}
//   <div
//     className="flex transition-transform duration-500"
//     style={{
//       transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
//       width: `${(testimonials.length * 100) / visibleCards}%`,
//     }}
//   >
//     {testimonials.map((t, index) => (
//       <div
//         key={index}
//         className="px-2 flex-shrink-0"
//         style={{ width: `${100 / visibleCards}%` }}
//       >
//         <div className="bg-white rounded-xl shadow-md p-4 h-full flex flex-col">
//           {/* Top Row */}
//           <div className="flex items-center gap-4">
//             <img
//               src={t.image}
//               alt={t.name}
//               className="w-14 h-14 rounded-full object-cover"
//             />
//             <div className="min-w-0">
//               <h4 className="font-semibold truncate">{t.name}</h4>
//               <p className="text-sm text-gray-500">{t.country}</p>
//             </div>
//             <div className="lg:ml-auto text-xs md:text-sm flex text-yellow-400">
//               {Array(t.rating)
//                 .fill()
//                 .map((_, i) => (
//                   <FontAwesomeIcon key={i} icon={faStar} />
//                 ))}
//             </div>
//           </div>

//           {/* Review */}
//           <div>
//             <p className="px-2 w-fit md:w-fit break-words text-sm sm:text-base text-gray-600 mt-4">
//               {t.review}
//             </p>
//           </div>

//           <hr className="mt-4" />

//           {/* Bottom Row */}
//           <div className="flex items-center gap-3 mt-4 text-sm flex-wrap">
//             <span className="flex items-center text-xs md:text-sm gap-1 text-gray-700">
//               <FontAwesomeIcon icon={faBox} className="text-red-500" />
//               {t.items}
//             </span>
//             <span className="flex items-center text-xs md:text-sm gap-1 text-gray-700">
//               <FontAwesomeIcon icon={faClock} className="text-[#235418]" />
//               {t.delivery}
//             </span>
//             <span className="bg-red-100 text-red-500 px-2 py-1 rounded-full text-xs md:text-sm font-medium">
//               {t.category}
//             </span>
//           </div>
//         </div>
//       </div>
//     ))}
//   </div>

//   {/* Controls */}
//   <button
//     onClick={prevSlide}
//     className="absolute left-0 bottom-4 bg-white shadow-md w-7 h-7 rounded-full flex items-center justify-center"
//   >
//     <FontAwesomeIcon icon={faAngleLeft} />
//   </button>
//   <button
//     onClick={nextSlide}
//     className="absolute right-0 bottom-4 bg-white shadow-md w-7 h-7 rounded-full flex items-center justify-center"
//   >
//     <FontAwesomeIcon icon={faAngleRight} />
//   </button>
// </div>


//       {/* Dots */}
//       <div className="flex justify-center gap-2 mt-6">
//         {Array(testimonials.length - visibleCards + 1)
//           .fill()
//           .map((_, index) => (
//             <span
//               key={index}
//               onClick={() => setCurrentIndex(index)}
//               className={`w-3 h-3 rounded-full cursor-pointer ${
//                 index === currentIndex ? "bg-red-500" : "bg-gray-300"
//               }`}
//             ></span>
//           ))}
//       </div>

//       {/* Bottom Stats */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mt-12">
//         <div>
//           <h3 className="text-[#B21E1E] text-2xl font-semibold">10,000+</h3>
//           <p className="text-sm">Happy Customers</p>
//         </div>
//         <div>
//           <h3 className="text-[#235418] text-2xl font-semibold">50,000+</h3>
//           <p className="text-sm">Products Sold</p>
//         </div>
//         <div>
//           <h3 className="text-[#B21E1E] text-2xl font-semibold">4.9/5</h3>
//           <p className="text-sm">Average Rating</p>
//         </div>
//         <div>
//           <h3 className="text-[#235418] text-2xl font-semibold">24h</h3>
//           <p className="text-sm">Average Delivery</p>
//         </div>
//       </div>
//     </section>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faBox,
  faClock,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";

/** 10 sample items */
const testimonials = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: `Customer ${i + 1}`,
  country: "Italy",
  image: `https://randomuser.me/api/portraits/${i % 2 === 0 ? "women" : "men"}/${30 + i}.jpg`,
  rating: 5,
  review:
    "This is a sample review. The product and experience are excellent — fast delivery, great quality and friendly service.",
  items: `${10 + i} items`,
  delivery: `${(i % 3) + 1} Day Delivery`,
  category: i % 2 === 0 ? "Fashion" : "Home Decor",
}));

export default function CustomerReview() {
  const containerRef = useRef(null);
  const resizeTimeoutRef = useRef(null);

  const [visibleCards, setVisibleCards] = useState(3);
  const [slideWidth, setSlideWidth] = useState(0); // px
  const [currentIndex, setCurrentIndex] = useState(0);

  // compute layout (visibleCards + slideWidth) based on container width
  const updateLayout = () => {
    const containerWidth = containerRef.current?.offsetWidth ?? window.innerWidth;

    // decide visible cards by window width breakpoints
    let vc = 3;
    if (window.innerWidth < 640) vc = 1; // mobile
    else if (window.innerWidth < 1024) vc = 2; // tablet
    else vc = 3; // desktop

    // compute slide width in pixels
    const newSlideWidth = containerWidth / vc;

    // clamp currentIndex so we don't overflow when visibleCards changes
    const maxIndex = Math.max(0, testimonials.length - vc);
    setCurrentIndex((prev) => Math.min(prev, maxIndex));

    setVisibleCards(vc);
    setSlideWidth(newSlideWidth);
  };

  useEffect(() => {
    // initial layout
    updateLayout();

    // debounce resize updates
    const handler = () => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(() => {
        updateLayout();
      }, 80);
    };

    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("resize", handler);
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // navigation functions (wrap-around)
  const maxIndex = Math.max(0, testimonials.length - visibleCards);
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const trackWidth = slideWidth * testimonials.length; // px
  const translateX = -currentIndex * slideWidth; // px

  const totalDots = Math.max(testimonials.length - visibleCards + 1, 1);

  return (
    <section className="bg-gray-50 my-12  px-4">

      {/* Heading */}
       <div className="text-center mb-10">
         <h2 className="text-2xl md:text-3xl font-semibold">
           What Our <span className="text-[#B21E1E]">Customers</span> Say
         </h2>
         <p className="text-lg mt-2">
           <img className="inline-block" src="/icons/Star.svg" alt="" /> 4.9/5
           (2,000+ customers)
         </p>
       </div>

      {/* carousel viewport */}
      <div
        className="max-w-6xl mx-auto relative overflow-hidden"
        ref={containerRef}
        aria-roledescription="carousel"
      >
        {/* track */}
        <div
          className="flex my-2 transition-transform duration-400 ease-in-out"
          style={{
            width: trackWidth ? `${trackWidth}px` : "auto",
            transform: `translateX(${translateX}px)`,
          }}
        >
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="px-2 flex-shrink-0"
              style={{ width: slideWidth ? `${slideWidth}px` : "100%" }}
            >
              <article className="bg-white rounded-xl shadow-md p-4 h-full flex flex-col min-h-[180px]">
                {/* top */}
                <div className="flex items-center gap-4">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-semibold truncate">{t.name}</h4>
                    <p className="text-sm text-gray-500">{t.country}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1 text-yellow-400">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar} />
                    ))}
                  </div>
                </div>

                {/* review */}
                <p className="px-2 w-full break-words text-sm sm:text-base text-gray-600 mt-4 flex-1">
                  {t.review}
                </p>

                <hr className="mt-4" />

                {/* bottom */}
                <div className="flex items-center gap-3 mt-4 text-sm flex-wrap">

                  <span className="flex items-center text-xs md:text-sm gap-1 text-gray-700">
                    <FontAwesomeIcon icon={faBox} className="text-red-500" />
                    {t.items}
                  </span>

                   <span className="flex items-center text-xs md:text-sm gap-1 text-gray-700">
                    <FontAwesomeIcon icon={faClock} className="text-[#235418]" />
                    {t.delivery}
                  </span>

                  <span className="bg-red-100 text-red-500 px-2 py-1 rounded-full text-xs md:text-sm font-medium">
                    {t.category}
                  </span>

                </div>
              </article>
            </div>
          ))}
        </div>

        {/* prev / next controls */}
        <button
          aria-label="Previous slide"
          onClick={prevSlide}
          className="absolute left-0 bottom-5 -translate-y-1/2 bg-white shadow-md w-7 h-7 rounded-full flex items-center justify-center"
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <button
          aria-label="Next slide"
          onClick={nextSlide}
          className="absolute right-0 bottom-5 -translate-y-1/2 bg-white shadow-md w-7 h-7 rounded-full flex items-center justify-center"
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </div>

      {/* dots */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalDots }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-3 h-3 rounded-full ${
              i === currentIndex ? "bg-red-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

       {/* Bottom Stats */}
       <div className=" grid grid-cols-2 md:grid-cols-4 max-w-5xl mx-auto gap-6 text-center  mt-12">
         <div>
           <h3 className="text-[#B21E1E] text-2xl font-semibold">10,000+</h3>
           <p className="text-sm">Happy Customers</p>
         </div>
         <div>
           <h3 className="text-[#235418] text-2xl font-semibold">50,000+</h3>
           <p className="text-sm">Products Sold</p>
         </div>
         <div>
           <h3 className="text-[#B21E1E] text-2xl font-semibold">4.9/5</h3>
           <p className="text-sm">Average Rating</p>
         </div>
         <div>
           <h3 className="text-[#235418] text-2xl font-semibold">24h</h3>
           <p className="text-sm">Average Delivery</p>
         </div>
       </div>

    </section>
  );
}



