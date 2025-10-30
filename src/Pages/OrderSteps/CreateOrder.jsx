import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useAlert } from "../../Components/AlertContext";

const CreateOrder = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // 🔹 State for customer info
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 State for order items
  const [orderItems, setOrderItems] = useState([
    { productName: "", quantity: 1, price: 0 },
  ]);

  // 🔹 State for payment & shipping
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [shippingMethod, setShippingMethod] = useState("");
  const [shippingStatus, setShippingStatus] = useState("");

  // 🔹 Validation errors + popup
  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  // Add product row
  const addProduct = () => {
    setOrderItems([...orderItems, { productName: "", quantity: 1, price: 0 }]);
  };

  // Remove product row
  const removeProduct = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  // Update product field
  const handleProductChange = (index, value) => {
    const newItems = [...orderItems];
    newItems[index].productName = value;
    setOrderItems(newItems);
  };

  // 🔹 Validation Logic (same style as LiveEvent)
  const validate = () => {
    const newErrors = {};

    if (!customerName.trim())
      newErrors.customerName = "Customer name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Please enter a valid email.";

    if (!phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required.";
    else if (!/^\d{9,15}$/.test(phoneNumber))
      newErrors.phoneNumber = "Phone number must be 9–15 digits.";

    if (!address.trim()) newErrors.address = "Shipping address is required.";

    if (!paymentMethod.trim())
      newErrors.paymentMethod = "Select a payment method.";
    if (!paymentStatus.trim())
      newErrors.paymentStatus = "Select a payment status.";
    if (!shippingMethod.trim())
      newErrors.shippingMethod = "Select a shipping method.";
    if (!shippingStatus.trim())
      newErrors.shippingStatus = "Select a shipping status.";

    // Validate order items
    orderItems.forEach((item, idx) => {
      if (!item.productName.trim())
        newErrors[`product_${idx}`] = `Product name is required for item ${
          idx + 1
        }`;
      if (item.price <= 0)
        newErrors[`price_${idx}`] = `Price must be greater than 0 for item ${
          idx + 1
        }`;
    });

    setErrors(newErrors);
    console.log("🧾 Validation Errors:", newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (!validate()) return;

    const payload = {
      customerName,
      email,
      phoneNumber,
      address,
      orderItems,
      paymentMethod,
      paymentStatus,
      shippingMethod,
      shippingStatus,
      orderTotal: total,
    };

    console.log("📤 Sending order:", payload);

    try {
      const res = await axios.post(
        "https://dev-api.payonlive.com/api/order/create-order",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("✅ Order created:", res.data);
      if (res.data?.success || res.status === 200) {
        showAlert("Order created successfully!", "success");
        navigate("/user/Orders");
        //  showAlert("Event created successfully!", "success", () => {
        //   navigate("/user/tiktok");
        // setPopupMessage("Order created successfully!");
        // setShowPopup(true);
        // setTimeout(() => {
        //   console.log("Redirecting to /Orders");
        //   navigate("/user/Orders");
        // }, 1500);
      } else {
        showAlert("Failed to create order. Please try again.", "error");
        setLoading(false);
        // setPopupMessage(res.data.message || "Failed to create order ❌");
        // setShowPopup(true);
      }
    } catch (err) {
      console.error("Sever Error  while creating order:", err);
      showAlert("Server error. Please try again.", "error");
      setLoading(false);
      // setPopupMessage("Server error — please try again.");
      // setShowPopup(true);
    }
  };

  // calculate
  const subtotal = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // Example 10%
  const shippingFee = shippingMethod === "Free Shipping" ? 0 : 7;
  const total = subtotal + tax + shippingFee;

  return (
    <div>
      <Navbar heading="Order Management" />

      {/* discard button */}
      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Order Creation</h1>
        <button
          onClick={() => navigate("/user/Orders")}
          className="px-3 py-1 border border-red-700 text-red-700 bg-red-50 rounded-md hover:bg-gray-100"
        >
          <FontAwesomeIcon
            icon={faXmark}
            size="lg"
            className="text-red-700 px-2"
          />
          Discard Product
        </button>
      </div>

      {/* Form wrapper */}
      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-6 sm:px-6 lg:px-8 py-6 space-y-8 font-sans text-gray-700"
      >
        {/* Create New Order */}
        <section className="border border-gray-400 rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-semibold pb-3">Create New Order</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Customer Name
              </label>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full name"
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
              {errors.customerName && (
                <p className="text-red-500 text-sm">{errors.customerName}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="customer@email.com"
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                phoneNumber
              </label>
              <input
                value={phoneNumber}
                onChange={(e) => setphoneNumber(e.target.value)}
                type="number"
                placeholder="+122 2313 3212"
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Shipping address
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123, main city, state"
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
            </div>
          </div>
        </section>

        {/* Order Items */}
        {/* <section className="border border-gray-400 rounded-lg p-6 overflow-x-auto">
          <div className="flex justify-between items-center pb-3 mb-4">
            <h2 className="text-lg font-semibold">Order Items</h2>
            <button
              onClick={addProduct}
              className="flex items-center gap-2 bg-green-600 text-white text-[12px] px-3 py-2 rounded-lg hover:bg-green-700"
              type="button"
            >
              <FontAwesomeIcon icon={faPlus} /> Add product
            </button>
          </div>

          {orderItems.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-3 border-b border-gray-400"
            >
              <div className="md:col-span-5">
                <select
                  value={item.product}
                  onChange={(e) => handleProductChange(idx, e.target.value)}
                  className="w-full text-sm bg-gray-100 rounded-xl border px-2 py-2"
                >
                  <option value="">Select product</option>
                  <option>Product A</option>
                  <option>Product B</option>
                  <option>Product C</option>
                </select>
              </div>

              <div className="md:col-span-1 text-center">{item.quantity}</div>
              <div className="md:col-span-2 text-center">€ {item.price.toFixed(2)}</div>
              <div className="md:col-span-2 text-center">
                € {(item.price * item.quantity).toFixed(2)}
              </div>
              <div className="md:col-span-2 flex justify-center">
                <button
                  onClick={() => removeProduct(idx)}
                  className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-red-100"
                  type="button"
                >
                  <FontAwesomeIcon icon={faTrash} className="text-red-600 text-sm" />
                </button>
              </div>
            </div>
          ))}
        </section> */}

        {/* Order Items */}
        <section className="border border-gray-400 rounded-lg p-6 overflow-x-auto">
          <div className="flex justify-between items-center pb-3 mb-4">
            <h2 className="text-lg font-semibold">Order Items</h2>
            <button
              onClick={addProduct}
              className="flex items-center gap-2 bg-green-600 text-white text-[12px] px-3 py-2 rounded-lg hover:bg-green-700"
              type="button"
            >
              <FontAwesomeIcon icon={faPlus} /> Add product
            </button>
          </div>

          {orderItems.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-3 border-b border-gray-400"
            >
              {/* Product dropdown */}
              {/* <div className="md:col-span-4">
                <label className="block mb-1 text-sm font-medium">
                  Product Name
                </label>
                <select
                  value={item.productName}
                  onChange={(e) => handleProductChange(idx, e.target.value)}
                  className="w-full text-sm  rounded-xl border px-2 py-2"
                >
                  <option value="">Select product</option>
                  <option>Travel bag</option>
                  <option>clothes</option>
                  <option>boots</option>
                  <option>T-Shirt</option>
                  <option>Asus</option>
                  <option >Adidas shoes</option>
                </select>
                {errors[`product_${idx}`] && (
                  <p className="text-red-500 text-sm">
                    {errors[`product_${idx}`]}
                  </p>
                )}
              </div> */}
              <div className="md:col-span-4">
                <label className="block mb-1 text-sm font-medium">
                  Product Name
                </label>
                <input
                  value={item.productName}
                  onChange={(e) => handleProductChange(idx, e.target.value)}
                  placeholder="enter product name"
                  className="w-full text-sm  rounded-xl border px-2 py-2"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm">
                    {errors[`product_${idx}`]}
                  </p>
                )}
              </div>

              {/* Quantity dropdown */}
              <div className="md:col-span-2 text-center">
                <label className="block mb-1 text-start text-sm font-medium">
                  Quantity
                </label>
                <select
                  value={item.quantity}
                  onChange={(e) => {
                    const newItems = [...orderItems];
                    newItems[idx].quantity = parseInt(e.target.value, 10);
                    setOrderItems(newItems);
                  }}
                  className="w-full text-sm border rounded-lg px-2 py-2"
                >
                  {[...Array(20)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price input */}
              <div className="md:col-span-2 text-center">
                <label className="block mb-1 text-start text-sm font-medium">
                  Price
                </label>
                <input
                  required
                  type="number"
                  
                  value={item.price}
                  onChange={(e) => {
                    const newItems = [...orderItems];
                    newItems[idx].price = parseFloat(e.target.value) || 0;
                    setOrderItems(newItems);
                  }}
                  className="w-full text-sm border rounded-lg px-2 py-2 text-center"
                />
                {errors[`price_${idx}`] && (
                  <p className="text-red-500 text-sm">
                    {errors[`price_${idx}`]}
                  </p>
                )}
              </div>

              {/* Total auto-calculated (read-only) */}
              <div className="md:col-span-2 text-center">
                <label className="block mb-1 text-start text-sm font-medium">
                  Total
                </label>
                <input
                  type="text"
                  readOnly
                  value={(item.price * item.quantity).toFixed(2)}
                  className="w-full text-sm border rounded-lg px-2 py-2 text-center "
                />
              </div>

              {/* Remove button */}
              <div className="md:col-span-2 flex justify-center">
                <button
                  onClick={() => removeProduct(idx)}
                  className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-red-100"
                  type="button"
                >
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-red-600 text-sm"
                  />
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Payment Details */}
        <section className="border border-gray-400 rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 text-sm font-medium">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">Select Payment method</option>
              <option>Stripe</option>
              <option>Paypal</option>
            </select>
            {errors.paymentMethod && (
              <p className="text-red-500 text-sm">{errors.paymentMethod}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Payment Status
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">Select payment status</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Failed</option>
            </select>
            {errors.paymentStatus && (
              <p className="text-red-500 text-sm">{errors.paymentStatus}</p>
            )}
          </div>
        </section>

        {/* Shipping Details */}
        <section className="border border-gray-400 rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 text-sm font-medium">
              Shipping Method
            </label>
            <select
              value={shippingMethod}
              onChange={(e) => setShippingMethod(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">Select Shipping method</option>
              <option>Flat Rate</option>
              <option>Free Shipping</option>
              <option>Local Pickup</option>
            </select>
            {errors.shippingMethod && (
              <p className="text-red-500 text-sm">{errors.shippingMethod}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Shipping Status
            </label>
            <select
              value={shippingStatus}
              onChange={(e) => setShippingStatus(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">Select shipping status</option>
              {/* <option>Shipped</option> */}
              <option>Pending</option>
              <option>Processing</option>
              {/* <option>Delivered</option> */}
            </select>
            {errors.shippingStatus && (
              <p className="text-red-500 text-sm">{errors.shippingStatus}</p>
            )}
          </div>
        </section>

        {/* Order Summary */}
        <section className="border border-gray-400 rounded-lg p-4 w-full sm:w-80">
          <h3 className="font-semibold mb-4 text-sm text-gray-700">
            Order Summary
          </h3>
          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex justify-between">
              <span>Sub Total</span>
              <span> € {subtotal} </span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span> € {tax} </span>
            </div>
            {/* <div className="flex justify-between">
            <span>Discount</span>
            <span>€ 12.44</span>
          </div> */}
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span>€ {shippingFee} </span>
            </div>
            <div className="border-t border-gray-400 mt-5 pt-2 font-semibold flex justify-between">
              <span>Total</span>
              <span>€ {total} </span>
            </div>
          </div>
        </section>

        {/* Submit Button */}
        {/* <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-600 text-white font-semibold rounded-lg px-5 py-2 text-sm hover:bg-green-700"
          >
            Submit Order
          </button>
        </div> */}

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            {loading && (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {loading ? "Submitting..." : "Submit Order"}
          </button>
        </div>
      </form>
      {/* ✅ Popup */}
      {/* {showPopup && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white text-black font-bold px-8 py-10 rounded-xl shadow-xl min-w-[300px] text-center">
            {popupMessage}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default CreateOrder;
