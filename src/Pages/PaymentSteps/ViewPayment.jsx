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

function ViewPayment() {
  const navigate = useNavigate();
  const { paymentId } = useParams(); // Dynamic payment ID from route

  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch payment details
  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await axios.get(
          `http://dev-api.payonlive.com//api/payment/payment-details/${paymentId}`
        );
        setPaymentData(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch payment details");
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [paymentId]);


  if (loading) {
    return <p className="text-center mt-10">Loading payment details...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  }

  if (!paymentData) {
    return <p className="text-center mt-10">No payment data found</p>;
  }

  const { customerDetails, orderDetails } = paymentData;


  // Delete payment API
const handleDelete = async () => {
  const confirmDelete = window.confirm("Are you sure you want to delete this payment?");
  if (!confirmDelete) return;

  try {
    setIsDeleting(true);
    const response = await axios.delete(
      `http://dev-api.payonlive.com/api/payment/delete-payment/${paymentId}`
    );

    if (response.data.success) {
      alert("Payment deleted successfully!");
      navigate("/user/Payments"); // Redirect after delete
    } else {
      alert(`Failed to delete payment: ${response.data.message || "Unknown error"}`);
    }
  } catch (error) {
    alert(`Error: ${error.response?.data?.message || error.message}`);
  } finally {
    setIsDeleting(false);
  }
};


  return (
    <div>
      <Navbar heading="Payment Management" />

      {/* Top buttons */}
      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Payment & Order details</h1>
        <div>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`px-3 py-1 border rounded-md ${
              isDeleting
                ? "bg-gray-300 text-gray-500"
                : "text-[#B21E1E] bg-red-50 hover:bg-red-100"
            }`}
          >
            <FontAwesomeIcon icon={faTrashCan} className="px-2" />
            {isDeleting ? "Deleting..." : "Delete payment"}
          </button>

          
          <button
           onClick={() => navigate(`/user/update-payment/${paymentData._id}`, { state: { paymentData } })  }
            // onClick={() => navigate(`/update-payment/${paymentData.paymentId}`)}
            className="mx-2 px-3 py-1 border rounded-md text-[#114E9D] bg-blue-50 hover:bg-blue-100"
          >
            <FontAwesomeIcon icon={faArrowRotateLeft} className="px-2" />
            Update
          </button>

          <button
            onClick={() => navigate("/user/Payments")}
            className="px-3 py-1 border rounded-md text-white bg-[#02B978] hover:bg-[#04D18C]"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-white px-2" />
            Back to Main View
          </button>
        </div>
      </div>

      <div className="p-4 mt-10 mx-5 max-w-4xl">
        {/* Grid wrapper */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Card */}
          <div className="border border-gray-300 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col items-center mb-6">
              <img
                src="https://randomuser.me/api/portraits/men/44.jpg"
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
              <h2 className="mt-4 text-lg font-semibold">{customerDetails.customerName}</h2>
              <p className="text-sm text-gray-600">{customerDetails.email}</p>
              <p className="text-sm text-gray-600">{customerDetails.phoneNumber}</p>
            </div>

            <hr className="my-4 border-gray-300" />

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 items-center">
                <span className="font-medium text-gray-700">Customer ID</span>
                <span className="text-gray-900 font-mono text-right">{customerDetails.customerID}</span>
              </div>
              <div className="grid grid-cols-2 items-center">
                <span className="font-medium text-gray-700">Payment Status</span>
                <span className={`justify-self-end px-3 py-1 rounded-full text-xs font-medium ${
                  orderDetails.paymentStatus === "Paid"
                    ? "bg-green-100 text-green-700 border border-green-700"
                    : "bg-red-100 text-red-700 border border-red-700"
                }`}>
                  {orderDetails.paymentStatus}
                </span>
              </div>
              <div className="grid grid-cols-2 items-center">
                <span className="font-medium text-gray-700">Delivery Status</span>
                <span className={`justify-self-end px-3 py-1 rounded-full text-xs font-medium ${
                  orderDetails.deliveryStatus === "Shipped"
                    ? "bg-blue-100 text-blue-700 border border-blue-700"
                    : "bg-yellow-100 text-yellow-700 border border-yellow-700"
                }`}>
                  {orderDetails.deliveryStatus}
                </span>
              </div>
              <div className="grid grid-cols-2 items-start">
                <span className="font-medium text-gray-700">Action</span>
                <div className="flex flex-col gap-3 justify-self-end">
                  <button
                    type="button"
                    className="px-3 py-1 text-white rounded-full bg-red-700 hover:bg-red-600"
                  >
                    <FontAwesomeIcon icon={faUndoAlt} className="h-3 w-3 pr-2" />
                    Refund
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 text-red-600 rounded-full border border-red-700 bg-red-100 hover:bg-red-200"
                  >
                    <FontAwesomeIcon icon={faXmark} className="h-3 w-3 pr-1" /> Cancel order
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card */}
          <div className="border border-gray-300 rounded-2xl p-6 shadow-sm">
            <h3 className="font-medium mb-4">Order Info</h3>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2">
                <span className="font-medium text-gray-700">Transaction ID</span>
                <span className="text-gray-900 text-right">{orderDetails.transactionID}</span>
              </div>
              <div className="grid grid-cols-2 py-2">
                <span className="font-medium text-gray-700">Date & Time</span>
                <span className="text-gray-900 text-right">
                  {new Date(orderDetails.date).toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-2">
                <span className="font-medium text-gray-700">Method</span>
                <span className="text-gray-900 text-right">{orderDetails.paymentMethod}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="font-medium text-gray-700">Amount</span>
                <span className="text-gray-900 text-right">€ {orderDetails.amount}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="font-medium text-gray-700">Notes</span>
                <span className="text-gray-900 text-right">{orderDetails.notes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewPayment;
