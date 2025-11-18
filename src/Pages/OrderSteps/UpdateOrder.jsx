import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faXmark,
  faClipboard,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useAlert } from "../../Components/AlertContext";

const UpdateOrder = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const location = useLocation();
  const existingOrder = location.state?.orderData;
  const [loading, setLoading] = useState(false);

  // if (!existingOrder) {
  //   // If no data passed, redirect back
  //   navigate("/Orders");
  // }

  useEffect(() => {
    if (!existingOrder) {
      navigate("/Orders");
    }
  }, [existingOrder, navigate]);

  const [orderData, setOrderData] = useState({
    customerName: existingOrder.customerName || "",
    email: existingOrder.email || "",
    phoneNumber: existingOrder.phoneNumber || "",
    address: existingOrder.address || "",
    paymentMethod: existingOrder.paymentMethod || "",
    paymentStatus: existingOrder.paymentStatus || "",
    shippingMethod: existingOrder.shippingMethod || "",
    shippingStatus: existingOrder.shippingStatus || "",
  });

  const [orderItems, setOrderItems] = useState(
    existingOrder.orderItems?.map((item) => ({
      productName: item.productName,
      quantity: item.quantity,
      price: item.price,
    })) || [{ productName: "", quantity: 1, price: 0 }]
  );

  const handleChange = (e) => {
    setOrderData({ ...orderData, [e.target.id]: e.target.value });
  };

  const handleProductChange = (index, field, value) => {
    const newItems = [...orderItems];
    newItems[index][field] = value;
    setOrderItems(newItems);
  };

  const addProduct = () => {
    setOrderItems([...orderItems, { productName: "", quantity: 1, price: 0 }]);
  };

  const removeProduct = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleUpdate = async (e) => {
  e.preventDefault();
  setLoading(true);

  const { paymentStatus, shippingStatus } = orderData;

  // ✅ Validation: prevent shipped/delivered if payment not paid
  if (
    paymentStatus !== "payé" &&
    (shippingStatus === "expédié" || shippingStatus === "livraison")
  ) {
    showAlert(
      "Vous ne pouvez marquer une commande comme Expédiée ou Livrée qu’après la confirmation du paiement.",
      "warning"
    );
    setLoading(false);
    return;
  }

  try {
    const payload = { ...orderData };

    const response = await axios.put(
      `https://dev-api.payonlive.com/api/order/update-order/${existingOrder._id}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200 && response.data.success) {
      showAlert("Commande mise à jour avec succès!", "succès");
      navigate("/user/Orders");
    } else {
      showAlert("Échec de la mise à jour de la commande. Veuillez réessayer.", "erreur");
      setLoading(false);
    }
  } catch (err) {
    console.error("❌ Error updating order:", err);
    showAlert(""+ err.response.data.emessage, "erreur");
    setLoading(false);
  }
};


  // Calculate order summary
  const summary = useMemo(() => {
    const subTotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subTotal * 0.1; // 10% tax
    const discount = subTotal * 0.05; // 5% discount
    const shippingFee = subTotal > 100 ? 0 : 5;
    const total = subTotal + tax + shippingFee - discount;
    return { subTotal, tax, discount, shippingFee, total };
  }, [orderItems]);

  return (
    <div>
      <Navbar heading="Gestion des commandes" />

      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Mise à jour du produit</h1>
        <button
          onClick={() => navigate("/user/Orders")}
          className="px-3 py-1 border border-red-700 text-red-700 bg-red-50 rounded-md hover:bg-gray-100"
        >
          <FontAwesomeIcon
            icon={faXmark}
            size="lg"
            className="text-red-700 px-2"
          />
          Jeter
        </button>
      </div>

      <form
        className="max-w-6xl mx-6 sm:px-6 lg:px-8 py-6 space-y-8 font-sans text-gray-700"
        onSubmit={handleUpdate}
      >
        {/* Customer Info */}
        <section className="border border-gray-400 rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-semibold">Informations client</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="customerName"
                className="block mb-1 text-sm font-medium text-gray-600"
              >
                Nom du client
              </label>
              <input
                required
                id="customerName"
                type="text"
                value={orderData.customerName}
                onChange={handleChange}
                placeholder="Nom complet"
                className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-1 text-sm font-medium text-gray-600"
              >
                E-mail
              </label>
              <input
                required
                id="email"
                type="email"
                value={orderData.email}
                onChange={handleChange}
                placeholder="client@email.com"
                className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="phoneNumber"
                className="block mb-1 text-sm font-medium text-gray-600"
              >
                numéro de téléphone
              </label>
              <input
                required
                id="phoneNumber"
                type="text"
                value={orderData.phoneNumber}
                onChange={handleChange}
                placeholder="+122 2313 3212"
                className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block mb-1 text-sm font-medium text-gray-600"
              >
                Adresse de livraison
              </label>
              <input
                required
                id="address"
                type="text"
                value={orderData.address}
                onChange={handleChange}
                placeholder="123, ville principale, état"
                className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </section>

        {/* Order Items */}
        <section className="border border-gray-400 rounded-lg p-6 overflow-x-auto">
          <div className="flex justify-between items-center border-gray-200 pb-3 mb-4">
            <h2 className="text-lg font-semibold">Articles commandés</h2>
            {/* <button
              type="button"
              onClick={addProduct}
              className="flex items-center gap-2 bg-green-600 text-white text-[12px] font-semibold px-3 py-2 rounded-lg hover:bg-green-700"
            >
              <FontAwesomeIcon icon={faPlus} /> Add product
            </button> */}
          </div>

          {orderItems.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-3 border-b border-gray-400 last:border-b-0"
            >
              {/* <div className="md:col-span-5">
                <select
                  required
                  value={item.productName}
                  onChange={(e) => handleProductChange(idx, "productName", e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-2 py-2 text-sm"
                >
                  <option value="">Select product</option>
                  <option>Travel bag</option>
                  <option>clothes</option>
                  <option>boots</option>
                  <option>Asus</option>
                  <option >Adidas shoes</option>
                
                </select>
              </div> */}
              <div className="md:col-span-5">
                <label className="block mb-1 text-sm font-medium">
                  Nom du produit
                </label>
                <input
                  required
                  type="text"
                   readOnly
                  value={item.productName}
                  onChange={(e) =>
                    handleProductChange(idx, "productName", e.target.value)
                  }
                  placeholder="Nom du produit"
                  className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                />
              </div>
              <div className="md:col-span-1 text-center">
                <label className="block mb-1 text-sm font-medium">
                  Quantité
                </label>
                <input
                  required
                  type="number"
                  min="1"
                   readOnly
                  value={item.quantity}
                  onChange={(e) =>
                    handleProductChange(
                      idx,
                      "quantity",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full text-center rounded-lg border border-gray-300 px-2 py-1 text-sm"
                />
              </div>
              <div className="md:col-span-2 text-center">
                <label className="block mb-1 text-sm font-medium">Price</label>
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                   readOnly
                  value={item.price}
                  onChange={(e) =>
                    handleProductChange(
                      idx,
                      "price",
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-full text-center rounded-lg border border-gray-300 px-2 py-1 text-sm"
                />
              </div>
              {/* <div className="md:col-span-2 text-center text-sm">
                € {(item.price * item.quantity).toFixed(2)}
              </div> */}
              <div className="md:col-span-2 text-center">
                <label className="block mb-1 text-center text-sm font-medium">
                  Total
                </label>
                <input
                  type="text"
                  readOnly
                  value={(item.price * item.quantity).toFixed(2)}
                  className="w-full text-center rounded-lg border border-gray-300 px-2 py-1 text-sm "
                />
              </div>

              {/* <div className="md:col-span-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => removeProduct(idx)}
                  className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-red-100"
                >
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-red-600 text-sm"
                  />
                </button>
              </div> */}
            </div>
          ))}
        </section>

        {/* Payment & Shipping */}
        <section className="border border-gray-400 rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="paymentMethod"
              className="block mb-1 text-sm font-medium text-gray-600"
            >
              Mode de paiement
            </label>
            <select
              required
              id="paymentMethod"
              value={orderData.paymentMethod}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm"
            >
              <option value="">Sélectionnez mode de paiement</option>

              <option value="paypal">Paypal</option>
              <option value="stripe">Stripe</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="paymentStatus"
              className="block mb-1 text-sm font-medium text-gray-600"
            >
              Statut du paiement
            </label>
            <select
              required
              id="paymentStatus"
              value={orderData.paymentStatus}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm"
            >
              <option value="">Sélectionnez statut du paiement</option>
              <option value="payé">Payé</option>
              <option value="enattente">En-attente</option>
              <option value="échoué">Échoué</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="shippingMethod"
              className="block mb-1 text-sm font-medium text-gray-600"
            >
              Statut de livraison
            </label>
            <select
              required
              id="shippingMethod"
              value={orderData.shippingMethod}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm"
            >
              <option value="">Sélectionnez mode de livraison</option>
              <option>Flat Rate</option>
              <option>Free Shipping</option>
              <option>Local Pickup</option>
              <option>Express</option>
            </select>
          </div>

          <div>
  <label
    htmlFor="shippingStatus"
    className="block mb-1 text-sm font-medium text-gray-600"
  >
    Statut de livraison
  </label>
  <select
    required
    id="shippingStatus"
    value={orderData.shippingStatus}
    onChange={handleChange}
    className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm"
  >
    <option value="">Sélectionnez statut de la livraison</option>
    <option value="Processing">Processing</option>
    <option
      value="expédié"
      disabled={orderData.paymentStatus !== "payé"}
    >
      Expédié
    </option>
    <option
      value="livraison"
      disabled={orderData.paymentStatus !== "payé"}
    >
      Livraison
    </option>
  </select>

  {/* 🧩 Optional inline message */}
  {orderData.paymentStatus !== "payé" && (
    <p className="text-xs text-gray-500 mt-1">
      Complete payment before marking as Shipped or Delivered.
    </p>
  )}
</div>


          {/* <div>
            <label
              htmlFor="shippingStatus"
              className="block mb-1 text-sm font-medium text-gray-600"
            >
              Shipping Status
            </label>
            <select
              required
              id="shippingStatus"
              value={orderData.shippingStatus}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm"
            >
              <option value="">Select shipping status</option>
              <option>Processing</option>
              <option>Shipped</option>        
              <option>Delivered</option>
              
            </select>
          </div> */}

          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">
              Lien de suivi de commande*
            </label>
            <div className="flex items-center border border-gray-400 rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-400 transition">
              <input
                type="text"
                name="eventLink"
                value={orderData.trackLink}
                onChange={handleChange}
                className="flex-grow focus:outline-none"
              />
              {/* <button
                            type="button"
                            onClick={handleCopyLink}
                            className="ml-2 text-gray-600 hover:text-blue-500 transition"
                          >
                            <FontAwesomeIcon icon={faClipboard} />
                          </button> */}
            </div>
            {/* {errors.eventLink && (
                          <p className="text-red-500 text-sm mt-1">{errors.trackLink}</p>
                        )} */}
          </div>
        </section>

        {/* Order Summary */}
        <section className="border border-gray-400 rounded-lg p-4 w-full sm:w-80">
          <h3 className="font-semibold mb-4 text-sm text-gray-700">
            Order Summary
          </h3>
          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex justify-between">
              <span>Sous Total</span>
              <span>€ {summary.subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Impôt (10%)</span>
              <span>€ {summary.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Livraison Frais</span>
              <span>€ {summary.shippingFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-400 mt-5 pt-2 font-semibold flex justify-between">
              <span>Total</span>
              <span>€ {summary.total.toFixed(2)}</span>
            </div>
          </div>
        </section>

        <hr className="text-gray-500" />
        {/* <div className="flex justify-end">
          <button type="submit" className="bg-[#114E9D] text-white font-semibold rounded-lg px-5 py-2 text-sm hover:bg-blue-500">
            Update Order
          </button>
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
            {loading ? "Mise à jour..." : "Mise à jour commande"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateOrder;
