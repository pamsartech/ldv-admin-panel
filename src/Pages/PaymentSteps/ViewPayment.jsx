import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faArrowRotateLeft,
  faUndoAlt,
  faXmark,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useAlert } from "../../Components/AlertContext";

// MUI 
import { Skeleton } from "@mui/material"; 
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";


function ViewPayment() {
  const navigate = useNavigate();
  const { paymentId } = useParams();
  const { showAlert } = useAlert(); // ✅ useAlert context

  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false); // 🔹 MUI confirm dialog

  // ✅ Fetch Payment / Order Details
  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await axios.get(
          `https://dev-api.payonlive.com/api/payment/${paymentId}/details`
        );

        if (response.data?.success) {
          setPaymentData(response.data.data);
          console.log("✅ Parsed payment data:", response.data.data);
        } else {
          setError("Invalid API response structure");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch payment details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [paymentId]);

  // ✅ Delete Payment Function
  const handleDelete = async () => {

    try {
      setIsDeleting(true);
      const response = await axios.post(
        "https://dev-api.payonlive.com/api/payment/bulk-delete",
        {
          payment_ids: [paymentId + ""],
        }
      );
      // console.log('rsponse', response)


      if (response.data.message) {
        showAlert("Payment deleted successfully!", "success");
        navigate("/user/Payments");
      } else {
      showAlert(response.data.message || "Failed to delete product", "error");
      }
    } catch (error) {
      showAlert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsDeleting(false);
      setOpenConfirm(false); // close confirmation dialog
    }
  };

  // ✅ Render Skeleton UI when loading
  if (loading) {
    return (
      <div>
        <Navbar heading="Payment Management" />
        <div className="p-4 mt-10 mx-5 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Skeleton Card */}
            <div className="border border-gray-300 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col items-center mb-6">
                <Skeleton variant="circular" width={80} height={80} />
                <Skeleton variant="text" width="60%" height={30} />
                <Skeleton variant="text" width="50%" height={25} />
              </div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    height={25}
                    animation="wave"
                  />
                ))}
              </div>
            </div>

            {/* Right Skeleton Card */}
            <div className="border border-gray-300 rounded-2xl p-6 shadow-sm">
              <Skeleton variant="text" width="40%" height={30} />
              <div className="space-y-2 mt-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    height={25}
                    animation="wave"
                  />
                ))}
              </div>
              <div className="mt-6">
                <Skeleton variant="text" width="50%" height={25} />
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-3 mt-3">
                    <Skeleton
                      variant="rectangular"
                      width={64}
                      height={64}
                      className="rounded-lg"
                    />
                    <div className="flex-1 space-y-2">
                      <Skeleton variant="text" width="70%" height={20} />
                      <Skeleton variant="text" width="60%" height={20} />
                      <Skeleton variant="text" width="50%" height={20} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error handling
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!paymentData)
    return <p className="text-center mt-10">No payment data found</p>;

  // ✅ Destructure all fields directly from API response
  const {
    _id,
    userId,
    customerName,
    email,
    phoneNumber,
    paymentMethod,
    orderTotal,
    createdAt,
    payment_id,
    paymentStatus = "Pending",
    shippingStatus = "Pending",
    orderItems = [],
  } = paymentData;

  return (
    <div>
      <Navbar heading="Gestion des paiements" />

      {/* Top Buttons */}
      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Détails du paiement et de la commande</h1>
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
            {isDeleting ? "Supprimer..." : "Supprimer paiement"}
          </button>

          <button
            onClick={() => navigate(`/user/update-payment/${paymentId}`)}
            className="mx-2 px-3 py-1 border rounded-md text-[#114E9D] bg-blue-50 hover:bg-blue-100"
          >
            <FontAwesomeIcon icon={faArrowRotateLeft} className="px-2" />
            Mise à jour
          </button>

          <button
            onClick={() => navigate("/user/Payments")}
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
          {"Confirm Payment Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-description">
            Are you sure you want to permanently delete this payment? This
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

      <div className="p-4 mt-10 mx-5 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Card */}
          <div className="border border-gray-300 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col items-center mb-6">
              <img
                src="https://randomuser.me/api/portraits/men/44.jpg"
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
              <h2 className="mt-4 text-lg font-semibold">{customerName}</h2>
              <p className="text-sm text-gray-600">{email}</p>
              <p className="text-sm text-gray-600">{phoneNumber}</p>
            </div>

            <hr className="my-4 border-gray-300" />

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 items-center">
                <span className="font-medium text-gray-700">ID client</span>
                <span className="text-gray-900 font-mono text-right">
                  {userId}
                </span>
              </div>

              {/* ✅ Payment Status */}
              <div className="grid grid-cols-2 items-center">
                <span className="font-medium text-gray-700">
                  Statut du paiement
                </span>
                <span
                  className={`justify-self-end px-3 py-1 rounded-full text-xs font-medium ${
                    paymentStatus === "Paid"
                      ? "bg-green-100 text-green-700 border border-green-700"
                      : "bg-red-100 text-red-700 border border-red-700"
                  }`}
                >
                  {paymentStatus}
                </span>
              </div>

              {/* ✅ Shipping Status */}
              <div className="grid grid-cols-2 items-center">
                <span className="font-medium text-gray-700">
                  Statut de livraison
                </span>
                <span
                  className={`justify-self-end px-3 py-1 rounded-full text-xs font-medium ${
                    shippingStatus === "Shipped"
                      ? "bg-blue-100 text-blue-700 border border-blue-700"
                      : shippingStatus === "Processing"
                      ? "bg-yellow-100 text-yellow-700 border border-yellow-700"
                      : "bg-gray-100 text-gray-700 border border-gray-400"
                  }`}
                >
                  {shippingStatus}
                </span>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 items-start">
                <span className="font-medium text-gray-700">Action</span>
                <div className="flex flex-col gap-3 justify-self-end">
                  <button
                    type="button"
                    className="px-3 py-1 text-white rounded-full bg-red-700 hover:bg-red-600"
                  >
                    <FontAwesomeIcon icon={faUndoAlt} className="h-3 w-3 pr-2" />
                    Remboursement
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className={`px-3 py-1 border rounded-full ${
                      isDeleting
                        ? "bg-gray-300 text-gray-500"
                        : "text-[#B21E1E] bg-red-50 hover:bg-red-100"
                    }`}
                  >
                    <FontAwesomeIcon icon={faXmark} className="h-3 w-3 pr-1" />
                    {isDeleting ? "Annuler..." : "Annuler commande"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card */}
          <div className="border border-gray-300 rounded-2xl p-6 shadow-sm">
            <h3 className="font-medium mb-4">Informations sur la commande</h3>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2">
                <span className="font-medium text-gray-700">
                  ID de transaction
                </span>
                <span className="text-gray-900 text-right">{payment_id}</span>
              </div>
              <div className="grid grid-cols-2 py-2">
                <span className="font-medium text-gray-700">Date et Temps</span>
                <span className="text-gray-900 text-right">
                  {new Date(createdAt).toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-2">
                <span className="font-medium text-gray-700">Méthode</span>
                <span className="text-gray-900 text-right">
                  {paymentMethod}
                </span>
              </div>
              <div className="grid grid-cols-2">
                <span className="font-medium text-gray-700">Montant</span>
                <span className="text-gray-900 text-right">€ {orderTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* ✅ Show Ordered Items */}
            <div className="mt-6">
              <h4 className="font-medium mb-2">Articles commandés</h4>
              {orderItems.length > 0 ? (
                orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 mb-3 border p-2 rounded-lg"
                  >
                    <img
                      src={item.productDetails?.images?.[0]}
                      alt={item.productName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-semibold">
                        {item.productDetails?.productName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantité: {item.quantity} × €{item.price}
                      </p>
                      <p className="text-sm font-medium">
                        Total: €{item.total}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No order items found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewPayment;
