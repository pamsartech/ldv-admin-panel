// EventDetail.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faTrash,
  faArrowLeft,
  faTrashCan,
  faArrowRotateLeft,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useAlert } from "../../Components/AlertContext";

// 🧩 Material 
import { Skeleton } from "@mui/material";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

export default function EventDetail() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { showAlert } = useAlert(); // ✅ useAlert context

  const [event, setEvent] = useState(null);
  const [hostImage, setHostImage] = useState(
    "https://randomuser.me/api/portraits/women/44.jpg"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
   const [openConfirm, setOpenConfirm] = useState(false); // 🔹 MUI confirm dialog

  const getStatusStyles = (status) => {
    const styles = {
      active: "border-green-400 text-green-600 bg-green-50",
      inactive: "border-red-400 text-red-600 bg-red-50",
      "about to come": "border-blue-400 text-blue-600 bg-blue-50",
      suspended: "border-red-400 text-red-600 bg-red-50",
    };
    return (
      styles[status?.toLowerCase()] ||
      "border-gray-400 text-gray-600 bg-gray-50"
    );
  };

  const capitalizeFirst = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  useEffect(() => {
    if (!eventId) {
      setError("Event ID is missing in the URL.");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `https://dev-api.payonlive.com/api/event/event-details/${eventId}`
        );
        if (response.data.success && response.data.data) {
          setEvent(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch event.");
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
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

  const handleDelete = async () => {

    try {
      setIsDeleting(true);
      const response = await axios.delete(
        `https://dev-api.payonlive.com/api/event/delete-event/${eventId}`
      );

      if (response.data.success) {
        showAlert("Event deleted successfully!", "success");
        navigate("/user/tiktok");
      } else {
        showAlert(response.data.message || "Failed to delete product", "info");
      }
    } catch (error) {
      showAlert(`Error: ${error.response?.data?.message || error.message}`, "error");
    } finally {
      setIsDeleting(false);
      setOpenConfirm(false); // close confirmation dialog
    }
  };

  // ----------------------------
  // 🔹 Skeleton Loader (Full UI)
  // ----------------------------
  if (loading) {
    return (
      <div>
        <Navbar heading="TikTok Live Event Management" />
        <div className="max-w-6xl mx-5 p-6 space-y-6">
          {/* Event Details Skeleton */}
          <div className="border border-gray-400 rounded-2xl p-6 space-y-4">
            <Skeleton variant="text" width={200} height={30} animation="wave" />
            <Skeleton variant="rectangular" height={80} animation="wave" />
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 pt-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <Skeleton
                    variant="text"
                    width={120}
                    height={20}
                    animation="wave"
                  />
                  <Skeleton
                    variant="text"
                    width={80}
                    height={25}
                    animation="wave"
                    className="mt-3"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Selected Products Skeleton */}
          <div className="border border-gray-400 rounded-2xl p-6 space-y-4">
            <Skeleton variant="text" width={220} height={30} animation="wave" />
            <Skeleton variant="rectangular" height={40} animation="wave" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between border border-gray-300 rounded-md px-4 py-3 bg-white"
              >
                <div className="flex items-center space-x-3">
                  <Skeleton
                    variant="circular"
                    width={40}
                    height={40}
                    animation="wave"
                  />
                  <div>
                    <Skeleton
                      variant="text"
                      width={150}
                      height={20}
                      animation="wave"
                    />
                    <Skeleton
                      variant="text"
                      width={100}
                      height={15}
                      animation="wave"
                    />
                  </div>
                </div>
                <Skeleton
                  variant="text"
                  width={60}
                  height={20}
                  animation="wave"
                />
              </div>
            ))}
          </div>

          {/* Host Info Skeleton */}
          <div className="border border-gray-400 rounded-2xl p-6 space-y-4">
            <Skeleton variant="text" width={180} height={30} animation="wave" />
            <div className="flex items-center space-x-4">
              <Skeleton
                variant="circular"
                width={60}
                height={60}
                animation="wave"
              />
              <div>
                <Skeleton
                  variant="text"
                  width={150}
                  height={20}
                  animation="wave"
                />
                <Skeleton
                  variant="text"
                  width={200}
                  height={15}
                  animation="wave"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <Skeleton
                    variant="text"
                    width={120}
                    height={20}
                    animation="wave"
                  />
                  <Skeleton
                    variant="rectangular"
                    height={40}
                    animation="wave"
                    className="mt-2 rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------
  // 🔹 Normal Loaded UI
  // ----------------------------
  if (error)
    return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  if (!event) return null;

  return (
    <div>
      <Navbar heading="Gestion des événements TikTok Live" />

      {/* Top buttons */}
      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Détails de l'événement en direct</h1>
        <div>
          <button
            onClick={() => setOpenConfirm(true)}
            disabled={isDeleting}
            className={`px-3 py-1 border rounded-md ${
              isDeleting
                ? "bg-gray-300 text-gray-500"
                : "text-[#B21E1E] bg-red-50 hover:bg-red-100"
            }`}
          >
            <FontAwesomeIcon icon={faTrashCan} className="px-2" />
            {isDeleting ? "Supprimer..." : "Supprimer événement en direct"}
          </button>

          <button
            onClick={() =>
              navigate(`/user/update-event/${event._id}`, { state: { event } })
            }
            className="mx-2 px-3 py-1 border rounded-md text-[#114E9D] bg-blue-50 hover:bg-blue-100"
          >
            <FontAwesomeIcon icon={faArrowRotateLeft} className="px-2" />
            Mise à jour
          </button>

          <button
            onClick={() => navigate("/user/tiktok")}
            className="px-3 py-1 border rounded-md text-white bg-[#02B978] hover:bg-[#04D18C]"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-white px-2" />
            Dos la vue principale
          </button>
        </div>
      </div>

      {/* 🔹 MUI Confirmation Dialog */}
      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-description"
      >
        <DialogTitle id="confirm-delete-title">
          {"Confirm Event Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-description">
            Are you sure you want to permanently delete this event? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Event Details */}
      <div className="max-w-6xl mx-5 p-6 space-y-6">
        <div className="border border-gray-400 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-medium text-gray-700">Nom de l’événement</h2>
          <p className="text-lg font-medium mt-1">
            {event.eventDetails.eventName}
          </p>

          <h3 className="text-sm font-medium text-gray-700">
            Description de l'événemen
          </h3>
          <textarea
            className="w-full h-35 mt-2 border border-gray-400 rounded-md p-3 text-sm bg-gray-100 resize-none"
            value={event.eventDetails.eventDescription}
            readOnly
          />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 text-sm pt-2">
            <div>
              <p className="font-medium text-gray-700">Statut</p>
              <span
                className={`inline-block mt-3 px-4 py-1 rounded-full border text-xs font-medium ${getStatusStyles(
                  event.eventDetails.status
                )}`}
              >
                {capitalizeFirst(event.eventDetails.status)}
              </span>
            </div>

            <div>
              <p className="font-medium text-gray-700">ID de session</p>
              <p className="mt-3 text-gray-800">
                {event.eventDetails.sessionID}
              </p>
            </div>

            <div>
              <p className="font-medium text-gray-700">Début Date et Temps</p>
              <p className="mt-3 text-gray-800">
                {new Date(event.eventDetails.startDateTime).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="font-medium text-gray-700">Fin Date et Temps</p>
              <p className="mt-3 text-gray-800">
                {new Date(event.eventDetails.endDateTime).toLocaleString()}
              </p>
            </div>

            <div className="col-span-2">
              <p className="font-medium text-gray-700">
                Lien vers l'événement TikTok en direct
              </p>
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
       {/* Selected Products */}
<div className="border border-gray-400 rounded-2xl p-6 space-y-4">
  <h2 className="text-base font-medium">Selected products for live</h2>

  {/* <div className="flex items-center border border-gray-400 rounded-md px-3 py-2 text-sm bg-white">
    <FontAwesomeIcon icon={faSearch} className="text-gray-500 mr-2" />
    <input
      type="text"
      placeholder="Search by products name or SKU to add products"
      className="w-full focus:outline-none placeholder:text-gray-400"
    />
  </div> */}

  <div className="space-y-3">
    {event.products && event.products.length > 0 ? (
      event.products.map((product, index) => (
        <div
          key={index}
          className="flex items-center justify-between border border-gray-400 rounded-md px-4 py-3 bg-white"
        >
          <div className="flex items-center space-x-3">
            <img
              src={
                product.productId?.images?.[0] ||
                "https://via.placeholder.com/100x100?text=No+Image"
              }
              alt={product.productId?.productName || "Product"}
              className="w-10 h-10 rounded object-cover"
            />
            <div>
              <p className="text-sm font-medium text-gray-800">
                {product.productId?.productName || "Unnamed Product"}
              </p>
              <p className="text-xs text-gray-500">
                {product.productId?.productCode || "No SKU"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-sm font-semibold">
              {product.productId?.price
                ? `€ ${product.productId.price}`
                : "N/A"}
            </p>
            
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-500 text-sm text-center py-3 border border-gray-200 rounded-md">
        No products selected for this live event.
      </p>
    )}
  </div>
</div>


        {/* Host Information */}
        <section className="border border-gray-400 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">Informations sur hôte</h2>
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
              <p className="font-semibold">
                {event.hostInformation.hostName}
              </p>
              <p className="text-sm text-gray-500">
                {event.hostInformation.hostEmailAddress}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="hostName"
              >
                Nom d'hôte
              </label>
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
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="emailAddress"
              >
                Adresse email
              </label>
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
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="phoneNumber"
              >
                Numéro de téléphone
              </label>
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
