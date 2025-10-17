import React, { useState, useMemo , useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const UpdateOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const existingOrder = location.state?.orderData;

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
    existingOrder.orderItems?.map(item => ({
      productName: item.productName,
      quantity: item.quantity,
      price: item.price
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

  try {
    // Include _id in payload just in case backend needs it
    const payload = { ...orderData, orderItems, _id: existingOrder._id };

    const response = await axios.put(
      `https://la-dolce-vita.onrender.com/api/order/update-order/${existingOrder._id}`,
      payload,
      {
        // Add headers if backend expects auth
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,  // uncomment if your API needs JWT
        },
      }
    );

    if (response.status === 200 && response.data.success) {
      alert(response.data.message || "Order updated successfully!");
      navigate("/Orders");
    } else {
      alert(response.data.message || "Failed to update order. Please try again.");
    }
  } catch (err) {
    console.error("❌ Error updating order:", err);
    alert("❌ Error updating order:");
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
      <Navbar heading="Order Management" />

      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Update Order</h1>
        <button
          onClick={() => navigate("/Orders")}
          className="px-3 py-1 border border-red-700 text-red-700 bg-red-50 rounded-md hover:bg-gray-100"
        >
          <FontAwesomeIcon icon={faXmark} size="lg" className="text-red-700 px-2" />
          Discard
        </button>
      </div>

      <form
        className="max-w-6xl mx-6 sm:px-6 lg:px-8 py-6 space-y-8 font-sans text-gray-700"
        onSubmit={handleUpdate}
      >
        {/* Customer Info */}
        <section className="border border-gray-400 rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-semibold">Customer Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="customerName" className="block mb-1 text-sm font-medium text-gray-600">
                Customer Name
              </label>
              <input
                required
                id="customerName"
                type="text"
                value={orderData.customerName}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                required
                id="email"
                type="email"
                value={orderData.email}
                onChange={handleChange}
                placeholder="customer@email.com"
                className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block mb-1 text-sm font-medium text-gray-600">
                Phone number
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
              <label htmlFor="address" className="block mb-1 text-sm font-medium text-gray-600">
                Shipping address
              </label>
              <input
                required
                id="address"
                type="text"
                value={orderData.address}
                onChange={handleChange}
                placeholder="123, main city, state, 12323"
                className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </section>

        {/* Order Items */}
        <section className="border border-gray-400 rounded-lg p-6 overflow-x-auto">
          <div className="flex justify-between items-center border-gray-200 pb-3 mb-4">
            <h2 className="text-lg font-semibold">Order Items</h2>
            <button
              type="button"
              onClick={addProduct}
              className="flex items-center gap-2 bg-green-600 text-white text-[12px] font-semibold px-3 py-2 rounded-lg hover:bg-green-700"
            >
              <FontAwesomeIcon icon={faPlus} /> Add product
            </button>
          </div>

          {orderItems.map((item, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-3 border-b border-gray-400 last:border-b-0">
              <div className="md:col-span-5">
                <select
                  required
                  value={item.productName}
                  onChange={(e) => handleProductChange(idx, "productName", e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-2 py-2 text-sm"
                >
                  <option value="">Select product</option>
                  <option>Asus</option>
                  <option>Adidas Backpack</option>
                  <option>Nike Air Max 2024</option>
                </select>
              </div>
              <div className="md:col-span-1 text-center">
                <input
                  required
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleProductChange(idx, "quantity", parseInt(e.target.value))}
                  className="w-full text-center rounded-lg border border-gray-300 px-2 py-1 text-sm"
                />
              </div>
              <div className="md:col-span-2 text-center">
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={item.price}
                  onChange={(e) => handleProductChange(idx, "price", parseFloat(e.target.value))}
                  className="w-full text-center rounded-lg border border-gray-300 px-2 py-1 text-sm"
                />
              </div>
              <div className="md:col-span-2 text-center text-sm">
                € {(item.price * item.quantity).toFixed(2)}
              </div>
              <div className="md:col-span-2 flex justify-center">
                <button type="button" onClick={() => removeProduct(idx)} className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-red-100">
                  <FontAwesomeIcon icon={faTrash} className="text-red-600 text-sm" />
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Payment & Shipping */}
        <section className="border border-gray-400 rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="paymentMethod" className="block mb-1 text-sm font-medium text-gray-600">Payment Method</label>
            <select
              required
              id="paymentMethod"
              value={orderData.paymentMethod}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm"
            >
              <option value="">Select Payment method</option>
              <option>Stripe</option>
              <option>Paypal</option>
            </select>
          </div>
          <div>
            <label htmlFor="paymentStatus" className="block mb-1 text-sm font-medium text-gray-600">Payment Status</label>
            <select
              required
              id="paymentStatus"
              value={orderData.paymentStatus}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm"
            >
              <option value="">Select payment status</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Failed</option>
            </select>
          </div>
          <div>
            <label htmlFor="shippingMethod" className="block mb-1 text-sm font-medium text-gray-600">Shipping Method</label>
            <select
              required
              id="shippingMethod"
              value={orderData.shippingMethod}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm"
            >
              <option value="">Select Shipping method</option>
              <option>Flat Rate</option>
              <option>Free Shipping</option>
              <option>Local Pickup</option>
              <option>Express</option>
            </select>
          </div>
          <div>
            <label htmlFor="shippingStatus" className="block mb-1 text-sm font-medium text-gray-600">Shipping Status</label>
            <select
              required
              id="shippingStatus"
              value={orderData.shippingStatus}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm"
            >
              <option value="">Select shipping status</option>
              <option>Shipped</option>
              <option>Processing</option>
              <option>Delivered</option>
              <option>Pending</option>
            </select>
          </div>
        </section>

        {/* Order Summary */}
        <section className="border border-gray-400 rounded-lg p-4 w-full sm:w-80">
          <h3 className="font-semibold mb-4 text-sm text-gray-700">Order Summary</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex justify-between"><span>Sub Total</span><span>€ {summary.subTotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax (10%)</span><span>€ {summary.tax.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping Fee</span><span>€ {summary.shippingFee.toFixed(2)}</span></div>
            <div className="border-t border-gray-400 mt-5 pt-2 font-semibold flex justify-between"><span>Total</span><span>€ {summary.total.toFixed(2)}</span></div>
          </div>
        </section>

        <hr className="text-gray-500" />
        <div className="flex justify-end">
          <button type="submit" className="bg-[#114E9D] text-white font-semibold rounded-lg px-5 py-2 text-sm hover:bg-blue-500">
            Update Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateOrder;


