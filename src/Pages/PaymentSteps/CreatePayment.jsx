import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCreditCard,
  faXmark,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useAlert } from "../../Components/AlertContext";

export default function CreatePayment() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // 🔹 Form states
  const [orderID, setOrderID] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const [deliveryStatus, setDeliveryStatus] = useState("Pending");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      orderId: orderID,
      amount: parseFloat(amount.replace(/[^0-9.]/g, "")),
      paymentMethod,
      paymentStatus,
      deliveryStatus,
      paymentDate: new Date(date).toISOString(),
      notes,
    };

    console.log("📤 Sending payment payload:", payload);
    setLoading(true);

    try {
      const res = await axios.post(
        "http://dev-api.payonlive.com/api/payment/create-payment",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("✅ Payment created:", res.data);
      showAlert(res.data.message || "Payment created successfully!", "success");
      navigate("/user/Payments");
    } catch (err) {
      console.error("❌ Error creating payment:", err.response?.data || err);
      showAlert("Failed to create payment. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar heading="Payment Management" />

      {/* Page Header */}
      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Create Payment</h1>
        <button
          onClick={() => navigate("/user/Payments")}
          className="px-3 py-1 border rounded-md text-white bg-[#02B978] hover:bg-[#04D18C]"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-white px-2" />
          Back to Main View
        </button>
      </div>

      {/* Payment Form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 max-w-4xl mx-5 mt-6 border border-gray-300 rounded-2xl space-y-6 bg-white shadow-sm"
      >
        {/* Order ID */}
        <div>
          <label className="block text-sm font-medium mb-1">Order ID*</label>
          <input
            required
            type="text"
            value={orderID}
            onChange={(e) => setOrderID(e.target.value)}
            placeholder="e.g. 100007"
            className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium mb-1">Amount (€)*</label>
          <input
            required
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="€ 12.99"
            className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium mb-1">Payment Method*</label>
          <select
            required
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border border-gray-400 text-gray-600 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Select</option>
            <option>Credit Card</option>
            <option>PayPal</option>
            <option>Stripe</option>
            <option>Bank Transfer</option>
          </select>
        </div>

        {/* Status Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Payment Status</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full border border-gray-400 text-gray-600 rounded-lg px-3 py-2 text-sm"
            >
              <option>Pending</option>
              <option>Paid</option>
              <option>Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Delivery Status</label>
            <select
              value={deliveryStatus}
              onChange={(e) => setDeliveryStatus(e.target.value)}
              className="w-full border border-gray-400 text-gray-600 rounded-lg px-3 py-2 text-sm"
            >
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>

        {/* Payment Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Payment Date & Time*</label>
          <input
            required
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-400 text-gray-600 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes about this payment"
            className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm h-24"
          ></textarea>
        </div>

        {/* Action Buttons */}
        <hr className="border-gray-300" />
        <div className="flex flex-col md:flex-row justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/user/Payments")}
            disabled={loading}
            className="w-full md:w-auto flex items-center justify-center border border-red-600 gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-md font-medium hover:bg-red-200"
          >
            <FontAwesomeIcon icon={faXmark} />
            Discard Payment
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium text-white ${
              loading
                ? "bg-[#02B978]/70 cursor-not-allowed"
                : "bg-[#02B978] hover:bg-[#04D18C]"
            }`}
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                Processing...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCreditCard} />
                Create Payment
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
