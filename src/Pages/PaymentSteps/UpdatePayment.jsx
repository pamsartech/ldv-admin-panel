import React, { useState, useEffect } from "react";
import { useNavigate, useParams ,useLocation } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCreditCard, faXmark, faClock } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useAlert } from "../../Components/AlertContext";

export default function UpdatePayment() {
   const navigate = useNavigate();
  const { paymentId } = useParams();
  const location = useLocation();
  const { showAlert } = useAlert();

  const [paymentData, setPaymentData] = useState({
    customerName: "",
    customerId: "",
    email: "",
    phone: "",
    orderId: "",
    transactionId: "",
    amount: "",
    paymentMethod: "",
    paymentStatus: "Pending",
    deliveryStatus: "Pending",
    dateTime: "",
    notes: "",
  });

  const [loading, setLoading] = useState(true);

  // Prefill from location.state or fetch if page refreshed
  useEffect(() => {
    const prefillData = location.state?.paymentData;

    if (prefillData) {
      setPaymentData({
        customerName: prefillData.customerDetails.customerName,
        customerId: prefillData.customerDetails.customerID,
        email: prefillData.customerDetails.email,
        phone: prefillData.customerDetails.phoneNumber,
        orderId: prefillData.orderDetails.orderID,
        transactionId: prefillData.orderDetails.transactionID,
        amount: prefillData.orderDetails.amount,
        paymentMethod: prefillData.orderDetails.paymentMethod,
        paymentStatus: prefillData.orderDetails.paymentStatus,
        deliveryStatus: prefillData.orderDetails.deliveryStatus,
        dateTime: prefillData.orderDetails.date?.slice(0, 16) || "",
        notes: prefillData.orderDetails.notes || "",
      });
      setLoading(false);
    } else {
      const fetchPayment = async () => {
        try {
          const res = await axios.get(
            `http://dev-api.payonlive.com/api/payment/update-payment/${paymentId}`
          );
          const data = res.data.data;
          setPaymentData({
            customerName: data.customerDetails.customerName,
            customerId: data.customerDetails.customerID,
            email: data.customerDetails.email,
            phone: data.customerDetails.phoneNumber,
            orderId: data.orderDetails.orderID,
            transactionId: data.orderDetails.transactionID,
            amount: data.orderDetails.amount,
            paymentMethod: data.orderDetails.paymentMethod,
            paymentStatus: data.orderDetails.paymentStatus,
            deliveryStatus: data.orderDetails.deliveryStatus,
            dateTime: data.orderDetails.date?.slice(0, 16) || "",
            notes: data.orderDetails.notes || "",
          });
        } catch (error) {
          console.error("Error fetching payment:", error);
          console.log(paymentData);
          alert("Failed to load payment details.");
        } finally {
          setLoading(false);
        }
      };
      fetchPayment();
    }
  }, [paymentId, location.state]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setPaymentData({ ...paymentData, [id]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const payload = {
      customerDetails: {
        customerName: paymentData.customerName,
        customerID: paymentData.customerId,
        email: paymentData.email,
        phoneNumber: paymentData.phone,
      },
      orderDetails: {
        orderID: paymentData.orderId,
        transactionID: paymentData.transactionId,
        amount: Number(paymentData.amount),
        paymentMethod: paymentData.paymentMethod,
        paymentStatus: paymentData.paymentStatus,
        deliveryStatus: paymentData.deliveryStatus,
        date: paymentData.dateTime,
        notes: paymentData.notes,
      },
    };

    try {
      await axios.put(
        `http://dev-api.payonlive.com/api/payment/update-payment/${paymentId}`,
        payload
      );
      showAlert("Payment update successfully!", "success");
      // alert("Payment updated successfully!");
      navigate("/user/Payments");
    } catch (error) {
      console.error("Error updating payment:", error);
       showAlert("Failed to update payment. Please try again.", "error");
      // alert("Failed to update payment. Please try again.");
    }
  };



  // Helper for status classes
  const getStatusClass = (status, type) => {
    if (type === "payment") {
      switch (status) {
        case "Paid": return "bg-green-100 text-green-600 border-green-400";
        case "Pending": return "bg-orange-100 text-orange-600 border-orange-400";
        case "Failed": return "bg-red-100 text-red-600 border-red-400";
        default: return "bg-gray-100 text-gray-600 border-gray-400";
      }
    } else if (type === "delivery") {
      switch (status) {
        case "Delivered": return "bg-green-100 text-green-600 border-green-400";
        case "Shipped": return "bg-blue-100 text-blue-600 border-blue-600";
        case "Pending": return "bg-orange-100 text-orange-600 border-orange-400";
        case "Cancelled": return "bg-red-100 text-red-600 border-red-400";
        default: return "bg-gray-100 text-gray-600 border-gray-400";
      }
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading payment details...</p>;
  }

  return (
    <div>
      <Navbar heading="Payment Management" />

      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Update Payment Details</h1>
        <button
          onClick={() => navigate("/user/Payments")}
          className="px-3 py-1 border rounded-md text-white bg-[#02B978] hover:bg-[#04D18C]"
        >
          <FontAwesomeIcon icon={faArrowLeft} size="lg" className="text-white px-2" />
          Back to Main View
        </button>
      </div>

      <form className="p-6 max-w-5xl mx-5 space-y-6" onSubmit={handleUpdate}>
        {/* Customer Details */}
        <div className="border border-gray-400 rounded-2xl p-6">
          <h2 className="text-lg font-medium mb-4">Customer Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Customer Name</label>
              <input
                required
                id="customerName"
                type="text"
                value={paymentData.customerName}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Customer ID</label>
              <input
                required
                id="customerId"
                type="text"
                value={paymentData.customerId}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                required
                id="email"
                type="email"
                value={paymentData.email}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                required
                id="phone"
                type="text"
                value={paymentData.phone}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="border border-gray-400 rounded-2xl p-6">
          <h2 className="text-lg font-medium mb-4">Order Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Order ID</label>
              <input
                required
                id="orderId"
                type="text"
                value={paymentData.orderId}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Transaction ID</label>
              <input
                required
                id="transactionId"
                type="text"
                value={paymentData.transactionId}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                required
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={paymentData.amount}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Payment Method</label>
              <select
                required
                id="paymentMethod"
                value={paymentData.paymentMethod}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select Payment Method</option>
                <option value="Stripe">Stripe</option>
                <option value="PayPal">PayPal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Payment Status</label>
              <select
                required
                id="paymentStatus"
                value={paymentData.paymentStatus}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select Payment Status</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Delivery Status</label>
              <select
                required
                id="deliveryStatus"
                value={paymentData.deliveryStatus}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select Delivery Status</option>
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Time & Date</label>
              <input
                required
                id="dateTime"
                type="datetime-local"
                value={paymentData.dateTime}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                id="notes"
                value={paymentData.notes}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm h-24"
              />
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="border border-gray-400 lg:w-1/2 rounded-2xl p-6">
          <h2 className="text-lg font-medium mb-4">Status Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm mb-2 font-medium">Payment Status</p>
              <span
                className={`px-3 py-1 mt-4 text-xs rounded-full border ${getStatusClass(
                  paymentData.paymentStatus,
                  "payment"
                )}`}
              >
                <FontAwesomeIcon icon={faClock} className="pr-2" />
                {paymentData.paymentStatus || "Pending"}
              </span>
            </div>
            <div>
              <p className="text-sm mb-2 font-medium">Delivery Status</p>
              <span
                className={`px-3 py-1 text-xs rounded-full border ${getStatusClass(
                  paymentData.deliveryStatus,
                  "delivery"
                )}`}
              >
                {paymentData.deliveryStatus || "Pending"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/Payments")}
            className="w-full md:w-auto flex items-center justify-center border border-red-600 gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-md font-medium hover:bg-red-200"
          >
            <FontAwesomeIcon icon={faXmark} />
            Discard Payment
          </button>
          <button
            type="submit"
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#114E9D] text-white px-4 py-2 rounded-md font-medium hover:bg-blue-500"
          >
            <FontAwesomeIcon icon={faCreditCard} />
            Update Payment
          </button>
        </div>
      </form>
    </div>
  );
}

