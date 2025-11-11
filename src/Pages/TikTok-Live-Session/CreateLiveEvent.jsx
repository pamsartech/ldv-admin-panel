import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faClipboard,
  faTrash,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../Components/Navbar";
import axios from "axios";
import { useAlert } from "../../Components/AlertContext";

function CreateLiveEvent() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [btnLoading , setBtnLoading] = useState(false);

  const [eventDetails, setEventDetails] = useState({
    eventName: "",
    eventDescription: "",
    sessionID: "",
    status: "inactive",
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

  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ----------------------
  // Event & Host Handlers
  // ----------------------
  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleHostChange = (e) => {
    const { name, value } = e.target;
    setHostInfo((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ----------------------
  // Copy Event Link
  // ----------------------
  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventDetails.eventLink);
    setPopupMessage("TikTok live event link copied to clipboard!");
    setShowPopup(true);
  };

  // ----------------------
  // Remove Product
  // ----------------------
  const removeProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  // ----------------------
  // Product Search
  // ----------------------
  const handleSearch = async () => {
    const trimmedId = productId.trim();
    if (!trimmedId) return;

    try {
      const response = await axios.get(
        `https://dev-api.payonlive.com/api/product/product-code/${trimmedId}`
      );
      if (response.data.success) {
        const productData = response.data.data;
        if (!products.some((p) => p._id === productData._id)) {
          setProducts((prev) => [...prev, productData]);
        } else {
          showAlert("Product already added.", "info");
        }
      } else {
        showAlert(response.data.message || "Product not found.", "error");
        console.log(response)
      }
    } catch (error) {
      console.error("❌ Error fetching product:", error);
      showAlert("Error fetching product. Please try again.", "error");
    }

    setProductId("");
  };

//   const [existingSessions, setExistingSessions] = useState([]);

// useEffect(() => {
//   const fetchExistingSessions = async () => {
//     try {
//       const res = await axios.get("https://dev-api.payonlive.com/api/event/all");
//       if (res.data?.success && Array.isArray(res.data.data)) {
//         const sessions = res.data.data.map((event) => event.eventDetails.sessionID);
//         setExistingSessions(sessions);
//       }
//     } catch (error) {
//       console.error("❌ Error fetching sessions:", error);
//     }
//   };
//   fetchExistingSessions();
// }, []);


  // ----------------------
  // Validation
  // ----------------------
  const validate = () => {
    const newErrors = {};
    const {
      eventName,
      sessionID,
      eventDescription,
      startDateTime,
      endDateTime,
      eventLink,
      eventCategory,
      status,
    } = eventDetails;

    const { hostName, hostEmailAddress, hostPhoneNumber } = hostInfo;

    // Event Name
    if (!eventName.trim()) newErrors.eventName = "Event name is required.";
    else if (eventName.length < 3)
      newErrors.eventName = "Event name must be at least 3 characters long.";
    else if (eventName.length > 50)
      newErrors.eventName = "Event name cannot exceed 50 characters.";

    // Event Description
    if (!eventDescription.trim())
      newErrors.eventDescription = "Event description is required.";
    else if (eventDescription.length < 10)
      newErrors.eventDescription =
        "Description should be at least 10 characters.";
    else if (eventDescription.length > 500)
      newErrors.eventDescription = "Description cannot exceed 500 characters.";

    // Session ID
    if (!sessionID.trim()) newErrors.sessionID = "Session ID is required.";
    // else if (sessionID.includes(sessionID.trim()))
    //   newErrors.sessionID = "Session ID already exists.";

    // Status
    const validStatuses = ["active", "inactive", "about to come", "suspended"];
    if (!status.trim()) newErrors.status = "Status is required.";
    else if (!validStatuses.includes(status))
      newErrors.status = "Invalid status selected.";

     // Start & End Date
    if (!startDateTime.trim())
      newErrors.startDateTime = "Start date & time is required.";
    if (!endDateTime.trim())
      newErrors.endDateTime = "End date & time is required.";
    else if (
      startDateTime &&
      endDateTime &&
      new Date(endDateTime) <= new Date(startDateTime)
    )
      newErrors.endDateTime =
        "End date and time must be after start date and time.";

    if (!eventLink.trim()) newErrors.eventLink = "Event link is required.";

    if (!eventCategory.trim())
      newErrors.eventCategory = "Event category is required.";

     // Host Name
    if (!hostName.trim()) newErrors.hostName = "Host name is required.";
    else if (hostName.length < 3)
      newErrors.hostName = "Host name must be at least 3 characters long.";
    else if (hostName.length > 100)
      newErrors.hostName = "Host name cannot exceed 100 characters.";


    if (!hostEmailAddress.trim())
      newErrors.hostEmailAddress = "Host email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(hostEmailAddress))
      newErrors.hostEmailAddress = "Please enter a valid email.";

    if (!hostPhoneNumber.trim())
      newErrors.hostPhoneNumber = "Phone number is required.";
    else if (!/^\d{9,15}$/.test(hostPhoneNumber))
      newErrors.hostPhoneNumber = "Phone number must be 9–15 digits.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ----------------------
  // Submit Event
  // ----------------------
//  const handleSave = async (e) => {
//   e.preventDefault();
//   if (!validate()) return;

//   setBtnLoading(true);
//   setLoading(true);

//   const payload = {
//     eventDetails: {
//       ...eventDetails,
//       status: eventDetails.status.toLowerCase(),
//       startDateTime: new Date(eventDetails.startDateTime).toISOString(),
//       endDateTime: new Date(eventDetails.endDateTime).toISOString(),
//     },
//     products: products.map((p) => ({ productId: p._id })),
//     hostInformation: {
//       ...hostInfo,
//       hostPhoneNumber: String(hostInfo.hostPhoneNumber),
//     },
//   };

//   try {
//     const response = await axios.post(
//       "https://dev-api.payonlive.com/api/event/create-live-event",
//       payload,
//       {
//         headers: { "Content-Type": "application/json" },
//       }
//     );

//     if (response.data?.success || response.status === 200) {
//       showAlert("Event created successfully!", "success", () => {
//         navigate("/user/tiktok");
//       });
//     } else {
//       showAlert(response.data.message || "Failed to create event.", "error");
//     }
//   } catch (error) {
//     console.error("❌ Error creating event:", error);
//     showAlert("Server error - Please try again.", "error");
//   } finally {
//     // ✅ Always stop spinner regardless of success or failure
//     setBtnLoading(false);
//     setLoading(false);
//   }
// };

// const handleSave = async (e) => {
//   e.preventDefault();

//   // Run existing validation
//   if (!validate()) return;

//   // Check product selection
//   if (products.length === 0) {
//     showAlert("Please select at least one product.", "error");
//     return;
//   }

//   // ✅ Check local sessionID uniqueness
//   const isDuplicate = existingSessions.includes(eventDetails.sessionID.trim());
//   if (isDuplicate) {
//     setErrors((prev) => ({
//       ...prev,
//       sessionID: "Please enter a unique session ID.",
//     }));
//     showAlert("Please enter a unique session ID.", "error");
//     return;
//   }

//   // If everything passes
//   setBtnLoading(true);
//   setLoading(true);

//   const payload = {
//     eventDetails: {
//       ...eventDetails,
//       status: eventDetails.status.toLowerCase(),
//       startDateTime: new Date(eventDetails.startDateTime).toISOString(),
//       endDateTime: new Date(eventDetails.endDateTime).toISOString(),
//     },
//     products: products.map((p) => ({ productId: p._id })),
//     hostInformation: {
//       ...hostInfo,
//       hostPhoneNumber: String(hostInfo.hostPhoneNumber),
//     },
//   };

//   try {
//     const response = await axios.post(
//       "https://dev-api.payonlive.com/api/event/create-live-event",
//       payload,
//       { headers: { "Content-Type": "application/json" } }
//     );

//     if (response.data?.success || response.status === 200) {
//       showAlert("Event created successfully!", "success", () => {
//         navigate("/user/tiktok");
//       });
//     } else {
//       showAlert(response.data.message || "Failed to create event.", "error");
//     }
//   } catch (error) {
//     console.error("❌ Error creating event:", error);
//     showAlert("Server error - Please try again.", "error");
//   } finally {
//     setBtnLoading(false);
//     setLoading(false);
//   }
// };

// ----------------------
// Submit Event
// ----------------------
// const handleSave = async (e) => {
//   e.preventDefault();

//   // 1️⃣ Run existing validation first
//   if (!validate()) return;

//   // 2️⃣ Check if at least one product is selected
//   if (products.length === 0) {
//     showAlert("Please select at least one product.", "info");
//     return;
//   }

//   // 3️⃣ Check if sessionID is unique
//   try {
//     const sessionCheck = await axios.get(
//       `https://dev-api.payonlive.com/api/event/check-event-session/${eventDetails.sessionID}`
//     );

//     // If API returns that the session already exists
//     if (sessionCheck.data?.exists) {
//       setErrors((prev) => ({
//         ...prev,
//         sessionID: " Please enter a unique session ID.",
//       }));
//       showAlert("Session ID already exits please enter a unique session ID.", "info");
//       return;
//     }
//   } catch (error) {
//     console.error("❌ Error checking session ID:", error);
//     showAlert("Unable to verify session ID. Please try again.", "error");
//     return;
//   }

//   // 4️⃣ Proceed only if all validations pass
//   setBtnLoading(true);
//   setLoading(true);

//   const payload = {
//     eventDetails: {
//       ...eventDetails,
//       status: eventDetails.status.toLowerCase(),
//       startDateTime: new Date(eventDetails.startDateTime).toISOString(),
//       endDateTime: new Date(eventDetails.endDateTime).toISOString(),
//     },
//     products: products.map((p) => ({ productId: p._id })),
//     hostInformation: {
//       ...hostInfo,
//       hostPhoneNumber: String(hostInfo.hostPhoneNumber),
//     },
//   };

//   try {
//     const response = await axios.post(
//       "https://dev-api.payonlive.com/api/event/create-live-event",
//       payload,
//       {
//         headers: { "Content-Type": "application/json" },
//       }
//     );

//     if (response.data?.success || response.status === 200) {
//       showAlert("Event created successfully!", "success", () => {
//         navigate("/user/tiktok");
//       });
//     } else {
//       showAlert(response.data.message || "Failed to create event.", "error");
//     }
//   } catch (error) {
//     console.error("❌ Error creating event:", error);
//     showAlert("Server error - Please try again.", "error");
//   } finally {
//     setBtnLoading(false);
//     setLoading(false);
//   }
// };

// const handleSave = async (e) => {
//   e.preventDefault();

//   // 1️⃣ Run validation first
//   if (!validate()) return;

//   // 2️⃣ Ensure product selection
//   if (products.length === 0) {
//     showAlert("Please select at least one product.", "info");
//     return;
//   }

//   // 3️⃣ Check session ID uniqueness
//   try {
//     const sessionCheck = await axios.get(
//       `https://dev-api.payonlive.com/api/event/check-event-session/${eventDetails.sessionID}`
//     );

//     console.log("🔍 Session check response:", sessionCheck.data);

//     if (sessionCheck.data?.exists === true) {
//       setErrors((prev) => ({
//         ...prev,
//         sessionID: "Please enter a unique session ID.",
//       }));
//       showAlert(
//         "Session ID already exists. Please enter a unique session ID.",
//         "info"
//       );
//       return;
//     }
//   } catch (error) {
//     console.error("❌ Error checking session ID:", error);
//     showAlert("Unable to verify session ID. Please try again.", "error");
//     return;
//   }

//   // 4️⃣ Proceed if unique
//   setBtnLoading(true);
//   setLoading(true);

//   const payload = {
//     eventDetails: {
//       ...eventDetails,
//       status: eventDetails.status.toLowerCase(),
//       startDateTime: new Date(eventDetails.startDateTime).toISOString(),
//       endDateTime: new Date(eventDetails.endDateTime).toISOString(),
//     },
//     products: products.map((p) => ({ productId: p._id })),
//     hostInformation: {
//       ...hostInfo,
//       hostPhoneNumber: String(hostInfo.hostPhoneNumber),
//     },
//   };

//   try {
//     const response = await axios.post(
//       "https://dev-api.payonlive.com/api/event/create-live-event",
//       payload,
//       { headers: { "Content-Type": "application/json" } }
//     );

//     if (response.data?.success || response.status === 200) {
//       showAlert("Event created successfully!", "success", () => {
//         navigate("/user/tiktok");
//       });
//     } else {
//       showAlert(response.data.message || "Failed to create event.", "error");
//     }
//   } catch (error) {
//     console.error("❌ Error creating event:", error);
//     showAlert("Server error - Please try again.", "error");
//   } finally {
//     setBtnLoading(false);
//     setLoading(false);
//   }
// };

const handleSave = async (e) => {
  e.preventDefault();

  // 1️⃣ Run validation first
  if (!validate()) return;

  // 2️⃣ Ensure product selection
  if (products.length === 0) {
    showAlert("Please select at least one product.", "info");
    return;
  }

  // 3️⃣ Check session ID uniqueness
  // try {
  //   const sessionCheck = await axios.get(
  //     `https://dev-api.payonlive.com/api/event/check-event-session/${eventDetails.sessionID}`
  //   );

  //   console.log("🔍 API response:", sessionCheck.data);

  //   // 🚀 Correct logic
  //   if (sessionCheck.data?.exists === true) {
  //     setErrors((prev) => ({
  //       ...prev,
  //       sessionID: "Session ID already exists.",
  //     }));
  //     showAlert(
  //       "Session ID already exists. Please enter a unique session ID.",
  //       "info"
  //     );
  //     return;
  //   }

  //   // If false → continue
  // } catch (error) {
  //   console.error("❌ Error checking session ID:", error);
  //   showAlert("Unable to verify session ID. Please try again.", "error");
  //   return;
  // }

  // 4️⃣ Proceed if unique (exists === false)
  setBtnLoading(true);
  setLoading(true);

  const payload = {
    eventDetails: {
      ...eventDetails,
      status: eventDetails.status.toLowerCase(),
      startDateTime: new Date(eventDetails.startDateTime).toISOString(),
      endDateTime: new Date(eventDetails.endDateTime).toISOString(),
    },
    products: products.map((p) => ({ productId: p._id })),
    hostInformation: {
      ...hostInfo,
      hostPhoneNumber: String(hostInfo.hostPhoneNumber),
    },
  };

  try {
    const response = await axios.post(
      "https://dev-api.payonlive.com/api/event/create-live-event",
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data?.success || response.status === 200) {
      showAlert("Event created successfully!", "success", () => {
        navigate("/user/tiktok");
      });
    } else {
      showAlert(response.data.message || "Failed to create event.", "error");
    }
  } catch (error) {
    console.error("❌ Error creating event:", error);
    showAlert("" + error.response.data.error, "info" );
  } finally {
    setBtnLoading(false);
    setLoading(false);
  }
};



  // ----------------------
  // Render Component
  // ----------------------
  return (
    <div>
      <Navbar heading="Gestion des événements TikTok Live " />

      {/* Header */}
      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Créer nouvel événement en direct</h1>
        <button
          onClick={() => navigate("/user/tiktok")}
          className="mr-20 px-3 py-1 border border-red-700 text-red-700 bg-red-50 rounded-md hover:bg-gray-100"
        >
          <FontAwesomeIcon
            icon={faXmark}
            size="lg"
            className="text-red-700 px-2"
          />
          Discard Event
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSave}
        className="max-w-6xl mb-10 mx-5 p-4 space-y-8"
      >
        {/* Event Details */}
        <section className="border border-gray-400 rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-semibold">Détails de l'événement</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Name */}
            <div className="flex flex-col">
              <label className="mb-1 text-gray-700 font-medium">
                Nom de l’événement*
              </label>
              <input
                type="text"
                name="eventName"
                value={eventDetails.eventName}
                onChange={handleEventChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {errors.eventName && (
                <p className="text-red-500 text-sm ">{errors.eventName}</p>
              )}
            </div>

            {/* Event Description */}
            <div className="flex flex-col">
              <label className="mb-1 text-gray-700 font-medium">
                Description de l'événement*
              </label>
              <input
                type="text"
                name="eventDescription"
                value={eventDetails.eventDescription}
                onChange={handleEventChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {errors.eventDescription && (
                <p className="text-red-500 text-sm ">
                  {errors.eventDescription}
                </p>
              )}
            </div>

            {/* Session ID */}
            <div className="flex flex-col">
              <label className="mb-1 text-gray-700 font-medium">
                ID de session*
              </label>
              <input
                type="text"
                name="sessionID"
                value={eventDetails.sessionID}
                onChange={handleEventChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
               {errors.sessionID && (
              <p className="text-red-500 text-sm">{errors.sessionID}</p>
            )}
            </div>

            {/* Status */}
            <div className="flex flex-col">
              <label className="mb-1 text-gray-700 font-medium">Statut*</label>
              <select
                name="status"
                value={eventDetails.status}
                onChange={handleEventChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value="inactive">Inactive</option>
                <option value="active">Active</option>
                <option value="about to come">About to come</option>
                <option value="suspended">Suspended</option>
              </select>
               {errors.status && (
                <p className="text-red-500 text-sm ">
                  {errors.status}
                </p>
              )}
            </div>

            {/* Start & End Date */}
            <div className="flex flex-col">
              <label className="mb-1 text-gray-700 font-medium">
                Début Date et Temps*
              </label>
              <input
                type="datetime-local"
                name="startDateTime"
                value={eventDetails.startDateTime}
                onChange={handleEventChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {errors.startDateTime && (
                <p className="text-red-500 text-sm ">
                  {errors.startDateTime}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-gray-700 font-medium">
                Fin Date et Temps*
              </label>
              <input
                type="datetime-local"
                name="endDateTime"
                value={eventDetails.endDateTime}
                onChange={handleEventChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {errors.endDateTime && (
                <p className="text-red-500 text-sm ">
                  {errors.endDateTime}
                </p>
              )}
            </div>

            {/* Event Link */}
            <div className="flex flex-col">
              <label className="mb-1 text-gray-700 font-medium">
                TikTok Live Link*
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-400 transition">
                <input
                  type="text"
                  name="eventLink"
                  value={eventDetails.eventLink}
                  onChange={handleEventChange}
                  className="flex-grow focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="ml-2 text-gray-600 hover:text-blue-500 transition"
                >
                  <FontAwesomeIcon icon={faClipboard} />
                </button>
              </div>
              {errors.eventLink && (
                <p className="text-red-500 text-sm ">{errors.eventLink}</p>
              )}
            </div>

            {/* Event Category */}
            <div className="flex flex-col">
              <label className="mb-1 text-gray-700 font-medium">
                Catégorie d'événement*
              </label>
              <select
                name="eventCategory"
                value={eventDetails.eventCategory}
                onChange={handleEventChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value="">Sélectionnez une catégorie</option>
                <option value="Fashion">Fashion</option>
                <option value="Beauty">Beauty</option>
                <option value="Other">Other</option>
              </select>
               {errors.eventCategory && (
              <p className="text-red-500 text-sm">{errors.eventCategory}</p>
            )}
            </div>
          </div>
        </section>

        {/* Selected Products */}
        <section className="border border-gray-400 rounded-2xl p-6 bg-white shadow-sm space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Selected products for live
          </h2>

          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Search by Product Code"
              className="flex-grow border border-gray-400 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="bg-[#02B978] text-white rounded-xl px-4 py-2 text-base font-medium hover:bg-[#04D18C] transition"
            >
              Select Product
            </button>
          </div>

          {/* Products List */}
          <div className="space-y-4">
            {products.map((item) => {
              const productImage =
                item.images && item.images.length
                  ? item.images[0]
                  : "https://via.placeholder.com/150";
              return (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row items-center justify-between bg-white border border-gray-200 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-center w-full sm:w-auto space-x-4">
                    <input
                      type="checkbox"
                      checked={true}
                      readOnly
                      className="w-4 h-4 accent-blue-600"
                    />
                    <img
                      src={productImage}
                      alt={item.productName}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                    />
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        SKU: {item.productCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-6 mt-4 sm:mt-0 w-full sm:w-auto">
                    <p className="text-lg font-semibold text-gray-900">
                      € {item.price}
                    </p>
                    <button
                      onClick={() => removeProduct(item._id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Host Information */}
        <section className="border border-gray-400 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">Informations sur l'hôte</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Nom d'hôte*</label>
              <input
                type="text"
                name="hostName"
                value={hostInfo.hostName}
                onChange={handleHostChange}
                className="w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.hostName && (
                <p className="text-red-500 text-sm">{errors.hostName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Adresse email*</label>
              <input
                type="email"
                name="hostEmailAddress"
                value={hostInfo.hostEmailAddress}
                onChange={handleHostChange}
                className="w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.hostEmailAddress && (
                <p className="text-red-500 text-sm">{errors.hostEmailAddress}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Numéro de téléphone*</label>
              <input
                type="number"
                name="hostPhoneNumber"
                value={hostInfo.hostPhoneNumber}
                onChange={handleHostChange}
                className="w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.hostPhoneNumber && (
                <p className="text-red-500 text-sm">{errors.hostPhoneNumber}</p>
              )}
            </div>
          </div>
        </section>

        <hr className="text-gray-400" />

         <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={btnLoading}
              className="bg-[#02B978] text-white px-6 py-2 rounded-lg hover:bg-[#04D18C] flex items-center gap-2"
            >
              {btnLoading && (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              {btnLoading ? "Saving..." : "Save"}
            </button>
          </div>
      </form>
    </div>
  );
}

export default CreateLiveEvent;

