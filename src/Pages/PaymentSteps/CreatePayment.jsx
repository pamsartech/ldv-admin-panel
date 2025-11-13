import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCreditCard,
  faXmark,
  faSpinner,
  faMagnifyingGlass,
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
  const [fetching, setFetching] = useState(false); // 🔹 for autofill spinner

  // 🔹 Auto-fill function (fetch order details)
  // ✅ UPDATED SECTION ONLY — rest of your component stays the same

  // 🔹 Auto-fill function (fetch order details)
  const handleFetchOrderDetails = async () => {
    if (!orderID.trim()) {
      showAlert("Please enter an Order ID first.", "error");
      return;
    }

    setFetching(true);
    try {
      const res = await axios.get(
        `https://dev-api.payonlive.com/api/order/order-details/${orderID}`
      );

      const data = res.data?.data;
      console.log("📦 Order details fetched:", data);

      if (!data) {
        showAlert("No order found for this ID.", "error");
        return;
      }

      // ✅ Match your existing form field states
      setAmount(data.orderTotal ? data.orderTotal.toString() : "");
      setPaymentMethod(data.paymentMethod || "");
      setPaymentStatus(data.paymentStatus || "en-attente");
      setDeliveryStatus(data.shippingStatus || "Processing");

      // ✅ Use order creation date if available
      if (data.createdAt) {
        const formattedDate = new Date(data.createdAt)
          .toISOString()
          .slice(0, 16);
        setDate(formattedDate);
      }

      // ✅ Optional notes (if available in future API)
      setNotes(data.notes || "");

      // ✅ Apply condition: If Delivered → Payment must be Paid
      // if (data.shippingStatus === "Delivered" || "Shipped") {
      //   setPaymentStatus("Paid");
      //   showAlert(
      //     "Delivery is already marked as Delivered — Payment status set to Paid.",
      //     "info"
      //   );
      // }

      showAlert("Order details loaded successfully!", "success");
    } catch (err) {
      console.error(
        "❌ Error fetching order details:",
        err.response?.data || err
      );
      showAlert("Order not found or failed to fetch details.", "error");
    } finally {
      setFetching(false);
    }
  };

  // 🔹 Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!orderID || !amount || !paymentMethod || !date) {
      showAlert("Please fill in all required fields.", "error");
      setLoading(false);
      return;
    }

    if (
      (deliveryStatus === "livraison" || deliveryStatus === "expédié") &&
      paymentStatus !== "payé"
    ) {
      showAlert(
        "When delivery status is 'Delivered' or 'Shipped', payment status must be 'Paid'.",
        "warning"
      );
      setLoading(false);
      return;
    }

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

    try {
      const res = await axios.post(
        "https://dev-api.payonlive.com/api/payment/create-payment",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data?.success || res.status === 200) {
        showAlert(
          res.data.message || "Payment created successfully!",
          "success"
        );
        navigate("/user/Payments");
      } else {
        showAlert("Failed to create payment. Please try again.", "error");
      }
    } catch (err) {
      console.error("❌ Error creating payment:", err.response?.data || err);
      showAlert("Server error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar heading="Gestion des paiements" />

      {/* Header */}
      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Créer un paiement </h1>
        <button
          onClick={() => navigate("/user/Payments")}
          className="px-3 py-1 border rounded-md text-white bg-[#02B978] hover:bg-[#04D18C]"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-white px-2" />
          Back to Main View
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 max-w-4xl mx-5 mt-6 border border-gray-300 rounded-2xl space-y-6 bg-white shadow-sm"
      >
        {/* Order ID with Auto-Fill Button */}
        {/* <div>
          <label className="block text-sm font-medium mb-1">Order ID*</label>
          <div className="flex gap-1">
            <input
              required
              type="text"
              value={orderID}
              onChange={(e) => setOrderID(e.target.value)}
              placeholder="e.g. 100007"
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={handleFetchOrderDetails}
              disabled={fetching || !orderID.trim()}
              className="flex items-center gap-1 bg-[#114E9D] text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {fetching ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Fetching...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                  Auto-Fill
                </>
              )}
            </button>
          </div>
        </div> */}
        <div>
          <label className="block text-sm font-medium mb-1">ID commande*</label>
          <div className="flex items-center gap-2">
            <input
              required
              type="text"
              value={orderID}
              onChange={(e) => setOrderID(e.target.value)}
              placeholder="e.g. 100007"
              className="flex-grow border border-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleFetchOrderDetails}
              disabled={fetching || !orderID.trim()}
              className="flex items-center justify-center gap-2 bg-[#114E9D] text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 min-w-[110px] h-[38px]"
            >
              {fetching ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Fetching...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                  Auto-Fill
                </>
              )}
            </button>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium mb-1">Montant (€)*</label>
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
          <label className="block text-sm font-medium mb-1">
            Mode de paiement*
          </label>
          <select
            required
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border border-gray-400 text-gray-600 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Sélectionnez mode de paiement</option>
            <option>PayPal</option>
            <option>Stripe</option>
          </select>
        </div>

        {/* Status Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Statut du paiement
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              // className="w-full border border-gray-400 text-gray-600 rounded-lg px-3 py-2 text-sm"
              disabled={
                deliveryStatus === "ivraison" || deliveryStatus === "Sxpédié"
              }
              className={`w-full border border-gray-400 text-gray-600 rounded-lg px-3 py-2 text-sm ${
                deliveryStatus === "Livraison" || deliveryStatus === "Expédié"
                  ? "bg-gray-100 cursor-not-allowed"
                  : ""
              }`}
            >
              <option value="en-attente">En-attente</option>
              <option value="payé">Payé</option>
              <option value="échoué">Échoué</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Statut de livraison
            </label>
            <select
              value={deliveryStatus}
              disabled
              onChange={(e) => setDeliveryStatus(e.target.value)}
              className="w-full border border-gray-400 text-gray-600 rounded-lg px-3 py-2 text-sm"
            >
              <option>Processing</option>
              <option value="expédié">Expédié</option>
              <option value="livraison">Livraison</option>
              <option value="annulé">Annulé</option>
            </select>
          </div>
        </div>

        {/* Payment Date */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Date et heure du paiement*
          </label>
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
          <label className="block text-sm font-medium mb-1">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes about this payment"
            className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm h-24"
          ></textarea>
        </div>

        <hr className="border-gray-300" />

        {/* Buttons */}
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
