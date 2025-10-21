import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCreditCard,
  faStickyNote,
  faClock,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function CreatePayment() {
  const navigate = useNavigate();

  // 🔹 State for customer details
  const [customerName, setCustomerName] = useState("");
  const [customerID, setCustomerID] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // 🔹 State for order details
  const [orderID, setOrderID] = useState("");
  const [transactionID, setTransactionID] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const [deliveryStatus, setDeliveryStatus] = useState("Pending");
  const [date, setdate] = useState("");
  const [notes, setNotes] = useState("");

  // 🔹 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {

    customerName,
    customerID, 
    email,
    phoneNumber,
    orderID,
    transactionID,
    amount: parseFloat(amount.replace(/[^0-9.]/g, "")),
    paymentMethod, 
    paymentStatus,
    deliveryStatus,
    date: new Date(date).getTime(),
    notes,

      // customerName,
      // customerID,
      // email,
      // phoneNumber,
      // orderID,
      // transactionID,
      // amount,
      // paymentMethod,
      // paymentStatus,
      // deliveryStatus,
      // date,
      // notes,
    };

    console.log("📤 Sending payment:", payload);

    try {
      const res = await axios.post(
        "http://dev-api.payonlive.com/api/payment/create-payment",
        payload
      );
      console.log("✅ Payment created:", res.data);
      alert("Payment created successfully!");
      navigate("/user/Payments");
    } catch (err) {
      console.error("❌ Error creating payment:", err);
      alert("Failed to create payment.");
    }
  };

  // Helper function to get CSS class based on status

  return (
    <div>
      <Navbar heading="Payment Management" />

      {/* discard button */}
      <div className="flex justify-between mt-5 mx-10">
        <h1 className=" font-medium  text-lg">Create Payment</h1>

        <button
          onClick={() => navigate("/user/Payments")}
          className=" px-3 py-1 mr-50 border rounded-md text-white bg-[#02B978] hover:bg-[#04D18C]"
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            size="lg"
            className="text-white px-2"
          />
          Back to Main View
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 max-w-5xl mx-5 space-y-6">
        {/* Customer Details */}
        <div className="border border-gray-400 rounded-2xl p-6">
          <h2 className="text-lg font-medium mb-4">Customer Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Customer Name
              </label>
              <input
                required
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full name"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Customer ID
              </label>
              <input
                required
                type="text"
                value={customerID}
                onChange={(e) => setCustomerID(e.target.value)}
                placeholder="#121214131"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                E-mail Address
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jamesmith12@gmail.com"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Phone number
              </label>
              <input
                required
                type="number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+121 1231 1212"
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
                type="text"
                value={orderID}
                onChange={(e) => setOrderID(e.target.value)}
                placeholder="#1811"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Transaction ID
              </label>
              <input
                required
                type="text"
                value={transactionID}
                onChange={(e) => setTransactionID(e.target.value)}
                placeholder="#qwivq12561"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount*</label>
              <input
                required
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="€ 12.99"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Payment Method*
              </label>
              <select
                required
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border border-gray-400 text-gray-500 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select</option>
                <option>Stripe</option>
                <option>PayPal</option>
                <option>Credit Card</option>
                <option>Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full border border-gray-400 text-gray-500 rounded-lg px-3 py-2 text-sm"
              >
                <option>Pending</option>
                <option>Paid</option>
                <option>Failed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Delivery Status
              </label>
              <select
                value={deliveryStatus}
                onChange={(e) => setDeliveryStatus(e.target.value)}
                className="w-full border border-gray-400 text-gray-500 rounded-lg px-3 py-2 text-sm"
              >
                <option>Pending</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Date & Time*
              </label>
              <input
                required
                type="datetime-local"
                value={date}
                onChange={(e) => setdate(e.target.value)}
                className="w-full border border-gray-400 text-gray-500 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes about this payment"
                className="w-full border border-gray-400 rounded-md px-3 py-2 text-sm h-24"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="border border-gray-400 lg:w-1/2 rounded-2xl p-6">
          <h2 className="text-lg font-medium mb-4">Status Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm mb-2 font-medium">Payment Status</p>{" "}
              <span className="px-3 py-1 mt-4 text-xs rounded-full border border-orange-400 bg-orange-100 text-orange-600">
                <FontAwesomeIcon icon={faClock} className="pr-2" /> Pending{" "}
              </span>
            </div>
            <div>
              <p className="text-sm mb-2 font-medium">Delivery Status</p>
              <span className="px-3 py-1 text-xs rounded-full border border-blue-600 bg-blue-100 text-blue-600">
                Shipped
              </span>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <hr className="text-gray-400" />
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
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#02B978] text-white px-4 py-2 rounded-md font-medium hover:bg-[#04D18C]"
          >
            <FontAwesomeIcon icon={faCreditCard} />
            Create Payment
          </button>
        </div>
      </form>
    </div>
  );
}
