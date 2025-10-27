import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faXmark } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../Components/Navbar";
import axios from "axios";
import { useAlert } from "../../Components/AlertContext";
import { Button, CircularProgress } from "@mui/material";

function UpdateEvent() {
  const { eventId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [eventDetails, setEventDetails] = useState({
    eventName: "",
    eventDescription: "",
    sessionID: "",
    status: "Inactive",
    startDateTime: "",
    endDateTime: "",
    eventLink: "",
    eventCategory: "",
  });

  const [hostInfo, setHostInfo] = useState({
    hostName: "",
    hostEmailAddress: "",
    hostPhoneNumber: "",
  });

  const [loading, setLoading] = useState(false);

  // Pre-fill form if state contains event data
  useEffect(() => {
    if (state?.event) {
      const data = state.event;

      setEventDetails({
        eventName: data.eventDetails?.eventName || "",
        eventDescription: data.eventDetails?.eventDescription || "",
        sessionID: data.eventDetails?.sessionID || "",
        status: data.eventDetails?.status || "Inactive",
        startDateTime: data.eventDetails?.startDateTime
          ? data.eventDetails.startDateTime.slice(0, 16)
          : "",
        endDateTime: data.eventDetails?.endDateTime
          ? data.eventDetails.endDateTime.slice(0, 16)
          : "",
        eventLink: data.eventDetails?.eventLink || "",
        eventCategory: data.eventCategory?.eventCategory || "",
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
      console.log(payload);
      const response = await axios.put(
        `http://dev-api.payonlive.com/api/event/update-event/${eventId}`,
        payload
      );

      if (response.data.success) {
        showAlert("Event updated successfully!", "success", () => {
          navigate("/user/tiktok");
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
        <h1 className="font-medium text-lg ">Update Event Details</h1>
        <button
          onClick={() => navigate("/user/tiktok")}
          className="mr-20 px-3 py-1 border border-red-700 text-red-700 bg-red-50 rounded-md hover:bg-gray-100"
        >
          <FontAwesomeIcon
            icon={faXmark}
            size="lg"
            className="text-red-700 px-2"
          />
          Discard
        </button>
      </div>

      <div className="max-w-6xl mb-10 mx-5 p-4 space-y-8">
        <form onSubmit={handleUpdate}>
          {/* Event Details */}
          <section className="border border-gray-400 rounded-2xl p-6 space-y-6">
            <h2 className="text-xl font-semibold">Event Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Event Name*
                </label>
                <input
                  type="text"
                  name="eventName"
                  value={eventDetails.eventName}
                  onChange={handleEventChange}
                  className="w-full border border-gray-400 rounded-md px-3 py-2"
                  required
                />
              </div>

              {/* Event Description */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Event Description*
                </label>
                <input
                  type="text"
                  name="eventDescription"
                  value={eventDetails.eventDescription}
                  onChange={handleEventChange}
                  className="w-full border border-gray-400 rounded-md px-3 py-2"
                  required
                />
              </div>

              {/* Session ID */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Session ID*
                </label>
                <input
                  type="text"
                  name="sessionID"
                  value={eventDetails.sessionID}
                  onChange={handleEventChange}
                  className="w-full border border-gray-400 rounded-md px-3 py-2"
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Status*
                </label>
                <select
                  name="status"
                  value={eventDetails.status}
                  onChange={handleEventChange}
                  className="w-full border border-gray-400 rounded-md px-3 py-2"
                  required
                >
                  <option value="inactive">Inactive</option>
                  <option value="active">Active</option>
                  <option value="about to come">About to come</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              {/* Start Date & Time */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Date & Time*
                </label>
                <input
                  type="datetime-local"
                  name="startDateTime"
                  value={eventDetails.startDateTime}
                  onChange={handleEventChange}
                  className="w-full border border-gray-400 rounded-md px-3 py-2"
                  required
                />
              </div>

              {/* End Date & Time */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Date & Time*
                </label>
                <input
                  type="datetime-local"
                  name="endDateTime"
                  value={eventDetails.endDateTime}
                  onChange={handleEventChange}
                  className="w-full border border-gray-400 rounded-md px-3 py-2"
                  required
                />
              </div>

              {/* Event Link */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  TikTok Live Event Link*
                </label>
                <div className="flex items-center border border-gray-400 rounded-md px-3 py-2">
                  <input
                    type="text"
                    name="eventLink"
                    value={eventDetails.eventLink}
                    onChange={handleEventChange}
                    className="flex-grow focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="ml-2 text-gray-600 hover:text-gray-900"
                  >
                    <FontAwesomeIcon icon={faClipboard} />
                  </button>
                </div>
              </div>

              {/* Event Category */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Event Category*
                </label>
                <select
                  name="eventCategory"
                  value={eventDetails.eventCategory}
                  onChange={handleEventChange}
                  className="w-full border border-gray-400 rounded-md px-3 py-2"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* <div>
                <label className="block text-sm font-medium mb-1">Event Category*</label>
                <input
                  type="text"
                  name="eventCategory"
                  value={eventDetails.eventCategory}
                  onChange={handleEventChange}
                  className="w-full border border-gray-400 rounded-md px-3 py-2"
                  required
                />
              </div> */}
            </div>
          </section>

          {/* Host Information */}
          <section className="border border-gray-400 rounded-2xl p-6 mt-10 space-y-4">
            <h2 className="text-xl font-semibold">Host Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Host Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Host Name*
                </label>
                <input
                  type="text"
                  name="hostName"
                  value={hostInfo.hostName}
                  onChange={handleHostChange}
                  className="w-full border border-gray-400 rounded-md px-3 py-2"
                  required
                />
              </div>

              {/* Host Email */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email Address*
                </label>
                <input
                  type="email"
                  name="hostEmailAddress"
                  value={hostInfo.hostEmailAddress}
                  onChange={handleHostChange}
                  className="w-full border border-gray-400 rounded-md px-3 py-2"
                  required
                />
              </div>

              {/* Host Phone Number */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="hostPhoneNumber"
                  value={hostInfo.hostPhoneNumber}
                  onChange={handleHostChange}
                  className="w-full border border-gray-400 rounded-md px-3 py-2"
                />
              </div>
            </div>
          </section>

          {/* Save Button */}
          {/* <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#114E9D] text-white px-6 py-2 rounded-lg hover:bg-blue-500"
            >
              {loading ? "Updating..." : "Update Event"}
            </button>
          </div> */}

            {/* Save Button using Material-UI */}
          {/* <div className="flex justify-end mt-4">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? "Updating..." : "Update Event"}
            </Button>
          </div> */}

            <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#114E9D] text-white px-6 py-2 rounded-lg hover:bg-blue-500 flex items-center gap-2"
            >
              {loading && (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              {loading ? "Updating..." : "Update Event"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default UpdateEvent;
