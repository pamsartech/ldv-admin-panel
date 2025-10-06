import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch,faTrash,
  faArrowLeft,
  faTrashCan,
  faArrowRotateLeft,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function EventDetail() {
  const navigate = useNavigate();
  const { eventId } = useParams(); // Dynamic event ID

  const [event, setEvent] = useState(null);
  const [hostImage, setHostImage] = useState(
    "https://randomuser.me/api/portraits/women/44.jpg"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!eventId) {
      setError("Event ID is missing in the URL.");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `https://la-dolce-vita.onrender.com/api/event/event-details/${eventId}`
        );
        if (response.data.success && response.data.data) {
          setEvent(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch event.");
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleHostChange = (e) => {
    const { name, value } = e.target;
    setEvent((prev) => ({
      ...prev,
      hostInformation: { ...prev.hostInformation, [name]: value },
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setHostImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading event details...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  if (!event) return null;



  const handleDelete = async () => {
  const confirmDelete = window.confirm("Are you sure you want to delete this event?");
  if (!confirmDelete) return;

  try {
    setIsDeleting(true);
    const response = await axios.delete(
      `https://la-dolce-vita.onrender.com/api/event/delete-event/${eventId}`
    );

    if (response.data.success) {
      alert("Event deleted successfully!");
      navigate("/tiktok"); // Redirect after delete
    } else {
      alert(`Failed to delete event: ${response.data.message || "Unknown error"}`);
    }
  } catch (error) {
    alert(`Error: ${error.response?.data?.message || error.message}`);
  } finally {
    setIsDeleting(false);
  }
};


  return (
    <div>
      <Navbar heading="TikTok Live Event Management" />

      {/* Top buttons */}
      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Live Event Details</h1>
        <div>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`px-3 py-1 border rounded-md ${
              isDeleting ? "bg-gray-300 text-gray-500" : "text-[#B21E1E] bg-red-50 hover:bg-red-100"
            }`}
          >
            <FontAwesomeIcon icon={faTrashCan} className="px-2" />
            {isDeleting ? "Deleting..." : "Delete live event"}
          </button>

          <button
              onClick={() => navigate(`/update-event/${event._id}`, { state: { event } })}
            className="mx-2 px-3 py-1 border rounded-md text-[#114E9D] bg-blue-50 hover:bg-blue-100"
          >
            <FontAwesomeIcon icon={faArrowRotateLeft} className="px-2" />
            Update
          </button>

          <button
            onClick={() => navigate("/tiktok")}
            className="px-3 py-1 border rounded-md text-white bg-[#02B978] hover:bg-[#04D18C]"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-white px-2" />
            Back to Main View
          </button>
        </div>
      </div>

      {/* Event Details */}
      <div className="max-w-6xl mx-5 p-6 space-y-6">
        <div className="border border-gray-400 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-medium text-gray-700">Event Name</h2>
          <p className="text-lg font-medium mt-1">{event.eventDetails.eventName}</p>

          <h3 className="text-sm font-medium text-gray-700">Event Description</h3>
          <textarea
            className="w-full h-35 mt-2 border border-gray-400 rounded-md p-3 text-sm bg-gray-100 resize-none"
            value={event.eventDetails.eventDescription}
            readOnly
          />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 text-sm pt-2">
            <div>
              <p className="font-medium text-gray-700">Status</p>
              <span className="inline-block mt-3 px-4 py-1 rounded-full border border-orange-400 text-orange-600 bg-orange-50 text-xs font-medium">
                {event.eventDetails.status}
              </span>
            </div>

            <div>
              <p className="font-medium text-gray-700">Session ID</p>
              <p className="mt-3 text-gray-800">{event.eventDetails.sessionID}</p>
            </div>

            <div>
              <p className="font-medium text-gray-700">Start Date & Time</p>
              <p className="mt-3 text-gray-800">{new Date(event.eventDetails.startDateTime).toLocaleString()}</p>
            </div>

            <div>
              <p className="font-medium text-gray-700">End Date & Time</p>
              <p className="mt-3 text-gray-800">{new Date(event.eventDetails.endDateTime).toLocaleString()}</p>
            </div>

            <div className="col-span-2">
              <p className="font-medium text-gray-700">TikTok Live Event Link</p>
              <a
                href={event.eventDetails.eventLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mt-3 block"
              >
                {event.eventDetails.eventLink}
              </a>
            </div>
          </div>
        </div>

         {/* Selected Products */}
        <div className="border border-gray-400 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-medium">Selected products for live</h2>
          <div className="flex items-center border border-gray-400 rounded-md px-3 py-2 text-sm bg-white">
            <FontAwesomeIcon icon={faSearch} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search by products name or SKU to add products"
              className="w-full focus:outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-3">
            {[1, 2, 3].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between border border-gray-400 rounded-md px-4 py-3 bg-white"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src="https://uspoloassn.in/cdn/shop/files/1_b38f1b29-bdee-4078-8f72-1507aad69aa7.jpg"
                    alt="Product"
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Classic white Sneakers</p>
                    <p className="text-xs text-gray-500">1231</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-sm font-semibold">€ 12.99</p>
                  <button className="text-gray-500 hover:text-red-600">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Host Information */}
        <section className="border border-gray-400 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">Host Information</h2>
          <div className="flex items-center space-x-4">
            <div className="relative w-15 h-15">
              <img
                src={hostImage}
                alt="Host avatar"
                className="w-14 h-14 rounded-full object-cover"
              />
              <label
                htmlFor="hostImageUpload"
                className="absolute bottom-9 right-0 bg-gray-50 px-1 text-black rounded-full cursor-pointer hover:bg-gray-200"
              >
                <FontAwesomeIcon icon={faPen} size="sm" />
              </label>
              <input
                id="hostImageUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            <div>
              <p className="font-semibold">{event.hostInformation.hostName}</p>
              <p className="text-sm text-gray-500">{event.hostInformation.hostEmailAddress}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="hostName">Host Name*</label>
              <input
                type="text"
                id="hostName"
                name="hostName"
                value={event.hostInformation.hostName}
                onChange={handleHostChange}
                className="w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="emailAddress">Email Address*</label>
              <input
                type="email"
                id="emailAddress"
                name="hostEmailAddress"
                value={event.hostInformation.hostEmailAddress}
                onChange={handleHostChange}
                className="w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="phoneNumber">Phone Number</label>
              <input
                type="number"
                id="phoneNumber"
                name="hostPhoneNumber"
                value={event.hostInformation.hostPhoneNumber}
                onChange={handleHostChange}
                className="w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
