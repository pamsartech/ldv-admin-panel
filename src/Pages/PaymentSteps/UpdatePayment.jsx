import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCreditCard,
  faXmark,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useAlert } from "../../Components/AlertContext";

export default function UpdatePayment() {
  const navigate = useNavigate();
  const { paymentId } = useParams();
  const location = useLocation();
  const { showAlert } = useAlert();

  const [btnLoading , setBtnLoading] = useState(false);

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

  useEffect(() => {
    const prefillData = location.state?.paymentData;

    // ✅ Prefill from router state if available
    if (prefillData) {
      setPaymentData({
        customerName: prefillData.customerName || "",
        customerId: prefillData.userId || "",
        email: prefillData.email || "",
        phone: prefillData.phoneNumber || "",
        orderId: prefillData._id || "",
        transactionId: prefillData.payment_id || "",
        amount: prefillData.orderTotal || "",
        paymentMethod: prefillData.paymentMethod || "",
        paymentStatus: prefillData.paymentStatus || "Pending",
        deliveryStatus: prefillData.shippingStatus || "Pending",
        dateTime: prefillData.createdAt
          ? prefillData.createdAt.slice(0, 16)
          : "",
        notes: prefillData.notes || "",
      });
      setLoading(false);
    } else {
      // ✅ Fetch payment details if page is refreshed
      const fetchPayment = async () => {
        try {
          const res = await axios.get(
            `https://dev-api.payonlive.com/api/payment/${paymentId}/details`
          );
          const data = res.data.data;

          setPaymentData({
            customerName: data.customerName || "",
            customerId: data.userId || "",
            email: data.email || "",
            phone: data.phoneNumber || "",
            orderId: data._id || "",
            transactionId: data.payment_id || "",
            amount: data.orderTotal || "",
            paymentMethod: data.paymentMethod || "",
            paymentStatus: data.paymentStatus || "Pending",
            deliveryStatus: data.shippingStatus || "Pending",
            dateTime: data.createdAt ? data.createdAt.slice(0, 16) : "",
            notes: data.notes || "",
          });
        } catch (error) {
          console.error("Error fetching payment:", error);
          showAlert("Failed to load payment details.", "error");
        } finally {
          setLoading(false);
        }
      };

      fetchPayment();
    }
  }, [paymentId, location.state, showAlert]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setPaymentData({ ...paymentData, [id]: value });
  };

  const handleUpdate = async (e) => {
  e.preventDefault();

  setBtnLoading(true);

  const payload = {
    orderDetails: {
      paymentMethod: paymentData.paymentMethod,
      paymentStatus: paymentData.paymentStatus,
    },
  };

  try {
    const res = await axios.put(
      `https://dev-api.payonlive.com/api/payment/update-payment/${paymentId}`,
      payload
    );
    console.log("API Response:", res.data);
    showAlert("Payment updated successfully!", "success");
    navigate("/user/Payments");
  } catch (error) {
    console.error("Error updating payment:", error.response?.data || error);
    showAlert("Failed to update payment. Please try again.", "error");
    btnLoading(false);
  }
};


  const getStatusClass = (status, type) => {
    if (type === "payment") {
      switch (status) {
        case "Paid":
          return "bg-green-100 text-green-600 border-green-400";
        case "Pending":
          return "bg-orange-100 text-orange-600 border-orange-400";
        case "Failed":
          return "bg-red-100 text-red-600 border-red-400";
        default:
          return "bg-gray-100 text-gray-600 border-gray-400";
      }
    } else if (type === "delivery") {
      switch (status) {
        case "Delivered":
          return "bg-green-100 text-green-600 border-green-400";
        case "Shipped":
          return "bg-blue-100 text-blue-600 border-blue-600";
        case "Pending":
          return "bg-orange-100 text-orange-600 border-orange-400";
        case "Cancelled":
          return "bg-red-100 text-red-600 border-red-400";
        default:
          return "bg-gray-100 text-gray-600 border-gray-400";
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
          <FontAwesomeIcon
            icon={faArrowLeft}
            size="lg"
            className="text-white px-2"
          />
          Back to Main View
        </button>
      </div>

      <form className="p-6 max-w-5xl mx-5 space-y-6" onSubmit={handleUpdate}>
        {/* Customer Details */}
        <div className="border border-gray-400 rounded-2xl p-6">
          <h2 className="text-lg font-medium mb-4">Customer Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Customer Name"
              id="customerName"
              value={paymentData.customerName}
              onChange={handleChange}
            />
            <InputField
              label="Customer ID"
              id="customerId"
              value={paymentData.customerId}
              onChange={handleChange}
            />
            <InputField
              label="Email"
              id="email"
              type="email"
              value={paymentData.email}
              onChange={handleChange}
            />
            <InputField
              label="Phone"
              id="phone"
              value={paymentData.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Order Details */}
        <div className="border border-gray-400 rounded-2xl p-6">
          <h2 className="text-lg font-medium mb-4">Order Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Order ID"
              id="orderId"
              value={paymentData.orderId}
              onChange={handleChange}
            />
            <InputField
              label="Transaction ID"
              id="transactionId"
              value={paymentData.transactionId}
              onChange={handleChange}
            />
            <InputField
              label="Amount"
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={paymentData.amount}
              onChange={handleChange}
            />

            <SelectField
              label="Payment Method"
              id="paymentMethod"
              value={paymentData.paymentMethod}
              onChange={handleChange}
              options={["Stripe", "PayPal"]}
            />
            <SelectField
              label="Payment Status"
              id="paymentStatus"
              value={paymentData.paymentStatus}
              onChange={handleChange}
              options={["Pending", "Paid", "Failed"]}
            />
            <SelectField
              label="Delivery Status"
              id="deliveryStatus"
              value={paymentData.deliveryStatus}
              onChange={handleChange}
              options={["Processing", "Shipped", "Delivered", "Cancelled"]}
            />
            <InputField
              label="Time & Date"
              id="dateTime"
              type="datetime-local"
              value={paymentData.dateTime}
              onChange={handleChange}
            />
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
              <p className="text-sm mb-2 font-medium">Shipping Status</p>
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
          {/* <button
            type="submit"
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#114E9D] text-white px-4 py-2 rounded-md font-medium hover:bg-blue-500"
          >
            <FontAwesomeIcon icon={faCreditCard} />
            Update Payment
          </button> */}

            <button
              type="submit"
              disabled={btnLoading}
              className="bg-[#114E9D] text-white px-6 py-2 rounded-lg hover:bg-blue-500 flex items-center gap-2"
            >
              {btnLoading && (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              {btnLoading ? "Updating..." : "Update Payment"}
            </button>
          

        </div>
      </form>
    </div>
  );
}

// Reusable input components for clean structure
const InputField = ({ label, id, type = "text", value, onChange, ...rest }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
      {...rest}
    />
  </div>
);

const SelectField = ({ label, id, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

