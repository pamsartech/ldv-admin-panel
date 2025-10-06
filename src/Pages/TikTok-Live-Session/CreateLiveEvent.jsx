import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faTrash, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../Components/Navbar";
import axios from "axios";

const initialProducts = [
  {
    id: 1,
    name: "Classic white Sneakers",
    sku: "1231",
    price: 12.99,
    image: "https://uspoloassn.in/cdn/shop/files/1_b38f1b29-bdee-4078-8f72-1507aad69aa7.jpg",
  },
  {
    id: 2,
    name: "Classic white Sneakers",
    sku: "1231",
    price: 12.99,
    image: "https://uspoloassn.in/cdn/shop/files/1_b38f1b29-bdee-4078-8f72-1507aad69aa7.jpg",
  },
  {
    id: 3,
    name: "Classic white Sneakers",
    sku: "1231",
    price: 12.99,
    image: "https://uspoloassn.in/cdn/shop/files/1_b38f1b29-bdee-4078-8f72-1507aad69aa7.jpg",
  },
];

function CreateLiveEvent() {
  const navigate = useNavigate();

  const [eventDetails, setEventDetails] = useState({
    eventName: "",
    eventDescription: "",
    sessionID: "",
    status: "Inactive",
    startDateTime: "",
    endDateTime: "",
    eventLink: "",
  });

  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");

  const [hostInfo, setHostInfo] = useState({
    hostName: "",
    hostEmailAddress: "",
    hostPhoneNumber: "",
  });

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleHostChange = (e) => {
    const { name, value } = e.target;
    setHostInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveProduct = (id) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventDetails.eventLink);
    alert("TikTok live event link copied to clipboard!");
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.includes(searchTerm)
  );

  // ✅ API Integration for full event
  const handleSave = async (e) => {
  e.preventDefault(); // prevent page reload

  // convert dates to ISO format
  const startDateISO = new Date(eventDetails.startDateTime).toISOString();
  const endDateISO = new Date(eventDetails.endDateTime).toISOString();

  const payload = {
    eventDetails: {
      eventName: eventDetails.eventName,
      eventDescription: eventDetails.eventDescription,
      sessionID: eventDetails.sessionID,
      status: eventDetails.status,
      startDateTime: startDateISO,
      endDateTime: endDateISO,
      eventLink: eventDetails.eventLink,
    },
    hostInformation: {
      hostName: hostInfo.hostName,
      hostEmailAddress: hostInfo.hostEmailAddress,
      hostPhoneNumber: String(hostInfo.hostPhoneNumber), // force string
    },
  };

  try {
    const response = await axios.post(
      "https://la-dolce-vita.onrender.com/api/event/create-live-event",
      payload
    );

    console.log("Event created:", response.data);
    alert("Event saved successfully!");
    navigate("/tiktok");
  } catch (error) {
    console.error("Error saving event:", error.response?.data || error.message);
    alert("Failed to save event. Please try again.");
  }
};


  return (
    <div>
      <Navbar heading="TikTok Live Event Management" />

      {/* Header */}
      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Create New Live Event</h1>
        <button
          onClick={() => navigate("/tiktok")}
          className="mr-20 px-3 py-1 border border-red-700 text-red-700 bg-red-50 rounded-md hover:bg-gray-100"
        >
          <FontAwesomeIcon icon={faXmark} size="lg" className="text-red-700 px-2" />
          Discard Event
        </button>
      </div>

      {/* ✅ FORM START */}
      <form onSubmit={handleSave} className="max-w-6xl mb-10 mx-5 p-4 space-y-8">
        {/* Event Details */}
        <section className="border border-gray-400 rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-semibold">Event details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label>Event Name*</label>
              <input
                required
                type="text"
                name="eventName"
                value={eventDetails.eventName}
                onChange={handleEventChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label>Event Description*</label>
              <input
                required
                type="text"
                name="eventDescription"
                value={eventDetails.eventDescription}
                onChange={handleEventChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label>Session ID*</label>
              <input
                required
                type="text"
                name="sessionID"
                value={eventDetails.sessionID}
                onChange={handleEventChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label>status*</label>
              <select
                required
                name="status"
                value={eventDetails.status}
                onChange={handleEventChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="Inactive">Inactive</option>
                <option value="Active">Active</option>
                <option value="About to come">About to come</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
            <div>
              <label>Start Date & Time*</label>
              <input
                required
                type="datetime-local"
                name="startDateTime"
                value={eventDetails.startDateTime}
                onChange={handleEventChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label>End Date & Time*</label>
              <input
                required
                type="datetime-local"
                name="endDateTime"
                value={eventDetails.endDateTime}
                onChange={handleEventChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label>TikTok Live Link*</label>
              <div className="flex items-center border px-3 py-2 rounded">
                <input
                  required
                  type="text"
                  name="eventLink"
                  value={eventDetails.eventLink}
                  onChange={handleEventChange}
                  className="flex-grow focus:outline-none"
                />
                <button type="button" onClick={handleCopyLink}>
                  <FontAwesomeIcon icon={faClipboard} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Selected Products */}
        <section className="border border-gray-400 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">Selected products for live</h2>
          <div>
            <input
              type="text"
              placeholder="Search by products name or SKU to add products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <ul className="mt-4 space-y-3 max-h-60 overflow-y-auto">
            {filteredProducts.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between border border-gray-200 rounded-md p-2"
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={true}
                    readOnly
                    className="w-4 h-4 border-gray-400 rounded accent-blue-600"
                  />
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sku}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-sm font-semibold">€ {product.price.toFixed(2)}</p>
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(product.id)}
                    aria-label={`Remove ${product.name}`}
                    className="text-gray-600 hover:text-red-600"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </li>
            ))}
            {filteredProducts.length === 0 && (
              <li className="text-center text-gray-500">No products found.</li>
            )}
          </ul>
        </section>

        {/* Host Info */}
        <section className="border border-gray-400 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Host information</h2>
            <button
              type="button"
              className="flex items-center space-x-1 bg-[#02B978] text-white px-3 py-1 rounded-lg hover:bg-[#04D18C]"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Add host</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="hostName">
                Host name*
              </label>
              <input
                required
                type="text"
                id="hostName"
                name="hostName"
                value={hostInfo.hostName}
                onChange={handleHostChange}
                className="w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="EmailAddress">
                Email address*
              </label>
              <input
                required
                type="email"
                id="EmailAddress"
                name="hostEmailAddress"
                value={hostInfo.hostEmailAddress}
                onChange={handleHostChange}
                className="w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="PhoneNumber">
                Phone Number*
              </label>
              <input
                required
                type="number"
                id="PhoneNumber"
                name="hostPhoneNumber"
                value={hostInfo.hostPhoneNumber}
                onChange={handleHostChange}
                className="w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Save Button */}
        <hr className="text-gray-400" />
        <div className="flex justify-end">
          <button
            type="submit" // ✅ submit triggers required
            className="bg-[#02B978] text-white px-6 py-2 rounded-lg hover:bg-[#04D18C]"
          >
            Save
          </button>
        </div>
      </form>
      {/* ✅ FORM END */}
    </div>
  );
}

export default CreateLiveEvent;



