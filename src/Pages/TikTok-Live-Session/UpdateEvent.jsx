import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faXmark } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../Components/Navbar";
import axios from "axios";
import { useAlert } from "../../Components/AlertContext"; // Make sure path is correct

function UpdateEvent() {
  const { eventId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // Pre-fill with state if available, otherwise empty
  const [eventDetails, setEventDetails] = useState({
    eventName: "",
    eventDescription: "",
    sessionID: "",
    status: "Inactive",
    startDateTime: "",
    endDateTime: "",
    eventLink: "",
  });

  const [hostInfo, setHostInfo] = useState({
    hostName: "",
    hostEmailAddress: "",
    hostPhoneNumber: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (state?.event) {
      const data = state.event;

      setEventDetails({
        eventName: data.eventDetails?.eventName || "",
        eventDescription: data.eventDetails?.eventDescription || "",
        sessionID: data.eventDetails?.sessionID || "",
        status: data.eventDetails?.status || "inactive",
        startDateTime: data.eventDetails?.startDateTime
          ? data.eventDetails.startDateTime.slice(0, 16)
          : "",
        endDateTime: data.eventDetails?.endDateTime
          ? data.eventDetails.endDateTime.slice(0, 16)
          : "",
        eventLink: data.eventDetails?.eventLink || "",
      });

      setHostInfo({
        hostName: data.hostInformation?.hostName || "",
        hostEmailAddress: data.hostInformation?.hostEmailAddress || "",
        hostPhoneNumber: data.hostInformation?.hostPhoneNumber || "",
      });
    }
  }, [state]);

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleHostChange = (e) => {
    const { name, value } = e.target;
    setHostInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventDetails.eventLink);
    showAlert("TikTok live event link copied to clipboard!", "success");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { eventDetails, hostInformation: hostInfo };

      const response = await axios.put(
        `http://dev-api.payonlive.com/api/event/update-event/${eventId}`,
        payload
      );

      if (response.data.success) {
        showAlert("Event updated successfully!", "success", () => {
          navigate("/user/tiktok"); // navigate after clicking OK
        });
      } else {
        showAlert("Failed to update event.", "error");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      showAlert("Failed to update event. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar heading="TikTok Live Event Management" />

      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Update Event Details</h1>
        <button
          onClick={() => navigate("/user/tiktok")}
          className="mr-20 px-3 py-1 border border-red-700 text-red-700 bg-red-50 rounded-md hover:bg-gray-100"
        >
          <FontAwesomeIcon icon={faXmark} size="lg" className="text-red-700 px-2" />
          Discard
        </button>
      </div>

      <div className="max-w-6xl mb-10 mx-5 p-4 space-y-8">
        <form onSubmit={handleUpdate}>
          {/* Event Details */}
          <section className="border border-gray-400 rounded-2xl p-6 space-y-6">
            <h2 className="text-xl font-semibold">Event Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["eventName", "eventDescription", "sessionID", "status", "startDateTime", "endDateTime", "eventLink"].map(
                (field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium mb-1">
                      {field === "eventName" && "Event Name"}
                      {field === "eventDescription" && "Event Description"}
                      {field === "sessionID" && "Session ID"}
                      {field === "status" && "Status"}
                      {field === "startDateTime" && "Start Date & Time"}
                      {field === "endDateTime" && "End Date & Time"}
                      {field === "eventLink" && "TikTok Live Event Link"}
                    </label>
                    {field === "status" ? (
                      <select
                        required
                        name="status"
                        value={eventDetails.status}
                        onChange={handleEventChange}
                        className="w-full border border-gray-400 rounded-md px-3 py-2"
                      >
                        <option value="inactive">Inactive</option>
                        <option value="active">Active</option>
                        <option value="about to come">About to come</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    ) : field === "eventLink" ? (
                      <div className="flex items-center border border-gray-400 rounded-md px-3 py-2">
                        <input
                          required
                          type="text"
                          name="eventLink"
                          value={eventDetails.eventLink}
                          onChange={handleEventChange}
                          className="flex-grow focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleCopyLink}
                          className="ml-2 text-gray-600 hover:text-gray-900"
                        >
                          <FontAwesomeIcon icon={faClipboard} />
                        </button>
                      </div>
                    ) : (
                      <input
                        required
                        type={field.includes("DateTime") ? "datetime-local" : "text"}
                        name={field}
                        value={eventDetails[field]}
                        onChange={handleEventChange}
                        className="w-full border border-gray-400 rounded-md px-3 py-2"
                      />
                    )}
                  </div>
                )
              )}
            </div>
          </section>

          {/* Host Information */}
          <section className="border border-gray-400 rounded-2xl p-6 mt-10 space-y-4">
            <h2 className="text-xl font-semibold">Host Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["hostName", "hostEmailAddress", "hostPhoneNumber"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1">
                    {field === "hostName" && "Host Name*"}
                    {field === "hostEmailAddress" && "Email Address*"}
                    {field === "hostPhoneNumber" && "Phone Number"}
                  </label>
                  <input
                    required={field !== "hostPhoneNumber"}
                    type={field === "hostEmailAddress" ? "email" : "text"}
                    name={field}
                    value={hostInfo[field]}
                    onChange={handleHostChange}
                    className="w-full border border-gray-400 rounded-md px-3 py-2"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Save Button */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#114E9D] text-white px-6 py-2 rounded-lg hover:bg-blue-500"
            >
              {loading ? "Updating..." : "Update Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateEvent;




